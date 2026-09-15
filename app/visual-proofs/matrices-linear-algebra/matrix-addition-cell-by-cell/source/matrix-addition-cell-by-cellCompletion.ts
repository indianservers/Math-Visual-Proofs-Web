import { ReducerState } from "./matrix-addition-cell-by-cellReducer";

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

export function evaluateMatrixProofProgress(state: ReducerState): ProofProgress {
  const totalCells = state.matrixA.rows * state.matrixA.cols;
  const placedCount = Object.keys(state.placedCells).length;

  const isPredictionCorrect = state.predictionChecked && state.predictionCorrect;
  const isChallengeCorrect = state.challengeChecked && state.challengeCorrect;

  const inspectCompleted = true;
  const manipulateCompleted =
    state.activeStep >= 1 || placedCount >= totalCells;
  const preserveCompleted = state.activeStep >= 2 || placedCount >= 2;
  const connectCompleted = state.activeStep >= 3 || state.revealFullProof;
  const concludeCompleted = state.activeStep >= 4 || isPredictionCorrect;
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
    unlockedOutcomes.push("Add matching matrix entries");
  }
  if (connectCompleted) {
    unlockedOutcomes.push("Identify dimension requirements");
  }
  if (concludeCompleted && transferCompleted) {
    unlockedOutcomes.push("Explain why addition is position-by-position");
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
