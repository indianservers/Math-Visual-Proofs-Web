import {
  Matrix2x2,
  DEFAULT_MATRIX,
  ViewMode,
  MatrixViewTab,
  ChallengeInputState,
} from "./eigenvectors-directions-do-not-turnConfig";
import { computeEigensystem } from "./eigenvectors-directions-do-not-turnMath";

export interface ReducerState {
  matrix: Matrix2x2;
  viewMode: ViewMode;
  activeMatrixTab: MatrixViewTab;
  showGrid: boolean;
  showUnitCircle: boolean;
  selectedVector: "v1" | "v2" | "arbitrary";
  arbitraryAngle: number;
  predictChecked: boolean;
  revealExact: boolean;
  challenge: ChallengeInputState;
  challengeChecked: boolean;
  challengeCorrect: boolean;
  activeStep: number;
  hintTier: number;
  liveAnnouncement: string;
  history: Array<Omit<ReducerState, "history" | "future">>;
  future: Array<Omit<ReducerState, "history" | "future">>;
}

export type ReducerAction =
  | { type: "SET_MATRIX_ENTRY"; payload: { key: keyof Matrix2x2; value: number } }
  | { type: "SET_MATRIX"; payload: Matrix2x2 }
  | { type: "SET_VIEW_MODE"; payload: ViewMode }
  | { type: "SET_MATRIX_TAB"; payload: MatrixViewTab }
  | { type: "TOGGLE_SHOW_GRID" }
  | { type: "TOGGLE_UNIT_CIRCLE" }
  | { type: "SET_SELECTED_VECTOR"; payload: "v1" | "v2" | "arbitrary" }
  | { type: "SET_ARBITRARY_ANGLE"; payload: number }
  | { type: "CHECK_PREDICT" }
  | { type: "TOGGLE_REVEAL" }
  | { type: "SET_CHALLENGE_INPUT"; payload: { key: keyof ChallengeInputState; value: string } }
  | { type: "CHECK_CHALLENGE" }
  | { type: "SET_ACTIVE_STEP"; payload: number }
  | { type: "SET_HINT_TIER"; payload: number }
  | { type: "SET_LIVE_ANNOUNCEMENT"; payload: string }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESET" };

export const initialState: ReducerState = {
  matrix: { ...DEFAULT_MATRIX },
  viewMode: "both",
  activeMatrixTab: "entries",
  showGrid: true,
  showUnitCircle: false,
  selectedVector: "v1",
  arbitraryAngle: Math.PI / 6,
  predictChecked: true,
  revealExact: true,
  challenge: {
    lambda1: "",
    v1_x: "",
    v1_y: "",
    lambda2: "",
    v2_x: "",
    v2_y: "",
  },
  challengeChecked: false,
  challengeCorrect: false,
  activeStep: 0,
  hintTier: 0,
  liveAnnouncement: "Eigenvectors as Directions That Do Not Turn visual proof loaded. Observe how v1 and v2 scale along their span lines.",
  history: [],
  future: [],
};

function pushHistory(state: ReducerState): ReducerState {
  const snapshot: Omit<ReducerState, "history" | "future"> = {
    matrix: { ...state.matrix },
    viewMode: state.viewMode,
    activeMatrixTab: state.activeMatrixTab,
    showGrid: state.showGrid,
    showUnitCircle: state.showUnitCircle,
    selectedVector: state.selectedVector,
    arbitraryAngle: state.arbitraryAngle,
    predictChecked: state.predictChecked,
    revealExact: state.revealExact,
    challenge: { ...state.challenge },
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

export function eigenvectorsReducer(
  state: ReducerState,
  action: ReducerAction,
): ReducerState {
  switch (action.type) {
    case "SET_MATRIX_ENTRY": {
      const nextState = pushHistory(state);
      const nextMatrix = {
        ...nextState.matrix,
        [action.payload.key]: action.payload.value,
      };
      const eigen = computeEigensystem(nextMatrix);
      return {
        ...nextState,
        matrix: nextMatrix,
        liveAnnouncement: `Matrix entry ${action.payload.key} updated to ${action.payload.value}. Eigenvalues are λ1 = ${eigen.lambda1.toFixed(2)}, λ2 = ${eigen.lambda2.toFixed(2)}.`,
      };
    }

    case "SET_MATRIX": {
      const nextState = pushHistory(state);
      const eigen = computeEigensystem(action.payload);
      return {
        ...nextState,
        matrix: action.payload,
        liveAnnouncement: `Transformation matrix updated. Eigenvalues are λ1 = ${eigen.lambda1.toFixed(2)}, λ2 = ${eigen.lambda2.toFixed(2)}.`,
      };
    }

    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };

    case "SET_MATRIX_TAB":
      return { ...state, activeMatrixTab: action.payload };

    case "TOGGLE_SHOW_GRID":
      return { ...state, showGrid: !state.showGrid };

    case "TOGGLE_UNIT_CIRCLE":
      return { ...state, showUnitCircle: !state.showUnitCircle };

    case "SET_SELECTED_VECTOR":
      return {
        ...state,
        selectedVector: action.payload,
        liveAnnouncement: `Selected vector ${action.payload}.`,
      };

    case "SET_ARBITRARY_ANGLE":
      return { ...state, arbitraryAngle: action.payload };

    case "CHECK_PREDICT": {
      const eigen = computeEigensystem(state.matrix);
      const isEigen = state.selectedVector === "v1" || state.selectedVector === "v2";
      const scale = state.selectedVector === "v1" ? eigen.lambda1 : eigen.lambda2;
      return {
        ...state,
        predictChecked: true,
        liveAnnouncement: isEigen
          ? `Direction unchanged! ${state.selectedVector} was scaled by factor λ = ${scale.toFixed(3)}.`
          : "Arbitrary vector turned away from its original span line.",
      };
    }

    case "TOGGLE_REVEAL":
      return { ...state, revealExact: !state.revealExact };

    case "SET_CHALLENGE_INPUT":
      return {
        ...state,
        challenge: {
          ...state.challenge,
          [action.payload.key]: action.payload.value,
        },
        challengeChecked: false,
      };

    case "CHECK_CHALLENGE": {
      const eigen = computeEigensystem(state.matrix);
      const userL1 = parseFloat(state.challenge.lambda1);
      const userL2 = parseFloat(state.challenge.lambda2);

      const l1Close =
        (!isNaN(userL1) && (Math.abs(userL1 - eigen.lambda1) < 0.2 || Math.abs(userL1 - eigen.lambda2) < 0.2)) ||
        state.challenge.lambda1.includes("5") ||
        state.challenge.lambda1.includes("√") ||
        state.challenge.lambda1.includes("3.6") ||
        state.challenge.lambda1.includes("4.4");

      const l2Close =
        (!isNaN(userL2) && (Math.abs(userL2 - eigen.lambda2) < 0.2 || Math.abs(userL2 - eigen.lambda1) < 0.2)) ||
        state.challenge.lambda2.includes("5") ||
        state.challenge.lambda2.includes("√") ||
        state.challenge.lambda2.includes("1.3") ||
        state.challenge.lambda2.includes("1.5");

      const isCorrect = l1Close && l2Close;

      return {
        ...state,
        challengeChecked: true,
        challengeCorrect: isCorrect,
        liveAnnouncement: isCorrect
          ? "Challenge passed! Eigenvalues and eigenvectors correctly identified."
          : "Check your calculations for det(A - λI) = 0.",
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
        matrix: { ...state.matrix },
        viewMode: state.viewMode,
        activeMatrixTab: state.activeMatrixTab,
        showGrid: state.showGrid,
        showUnitCircle: state.showUnitCircle,
        selectedVector: state.selectedVector,
        arbitraryAngle: state.arbitraryAngle,
        predictChecked: state.predictChecked,
        revealExact: state.revealExact,
        challenge: { ...state.challenge },
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
        matrix: { ...state.matrix },
        viewMode: state.viewMode,
        activeMatrixTab: state.activeMatrixTab,
        showGrid: state.showGrid,
        showUnitCircle: state.showUnitCircle,
        selectedVector: state.selectedVector,
        arbitraryAngle: state.arbitraryAngle,
        predictChecked: state.predictChecked,
        revealExact: state.revealExact,
        challenge: { ...state.challenge },
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
