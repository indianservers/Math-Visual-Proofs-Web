// ─── Shoelace Formula — Completion Verification ───────────────────────────────
import type { ShoelaceState } from './shoelace-formulaReducer';

export function checkCompletion(state: ShoelaceState) {
  const predictCorrect = state.predictCorrect;
  const challengeCorrect = state.challengeCorrect;
  const isComplete = predictCorrect || challengeCorrect;

  return { isComplete, predictCorrect, challengeCorrect };
}
