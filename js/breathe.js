/* Guided breathing animation
   Cycle: Inhale 4s -> Hold 4s -> Exhale 4s */

const BREATH_PHASES = [
  { name: "Inhale", className: "inhale", duration: 4 },
  { name: "Hold", className: "hold", duration: 4 },
  { name: "Exhale", className: "exhale", duration: 4 }
];

let phaseIndex = 0;
let secondsLeft = BREATH_PHASES[0].duration;
let timer = null;
let completedCycles = 0;
let targetCycles = 3;

function getElements() {
  return {
    circle: document.querySelector("#breathCircle"),
    phaseText: document.querySelector("#breathPhase"),
    counter: document.querySelector("#breathCounter"),
    cycleProgress: document.querySelector("#cycleProgress"),
    progressFill: document.querySelector("#breathProgressFill"),
    status: document.querySelector("#breathSessionStatus"),
    cycleTargetSelect: document.querySelector("#cycleTarget")
  };
}

function applyPhase() {
  const { circle, phaseText, counter } = getElements();
  if (!circle || !phaseText || !counter) return;

  const phase = BREATH_PHASES[phaseIndex];
  circle.classList.remove("inhale", "hold", "exhale");
  circle.classList.add(phase.className);
  phaseText.textContent = phase.name;
  counter.textContent = String(secondsLeft);
}

function updateSessionProgress() {
  const { cycleProgress, progressFill } = getElements();
  if (cycleProgress) {
    cycleProgress.textContent = `Cycle ${completedCycles} / ${targetCycles}`;
  }

  if (progressFill) {
    const percent = targetCycles > 0 ? Math.min(100, (completedCycles / targetCycles) * 100) : 0;
    progressFill.style.width = `${percent}%`;
  }
}

function goToNextPhase() {
  const currentPhase = BREATH_PHASES[phaseIndex];
  if (currentPhase.name === "Exhale") {
    completedCycles += 1;
    updateSessionProgress();

    if (completedCycles >= targetCycles) {
      pauseBreathing();
      const { status } = getElements();
      if (status) status.textContent = "Session complete. Great job staying present.";
      return;
    }
  }

  phaseIndex = (phaseIndex + 1) % BREATH_PHASES.length;
  secondsLeft = BREATH_PHASES[phaseIndex].duration;
  applyPhase();
}

function tick() {
  secondsLeft -= 1;
  const { counter } = getElements();
  if (counter) counter.textContent = String(Math.max(secondsLeft, 0));

  if (secondsLeft <= 0) {
    goToNextPhase();
  }
}

function startBreathing() {
  const { status } = getElements();

  if (completedCycles >= targetCycles) {
    resetSession(false);
  }

  if (timer) return;
  if (status) status.textContent = "Breathing session in progress.";

  applyPhase();
  timer = setInterval(tick, 1000);
}

function pauseBreathing() {
  if (!timer) return;
  clearInterval(timer);
  timer = null;
}

function resetSession(announce = true) {
  pauseBreathing();
  phaseIndex = 0;
  secondsLeft = BREATH_PHASES[0].duration;
  completedCycles = 0;
  updateSessionProgress();
  applyPhase();

  const { status } = getElements();
  if (status && announce) {
    status.textContent = "Session reset. Press Start when ready.";
  }
}

function initBreathingPage() {
  const startButton = document.querySelector("#startBreathBtn");
  const pauseButton = document.querySelector("#pauseBreathBtn");
  const resetButton = document.querySelector("#resetBreathBtn");
  const { cycleTargetSelect, status } = getElements();

  if (!startButton || !pauseButton || !cycleTargetSelect) return;

  targetCycles = Number(cycleTargetSelect.value) || 3;
  updateSessionProgress();
  applyPhase();
  if (status) status.textContent = "Choose your cycle count, then press Start.";

  startButton.addEventListener("click", startBreathing);
  pauseButton.addEventListener("click", () => {
    pauseBreathing();
    if (status) status.textContent = "Paused. Press Start to continue.";
  });

  if (resetButton) {
    resetButton.addEventListener("click", () => resetSession(true));
  }

  cycleTargetSelect.addEventListener("change", () => {
    targetCycles = Number(cycleTargetSelect.value) || 3;
    resetSession(false);
    if (status) {
      status.textContent = `Session updated to ${targetCycles} cycles.`;
    }
  });
}

document.addEventListener("DOMContentLoaded", initBreathingPage);
