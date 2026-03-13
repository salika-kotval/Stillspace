/* Mood tracker page logic:
   - saves daily mood
   - renders mood history with Chart.js
   - displays streak value and quick insights */

let selectedMood = null;
let moodChartInstance = null;

function normalizeEmail(emailInput) {
  return String(emailInput || "").trim().toLowerCase();
}

function formatDateLabel(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatDateReadable(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

async function loadMoodHistory() {
  const email = normalizeEmail(localStorage.getItem("stillspaceUserEmail"));
  if (!email) return [];

  const response = await fetch(`/mood?email=${encodeURIComponent(email)}`);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "Could not load moods");
  }
  return payload.moods || [];
}

function renderMoodChart(moods) {
  const chartElement = document.querySelector("#moodChart");
  if (!chartElement || typeof Chart === "undefined") return;

  const sorted = [...moods].sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  const labels = sorted.map((entry) => formatDateLabel(entry.dateKey));
  const data = sorted.map((entry) => entry.score);

  if (moodChartInstance) moodChartInstance.destroy();

  moodChartInstance = new Chart(chartElement, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Mood Trend",
          data,
          borderColor: "#8f8ff7",
          backgroundColor: "rgba(143, 143, 247, 0.18)",
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          min: 1,
          max: 5,
          ticks: {
            callback(value) {
              const moodMap = { 1: "Stressed", 2: "Sad", 3: "Neutral", 4: "Calm", 5: "Happy" };
              return moodMap[value] || value;
            }
          }
        }
      }
    }
  });
}

function updateMoodInsights(moods) {
  const weeklyAvgEl = document.querySelector("#moodWeeklyAvg");
  const commonEl = document.querySelector("#moodCommon");
  const lastLoggedEl = document.querySelector("#moodLastLogged");

  if (!weeklyAvgEl || !commonEl || !lastLoggedEl) return;
  if (!moods.length) {
    weeklyAvgEl.textContent = "-";
    commonEl.textContent = "-";
    lastLoggedEl.textContent = "-";
    return;
  }

  const sorted = [...moods].sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  const recent = sorted.slice(-7);
  const avg = recent.reduce((sum, entry) => sum + Number(entry.score || 0), 0) / recent.length;

  const countMap = new Map();
  sorted.forEach((entry) => {
    const mood = entry.mood || "Unknown";
    countMap.set(mood, (countMap.get(mood) || 0) + 1);
  });

  const mostCommon = [...countMap.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
  const latest = sorted[sorted.length - 1];

  weeklyAvgEl.textContent = avg.toFixed(1) + " / 5";
  commonEl.textContent = mostCommon;
  lastLoggedEl.textContent = latest ? formatDateReadable(latest.dateKey) : "-";
}

function syncTodaySelection(moods) {
  const todayKey = window.StillSpaceMoodUtils.dateToKey(new Date());
  const todayMood = moods.find((entry) => entry.dateKey === todayKey);
  if (!todayMood) return;

  const matchingButton = document.querySelector(`.mood-btn[data-mood="${todayMood.mood}"]`);
  if (!matchingButton) return;

  document.querySelectorAll(".mood-btn").forEach((btn) => btn.classList.remove("active"));
  matchingButton.classList.add("active");
  selectedMood = {
    mood: todayMood.mood,
    score: Number(todayMood.score)
  };
}

async function refreshMoodUI() {
  const streakEl = document.querySelector("#moodStreakPage");
  if (!streakEl) return;

  const moods = await loadMoodHistory();
  renderMoodChart(moods);
  updateMoodInsights(moods);

  const streak = window.StillSpaceMoodUtils.calculateMoodStreak(moods);
  streakEl.textContent = `Mood Streak: ${streak} ${streak === 1 ? "Day" : "Days"}`;
  syncTodaySelection(moods);
}

function initMoodButtons() {
  const buttons = document.querySelectorAll(".mood-btn");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      selectedMood = {
        mood: button.dataset.mood,
        score: Number(button.dataset.score)
      };
    });
  });
}

function initMoodPage() {
  const saveButton = document.querySelector("#saveMoodBtn");
  const status = document.querySelector("#moodStatus");
  if (!saveButton || !status) return;

  initMoodButtons();

  saveButton.addEventListener("click", async () => {
    if (!selectedMood) {
      status.textContent = "Pick a mood before saving.";
      window.StillSpaceMoodUtils.showToast("Pick a mood first.", "error");
      return;
    }

    status.textContent = "Saving your mood...";
    try {
      const email = normalizeEmail(localStorage.getItem("stillspaceUserEmail"));
      const todayKey = window.StillSpaceMoodUtils.dateToKey(new Date());

      const response = await fetch("/mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userEmail: email,
          mood: selectedMood.mood,
          score: selectedMood.score,
          dateKey: todayKey
        })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || "Mood save failed");
      }

      status.textContent = "Mood saved for today.";
      window.StillSpaceMoodUtils.showToast("Mood saved.");
      refreshMoodUI();
    } catch (error) {
      status.textContent = error.message;
      window.StillSpaceMoodUtils.showToast(error.message, "error");
    }
  });

  refreshMoodUI().catch(() => {
    status.textContent = "Could not load mood analytics right now.";
  });
}

document.addEventListener("DOMContentLoaded", initMoodPage);
