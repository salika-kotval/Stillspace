/* Calls backend endpoint that handles OpenAI reflection. */
async function analyzeJournalWithAI(journalText) {
  if (!journalText || !journalText.trim()) {
    throw new Error("Please write a journal entry first.");
  }

  const response = await fetch("/ai-reflection", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: journalText })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "AI reflection failed");
  }

  return {
    reflection: payload.reflection || "Take a slow breath and notice what your body needs right now.",
    source: payload.source || "fallback"
  };
}

window.analyzeJournalWithAI = analyzeJournalWithAI;
