// ─── Exponent Quotient Rule — Completion Verification ──────────────────────────
import type { ExponentQuotientState } from './exponent-quotient-ruleReducer';

export interface CompletionResult {
  isComplete: boolean;
  isFullyCancelled: boolean;
  predictionCorrect: boolean;
  challengeCorrect: boolean;
  progressPercent: number;
}

export function checkCompletion(state: ExponentQuotientState): CompletionResult {
  const maxPossible = Math.min(state.m, state.n);
  const isFullyCancelled = state.cancelledCount >= maxPossible;
  const predictionCorrect = state.predictionCorrect;
  const challengeCorrect = state.challengeCorrect;

  let count = 0;
  if (isFullyCancelled) count++;
  if (predictionCorrect) count++;
  if (challengeCorrect) count++;

  const progressPercent = Math.round((count / 3) * 100);
  const isComplete = isFullyCancelled && (predictionCorrect || challengeCorrect);

  return {
    isComplete,
    isFullyCancelled,
    predictionCorrect,
    challengeCorrect,
    progressPercent,
  };
}
