// ─── Zero Exponent Rule — Completion Verification ──────────────────────────────
import type { ZeroExponentState } from './zero-exponent-ruleReducer';

export function checkCompletion(state: ZeroExponentState) {
  const isCancelled = state.isCancelled;
  const predictCorrect = state.predictCorrect;
  const challengeCorrect = state.challengeCorrect;
  const isComplete = isCancelled && (predictCorrect || challengeCorrect);

  return { isComplete, isCancelled, predictCorrect, challengeCorrect };
}
