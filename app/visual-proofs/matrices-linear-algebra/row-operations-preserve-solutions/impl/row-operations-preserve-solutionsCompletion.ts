import { ReducerState } from "./row-operations-preserve-solutionsReducer";

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

export function evaluateRowOpsProofProgress(state: ReducerState): ProofProgress {
  const isChallengeCorrect = state.challengeChecked && state.challengeCorrect;
  const isPredictCorrect = state.predictChecked && state.predictChoice === "A";

  const inspectCompleted = true;
  const manipulateCompleted =
    state.activeStep >= 1 || state.activeOp !== "swap" || state.system1.row1.a !== 2;
  const preserveCompleted = state.activeStep >= 2 || state.predictChecked;
  const connectCompleted = state.activeStep >= 3 || state.revealExact;
  const concludeCompleted = state.activeStep >= 4 || isPredictCorrect || state.revealExact;
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
    unlockedOutcomes.push("Use valid row operations");
  }
  if (connectCompleted) {
    unlockedOutcomes.push("Explain equivalent systems");
  }
  if (concludeCompleted && transferCompleted) {
    unlockedOutcomes.push("Verify the solution set is preserved");
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
