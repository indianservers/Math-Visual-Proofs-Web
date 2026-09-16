import { ReducerState } from "./integration-by-parts-visual-proofReducer";
import { QUIZ_OPTIONS } from "./integration-by-parts-visual-proofConfig";

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
  const isQuizCorrect =
    state.quizRevealed &&
    QUIZ_OPTIONS.find((o) => o.id === state.quizChoice)?.correct === true;

  const inspectCompleted = true; // Givens are available at initialization
  const manipulateCompleted = state.activeStep >= 1 || Math.abs(state.x - 1.78) > 0.05;
  const preserveCompleted = state.activeStep >= 2;
  const connectCompleted = state.activeStep >= 3 || state.graphView !== "curve";
  const concludeCompleted = isQuizCorrect || state.activeStep >= 4;
  const transferCompleted = state.challengeChecked || state.activeStep >= 5;

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
    unlockedOutcomes.push("Interpret the product rectangle area balance");
  }
  if (connectCompleted) {
    unlockedOutcomes.push("Connect product rule to function motion & accumulation");
  }
  if (concludeCompleted && transferCompleted) {
    unlockedOutcomes.push("Derive and verify integration by parts theorem");
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
