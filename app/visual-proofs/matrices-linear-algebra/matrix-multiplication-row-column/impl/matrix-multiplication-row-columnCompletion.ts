import { ReducerState } from "./matrix-multiplication-row-columnReducer";

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

export function evaluateMultProofProgress(state: ReducerState): ProofProgress {
  const inspectCompleted = true;
  const manipulateCompleted =
    state.activeStep >= 1 || state.selectedRow !== 1 || state.selectedCol !== 2 || state.highlightProducts;
  const preserveCompleted = state.activeStep >= 2 || state.highlightProducts;
  const connectCompleted = state.activeStep >= 3 || state.predictionRevealed;
  const concludeCompleted = state.activeStep >= 4 || state.predictionRevealed;
  const transferCompleted = state.activeStep >= 5 || state.challengeCompleted;

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
    unlockedOutcomes.push("Compute one entry of a product matrix");
  }
  if (connectCompleted) {
    unlockedOutcomes.push("Connect rows and columns to dot products");
  }
  if (concludeCompleted && transferCompleted) {
    unlockedOutcomes.push("Avoid cell-by-cell multiplication mistakes");
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
