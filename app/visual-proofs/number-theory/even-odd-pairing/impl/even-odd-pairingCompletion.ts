import { ReducerState } from "./even-odd-pairingReducer";

export interface ProofProgress {
  inspectCompleted: boolean;
  manipulateCompleted: boolean;
  preserveCompleted: boolean;
  connectCompleted: boolean;
  concludeCompleted: boolean;
  transferCompleted: boolean;
  allCompleted: boolean;
  completionScore: number;
  unlockedOutcomes: string[];
}

export function evaluateProofProgress(state: ReducerState): ProofProgress {
  const placedCount = Object.keys(state.placedCounters).length;
  const leftoverCount = state.leftoverCounterId !== null ? 1 : 0;
  const totalAssigned = placedCount + leftoverCount;

  const isQuizCorrect = state.predictionRevealed && state.predictionChoice === "even";
  const isChallengeCorrect = state.challengeChecked && state.challengeCorrect;

  const inspectCompleted = true;
  const manipulateCompleted =
    state.activeStep >= 1 || (state.n > 0 && totalAssigned === state.n) || state.n === 0;
  const preserveCompleted = state.activeStep >= 2 || (totalAssigned === state.n && state.n > 0);
  const connectCompleted = state.activeStep >= 3 || state.revealFormula || state.model !== "pairs";
  const concludeCompleted = state.activeStep >= 4 || isQuizCorrect;
  const transferCompleted = state.activeStep >= 5 || isChallengeCorrect;

  const completedStepsCount = [
    inspectCompleted,
    manipulateCompleted,
    preserveCompleted,
    connectCompleted,
    concludeCompleted,
    transferCompleted,
  ].filter(Boolean).length;

  const completionScore = Math.round((completedStepsCount / 6) * 100);

  const unlockedOutcomes: string[] = [];
  if (manipulateCompleted) {
    unlockedOutcomes.push("Classify even and odd numbers visually");
  }
  if (connectCompleted) {
    unlockedOutcomes.push("Connect n = 2k and n = 2k + 1 to pairing");
  }
  if (concludeCompleted && transferCompleted) {
    unlockedOutcomes.push("Use leftovers to explain parity");
  }

  const allCompleted =
    inspectCompleted &&
    manipulateCompleted &&
    preserveCompleted &&
    connectCompleted &&
    concludeCompleted &&
    transferCompleted;

  return {
    inspectCompleted,
    manipulateCompleted,
    preserveCompleted,
    connectCompleted,
    concludeCompleted,
    transferCompleted,
    allCompleted,
    completionScore,
    unlockedOutcomes,
  };
}
