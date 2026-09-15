import { ReducerState } from "./matrix-linear-transformation-gridReducer";
import { DEFAULT_CHALLENGE } from "./matrix-linear-transformation-gridConfig";

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

export function evaluateTransformProofProgress(state: ReducerState): ProofProgress {
  const isChallengeCorrect =
    state.challengeChecked &&
    DEFAULT_CHALLENGE.options.find((o) => o.id === state.challengeChoice)?.isCorrect === true;

  const inspectCompleted = true;
  const manipulateCompleted =
    state.activeStep >= 1 || state.activePreset !== "default" || state.vectorV.x !== 2 || state.vectorV.y !== 1;
  const preserveCompleted = state.activeStep >= 2 || state.showPath;
  const connectCompleted = state.activeStep >= 3 || state.activePreset === "shear" || state.activePreset === "rotate-30";
  const concludeCompleted = state.activeStep >= 4 || state.activeActionTab === "Transformations";
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
    unlockedOutcomes.push("Interpret columns as transformed basis vectors");
  }
  if (connectCompleted) {
    unlockedOutcomes.push("Compute Av");
  }
  if (concludeCompleted && transferCompleted) {
    unlockedOutcomes.push("See matrices as transformations of space");
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
