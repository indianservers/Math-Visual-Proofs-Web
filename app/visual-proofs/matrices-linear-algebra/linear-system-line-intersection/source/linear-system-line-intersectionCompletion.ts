import { ReducerState } from "./linear-system-line-intersectionReducer";

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

export function evaluateSystemProofProgress(state: ReducerState): ProofProgress {
  const isChallengeCorrect = state.challengeChecked && state.challengeCorrect;
  const isPredictionCorrect =
    state.predictionChecked && state.predictionChoice === "none_or_infinite";

  const inspectCompleted = true;
  const manipulateCompleted =
    state.activeStep >= 1 || state.eq1.a !== 2 || state.eq2.b !== -1;
  const preserveCompleted = state.activeStep >= 2 || state.eq1.c !== 5 || state.eq2.c !== 1;
  const connectCompleted = state.activeStep >= 3 || state.predictionRevealed;
  const concludeCompleted = state.activeStep >= 4 || isPredictionCorrect || state.predictionRevealed;
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
    unlockedOutcomes.push("Interpret a solution as line intersection");
  }
  if (connectCompleted) {
    unlockedOutcomes.push("Classify one/no/infinite solutions");
  }
  if (concludeCompleted && transferCompleted) {
    unlockedOutcomes.push("Connect determinant to uniqueness");
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
