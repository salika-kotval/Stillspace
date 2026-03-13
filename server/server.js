const path = require("path");
const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const fsp = fs.promises;

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/stillspace";
const LOCAL_DB_PATH = path.join(__dirname, "local-db.json");
let useMemoryDb = false;

app.use(express.json());

// Basic CORS support for mobile wrappers (Capacitor webview -> backend API).
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  return next();
});

app.use(express.static(path.join(__dirname, "..")));

/* -----------------------------
   MongoDB setup
   ----------------------------- */
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    nickname: { type: String, default: "" },
    // Note: plain text password is for beginner demo only.
    password: { type: String, required: true }
  },
  { timestamps: true }
);

const journalSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    prompt: { type: String, default: "" },
    text: { type: String, required: true }
  },
  { timestamps: true }
);

const moodSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    mood: { type: String, required: true },
    score: { type: Number, required: true },
    dateKey: { type: String, required: true } // YYYY-MM-DD
  },
  { timestamps: true }
);

moodSchema.index({ userEmail: 1, dateKey: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);
const Journal = mongoose.model("Journal", journalSchema);
const Mood = mongoose.model("Mood", moodSchema);

/* In-memory fallback store (used when MongoDB is unavailable). */
const memoryDb = {
  users: [],
  journals: [],
  moods: []
};
let memoryDbWriteQueue = Promise.resolve();

function sanitizeCollection(value) {
  return Array.isArray(value) ? value : [];
}

async function loadMemoryDbFromDisk() {
  try {
    const raw = await fsp.readFile(LOCAL_DB_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    memoryDb.users = sanitizeCollection(parsed.users);
    memoryDb.journals = sanitizeCollection(parsed.journals);
    memoryDb.moods = sanitizeCollection(parsed.moods);
    console.log("Loaded fallback data from server/local-db.json");
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn(`Could not read local fallback data: ${error.message}`);
    }
  }
}

function persistMemoryDb() {
  if (!useMemoryDb) return Promise.resolve();

  memoryDbWriteQueue = memoryDbWriteQueue
    .then(() => fsp.writeFile(LOCAL_DB_PATH, JSON.stringify(memoryDb, null, 2), "utf-8"))
    .catch((error) => {
      console.warn(`Could not persist local fallback data: ${error.message}`);
    });

  return memoryDbWriteQueue;
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeEmail(emailInput) {
  return String(emailInput || "").trim().toLowerCase();
}

function getDefaultNickname(email, nicknameInput) {
  const cleaned = (nicknameInput || "").trim();
  if (cleaned) return cleaned;
  return String(email || "").split("@")[0] || "Friend";
}

async function findOrCreateUser(email, password, nicknameInput) {
  const nickname = getDefaultNickname(email, nicknameInput);

  if (useMemoryDb) {
    let changed = false;
    let user = memoryDb.users.find((item) => item.email === email);
    if (!user) {
      user = { email, nickname, password, createdAt: nowIso(), updatedAt: nowIso() };
      memoryDb.users.push(user);
      changed = true;
    } else if (nicknameInput && nicknameInput.trim()) {
      user.nickname = nickname;
      user.updatedAt = nowIso();
      changed = true;
    } else if (!String(user.nickname || "").trim()) {
      // Ensure nickname is persisted even for old accounts created without one.
      user.nickname = getDefaultNickname(email, "");
      user.updatedAt = nowIso();
      changed = true;
    }

    if (changed) {
      await persistMemoryDb();
    }

    return user;
  }

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email, nickname, password });
  } else if (nicknameInput && nicknameInput.trim()) {
    user.nickname = nickname;
    await user.save();
  } else if (!String(user.nickname || "").trim()) {
    // Ensure nickname is persisted even for old accounts created without one.
    user.nickname = getDefaultNickname(email, "");
    await user.save();
  }
  return user;
}

async function getUserProfile(email) {
  if (useMemoryDb) {
    return memoryDb.users.find((item) => item.email === email) || null;
  }

  return User.findOne({ email });
}

async function updateUserProfile(email, nicknameInput) {
  const nickname = getDefaultNickname(email, nicknameInput);

  if (useMemoryDb) {
    const user = memoryDb.users.find((item) => item.email === email);
    if (!user) return null;

    user.nickname = nickname;
    user.updatedAt = nowIso();
    await persistMemoryDb();
    return user;
  }

  return User.findOneAndUpdate({ email }, { nickname }, { new: true });
}

async function deleteAccountByEmail(email) {
  if (useMemoryDb) {
    const userExists = memoryDb.users.some((item) => item.email === email);
    const hasJournalData = memoryDb.journals.some((item) => item.userEmail === email);
    const hasMoodData = memoryDb.moods.some((item) => item.userEmail === email);

    memoryDb.users = memoryDb.users.filter((item) => item.email !== email);
    memoryDb.journals = memoryDb.journals.filter((item) => item.userEmail !== email);
    memoryDb.moods = memoryDb.moods.filter((item) => item.userEmail !== email);

    if (userExists || hasJournalData || hasMoodData) {
      await persistMemoryDb();
    }

    return userExists || hasJournalData || hasMoodData;
  }

  const deletedUser = await User.findOneAndDelete({ email });
  const deletedJournals = await Journal.deleteMany({ userEmail: email });
  const deletedMoods = await Mood.deleteMany({ userEmail: email });

  return Boolean(
    deletedUser ||
      deletedJournals.deletedCount > 0 ||
      deletedMoods.deletedCount > 0
  );
}

async function saveJournalEntry(data) {
  if (useMemoryDb) {
    const entry = {
      _id: String(Date.now() + Math.random()),
      userEmail: data.userEmail,
      prompt: data.prompt || "",
      text: data.text,
      createdAt: nowIso(),
      updatedAt: nowIso()
    };
    memoryDb.journals.push(entry);
    await persistMemoryDb();
    return entry;
  }

  return Journal.create(data);
}

async function getJournalEntries(userEmail) {
  if (useMemoryDb) {
    return memoryDb.journals
      .filter((item) => item.userEmail === userEmail)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return Journal.find({ userEmail }).sort({ createdAt: -1 });
}

async function deleteJournalEntry(userEmail, journalId) {
  if (useMemoryDb) {
    const before = memoryDb.journals.length;
    memoryDb.journals = memoryDb.journals.filter(
      (item) => !(item._id === journalId && item.userEmail === userEmail)
    );
    const changed = memoryDb.journals.length !== before;
    if (changed) {
      await persistMemoryDb();
    }
    return changed;
  }

  if (!mongoose.Types.ObjectId.isValid(journalId)) {
    return false;
  }

  const deleted = await Journal.findOneAndDelete({ _id: journalId, userEmail });
  return Boolean(deleted);
}

async function upsertMoodEntry(data) {
  if (useMemoryDb) {
    const existingIndex = memoryDb.moods.findIndex(
      (item) => item.userEmail === data.userEmail && item.dateKey === data.dateKey
    );

    if (existingIndex >= 0) {
      memoryDb.moods[existingIndex] = {
        ...memoryDb.moods[existingIndex],
        mood: data.mood,
        score: data.score,
        updatedAt: nowIso()
      };
      await persistMemoryDb();
      return memoryDb.moods[existingIndex];
    }

    const moodEntry = {
      _id: String(Date.now() + Math.random()),
      userEmail: data.userEmail,
      mood: data.mood,
      score: data.score,
      dateKey: data.dateKey,
      createdAt: nowIso(),
      updatedAt: nowIso()
    };
    memoryDb.moods.push(moodEntry);
    await persistMemoryDb();
    return moodEntry;
  }

  return Mood.findOneAndUpdate(
    { userEmail: data.userEmail, dateKey: data.dateKey },
    {
      userEmail: data.userEmail,
      mood: data.mood,
      score: data.score,
      dateKey: data.dateKey
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function getMoodEntries(userEmail) {
  if (useMemoryDb) {
    return memoryDb.moods
      .filter((item) => item.userEmail === userEmail)
      .sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  }

  return Mood.find({ userEmail }).sort({ dateKey: 1 });
}

function fallbackReflection(text) {
  const lower = text.toLowerCase();

  const scoreKeywords = (words) =>
    words.reduce((count, word) => (lower.includes(word) ? count + 1 : count), 0);

  const calmScore = scoreKeywords([
    "calm",
    "grateful",
    "peaceful",
    "happy",
    "relaxed",
    "better",
    "hopeful"
  ]);
  const stressScore = scoreKeywords([
    "stress",
    "stressed",
    "overwhelm",
    "anxious",
    "panic",
    "tired",
    "pressure",
    "busy"
  ]);
  const lowMoodScore = scoreKeywords(["sad", "lonely", "down", "empty", "upset", "hurt"]);
  const angerScore = scoreKeywords(["angry", "frustrated", "irritated", "annoyed"]);

  let tone = "mixed";
  if (calmScore >= 2 && calmScore > stressScore + lowMoodScore + angerScore) {
    tone = "calm";
  } else if (stressScore >= 2) {
    tone = "stressed";
  } else if (lowMoodScore >= 1) {
    tone = "low";
  } else if (angerScore >= 1) {
    tone = "frustrated";
  }

  if (tone === "calm") {
    return "Your reflection sounds grounded and steady. A helpful next step could be writing one short line about what supported this calm feeling so you can return to it tomorrow.";
  }

  if (tone === "stressed") {
    return "It sounds like your day carried a lot of pressure. Try one cycle of box breathing (inhale 4, hold 4, exhale 4, hold 4), then choose just one small task to focus on next.";
  }

  if (tone === "low") {
    return "Thank you for sharing honestly. A gentle next step could be naming one thing that feels heavy and one thing that feels even slightly supportive right now.";
  }

  if (tone === "frustrated") {
    return "There is understandable tension in what you wrote. It may help to pause for a minute, relax your shoulders, and write one boundary or need you want to honor today.";
  }

  return "Your reflection shows thoughtful self-awareness. If you want, try this: name your current emotion, rate your energy from 1 to 10, and pick one gentle action for the next hour.";
}

async function generateAIReflection(text) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      reflection: fallbackReflection(text),
      source: "fallback"
    };
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        temperature: 0.5,
        max_output_tokens: 220,
        input: [
          {
            role: "system",
            content:
              "You are a supportive mental wellness reflection assistant. Detect emotional tone and offer gentle, practical suggestions in 3-4 sentences. Never provide medical advice, diagnosis, or crisis instructions. Keep language calm, validating, and actionable."
          },
          {
            role: "user",
            content: `Journal entry:\n${text}`
          }
        ]
      })
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errorPayload = await response.text();
      console.warn(`OpenAI request failed. Falling back. Error: ${errorPayload}`);
      return {
        reflection: fallbackReflection(text),
        source: "fallback"
      };
    }

    const data = await response.json();
    return {
      reflection: data.output_text || fallbackReflection(text),
      source: data.output_text ? "openai" : "fallback"
    };
  } catch (error) {
    console.warn(`OpenAI unavailable. Using fallback reflection. Reason: ${error.message}`);
    return {
      reflection: fallbackReflection(text),
      source: "fallback"
    };
  }
}

/* -----------------------------
   API routes
   ----------------------------- */
app.post("/login", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "").trim();
    const nickname = req.body.nickname;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await findOrCreateUser(email, password, nickname);

    return res.json({
      message: "Login successful",
      user: {
        email: user.email,
        nickname: getDefaultNickname(user.email, user.nickname)
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed.", error: error.message });
  }
});

app.get("/profile", async (req, res) => {
  try {
    const email = normalizeEmail(req.query.email);
    if (!email) return res.status(400).json({ message: "email query param is required." });

    const user = await getUserProfile(email);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({
      user: {
        email: user.email,
        nickname: getDefaultNickname(user.email, user.nickname)
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not load profile.", error: error.message });
  }
});

app.put("/profile", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const nickname = req.body.nickname;
    if (!email) {
      return res.status(400).json({ message: "email is required." });
    }

    const updatedUser = await updateUserProfile(email, nickname);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({
      message: "Profile updated.",
      user: {
        email: updatedUser.email,
        nickname: getDefaultNickname(updatedUser.email, updatedUser.nickname)
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not update profile.", error: error.message });
  }
});

app.delete("/account", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    if (!email) {
      return res.status(400).json({ message: "email is required." });
    }

    const deleted = await deleteAccountByEmail(email);
    if (!deleted) {
      return res.status(404).json({ message: "Account not found." });
    }

    return res.json({ message: "Account deleted." });
  } catch (error) {
    return res.status(500).json({ message: "Could not delete account.", error: error.message });
  }
});

app.post("/journal", async (req, res) => {
  try {
    const userEmail = normalizeEmail(req.body.userEmail);
    const prompt = req.body.prompt;
    const text = String(req.body.text || "").trim();
    if (!userEmail || !text) {
      return res.status(400).json({ message: "userEmail and text are required." });
    }

    const journal = await saveJournalEntry({ userEmail, prompt, text });
    return res.status(201).json({ message: "Journal saved", journal });
  } catch (error) {
    return res.status(500).json({ message: "Could not save journal.", error: error.message });
  }
});

app.get("/journal", async (req, res) => {
  try {
    const email = normalizeEmail(req.query.email);
    if (!email) return res.status(400).json({ message: "email query param is required." });

    const journals = await getJournalEntries(email);
    return res.json({ journals });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch journals.", error: error.message });
  }
});

app.delete("/journal/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = normalizeEmail(req.body.userEmail);
    if (!id || !userEmail) {
      return res.status(400).json({ message: "Journal id and userEmail are required." });
    }

    const deleted = await deleteJournalEntry(userEmail, id);
    if (!deleted) {
      return res.status(404).json({ message: "Journal entry not found." });
    }

    return res.json({ message: "Journal entry deleted." });
  } catch (error) {
    return res.status(500).json({ message: "Could not delete journal.", error: error.message });
  }
});

app.post("/mood", async (req, res) => {
  try {
    const userEmail = normalizeEmail(req.body.userEmail);
    const mood = String(req.body.mood || "").trim();
    const score = Number(req.body.score);
    const dateKey = String(req.body.dateKey || "").trim();
    const hasValidDateKey = /^\d{4}-\d{2}-\d{2}$/.test(dateKey);

    if (!userEmail || !mood || !Number.isFinite(score) || score < 1 || score > 5 || !hasValidDateKey) {
      return res
        .status(400)
        .json({ message: "userEmail, mood, score (1-5), and valid dateKey are required." });
    }

    // Keep one mood entry per day per user.
    const savedMood = await upsertMoodEntry({ userEmail, mood, score, dateKey });

    return res.status(201).json({ message: "Mood saved", mood: savedMood });
  } catch (error) {
    return res.status(500).json({ message: "Could not save mood.", error: error.message });
  }
});

app.get("/mood", async (req, res) => {
  try {
    const email = normalizeEmail(req.query.email);
    if (!email) return res.status(400).json({ message: "email query param is required." });

    const moods = await getMoodEntries(email);
    return res.json({ moods });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch mood entries.", error: error.message });
  }
});

app.post("/ai-reflection", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Journal text is required." });
    }

    const result = await generateAIReflection(text);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Could not generate AI reflection.",
      error: error.message
    });
  }
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
    console.log("Connected to MongoDB");
  } catch (error) {
    useMemoryDb = true;
    console.warn("MongoDB not available. Starting with local fallback storage.");
    console.warn("Using local JSON fallback storage (server/local-db.json).");
    console.warn(`Connection error: ${error.message}`);
    await loadMemoryDbFromDisk();
  }

  const server = app.listen(PORT, () => {
    console.log(`StillSpace server running on http://localhost:${PORT}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use. Stop the other server process and try again.`);
      process.exit(1);
    }

    console.error(`Server failed to start: ${error.message}`);
    process.exit(1);
  });
}

startServer();
