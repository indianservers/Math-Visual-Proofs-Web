// ─── Negative Exponent Rule — Completion Verification ──────────────────────────
import type { NegativeExponentState } from './negative-exponent-ruleReducer';

export function checkCompletion(state: NegativeExponentState) {
  const isMovedLeft = state.stepsMovedLeft > 0;
  const predictCorrect = state.predictCorrect;
  const challengeCorrect = state.challengeCorrect;
  const isComplete = isMovedLeft && (predictCorrect || challengeCorrect);

  return { isComplete, isMovedLeft, predictCorrect, challengeCorrect };
}
