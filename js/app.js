/* StillSpace shared client logic
   This file handles theme, login, auth guard, dashboard data, and journal actions. */

const QUOTES = [
  "Small pauses create big clarity.",
  "You do not need to fix everything today.",
  "Gentleness is a form of strength.",
  "One mindful breath can reset your whole moment.",
  "Progress can be soft and still meaningful.",
  "Your pace is valid, even when the world moves fast.",
  "Quiet consistency builds powerful change.",
  "A calm mind notices details a rushed mind misses."
];

const AFFIRMATIONS = [
  "I am allowed to take up space with calm and kindness.",
  "I can move slowly and still move forward.",
  "My feelings are real, and I can respond with care.",
  "I choose one gentle step instead of perfect control.",
  "I can reset at any moment with one deep breath.",
  "I trust myself to handle this day with softness and clarity."
];

const CALM_TIPS = [
  "Sip water slowly and unclench your jaw for ten seconds.",
  "Name one feeling, then name one gentle next step.",
  "If your thoughts are racing, pause and lengthen your exhale.",
  "Small routines create steady progress. Keep it simple today.",
  "You can always restart your day from this moment."
];

const PROTECTED_PAGES = ["dashboard", "journal", "mood", "breathe", "profile"];

function normalizeEmail(emailInput) {
  return String(emailInput || "").trim().toLowerCase();
}

function dateToKey(dateValue) {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateKeyToDate(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function calculateMoodStreak(moods) {
  const todayKey = dateToKey(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = dateToKey(yesterday);

  const uniqueDateKeys = [...new Set(moods.map((m) => m.dateKey || dateToKey(m.date)))]
    .filter(Boolean)
    .sort((a, b) => b.localeCompare(a));

  if (uniqueDateKeys.length === 0) return 0;

  const latestKey = uniqueDateKeys[0];
  if (latestKey !== todayKey && latestKey !== yesterdayKey) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDateKeys.length; i += 1) {
    const prev = dateKeyToDate(uniqueDateKeys[i - 1]);
    const current = dateKeyToDate(uniqueDateKeys[i]);
    const diffDays = Math.round((prev - current) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

function calculateJournalStreak(entries) {
  const mapped = (entries || []).map((entry) => ({
    dateKey: dateToKey(entry.createdAt || entry.date)
  }));
  return calculateMoodStreak(mapped);
}

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "Request failed");
  }
  return payload;
}

function showToast(message, variant = "success") {
  const text = String(message || "").trim();
  if (!text) return;

  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${variant}`;
  toast.textContent = text;
  wrap.appendChild(toast);

  setTimeout(() => {
    toast.remove();
    if (wrap && !wrap.childElementCount) {
      wrap.remove();
    }
  }, 2600);
}

function getUserEmail() {
  return normalizeEmail(localStorage.getItem("stillspaceUserEmail"));
}

function getUserNickname() {
  return localStorage.getItem("stillspaceUserNickname") || "";
}

function setUserProfile(email, nickname) {
  localStorage.setItem("stillspaceUserEmail", normalizeEmail(email));
  localStorage.setItem("stillspaceUserNickname", nickname || "");
}

function clearSession() {
  localStorage.removeItem("stillspaceUserEmail");
  localStorage.removeItem("stillspaceUserNickname");
}

function requireAuth(page) {
  if (PROTECTED_PAGES.includes(page) && !getUserEmail()) {
    window.location.href = "login.html";
  }
}

function initTheme() {
  const toggle = document.querySelector("#themeToggle");
  const savedTheme = localStorage.getItem("stillspaceTheme") || "light";

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }

  if (!toggle) return;
  const isDark = document.body.classList.contains("dark");
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";
  toggle.setAttribute("aria-label", label);
  toggle.setAttribute("title", label);

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const currentTheme = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("stillspaceTheme", currentTheme);
    const updatedLabel = currentTheme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    toggle.setAttribute("aria-label", updatedLabel);
    toggle.setAttribute("title", updatedLabel);
  });
}

function initPageTransitions() {
  const links = document.querySelectorAll("a[href]");
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href.startsWith("#")) return;
      if (link.target === "_blank") return;
      if (event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (/^https?:\/\//i.test(href)) return;

      event.preventDefault();
      document.body.classList.add("leaving");
      setTimeout(() => {
        window.location.href = href;
      }, 170);
    });
  });
}

function initLogout() {
  const logoutButton = document.querySelector("#logoutBtn");
  if (!logoutButton) return;

  logoutButton.addEventListener("click", () => {
    clearSession();
    showToast("Logged out.");
    window.location.href = "login.html";
  });
}

function resolveDisplayName() {
  const nickname = getUserNickname().trim();
  if (nickname) return nickname;

  const email = getUserEmail() || "";
  if (!email) return "Friend";
  return email.split("@")[0] || "Friend";
}

function initUserIdentityUI() {
  const sidebarNickname = document.querySelector("#sidebarNickname");
  if (sidebarNickname) {
    sidebarNickname.textContent = `Hi, ${resolveDisplayName()}`;
  }
}

async function fetchMoodData() {
  const email = getUserEmail();
  if (!email) return [];
  const result = await apiRequest(`/mood?email=${encodeURIComponent(email)}`);
  return result.moods || [];
}

async function fetchJournalData() {
  const email = getUserEmail();
  if (!email) return [];
  const result = await apiRequest(`/journal?email=${encodeURIComponent(email)}`);
  return result.journals || [];
}

function getFocusStorageKey() {
  const email = getUserEmail() || "guest";
  return `stillspaceFocus:${email}:${dateToKey(new Date())}`;
}

function loadFocusItems() {
  try {
    const raw = localStorage.getItem(getFocusStorageKey());
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveFocusItems(items) {
  localStorage.setItem(getFocusStorageKey(), JSON.stringify(items));
}

function initFocusRitual() {
  const input = document.querySelector("#focusInput");
  const addButton = document.querySelector("#addFocusItemBtn");
  const clearButton = document.querySelector("#clearFocusBtn");
  const list = document.querySelector("#focusList");
  const progress = document.querySelector("#focusProgressLabel");
  if (!input || !addButton || !clearButton || !list || !progress) return;

  let items = loadFocusItems();

  function render() {
    list.innerHTML = "";
    items.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "focus-item";

      const label = document.createElement("label");
      label.className = "focus-check";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = Boolean(item.done);
      checkbox.dataset.index = String(index);

      const text = document.createElement("span");
      text.textContent = item.text;
      if (item.done) text.classList.add("done");

      label.appendChild(checkbox);
      label.appendChild(text);

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "focus-remove";
      removeButton.dataset.index = String(index);
      removeButton.textContent = "Remove";

      li.appendChild(label);
      li.appendChild(removeButton);
      list.appendChild(li);
    });

    const completed = items.filter((item) => item.done).length;
    const percent = items.length ? Math.round((completed / items.length) * 100) : 0;
    progress.textContent = `${percent}% complete`;
  }

  function persistAndRender() {
    saveFocusItems(items);
    render();
  }

  addButton.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) {
      showToast("Add a short intention first.", "error");
      return;
    }
    if (items.length >= 3) {
      showToast("Keep it gentle: max 3 focus items.", "error");
      return;
    }

    items.push({ text, done: false });
    input.value = "";
    persistAndRender();
    showToast("Focus item added.");
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addButton.click();
    }
  });

  clearButton.addEventListener("click", () => {
    items = [];
    persistAndRender();
    showToast("Ritual reset.");
  });

  list.addEventListener("click", (event) => {
    const removeButton = event.target.closest(".focus-remove");
    if (!removeButton) return;
    const index = Number(removeButton.dataset.index);
    if (Number.isNaN(index)) return;
    items.splice(index, 1);
    persistAndRender();
  });

  list.addEventListener("change", (event) => {
    const checkbox = event.target.closest("input[type='checkbox']");
    if (!checkbox) return;
    const index = Number(checkbox.dataset.index);
    if (Number.isNaN(index) || !items[index]) return;
    items[index].done = checkbox.checked;
    persistAndRender();
  });

  render();
}

function initLoginPage() {
  const form = document.querySelector("#loginForm");
  if (!form) return;

  const message = document.querySelector("#loginMessage");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nicknameInput = form.querySelector("#nickname");
    const nickname = nicknameInput ? nicknameInput.value.trim() : "";
    const email = normalizeEmail(form.email.value);
    const password = form.password.value.trim();
    message.textContent = "Logging in...";

    try {
      const result = await apiRequest("/login", {
        method: "POST",
        body: JSON.stringify({ email, password, nickname })
      });

      const savedEmail = result?.user?.email || email;
      const savedNickname = result?.user?.nickname || nickname || savedEmail.split("@")[0] || "Friend";
      setUserProfile(savedEmail, savedNickname);

      message.textContent = "Login successful. Redirecting...";
      showToast("Welcome back.");
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 500);
    } catch (error) {
      message.textContent = error.message;
      showToast(error.message, "error");
    }
  });
}

async function initDashboardPage() {
  const welcomeTitle = document.querySelector("#welcomeTitle");
  const quoteEl = document.querySelector("#dailyQuote");
  const affirmationEl = document.querySelector("#dailyAffirmation");
  const quoteButton = document.querySelector("#nextQuoteBtn");
  const affirmationButton = document.querySelector("#nextAffirmationBtn");
  const streakEl = document.querySelector("#moodStreakDisplay");
  const dateEl = document.querySelector("#todayDate");
  const tipEl = document.querySelector("#calmTip");
  const snapshotJournalCount = document.querySelector("#snapshotJournalCount");
  const snapshotMoodCount = document.querySelector("#snapshotMoodCount");
  const snapshotRecentMood = document.querySelector("#snapshotRecentMood");
  const journalStreakDisplay = document.querySelector("#journalStreakDisplay");
  const snapshotCalmScore = document.querySelector("#snapshotCalmScore");
  if (!welcomeTitle || !quoteEl || !affirmationEl || !streakEl) return;

  welcomeTitle.textContent = `Welcome back to StillSpace, ${resolveDisplayName()}`;
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
  }

  function renderQuote() {
    quoteEl.textContent = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  }

  function renderAffirmation() {
    affirmationEl.textContent = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
  }

  function renderTip() {
    if (!tipEl) return;
    tipEl.textContent = `Tip: ${CALM_TIPS[Math.floor(Math.random() * CALM_TIPS.length)]}`;
  }

  renderQuote();
  renderAffirmation();
  renderTip();

  if (quoteButton) {
    quoteButton.addEventListener("click", renderQuote);
  }

  if (affirmationButton) {
    affirmationButton.addEventListener("click", renderAffirmation);
  }

  try {
    const [moods, journals] = await Promise.all([fetchMoodData(), fetchJournalData()]);
    const streak = calculateMoodStreak(moods);
    streakEl.textContent = `Mood Streak: ${streak} ${streak === 1 ? "Day" : "Days"}`;

    if (snapshotMoodCount) {
      snapshotMoodCount.textContent = String(moods.length);
    }

    if (snapshotJournalCount) {
      snapshotJournalCount.textContent = String(journals.length);
    }

    if (snapshotRecentMood) {
      const sorted = [...moods].sort((a, b) => b.dateKey.localeCompare(a.dateKey));
      snapshotRecentMood.textContent = sorted[0]?.mood || "No data";
    }

    if (journalStreakDisplay) {
      const journalStreak = calculateJournalStreak(journals);
      journalStreakDisplay.textContent = `${journalStreak} ${journalStreak === 1 ? "Day" : "Days"}`;
    }

    if (snapshotCalmScore) {
      const recentMoods = [...moods]
        .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
        .slice(-7);
      if (!recentMoods.length) {
        snapshotCalmScore.textContent = "No data";
      } else {
        const average = recentMoods.reduce((sum, entry) => sum + Number(entry.score || 0), 0) / recentMoods.length;
        const calmScore = Math.round((average / 5) * 100);
        snapshotCalmScore.textContent = `${calmScore}%`;
      }
    }
  } catch (error) {
    streakEl.textContent = "Mood Streak: unavailable";
    if (snapshotMoodCount) snapshotMoodCount.textContent = "-";
    if (snapshotJournalCount) snapshotJournalCount.textContent = "-";
    if (snapshotRecentMood) snapshotRecentMood.textContent = "-";
    if (journalStreakDisplay) journalStreakDisplay.textContent = "-";
    if (snapshotCalmScore) snapshotCalmScore.textContent = "-";
  }

  setInterval(renderTip, 12000);
  initFocusRitual();
}

function formatEntryDate(date) {
  const parsed = new Date(date);
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function createHistoryItem(entry) {
  const item = document.createElement("li");
  item.className = "history-item";

  const meta = document.createElement("div");
  meta.className = "history-meta";

  const title = document.createElement("strong");
  title.textContent = formatEntryDate(entry.createdAt);

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "history-delete-btn";
  deleteButton.dataset.entryId = entry._id;
  deleteButton.textContent = "Delete";

  const preview = document.createElement("p");
  const shortText = (entry.text || "").slice(0, 140);
  preview.textContent = shortText + ((entry.text || "").length > 140 ? "..." : "");

  meta.appendChild(title);
  meta.appendChild(deleteButton);

  item.appendChild(meta);
  item.appendChild(preview);
  return item;
}

async function loadJournalHistory() {
  const historyList = document.querySelector("#journalHistory");
  if (!historyList) return;

  const email = getUserEmail();
  if (!email) return;

  try {
    const result = await apiRequest(`/journal?email=${encodeURIComponent(email)}`);
    const entries = result.journals || [];

    historyList.innerHTML = "";

    if (!entries.length) {
      const empty = document.createElement("li");
      empty.textContent = "No entries yet. Start with a small reflection.";
      historyList.appendChild(empty);
      return;
    }

    entries.slice(0, 8).forEach((entry) => {
      historyList.appendChild(createHistoryItem(entry));
    });
  } catch (error) {
    historyList.innerHTML = "<li>Could not load journal history right now.</li>";
  }
}

function initJournalHistoryDelete() {
  const historyList = document.querySelector("#journalHistory");
  const statusEl = document.querySelector("#journalStatus");
  if (!historyList || !statusEl) return;

  historyList.addEventListener("click", async (event) => {
    const button = event.target.closest(".history-delete-btn");
    if (!button) return;

    const entryId = button.dataset.entryId;
    if (!entryId) return;

    const confirmed = window.confirm("Delete this journal entry?");
    if (!confirmed) return;

    statusEl.textContent = "Deleting entry...";

    try {
      await apiRequest(`/journal/${encodeURIComponent(entryId)}`, {
        method: "DELETE",
        body: JSON.stringify({ userEmail: getUserEmail() })
      });
      statusEl.textContent = "Entry deleted.";
      showToast("Journal entry deleted.");
      loadJournalHistory();
    } catch (error) {
      statusEl.textContent = error.message;
      showToast(error.message, "error");
    }
  });
}

function initJournalPage() {
  const promptEl = document.querySelector("#journalPrompt");
  const journalText = document.querySelector("#journalText");
  const saveButton = document.querySelector("#saveJournalBtn");
  const analyzeButton = document.querySelector("#analyzeBtn");
  const clearDraftButton = document.querySelector("#clearDraftBtn");
  const charCount = document.querySelector("#journalCharCount");
  const statusEl = document.querySelector("#journalStatus");
  const aiResponse = document.querySelector("#aiResponse");

  if (!promptEl || !journalText || !saveButton || !analyzeButton || !statusEl || !aiResponse) return;
  const email = getUserEmail();
  const draftKey = `stillspaceJournalDraft:${email || "guest"}`;

  // Pull one random prompt every time this page opens.
  const prompt = window.StillSpacePrompts
    ? window.StillSpacePrompts.getRandomPrompt()
    : "What made you feel calm today?";
  promptEl.textContent = prompt;

  function updateCharCount() {
    if (!charCount) return;
    const count = journalText.value.length;
    charCount.textContent = `${count} ${count === 1 ? "character" : "characters"}`;
  }

  const existingDraft = localStorage.getItem(draftKey);
  if (existingDraft) {
    journalText.value = existingDraft;
    statusEl.textContent = "Loaded your saved draft.";
  }
  updateCharCount();

  let draftSaveTimeout = null;
  journalText.addEventListener("input", () => {
    updateCharCount();
    if (draftSaveTimeout) clearTimeout(draftSaveTimeout);
    draftSaveTimeout = setTimeout(() => {
      localStorage.setItem(draftKey, journalText.value);
    }, 250);
  });

  if (clearDraftButton) {
    clearDraftButton.addEventListener("click", () => {
      journalText.value = "";
      localStorage.removeItem(draftKey);
      updateCharCount();
      statusEl.textContent = "Draft cleared.";
      showToast("Draft cleared.", "success");
    });
  }

  saveButton.addEventListener("click", async () => {
    const text = journalText.value.trim();
    if (!text) {
      statusEl.textContent = "Please write a journal entry before saving.";
      showToast("Please write a journal entry first.", "error");
      return;
    }

    statusEl.textContent = "Saving entry...";
    try {
      await apiRequest("/journal", {
        method: "POST",
        body: JSON.stringify({
          userEmail: getUserEmail(),
          prompt,
          text
        })
      });
      statusEl.textContent = "Entry saved successfully.";
      localStorage.removeItem(draftKey);
      showToast("Journal entry saved.");
      loadJournalHistory();
    } catch (error) {
      statusEl.textContent = error.message;
      showToast(error.message, "error");
    }
  });

  analyzeButton.addEventListener("click", async () => {
    const text = journalText.value.trim();
    if (!text) {
      statusEl.textContent = "Write a few lines first so AI can reflect on it.";
      return;
    }

    statusEl.textContent = "Analyzing with AI...";
    aiResponse.textContent = "Reading your reflection...";
    try {
      const aiResult = await window.analyzeJournalWithAI(text);
      aiResponse.textContent = aiResult.reflection;
      statusEl.textContent = aiResult.source === "fallback"
        ? "AI helper is in local mode right now, but reflection is ready."
        : "AI reflection is ready.";
      showToast("Reflection generated.");
    } catch (error) {
      aiResponse.textContent = "I couldn't generate a reflection right now. Try again in a moment.";
      statusEl.textContent = error.message;
      showToast(error.message, "error");
    }
  });

  initJournalHistoryDelete();
  loadJournalHistory();
}

async function initProfilePage() {
  const emailInput = document.querySelector("#profileEmail");
  const nicknameInput = document.querySelector("#profileNickname");
  const saveButton = document.querySelector("#saveProfileBtn");
  const deleteButton = document.querySelector("#deleteAccountBtn");
  const profileJournalCount = document.querySelector("#profileJournalCount");
  const profileMoodCount = document.querySelector("#profileMoodCount");
  const profileMoodStreak = document.querySelector("#profileMoodStreak");
  const statusEl = document.querySelector("#profileStatus");
  if (!emailInput || !nicknameInput || !saveButton || !deleteButton || !statusEl) return;

  const email = getUserEmail();
  if (!email) {
    window.location.href = "login.html";
    return;
  }

  emailInput.value = email;
  nicknameInput.value = getUserNickname() || email.split("@")[0] || "Friend";

  try {
    const result = await apiRequest(`/profile?email=${encodeURIComponent(email)}`);
    const nickname = result?.user?.nickname || nicknameInput.value;
    nicknameInput.value = nickname;
    setUserProfile(email, nickname);
    initUserIdentityUI();
  } catch (error) {
    // Keep local profile if backend profile fetch fails.
  }

  async function refreshProfileStats() {
    if (!profileJournalCount || !profileMoodCount || !profileMoodStreak) return;
    try {
      const [journals, moods] = await Promise.all([fetchJournalData(), fetchMoodData()]);
      profileJournalCount.textContent = String(journals.length);
      profileMoodCount.textContent = String(moods.length);
      const streak = calculateMoodStreak(moods);
      profileMoodStreak.textContent = `${streak} ${streak === 1 ? "Day" : "Days"}`;
    } catch (error) {
      profileJournalCount.textContent = "-";
      profileMoodCount.textContent = "-";
      profileMoodStreak.textContent = "-";
    }
  }

  refreshProfileStats();

  saveButton.addEventListener("click", async () => {
    const nickname = nicknameInput.value.trim();
    statusEl.textContent = "Saving profile...";

    try {
      const result = await apiRequest("/profile", {
        method: "PUT",
        body: JSON.stringify({ email, nickname })
      });

      const savedNickname = result?.user?.nickname || nickname || email.split("@")[0] || "Friend";
      setUserProfile(email, savedNickname);
      nicknameInput.value = savedNickname;
      initUserIdentityUI();
      statusEl.textContent = "Profile updated.";
      showToast("Profile updated.");
    } catch (error) {
      statusEl.textContent = error.message;
      showToast(error.message, "error");
    }
  });

  deleteButton.addEventListener("click", async () => {
    const confirmed = window.confirm(
      "This will permanently delete your account, journals, and moods. Continue?"
    );
    if (!confirmed) return;

    statusEl.textContent = "Deleting account...";
    try {
      await apiRequest("/account", {
        method: "DELETE",
        body: JSON.stringify({ email })
      });
      clearSession();
      statusEl.textContent = "Account deleted. Redirecting...";
      showToast("Account deleted.");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 600);
    } catch (error) {
      statusEl.textContent = error.message;
      showToast(error.message, "error");
    }
  });
}

function initPage() {
  const page = document.body.dataset.page;

  requireAuth(page);
  initTheme();
  initLogout();
  initPageTransitions();
  initUserIdentityUI();

  if (page === "login") {
    initLoginPage();
  }

  if (page === "dashboard") {
    initDashboardPage();
  }

  if (page === "journal") {
    initJournalPage();
  }

  if (page === "profile") {
    initProfilePage();
  }
}

window.StillSpaceMoodUtils = {
  dateToKey,
  calculateMoodStreak,
  fetchMoodData,
  showToast
};

document.addEventListener("DOMContentLoaded", initPage);

