import {
  Matrix2x2,
  DEFAULT_MATRIX_A,
  Vector2D,
  DEFAULT_POINT_P,
  AnimationStage,
  ChallengeMatrixState,
} from "./matrix-inverse-undo-transformationConfig";
import { computeInverse } from "./matrix-inverse-undo-transformationMath";

export interface ReducerState {
  matrixA: Matrix2x2;
  pointP: Vector2D;
  stage: AnimationStage;
  isPlaying: boolean;
  speed: number;
  autoPlay: boolean;
  showGrid: boolean;
  showPath: boolean;
  showBasis: boolean;
  showArea: boolean;
  quizChoice: "new_point" | "original_p" | "";
  quizRevealed: boolean;
  challenge: ChallengeMatrixState;
  challengeChecked: boolean;
  challengeCorrect: boolean;
  activeStep: number;
  hintTier: number;
  liveAnnouncement: string;
  history: Array<Omit<ReducerState, "history" | "future">>;
  future: Array<Omit<ReducerState, "history" | "future">>;
}

export type ReducerAction =
  | { type: "SET_MATRIX_A_ENTRY"; payload: { key: keyof Matrix2x2; value: number } }
  | { type: "SET_POINT_P"; payload: Vector2D }
  | { type: "SET_STAGE"; payload: AnimationStage }
  | { type: "TOGGLE_PLAY" }
  | { type: "SET_SPEED"; payload: number }
  | { type: "TOGGLE_AUTO_PLAY" }
  | { type: "TOGGLE_SHOW_GRID" }
  | { type: "TOGGLE_SHOW_PATH" }
  | { type: "TOGGLE_SHOW_BASIS" }
  | { type: "TOGGLE_SHOW_AREA" }
  | { type: "SET_QUIZ_CHOICE"; payload: "new_point" | "original_p" }
  | { type: "TOGGLE_QUIZ_REVEAL" }
  | { type: "SET_CHALLENGE_ENTRY"; payload: { key: keyof ChallengeMatrixState; value: string } }
  | { type: "CHECK_CHALLENGE" }
  | { type: "SET_ACTIVE_STEP"; payload: number }
  | { type: "SET_HINT_TIER"; payload: number }
  | { type: "SET_LIVE_ANNOUNCEMENT"; payload: string }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESET" };

export const initialState: ReducerState = {
  matrixA: { ...DEFAULT_MATRIX_A },
  pointP: { ...DEFAULT_POINT_P },
  stage: "apply_a",
  isPlaying: false,
  speed: 1,
  autoPlay: false,
  showGrid: true,
  showPath: true,
  showBasis: true,
  showArea: true,
  quizChoice: "original_p",
  quizRevealed: true,
  challenge: { a: "", b: "", c: "", d: "" },
  challengeChecked: false,
  challengeCorrect: false,
  activeStep: 0,
  hintTier: 0,
  liveAnnouncement: "Matrix Inverse visual proof loaded. Observe how A transforms the space and A^-1 reverses it.",
  history: [],
  future: [],
};

function pushHistory(state: ReducerState): ReducerState {
  const snapshot: Omit<ReducerState, "history" | "future"> = {
    matrixA: { ...state.matrixA },
    pointP: { ...state.pointP },
    stage: state.stage,
    isPlaying: state.isPlaying,
    speed: state.speed,
    autoPlay: state.autoPlay,
    showGrid: state.showGrid,
    showPath: state.showPath,
    showBasis: state.showBasis,
    showArea: state.showArea,
    quizChoice: state.quizChoice,
    quizRevealed: state.quizRevealed,
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

export function matrixInverseReducer(
  state: ReducerState,
  action: ReducerAction,
): ReducerState {
  switch (action.type) {
    case "SET_MATRIX_A_ENTRY": {
      const nextState = pushHistory(state);
      const nextA = {
        ...nextState.matrixA,
        [action.payload.key]: action.payload.value,
      };
      const inv = computeInverse(nextA);
      return {
        ...nextState,
        matrixA: nextA,
        liveAnnouncement: `Matrix entry ${action.payload.key} updated to ${action.payload.value}. Determinant is ${inv.det.toFixed(2)}.`,
      };
    }

    case "SET_POINT_P":
      return {
        ...state,
        pointP: action.payload,
        liveAnnouncement: `Point p moved to (${action.payload.x.toFixed(2)}, ${action.payload.y.toFixed(2)}).`,
      };

    case "SET_STAGE":
      return {
        ...state,
        stage: action.payload,
        liveAnnouncement: `Animation stage changed to ${action.payload}.`,
      };

    case "TOGGLE_PLAY":
      return { ...state, isPlaying: !state.isPlaying };

    case "SET_SPEED":
      return { ...state, speed: action.payload };

    case "TOGGLE_AUTO_PLAY":
      return { ...state, autoPlay: !state.autoPlay };

    case "TOGGLE_SHOW_GRID":
      return { ...state, showGrid: !state.showGrid };

    case "TOGGLE_SHOW_PATH":
      return { ...state, showPath: !state.showPath };

    case "TOGGLE_SHOW_BASIS":
      return { ...state, showBasis: !state.showBasis };

    case "TOGGLE_SHOW_AREA":
      return { ...state, showArea: !state.showArea };

    case "SET_QUIZ_CHOICE":
      return {
        ...state,
        quizChoice: action.payload,
        liveAnnouncement: action.payload === "original_p"
          ? "Correct! Applying A^-1 to Ap returns to original point p."
          : "Not quite. A^-1 reverses the transformation of A.",
      };

    case "TOGGLE_QUIZ_REVEAL":
      return { ...state, quizRevealed: !state.quizRevealed };

    case "SET_CHALLENGE_ENTRY":
      return {
        ...state,
        challenge: {
          ...state.challenge,
          [action.payload.key]: action.payload.value,
        },
        challengeChecked: false,
      };

    case "CHECK_CHALLENGE": {
      // For A = [[3, -1], [2, 1]], det = 5
      // Inverse is [[1/5, 1/5], [-2/5, 3/5]] = [[0.2, 0.2], [-0.4, 0.6]]
      const parseVal = (str: string) => {
        if (str.includes("/")) {
          const parts = str.split("/");
          return parseFloat(parts[0]) / parseFloat(parts[1]);
        }
        return parseFloat(str);
      };

      const valA = parseVal(state.challenge.a);
      const valB = parseVal(state.challenge.b);
      const valC = parseVal(state.challenge.c);
      const valD = parseVal(state.challenge.d);

      const isCorrect =
        Math.abs(valA - 0.2) < 0.05 &&
        Math.abs(valB - 0.2) < 0.05 &&
        Math.abs(valC - -0.4) < 0.05 &&
        Math.abs(valD - 0.6) < 0.05;

      return {
        ...state,
        challengeChecked: true,
        challengeCorrect: isCorrect,
        liveAnnouncement: isCorrect
          ? "Challenge passed! Matrix inverse correctly calculated."
          : "Values do not match the exact inverse. Remember: (1/det(A)) * [[d, -b], [-c, a]].",
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
        pointP: { ...state.pointP },
        stage: state.stage,
        isPlaying: state.isPlaying,
        speed: state.speed,
        autoPlay: state.autoPlay,
        showGrid: state.showGrid,
        showPath: state.showPath,
        showBasis: state.showBasis,
        showArea: state.showArea,
        quizChoice: state.quizChoice,
        quizRevealed: state.quizRevealed,
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
        matrixA: { ...state.matrixA },
        pointP: { ...state.pointP },
        stage: state.stage,
        isPlaying: state.isPlaying,
        speed: state.speed,
        autoPlay: state.autoPlay,
        showGrid: state.showGrid,
        showPath: state.showPath,
        showBasis: state.showBasis,
        showArea: state.showArea,
        quizChoice: state.quizChoice,
        quizRevealed: state.quizRevealed,
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
