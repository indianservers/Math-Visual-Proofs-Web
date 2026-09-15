// ─── Volume of a Pyramid — Completion Verification ────────────────────────────
import type { PyramidVolumeState } from './pyramid-volume-one-thirdReducer';

export function checkCompletion(state: PyramidVolumeState) {
  const isFilled = state.placedPyramidsCount >= 3;
  const predictCorrect = state.predictCorrect;
  const challengeCorrect = state.challengeCorrect;
  const isComplete = isFilled && (predictCorrect || challengeCorrect);

  return { isComplete, isFilled, predictCorrect, challengeCorrect };
}
