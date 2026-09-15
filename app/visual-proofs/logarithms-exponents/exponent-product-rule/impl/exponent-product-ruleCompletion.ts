// ─── Exponent Product Rule — Completion Verification ───────────────────────────
import type { ExponentProductState } from './exponent-product-ruleReducer';

export interface CompletionResult {
  isComplete: boolean;
  isJoined: boolean;
  predictionCorrect: boolean;
  challengeCorrect: boolean;
  progressPercent: number;
}

export function checkCompletion(state: ExponentProductState): CompletionResult {
  const isJoined = state.isJoined;
  const predictionCorrect = state.predictionCorrect;
  const challengeCorrect = state.challengeCorrect;

  let count = 0;
  if (isJoined) count++;
  if (predictionCorrect) count++;
  if (challengeCorrect) count++;

  const progressPercent = Math.round((count / 3) * 100);
  const isComplete = isJoined && (predictionCorrect || challengeCorrect);

  return {
    isComplete,
    isJoined,
    predictionCorrect,
    challengeCorrect,
    progressPercent,
  };
}
