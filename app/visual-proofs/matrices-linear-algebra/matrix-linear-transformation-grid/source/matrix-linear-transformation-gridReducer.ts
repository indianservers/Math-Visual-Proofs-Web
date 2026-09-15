import {
  Matrix2x2,
  Vector2D,
  PRESETS,
  DEFAULT_CHALLENGE,
} from "./matrix-linear-transformation-gridConfig";
import { transformVector, computeDeterminant } from "./matrix-linear-transformation-gridMath";

export interface ReducerState {
  matrixA: Matrix2x2;
  vectorV: Vector2D;
  activePreset: string;
  showGrid: boolean;
  showBasis: boolean;
  showPath: boolean;
  showCoordinates: boolean;
  activeActionTab: "Entries" | "Row ops" | "Systems" | "Transformations";
  challengeChoice: "A" | "B" | "C" | "D" | null;
  challengeChecked: boolean;
  activeStep: number;
  hintTier: number;
  animProgress: number;
  isAnimating: boolean;
  animSpeed: number; // 0.25 (extra slow for kids), 0.5, 1.0
  liveAnnouncement: string;
  history: Array<Omit<ReducerState, "history" | "future">>;
  future: Array<Omit<ReducerState, "history" | "future">>;
}

export type ReducerAction =
  | { type: "SET_MATRIX"; payload: Matrix2x2 }
  | { type: "SET_MATRIX_ENTRY"; payload: { key: keyof Matrix2x2; value: number } }
  | { type: "SET_VECTOR_V"; payload: Vector2D }
  | { type: "APPLY_PRESET"; payload: string }
  | { type: "TOGGLE_GRID" }
  | { type: "TOGGLE_BASIS" }
  | { type: "TOGGLE_PATH" }
  | { type: "TOGGLE_COORDINATES" }
  | { type: "SET_ACTION_TAB"; payload: "Entries" | "Row ops" | "Systems" | "Transformations" }
  | { type: "SELECT_CHALLENGE_CHOICE"; payload: "A" | "B" | "C" | "D" }
  | { type: "CHECK_CHALLENGE" }
  | { type: "RANDOMIZE_VECTOR" }
  | { type: "SET_ANIM_PROGRESS"; payload: number }
  | { type: "TOGGLE_ANIMATION" }
  | { type: "SET_ANIM_SPEED"; payload: number }
  | { type: "SET_ACTIVE_STEP"; payload: number }
  | { type: "SET_HINT_TIER"; payload: number }
  | { type: "SET_LIVE_ANNOUNCEMENT"; payload: string }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESET" };

export const initialState: ReducerState = {
  matrixA: { a: 1.2, c: 0.6, b: 0.3, d: 1.1 },
  vectorV: { x: 2, y: 1 },
  activePreset: "default",
  showGrid: true,
  showBasis: true,
  showPath: true,
  showCoordinates: false,
  activeActionTab: "Transformations",
  challengeChoice: null,
  challengeChecked: false,
  activeStep: 0,
  hintTier: 0,
  animProgress: 1,
  isAnimating: false,
  animSpeed: 0.3, // Slow by default so kids can clearly observe
  liveAnnouncement: "Matrix as Linear Transformation loaded. Matrix A = [[1.20, 0.60], [0.30, 1.10]], v = (2, 1) -> Av = (3.00, 1.70).",
  history: [],
  future: [],
};

function pushHistory(state: ReducerState): ReducerState {
  const snapshot: Omit<ReducerState, "history" | "future"> = {
    matrixA: { ...state.matrixA },
    vectorV: { ...state.vectorV },
    activePreset: state.activePreset,
    showGrid: state.showGrid,
    showBasis: state.showBasis,
    showPath: state.showPath,
    showCoordinates: state.showCoordinates,
    activeActionTab: state.activeActionTab,
    challengeChoice: state.challengeChoice,
    challengeChecked: state.challengeChecked,
    activeStep: state.activeStep,
    hintTier: state.hintTier,
    animProgress: state.animProgress,
    isAnimating: state.isAnimating,
    animSpeed: state.animSpeed,
    liveAnnouncement: state.liveAnnouncement,
  };
  return {
    ...state,
    history: [...state.history.slice(-20), snapshot],
    future: [],
  };
}

export function linearTransformReducer(state: ReducerState, action: ReducerAction): ReducerState {
  switch (action.type) {
    case "SET_ANIM_PROGRESS":
      return { ...state, animProgress: Math.max(0, Math.min(1, action.payload)) };

    case "TOGGLE_ANIMATION":
      return {
        ...state,
        isAnimating: !state.isAnimating,
        animProgress: state.animProgress >= 1 ? 0 : state.animProgress,
        liveAnnouncement: !state.isAnimating
          ? "Playing slow-motion transformation animation."
          : "Paused transformation animation.",
      };

    case "SET_ANIM_SPEED":
      return {
        ...state,
        animSpeed: action.payload,
        liveAnnouncement: `Animation speed set to ${action.payload}x.`,
      };
    case "SET_MATRIX": {
      const nextState = pushHistory(state);
      const det = computeDeterminant(action.payload);
      return {
        ...nextState,
        matrixA: action.payload,
        activePreset: "custom",
        liveAnnouncement: `Matrix updated. det(A) = ${det.toFixed(2)}.`,
      };
    }

    case "SET_MATRIX_ENTRY": {
      const nextState = pushHistory(state);
      const nextMatrix = {
        ...nextState.matrixA,
        [action.payload.key]: action.payload.value,
      };
      const det = computeDeterminant(nextMatrix);
      return {
        ...nextState,
        matrixA: nextMatrix,
        activePreset: "custom",
        liveAnnouncement: `Matrix entry ${action.payload.key} set to ${action.payload.value.toFixed(2)}. det(A) = ${det.toFixed(2)}.`,
      };
    }

    case "SET_VECTOR_V": {
      const nextState = pushHistory(state);
      const Av = transformVector(state.matrixA, action.payload);
      return {
        ...nextState,
        vectorV: action.payload,
        liveAnnouncement: `Vector v moved to (${action.payload.x.toFixed(1)}, ${action.payload.y.toFixed(1)}) -> Av = (${Av.x.toFixed(2)}, ${Av.y.toFixed(2)}).`,
      };
    }

    case "APPLY_PRESET": {
      const preset = PRESETS.find((p) => p.id === action.payload);
      if (!preset) return state;
      const nextState = pushHistory(state);
      return {
        ...nextState,
        matrixA: { ...preset.matrix },
        activePreset: preset.id,
        liveAnnouncement: `Applied preset "${preset.name}". ${preset.description}.`,
      };
    }

    case "TOGGLE_GRID":
      return { ...state, showGrid: !state.showGrid };

    case "TOGGLE_BASIS":
      return { ...state, showBasis: !state.showBasis };

    case "TOGGLE_PATH":
      return { ...state, showPath: !state.showPath };

    case "TOGGLE_COORDINATES":
      return { ...state, showCoordinates: !state.showCoordinates };

    case "SET_ACTION_TAB":
      return { ...state, activeActionTab: action.payload };

    case "SELECT_CHALLENGE_CHOICE":
      return {
        ...state,
        challengeChoice: action.payload,
        challengeChecked: false,
      };

    case "CHECK_CHALLENGE": {
      const option = DEFAULT_CHALLENGE.options.find((o) => o.id === state.challengeChoice);
      const isCorrect = option?.isCorrect ?? false;
      return {
        ...state,
        challengeChecked: true,
        liveAnnouncement: isCorrect
          ? "Challenge passed! Av = [0, -5]^T is correct."
          : "Choice incorrect. Remember: Av = x(Ae1) + y(Ae2).",
      };
    }

    case "RANDOMIZE_VECTOR": {
      const nextState = pushHistory(state);
      const randX = Math.round((Math.random() * 4 - 2) * 10) / 10;
      const randY = Math.round((Math.random() * 4 - 2) * 10) / 10;
      return {
        ...nextState,
        vectorV: { x: randX === 0 ? 1 : randX, y: randY === 0 ? 1 : randY },
        liveAnnouncement: `Generated new vector v = (${randX}, ${randY}).`,
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
        matrixA: { ...state.matrixA },
        vectorV: { ...state.vectorV },
        activePreset: state.activePreset,
        showGrid: state.showGrid,
        showBasis: state.showBasis,
        showPath: state.showPath,
        showCoordinates: state.showCoordinates,
        activeActionTab: state.activeActionTab,
        challengeChoice: state.challengeChoice,
        challengeChecked: state.challengeChecked,
        activeStep: state.activeStep,
        hintTier: state.hintTier,
        animProgress: state.animProgress,
        isAnimating: state.isAnimating,
        animSpeed: state.animSpeed,
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
        matrixA: { ...state.matrixA },
        vectorV: { ...state.vectorV },
        activePreset: state.activePreset,
        showGrid: state.showGrid,
        showBasis: state.showBasis,
        showPath: state.showPath,
        showCoordinates: state.showCoordinates,
        activeActionTab: state.activeActionTab,
        challengeChoice: state.challengeChoice,
        challengeChecked: state.challengeChecked,
        activeStep: state.activeStep,
        hintTier: state.hintTier,
        animProgress: state.animProgress,
        isAnimating: state.isAnimating,
        animSpeed: state.animSpeed,
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
