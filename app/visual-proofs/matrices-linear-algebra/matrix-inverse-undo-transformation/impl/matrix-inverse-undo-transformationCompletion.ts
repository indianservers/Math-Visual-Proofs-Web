import { ReducerState } from "./matrix-inverse-undo-transformationReducer";

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

export function evaluateMatrixInverseProofProgress(state: ReducerState): ProofProgress {
  const isChallengeCorrect = state.challengeChecked && state.challengeCorrect;
  const isQuizCorrect = state.quizChoice === "original_p" && state.quizRevealed;

  const inspectCompleted = true;
  const manipulateCompleted =
    state.activeStep >= 1 || state.stage !== "apply_a" || state.matrixA.a !== 2;
  const preserveCompleted = state.activeStep >= 2 || state.stage === "apply_a_inv";
  const connectCompleted = state.activeStep >= 3 || state.stage === "result" || isQuizCorrect;
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
    unlockedOutcomes.push("Explain inverse as undoing a transformation");
  }
  if (connectCompleted) {
    unlockedOutcomes.push("Connect determinant zero to non-invertibility");
  }
  if (concludeCompleted && transferCompleted) {
    unlockedOutcomes.push("Verify A inverse Av equals v");
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
