// ─── Power of a Power Rule — Completion Verification ───────────────────────────
import type { PowerOfPowerState } from './power-of-a-power-ruleReducer';

export function checkCompletion(state: PowerOfPowerState) {
  const isFlattened = state.isFlattened;
  const predictCorrect = state.predictCorrect;
  const challengeCorrect = state.challengeCorrect;
  const isComplete = isFlattened && (predictCorrect || challengeCorrect);

  return { isComplete, isFlattened, predictCorrect, challengeCorrect };
}
