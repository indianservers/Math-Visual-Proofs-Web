import {
  LinearEquation,
  LinearSystemState,
  DEFAULT_SYSTEM,
  PredictOutcome,
  DEFAULT_CHALLENGE_TARGET,
} from "./linear-system-line-intersectionConfig";
import {
  solveLinearSystem,
  checkIntersectionInvariant,
} from "./linear-system-line-intersectionMath";

export interface ReducerState {
  eq1: LinearEquation;
  eq2: LinearEquation;
  predictionChoice: PredictOutcome | "";
  predictionChecked: boolean;
  predictionRevealed: boolean;
  challengeEq1: LinearEquation;
  challengeEq2: LinearEquation;
  challengeChecked: boolean;
  challengeCorrect: boolean;
  activeStep: number;
  hintTier: number;
  liveAnnouncement: string;
  history: Array<Omit<ReducerState, "history" | "future">>;
  future: Array<Omit<ReducerState, "history" | "future">>;
}

export type ReducerAction =
  | { type: "SET_EQ1_COEFF"; payload: { key: keyof LinearEquation; value: number } }
  | { type: "SET_EQ2_COEFF"; payload: { key: keyof LinearEquation; value: number } }
  | { type: "SET_SYSTEM"; payload: LinearSystemState }
  | { type: "APPLY_ROW_OP_ELIMINATE" }
  | { type: "APPLY_ROW_OP_SWAP" }
  | { type: "SET_PREDICTION_CHOICE"; payload: PredictOutcome }
  | { type: "CHECK_PREDICTION" }
  | { type: "TOGGLE_PREDICTION_REVEAL" }
  | { type: "SET_CHALLENGE_EQ1"; payload: { key: keyof LinearEquation; value: number } }
  | { type: "SET_CHALLENGE_EQ2"; payload: { key: keyof LinearEquation; value: number } }
  | { type: "RANDOMIZE_CHALLENGE" }
  | { type: "CHECK_CHALLENGE" }
  | { type: "SET_ACTIVE_STEP"; payload: number }
  | { type: "SET_HINT_TIER"; payload: number }
  | { type: "SET_LIVE_ANNOUNCEMENT"; payload: string }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESET" };

export const initialState: ReducerState = {
  eq1: { ...DEFAULT_SYSTEM.eq1 },
  eq2: { ...DEFAULT_SYSTEM.eq2 },
  predictionChoice: "",
  predictionChecked: false,
  predictionRevealed: false,
  challengeEq1: { a: 1, b: 1, c: 1 },
  challengeEq2: { a: 1, b: 1, c: 1 },
  challengeChecked: false,
  challengeCorrect: false,
  activeStep: 0,
  hintTier: 0,
  liveAnnouncement: "Solving 2x2 Linear Systems as Line Intersection loaded. Equations 2x + y = 5 and x - y = 1 intersect at (2, 1).",
  history: [],
  future: [],
};

function pushHistory(state: ReducerState): ReducerState {
  const snapshot: Omit<ReducerState, "history" | "future"> = {
    eq1: { ...state.eq1 },
    eq2: { ...state.eq2 },
    predictionChoice: state.predictionChoice,
    predictionChecked: state.predictionChecked,
    predictionRevealed: state.predictionRevealed,
    challengeEq1: { ...state.challengeEq1 },
    challengeEq2: { ...state.challengeEq2 },
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

export function linearSystemReducer(
  state: ReducerState,
  action: ReducerAction,
): ReducerState {
  switch (action.type) {
    case "SET_EQ1_COEFF": {
      const nextState = pushHistory(state);
      const nextEq1 = {
        ...nextState.eq1,
        [action.payload.key]: action.payload.value,
      };
      const sol = solveLinearSystem(nextEq1, nextState.eq2);
      return {
        ...nextState,
        eq1: nextEq1,
        liveAnnouncement: `Equation 1 updated: ${nextEq1.a}x + ${nextEq1.b}y = ${nextEq1.c}. ${sol.explanation}`,
      };
    }

    case "SET_EQ2_COEFF": {
      const nextState = pushHistory(state);
      const nextEq2 = {
        ...nextState.eq2,
        [action.payload.key]: action.payload.value,
      };
      const sol = solveLinearSystem(nextState.eq1, nextEq2);
      return {
        ...nextState,
        eq2: nextEq2,
        liveAnnouncement: `Equation 2 updated: ${nextEq2.a}x + ${nextEq2.b}y = ${nextEq2.c}. ${sol.explanation}`,
      };
    }

    case "SET_SYSTEM": {
      const nextState = pushHistory(state);
      const sol = solveLinearSystem(action.payload.eq1, action.payload.eq2);
      return {
        ...nextState,
        eq1: { ...action.payload.eq1 },
        eq2: { ...action.payload.eq2 },
        liveAnnouncement: `System updated. ${sol.explanation}`,
      };
    }

    case "APPLY_ROW_OP_ELIMINATE": {
      if (Math.abs(state.eq1.a) < 0.0001) return state;
      const nextState = pushHistory(state);
      const factor = state.eq2.a / state.eq1.a;
      const newEq2: LinearEquation = {
        a: 0,
        b: state.eq2.b - factor * state.eq1.b,
        c: state.eq2.c - factor * state.eq1.c,
      };
      return {
        ...nextState,
        eq2: newEq2,
        liveAnnouncement: `Applied row operation R2 -> R2 - (${factor.toFixed(2)})R1. Intersection point remains invariant.`,
      };
    }

    case "APPLY_ROW_OP_SWAP": {
      const nextState = pushHistory(state);
      return {
        ...nextState,
        eq1: { ...state.eq2 },
        eq2: { ...state.eq1 },
        liveAnnouncement: "Swapped Row 1 and Row 2. System and intersection point are preserved.",
      };
    }

    case "SET_PREDICTION_CHOICE":
      return {
        ...state,
        predictionChoice: action.payload,
        predictionChecked: false,
      };

    case "CHECK_PREDICTION": {
      const isCorrect = state.predictionChoice === "none_or_infinite";
      return {
        ...state,
        predictionChecked: true,
        liveAnnouncement: isCorrect
          ? "Correct! When det(A) = 0, lines are either parallel (no solution) or coincident (infinite solutions)."
          : "Not quite. When det(A) = 0, lines have the same slope, giving 0 or infinitely many solutions.",
      };
    }

    case "TOGGLE_PREDICTION_REVEAL":
      return {
        ...state,
        predictionRevealed: !state.predictionRevealed,
      };

    case "SET_CHALLENGE_EQ1":
      return {
        ...state,
        challengeEq1: {
          ...state.challengeEq1,
          [action.payload.key]: action.payload.value,
        },
        challengeChecked: false,
      };

    case "SET_CHALLENGE_EQ2":
      return {
        ...state,
        challengeEq2: {
          ...state.challengeEq2,
          [action.payload.key]: action.payload.value,
        },
        challengeChecked: false,
      };

    case "RANDOMIZE_CHALLENGE": {
      // Suggest valid random coefficients that pass through (-1, 3)
      const a1 = Math.floor(Math.random() * 3) + 1;
      const b1 = Math.floor(Math.random() * 3) + 1;
      const c1 = a1 * DEFAULT_CHALLENGE_TARGET.targetX + b1 * DEFAULT_CHALLENGE_TARGET.targetY;

      return {
        ...state,
        challengeEq1: { a: a1, b: b1, c: c1 },
        challengeChecked: false,
      };
    }

    case "CHECK_CHALLENGE": {
      const isCorrect = checkIntersectionInvariant(
        state.challengeEq1,
        state.challengeEq2,
        DEFAULT_CHALLENGE_TARGET.targetX,
        DEFAULT_CHALLENGE_TARGET.targetY,
      );
      return {
        ...state,
        challengeChecked: true,
        challengeCorrect: isCorrect,
        liveAnnouncement: isCorrect
          ? "Challenge passed! Both equations intersect at (-1, 3)."
          : "Equations do not both pass through (-1, 3). Check substitution.",
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
        eq1: { ...state.eq1 },
        eq2: { ...state.eq2 },
        predictionChoice: state.predictionChoice,
        predictionChecked: state.predictionChecked,
        predictionRevealed: state.predictionRevealed,
        challengeEq1: { ...state.challengeEq1 },
        challengeEq2: { ...state.challengeEq2 },
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
        eq1: { ...state.eq1 },
        eq2: { ...state.eq2 },
        predictionChoice: state.predictionChoice,
        predictionChecked: state.predictionChecked,
        predictionRevealed: state.predictionRevealed,
        challengeEq1: { ...state.challengeEq1 },
        challengeEq2: { ...state.challengeEq2 },
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
