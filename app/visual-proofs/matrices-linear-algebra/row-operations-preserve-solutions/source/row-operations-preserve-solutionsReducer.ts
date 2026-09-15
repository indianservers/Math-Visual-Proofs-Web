import {
  AugmentedMatrixState,
  INITIAL_SYSTEM_1,
  RowOperationType,
  ChallengeStep,
  DEFAULT_CHALLENGE_TARGET,
} from "./row-operations-preserve-solutionsConfig";
import {
  applyRowOp,
  checkEquivalenceInvariant,
} from "./row-operations-preserve-solutionsMath";

export interface ReducerState {
  system1: AugmentedMatrixState;
  system2: AugmentedMatrixState;
  activeOp: RowOperationType;
  activeK: number;
  predictChoice: "A" | "B" | "C" | "";
  predictChecked: boolean;
  revealExact: boolean;
  challengeSteps: ChallengeStep[];
  challengeChecked: boolean;
  challengeCorrect: boolean;
  activeStep: number;
  hintTier: number;
  liveAnnouncement: string;
  history: Array<Omit<ReducerState, "history" | "future">>;
  future: Array<Omit<ReducerState, "history" | "future">>;
}

export type ReducerAction =
  | { type: "SET_SYS1_ENTRY"; payload: { row: "row1" | "row2"; key: "a" | "b" | "c"; value: number } }
  | { type: "APPLY_ROW_OP"; payload: { op: RowOperationType; k?: number } }
  | { type: "SET_PREDICT_CHOICE"; payload: "A" | "B" | "C" }
  | { type: "CHECK_PREDICT" }
  | { type: "TOGGLE_REVEAL" }
  | { type: "ADD_CHALLENGE_STEP"; payload: { op: RowOperationType; k?: number } }
  | { type: "RESET_CHALLENGE_STEPS" }
  | { type: "CHECK_CHALLENGE" }
  | { type: "SET_ACTIVE_STEP"; payload: number }
  | { type: "SET_HINT_TIER"; payload: number }
  | { type: "SET_LIVE_ANNOUNCEMENT"; payload: string }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESET" };

export const initialState: ReducerState = {
  system1: { ...INITIAL_SYSTEM_1 },
  system2: applyRowOp(INITIAL_SYSTEM_1, "swap"),
  activeOp: "swap",
  activeK: 1,
  predictChoice: "A",
  predictChecked: true,
  revealExact: true,
  challengeSteps: [{ stepNumber: 1, operation: "swap", label: "R_1 \\leftrightarrow R_2" }],
  challengeChecked: false,
  challengeCorrect: false,
  activeStep: 0,
  hintTier: 0,
  liveAnnouncement: "Row Operations Preserve Solution Set visual proof loaded. System 1 and System 2 both intersect at (2, 1).",
  history: [],
  future: [],
};

function pushHistory(state: ReducerState): ReducerState {
  const snapshot: Omit<ReducerState, "history" | "future"> = {
    system1: {
      row1: { ...state.system1.row1 },
      row2: { ...state.system1.row2 },
    },
    system2: {
      row1: { ...state.system2.row1 },
      row2: { ...state.system2.row2 },
    },
    activeOp: state.activeOp,
    activeK: state.activeK,
    predictChoice: state.predictChoice,
    predictChecked: state.predictChecked,
    revealExact: state.revealExact,
    challengeSteps: [...state.challengeSteps],
    challengeChecked: state.challengeChecked,
    challengeCorrect: state.challengeCorrect,
    activeStep: state.activeStep,
    hintTier: state.hintTier,
    liveAnnouncement: state.liveAnnouncement,
  };
  return {
    ...state,
    history: [...state.history.slice(-20), snapshot],
    future: [],
  };
}

export function rowOpsProofReducer(
  state: ReducerState,
  action: ReducerAction,
): ReducerState {
  switch (action.type) {
    case "SET_SYS1_ENTRY": {
      const nextState = pushHistory(state);
      const nextSys1 = {
        ...nextState.system1,
        [action.payload.row]: {
          ...nextState.system1[action.payload.row],
          [action.payload.key]: action.payload.value,
        },
      };
      const nextSys2 = applyRowOp(nextSys1, state.activeOp, state.activeK);
      const inv = checkEquivalenceInvariant(nextSys1, nextSys2);
      return {
        ...nextState,
        system1: nextSys1,
        system2: nextSys2,
        liveAnnouncement: `System 1 entry updated. Solution is ${inv.sol1.intersection ? `(${inv.sol1.intersection.x.toFixed(1)}, ${inv.sol1.intersection.y.toFixed(1)})` : "unchanged"} in both systems.`,
      };
    }

    case "APPLY_ROW_OP": {
      const nextState = pushHistory(state);
      const k = action.payload.k ?? (action.payload.op === "add_k_r1_to_r2" ? -0.5 : 1);
      const nextSys2 = applyRowOp(state.system1, action.payload.op, k);
      const inv = checkEquivalenceInvariant(state.system1, nextSys2);
      return {
        ...nextState,
        activeOp: action.payload.op,
        activeK: k,
        system2: nextSys2,
        liveAnnouncement: `Applied row operation ${action.payload.op}. Both systems are equivalent with solution at ${inv.sol2.intersection ? `(${inv.sol2.intersection.x.toFixed(1)}, ${inv.sol2.intersection.y.toFixed(1)})` : "unchanged"}.`,
      };
    }

    case "SET_PREDICT_CHOICE":
      return {
        ...state,
        predictChoice: action.payload,
        predictChecked: false,
      };

    case "CHECK_PREDICT":
      return {
        ...state,
        predictChecked: true,
        liveAnnouncement: state.predictChoice === "A"
          ? "Correct! Swapping rows preserves the exact solution (2, 1)."
          : "Not quite. Row operations preserve the solution set.",
      };

    case "TOGGLE_REVEAL":
      return {
        ...state,
        revealExact: !state.revealExact,
      };

    case "ADD_CHALLENGE_STEP": {
      if (state.challengeSteps.length >= 3) return state;
      const stepNumber = state.challengeSteps.length + 1;
      const label =
        action.payload.op === "swap"
          ? "R_1 \\leftrightarrow R_2"
          : action.payload.op === "add_k_r2_to_r1"
          ? "R_1 \\to R_1 + R_2"
          : "R_2 \\to R_2 - 0.5R_1";
      return {
        ...state,
        challengeSteps: [
          ...state.challengeSteps,
          { stepNumber, operation: action.payload.op, k: action.payload.k, label },
        ],
        challengeChecked: false,
      };
    }

    case "RESET_CHALLENGE_STEPS":
      return {
        ...state,
        challengeSteps: [],
        challengeChecked: false,
        challengeCorrect: false,
      };

    case "CHECK_CHALLENGE": {
      // Starting from INITIAL_SYSTEM_1, apply the steps sequentially
      let current = { ...INITIAL_SYSTEM_1 };
      for (const step of state.challengeSteps) {
        current = applyRowOp(current, step.operation, step.k ?? 1);
      }
      const exp = DEFAULT_CHALLENGE_TARGET;
      const isCorrect =
        current.row1.a === exp.row1.a &&
        current.row1.b === exp.row1.b &&
        current.row1.c === exp.row1.c &&
        current.row2.a === exp.row2.a &&
        current.row2.b === exp.row2.b &&
        current.row2.c === exp.row2.c;

      return {
        ...state,
        challengeChecked: true,
        challengeCorrect: isCorrect,
        liveAnnouncement: isCorrect
          ? "Challenge passed! Sequence of row operations correctly transformed the matrix."
          : "Sequence did not reach the target matrix. Check the steps.",
      };
    }

    case "SET_ACTIVE_STEP":
      return { ...state, activeStep: Math.max(0, Math.min(5, action.payload)) };

    case "SET_HINT_TIER":
      return { ...state, hintTier: Math.max(0, Math.min(5, action.payload)) };

    case "SET_LIVE_ANNOUNCEMENT":
      return { ...state, liveAnnouncement: action.payload };

    case "UNDO": {
      if (state.history.length === 0) return state;
      const prev = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, -1);
      const currentSnapshot: Omit<ReducerState, "history" | "future"> = {
        system1: { ...state.system1 },
        system2: { ...state.system2 },
        activeOp: state.activeOp,
        activeK: state.activeK,
        predictChoice: state.predictChoice,
        predictChecked: state.predictChecked,
        revealExact: state.revealExact,
        challengeSteps: [...state.challengeSteps],
        challengeChecked: state.challengeChecked,
        challengeCorrect: state.challengeCorrect,
        activeStep: state.activeStep,
        hintTier: state.hintTier,
        liveAnnouncement: state.liveAnnouncement,
      };
      return {
        ...state,
        ...prev,
        history: newHistory,
        future: [currentSnapshot, ...state.future],
        liveAnnouncement: "Undo previous action.",
      };
    }

    case "REDO": {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      const currentSnapshot: Omit<ReducerState, "history" | "future"> = {
        system1: { ...state.system1 },
        system2: { ...state.system2 },
        activeOp: state.activeOp,
        activeK: state.activeK,
        predictChoice: state.predictChoice,
        predictChecked: state.predictChecked,
        revealExact: state.revealExact,
        challengeSteps: [...state.challengeSteps],
        challengeChecked: state.challengeChecked,
        challengeCorrect: state.challengeCorrect,
        activeStep: state.activeStep,
        hintTier: state.hintTier,
        liveAnnouncement: state.liveAnnouncement,
      };
      return {
        ...state,
        ...next,
        history: [...state.history, currentSnapshot],
        future: newFuture,
        liveAnnouncement: "Redo action.",
      };
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
}
