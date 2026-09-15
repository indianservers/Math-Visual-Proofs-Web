// ─── Exterior Angle Sum of Polygon — Completion Verification ────────────────────
import type { ExteriorAngleSumState } from './exterior-angle-sum-polygonReducer';

export function checkCompletion(state: ExteriorAngleSumState) {
  const predictCorrect = state.predictCorrect;
  const challengeCorrect = state.challengeCorrect;
  const isComplete = predictCorrect || challengeCorrect;

  return { isComplete, predictCorrect, challengeCorrect };
}
