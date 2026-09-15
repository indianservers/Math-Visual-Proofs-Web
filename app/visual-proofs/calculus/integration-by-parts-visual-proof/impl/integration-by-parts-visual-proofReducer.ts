import {
  DEFAULT_A,
  DEFAULT_B,
  DEFAULT_X,
  GraphViewMode,
  PROOF_STEPS,
  QUIZ_OPTIONS,
} from "./integration-by-parts-visual-proofConfig";
import { snapX, formatX, clamp } from "./integration-by-parts-visual-proofMath";

export interface ReducerState {
  a: number;
  b: number;
  x: number;
  showLabels: boolean;
  snapEnabled: boolean;
  graphView: GraphViewMode;
  activeStep: number;
  quizChoice: string;
  quizRevealed: boolean;
  challengeChecked: boolean;
  activeHintIndex: number;
  isPlayingAnimation: boolean;
  animationSpeed: number;
  announcement: string;
  isSettingsOpen: boolean;
  misconceptionMessage: string | null;
  history: Array<{ a: number; b: number; x: number; activeStep: number; graphView: GraphViewMode }>;
  future: Array<{ a: number; b: number; x: number; activeStep: number; graphView: GraphViewMode }>;
}

export type Action =
  | { type: "SET_A"; value: number }
  | { type: "SET_B"; value: number }
  | { type: "SET_X"; value: number; recordHistory?: boolean }
  | { type: "NUDGE_X"; delta: number }
  | { type: "TOGGLE_LABELS" }
  | { type: "TOGGLE_SNAP" }
  | { type: "SET_GRAPH_VIEW"; value: GraphViewMode }
  | { type: "SET_PROOF_STEP"; stepIndex: number }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_QUIZ"; value: string }
  | { type: "REVEAL_QUIZ" }
  | { type: "CHECK_CHALLENGE" }
  | { type: "SET_HINT_INDEX"; value: number }
  | { type: "NEXT_HINT" }
  | { type: "CLOSE_HINT" }
  | { type: "START_ANIMATION" }
  | { type: "PAUSE_ANIMATION" }
  | { type: "TICK_ANIMATION"; dt: number }
  | { type: "SET_ANIMATION_SPEED"; value: number }
  | { type: "RESET_ALL" }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SET_SETTINGS_OPEN"; value: boolean }
  | { type: "DISMISS_MISCONCEPTION" };

export const initialState: ReducerState = {
  a: DEFAULT_A,
  b: DEFAULT_B,
  x: DEFAULT_X,
  showLabels: true,
  snapEnabled: true,
  graphView: "curve",
  activeStep: 0,
  quizChoice: "",
  quizRevealed: false,
  challengeChecked: false,
  activeHintIndex: -1,
  isPlayingAnimation: false,
  animationSpeed: 1,
  announcement: "Explore integration by parts. Drag handle x₂ on the product rectangle.",
  isSettingsOpen: false,
  misconceptionMessage: null,
  history: [],
  future: [],
};

function pushHistory(state: ReducerState): ReducerState {
  const currentSnapshot = {
    a: state.a,
    b: state.b,
    x: state.x,
    activeStep: state.activeStep,
    graphView: state.graphView,
  };
  return {
    ...state,
    history: [...state.history.slice(-20), currentSnapshot],
    future: [],
  };
}

export function proofReducer(state: ReducerState, action: Action): ReducerState {
  switch (action.type) {
    case "SET_A": {
      const nextA = clamp(action.value, 0, state.b - 0.2);
      const nextState = pushHistory(state);
      const nextX = snapX(state.x, nextA, state.b, state.snapEnabled);
      return {
        ...nextState,
        a: nextA,
        x: nextX,
        announcement: `Interval start set to ${formatX(nextA)}.`,
      };
    }

    case "SET_B": {
      const nextB = clamp(action.value, state.a + 0.2, 2 * Math.PI);
      const nextState = pushHistory(state);
      const nextX = snapX(state.x, state.a, nextB, state.snapEnabled);
      return {
        ...nextState,
        b: nextB,
        x: nextX,
        announcement: `Interval end set to ${formatX(nextB)}.`,
      };
    }

    case "SET_X": {
      const targetX = snapX(action.value, state.a, state.b, state.snapEnabled);
      if (Math.abs(targetX - state.x) < 0.001) return state;
      const baseState = action.recordHistory ? pushHistory(state) : state;
      const nextStep = baseState.activeStep === 0 ? 1 : baseState.activeStep;
      return {
        ...baseState,
        x: targetX,
        activeStep: nextStep,
        announcement: `x adjusted to ${formatX(targetX)}.`,
      };
    }

    case "NUDGE_X": {
      const targetX = snapX(state.x + action.delta, state.a, state.b, state.snapEnabled);
      const nextState = pushHistory(state);
      return {
        ...nextState,
        x: targetX,
        activeStep: nextState.activeStep === 0 ? 1 : nextState.activeStep,
        announcement: `Handle moved to ${formatX(targetX)}.`,
      };
    }

    case "TOGGLE_LABELS":
      return {
        ...state,
        showLabels: !state.showLabels,
        announcement: state.showLabels ? "Labels hidden." : "Labels shown.",
      };

    case "TOGGLE_SNAP":
      return {
        ...state,
        snapEnabled: !state.snapEnabled,
        announcement: state.snapEnabled ? "Snapping disabled." : "Snapping enabled.",
      };

    case "SET_GRAPH_VIEW":
      return {
        ...state,
        graphView: action.value,
        announcement: `Graph view switched to ${action.value}.`,
      };

    case "SET_PROOF_STEP":
      return {
        ...state,
        activeStep: clamp(action.stepIndex, 0, PROOF_STEPS.length - 1),
        announcement: `Proof step ${action.stepIndex + 1}: ${PROOF_STEPS[action.stepIndex]?.title}.`,
      };

    case "NEXT_STEP": {
      const nextStep = Math.min(state.activeStep + 1, PROOF_STEPS.length - 1);
      return {
        ...state,
        activeStep: nextStep,
        announcement: `Advanced to step ${nextStep + 1}.`,
      };
    }

    case "PREV_STEP": {
      const prevStep = Math.max(state.activeStep - 1, 0);
      return {
        ...state,
        activeStep: prevStep,
        announcement: `Returned to step ${prevStep + 1}.`,
      };
    }

    case "SET_QUIZ":
      return {
        ...state,
        quizChoice: action.value,
        quizRevealed: false,
        misconceptionMessage: null,
      };

    case "REVEAL_QUIZ": {
      const selected = QUIZ_OPTIONS.find((o) => o.id === state.quizChoice);
      const isCorrect = selected?.correct ?? false;
      let misconception: string | null = null;
      if (!isCorrect && state.quizChoice === "b") {
        misconception = "Watch the sign: subtract ∫ v du from [uv]_a^b to isolate ∫ u dv.";
      } else if (!isCorrect && state.quizChoice === "d") {
        misconception = "u(b)v(b) - u(a)v(a) is only the boundary term, missing the integral of v du.";
      } else if (!isCorrect) {
        misconception = "Rearrange the integrated product rule: [uv]_a^b = ∫ u dv + ∫ v du.";
      }

      return {
        ...state,
        quizRevealed: true,
        misconceptionMessage: misconception,
        activeStep: isCorrect ? Math.max(state.activeStep, 4) : state.activeStep,
        announcement: isCorrect
          ? "Prediction correct! Theorem verified."
          : "Prediction incorrect. Review the product rule rearrangement.",
      };
    }

    case "CHECK_CHALLENGE":
      return {
        ...state,
        challengeChecked: true,
        activeStep: Math.max(state.activeStep, 5),
        announcement: "Numerical challenge verified on [0, π].",
      };

    case "SET_HINT_INDEX":
      return {
        ...state,
        activeHintIndex: action.value,
      };

    case "NEXT_HINT":
      return {
        ...state,
        activeHintIndex: Math.min(state.activeHintIndex + 1, 4),
      };

    case "CLOSE_HINT":
      return {
        ...state,
        activeHintIndex: -1,
      };

    case "START_ANIMATION":
      return {
        ...state,
        isPlayingAnimation: true,
        announcement: "Playing animation across interval.",
      };

    case "PAUSE_ANIMATION":
      return {
        ...state,
        isPlayingAnimation: false,
        announcement: "Animation paused.",
      };

    case "TICK_ANIMATION": {
      if (!state.isPlayingAnimation) return state;
      const speedFactor = state.animationSpeed * 0.45;
      let nextX = state.x + action.dt * speedFactor;
      let nextPlaying = true;
      if (nextX >= state.b) {
        nextX = state.b;
        nextPlaying = false;
      }
      return {
        ...state,
        x: nextX,
        isPlayingAnimation: nextPlaying,
        activeStep: Math.max(state.activeStep, 1),
      };
    }

    case "SET_ANIMATION_SPEED":
      return {
        ...state,
        animationSpeed: action.value,
      };

    case "RESET_ALL":
      return {
        ...initialState,
        history: [],
        future: [],
        announcement: "Reset to default initial state.",
      };

    case "UNDO": {
      if (state.history.length === 0) return state;
      const prevSnapshot = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, -1);
      const currentSnapshot = {
        a: state.a,
        b: state.b,
        x: state.x,
        activeStep: state.activeStep,
        graphView: state.graphView,
      };
      return {
        ...state,
        ...prevSnapshot,
        history: newHistory,
        future: [currentSnapshot, ...state.future.slice(0, 20)],
        announcement: "Undid last action.",
      };
    }

    case "REDO": {
      if (state.future.length === 0) return state;
      const nextSnapshot = state.future[0];
      const newFuture = state.future.slice(1);
      const currentSnapshot = {
        a: state.a,
        b: state.b,
        x: state.x,
        activeStep: state.activeStep,
        graphView: state.graphView,
      };
      return {
        ...state,
        ...nextSnapshot,
        history: [...state.history, currentSnapshot],
        future: newFuture,
        announcement: "Redid action.",
      };
    }

    case "SET_SETTINGS_OPEN":
      return {
        ...state,
        isSettingsOpen: action.value,
      };

    case "DISMISS_MISCONCEPTION":
      return {
        ...state,
        misconceptionMessage: null,
      };

    default:
      return state;
  }
}
