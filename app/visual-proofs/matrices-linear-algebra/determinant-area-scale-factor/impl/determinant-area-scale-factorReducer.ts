import {
  MatrixEntries,
  QUICK_PRESETS,
  DEFAULT_CHALLENGE,
} from "./determinant-area-scale-factorConfig";
import { calculateDeterminant } from "./determinant-area-scale-factorMath";

export interface ReducerState {
  matrixA: MatrixEntries;
  activePreset: string;
  showPath: boolean;
  predictionInput: string;
  predictionChecked: boolean;
  predictionCorrect: boolean;
  revealExact: boolean;
  challengeMatrix: MatrixEntries;
  challengeChecked: boolean;
  challengeCorrect: boolean;
  activeStep: number;
  hintTier: number;
  animProgress: number;
  isAnimating: boolean;
  animSpeed: number;
  liveAnnouncement: string;
  history: Array<Omit<ReducerState, "history" | "future">>;
  future: Array<Omit<ReducerState, "history" | "future">>;
}

export type ReducerAction =
  | { type: "SET_MATRIX"; payload: MatrixEntries }
  | { type: "SET_MATRIX_ENTRY"; payload: { key: keyof MatrixEntries; value: number } }
  | { type: "APPLY_PRESET"; payload: string }
  | { type: "RANDOMIZE_MATRIX" }
  | { type: "TOGGLE_SHOW_PATH" }
  | { type: "SET_ANIM_PROGRESS"; payload: number }
  | { type: "TOGGLE_PLAY_ANIMATION" }
  | { type: "SET_ANIM_SPEED"; payload: number }
  | { type: "SET_PREDICTION_INPUT"; payload: string }
  | { type: "CHECK_PREDICTION" }
  | { type: "TOGGLE_REVEAL_EXACT" }
  | { type: "SET_CHALLENGE_ENTRY"; payload: { key: keyof MatrixEntries; value: number } }
  | { type: "CHECK_CHALLENGE" }
  | { type: "SET_ACTIVE_STEP"; payload: number }
  | { type: "SET_HINT_TIER"; payload: number }
  | { type: "SET_LIVE_ANNOUNCEMENT"; payload: string }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESET" };

export const initialState: ReducerState = {
  matrixA: { a: 1.4, b: -0.6, c: 0.8, d: 1.1 },
  activePreset: "default",
  showPath: true,
  predictionInput: "",
  predictionChecked: false,
  predictionCorrect: false,
  revealExact: true,
  challengeMatrix: { a: 0, b: 0, c: 0, d: 0 },
  challengeChecked: false,
  challengeCorrect: false,
  activeStep: 0,
  hintTier: 0,
  animProgress: 1,
  isAnimating: false,
  animSpeed: 0.5,
  liveAnnouncement: "Determinant as Area Scale Factor visual proof loaded. det(A) = +2.02, Area scale ≈ 2.02x.",
  history: [],
  future: [],
};

function pushHistory(state: ReducerState): ReducerState {
  const snapshot: Omit<ReducerState, "history" | "future"> = {
    matrixA: { ...state.matrixA },
    activePreset: state.activePreset,
    showPath: state.showPath,
    predictionInput: state.predictionInput,
    predictionChecked: state.predictionChecked,
    predictionCorrect: state.predictionCorrect,
    revealExact: state.revealExact,
    challengeMatrix: { ...state.challengeMatrix },
    challengeChecked: state.challengeChecked,
    challengeCorrect: state.challengeCorrect,
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

export function determinantProofReducer(
  state: ReducerState,
  action: ReducerAction,
): ReducerState {
  switch (action.type) {
    case "SET_ANIM_PROGRESS":
      return { ...state, animProgress: Math.max(0, Math.min(1, action.payload)) };

    case "TOGGLE_PLAY_ANIMATION":
      return {
        ...state,
        isAnimating: !state.isAnimating,
        animProgress: state.animProgress >= 1 ? 0 : state.animProgress,
        liveAnnouncement: !state.isAnimating
          ? "Playing determinant transformation animation."
          : "Paused determinant transformation animation.",
      };

    case "SET_ANIM_SPEED":
      return { ...state, animSpeed: action.payload };

    case "SET_MATRIX": {
      const nextState = pushHistory(state);
      const det = calculateDeterminant(action.payload);
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
      const det = calculateDeterminant(nextMatrix);
      return {
        ...nextState,
        matrixA: nextMatrix,
        activePreset: "custom",
        liveAnnouncement: `Matrix entry ${action.payload.key} set to ${action.payload.value.toFixed(2)}. det(A) = ${det.toFixed(2)}.`,
      };
    }

    case "APPLY_PRESET": {
      const preset = QUICK_PRESETS.find((p) => p.id === action.payload);
      if (!preset) return state;
      const nextState = pushHistory(state);
      return {
        ...nextState,
        matrixA: { ...preset.matrix },
        activePreset: preset.id,
        liveAnnouncement: `Applied preset "${preset.name}". ${preset.description}.`,
      };
    }

    case "RANDOMIZE_MATRIX": {
      const nextState = pushHistory(state);
      const rA = Math.round((Math.random() * 3 - 1.5) * 10) / 10;
      const rB = Math.round((Math.random() * 3 - 1.5) * 10) / 10;
      const rC = Math.round((Math.random() * 3 - 1.5) * 10) / 10;
      const rD = Math.round((Math.random() * 3 - 1.5) * 10) / 10;
      const newM = { a: rA, b: rB, c: rC, d: rD };
      const det = calculateDeterminant(newM);
      return {
        ...nextState,
        matrixA: newM,
        activePreset: "random",
        liveAnnouncement: `Random matrix generated: [[${rA}, ${rB}], [${rC}, ${rD}]]. det(A) = ${det.toFixed(2)}.`,
      };
    }

    case "TOGGLE_SHOW_PATH":
      return { ...state, showPath: !state.showPath };

    case "SET_PREDICTION_INPUT":
      return { ...state, predictionInput: action.payload, predictionChecked: false };

    case "CHECK_PREDICTION": {
      const det = calculateDeterminant(state.matrixA);
      const userVal = parseFloat(state.predictionInput);
      const isCorrect = !isNaN(userVal) && Math.abs(userVal - det) < 0.1;
      return {
        ...state,
        predictionChecked: true,
        predictionCorrect: isCorrect,
        liveAnnouncement: isCorrect
          ? `Correct! det(A) = ${det.toFixed(2)}.`
          : `Prediction "${state.predictionInput}" is close, but det(A) = ad - bc = ${det.toFixed(2)}.`,
      };
    }

    case "TOGGLE_REVEAL_EXACT":
      return { ...state, revealExact: !state.revealExact };

    case "SET_CHALLENGE_ENTRY": {
      return {
        ...state,
        challengeMatrix: {
          ...state.challengeMatrix,
          [action.payload.key]: action.payload.value,
        },
        challengeChecked: false,
      };
    }

    case "CHECK_CHALLENGE": {
      const exp = DEFAULT_CHALLENGE.expectedMatrix;
      const user = state.challengeMatrix;
      const isCorrect =
        Math.abs(user.a - exp.a) < 0.1 &&
        Math.abs(user.b - exp.b) < 0.1 &&
        Math.abs(user.c - exp.c) < 0.1 &&
        Math.abs(user.d - exp.d) < 0.1;

      return {
        ...state,
        challengeChecked: true,
        challengeCorrect: isCorrect,
        liveAnnouncement: isCorrect
          ? "Challenge passed! Matrix A correctly identified."
          : "Challenge matrix does not match target parallelogram vertices.",
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
        activePreset: state.activePreset,
        showPath: state.showPath,
        predictionInput: state.predictionInput,
        predictionChecked: state.predictionChecked,
        predictionCorrect: state.predictionCorrect,
        revealExact: state.revealExact,
        challengeMatrix: { ...state.challengeMatrix },
        challengeChecked: state.challengeChecked,
        challengeCorrect: state.challengeCorrect,
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
        activePreset: state.activePreset,
        showPath: state.showPath,
        predictionInput: state.predictionInput,
        predictionChecked: state.predictionChecked,
        predictionCorrect: state.predictionCorrect,
        revealExact: state.revealExact,
        challengeMatrix: { ...state.challengeMatrix },
        challengeChecked: state.challengeChecked,
        challengeCorrect: state.challengeCorrect,
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
