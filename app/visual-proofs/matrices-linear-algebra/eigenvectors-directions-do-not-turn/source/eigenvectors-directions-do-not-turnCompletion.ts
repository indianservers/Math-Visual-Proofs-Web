import { ReducerState } from "./eigenvectors-directions-do-not-turnReducer";

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

export function evaluateEigenvectorsProofProgress(state: ReducerState): ProofProgress {
  const isChallengeCorrect = state.challengeChecked && state.challengeCorrect;
  const isPredictChecked = state.predictChecked;

  const inspectCompleted = true;
  const manipulateCompleted = state.activeStep >= 1 || state.selectedVector !== "v1" || state.matrix.a !== 2;
  const preserveCompleted = state.activeStep >= 2 || isPredictChecked;
  const connectCompleted = state.activeStep >= 3 || state.revealExact;
  const concludeCompleted = state.activeStep >= 4 || (isPredictChecked && state.revealExact);
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
    unlockedOutcomes.push("Recognize eigenvector directions");
  }
  if (connectCompleted) {
    unlockedOutcomes.push("Interpret lambda as stretch factor");
  }
  if (concludeCompleted && transferCompleted) {
    unlockedOutcomes.push("Distinguish special directions from arbitrary vectors");
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
