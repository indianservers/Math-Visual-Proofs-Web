// ─── Heron's Formula — Completion Verification ───────────────────────────────
import type { HeronsState } from './herons-formula-visual-proofReducer';

export function checkCompletion(state: HeronsState) {
  const predictRevealed = state.predictRevealed;
  const challengeCorrect = state.challengeCorrect;
  const isComplete = predictRevealed || challengeCorrect;

  return { isComplete, predictRevealed, challengeCorrect };
}
