import { ReducerState } from "./determinant-area-scale-factorReducer";

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

export function evaluateDetProofProgress(state: ReducerState): ProofProgress {
  const isChallengeCorrect = state.challengeChecked && state.challengeCorrect;
  const isPredictionCorrect = state.predictionChecked && state.predictionCorrect;

  const inspectCompleted = true;
  const manipulateCompleted =
    state.activeStep >= 1 || state.activePreset !== "default" || state.matrixA.a !== 1.4;
  const preserveCompleted = state.activeStep >= 2 || state.showPath;
  const connectCompleted = state.activeStep >= 3 || state.activePreset === "flip";
  const concludeCompleted = state.activeStep >= 4 || isPredictionCorrect || state.revealExact;
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
    unlockedOutcomes.push("Compute determinant ad-bc");
  }
  if (connectCompleted) {
    unlockedOutcomes.push("Interpret absolute determinant as area scale");
  }
  if (concludeCompleted && transferCompleted) {
    unlockedOutcomes.push("Recognize orientation flips");
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
