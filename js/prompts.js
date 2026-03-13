/* Daily prompts used on the journal page. */
const reflectionPrompts = [
  "What made you feel calm today?",
  "What challenged you today?",
  "What are you grateful for today?",
  "What helped you relax today?",
  "What made you smile today?"
];

function getRandomPrompt() {
  const randomIndex = Math.floor(Math.random() * reflectionPrompts.length);
  return reflectionPrompts[randomIndex];
}

window.StillSpacePrompts = {
  reflectionPrompts,
  getRandomPrompt
};
