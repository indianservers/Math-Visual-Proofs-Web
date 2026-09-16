export interface ReducerState {
  selectedRow: number; // 1, 2, 3
  selectedCol: number; // 1, 2, 3
  highlightProducts: boolean;
  predictionInput: string;
  predictionRevealed: boolean;
  challengeRow: number;
  challengeCol: number;
  challengeStarted: boolean;
  challengeCompleted: boolean;
  activeStep: number;
  hintTier: number;
  liveAnnouncement: string;
  history: Array<Omit<ReducerState, "history" | "future">>;
  future: Array<Omit<ReducerState, "history" | "future">>;
}

export type ReducerAction =
  | { type: "SELECT_ROW"; payload: number }
  | { type: "SELECT_COL"; payload: number }
  | { type: "SET_ROW_AND_COL"; payload: { row: number; col: number } }
  | { type: "TOGGLE_HIGHLIGHT_PRODUCTS" }
  | { type: "SET_PREDICTION_INPUT"; payload: string }
  | { type: "TOGGLE_PREDICTION_REVEAL" }
  | { type: "SET_CHALLENGE_ROW"; payload: number }
  | { type: "SET_CHALLENGE_COL"; payload: number }
  | { type: "START_CHALLENGE" }
  | { type: "CHECK_CHALLENGE" }
  | { type: "SET_ACTIVE_STEP"; payload: number }
  | { type: "SET_HINT_TIER"; payload: number }
  | { type: "SET_LIVE_ANNOUNCEMENT"; payload: string }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESET" };

export const initialState: ReducerState = {
  selectedRow: 1,
  selectedCol: 2,
  highlightProducts: true,
  predictionInput: "",
  predictionRevealed: false,
  challengeRow: 2,
  challengeCol: 3,
  challengeStarted: false,
  challengeCompleted: false,
  activeStep: 0,
  hintTier: 0,
  liveAnnouncement: "Matrix Multiplication visual proof loaded. Row 1 of A and Column 2 of B selected for entry (AB)_12.",
  history: [],
  future: [],
};

function pushHistory(state: ReducerState): ReducerState {
  const snapshot: Omit<ReducerState, "history" | "future"> = {
    selectedRow: state.selectedRow,
    selectedCol: state.selectedCol,
    highlightProducts: state.highlightProducts,
    predictionInput: state.predictionInput,
    predictionRevealed: state.predictionRevealed,
    challengeRow: state.challengeRow,
    challengeCol: state.challengeCol,
    challengeStarted: state.challengeStarted,
    challengeCompleted: state.challengeCompleted,
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

export function matrixMultReducer(state: ReducerState, action: ReducerAction): ReducerState {
  switch (action.type) {
    case "SELECT_ROW": {
      const nextRow = Math.max(1, Math.min(3, action.payload));
      if (nextRow === state.selectedRow) return state;
      const nextState = pushHistory(state);
      return {
        ...nextState,
        selectedRow: nextRow,
        liveAnnouncement: `Selected Row ${nextRow} of Matrix A. Computing entry (AB)_{${nextRow}${state.selectedCol}}.`,
      };
    }

    case "SELECT_COL": {
      const nextCol = Math.max(1, Math.min(3, action.payload));
      if (nextCol === state.selectedCol) return state;
      const nextState = pushHistory(state);
      return {
        ...nextState,
        selectedCol: nextCol,
        liveAnnouncement: `Selected Column ${nextCol} of Matrix B. Computing entry (AB)_{${state.selectedRow}${nextCol}}.`,
      };
    }

    case "SET_ROW_AND_COL": {
      const nextRow = Math.max(1, Math.min(3, action.payload.row));
      const nextCol = Math.max(1, Math.min(3, action.payload.col));
      const nextState = pushHistory(state);
      return {
        ...nextState,
        selectedRow: nextRow,
        selectedCol: nextCol,
        liveAnnouncement: `Position set to Row ${nextRow}, Column ${nextCol} -> Entry (AB)_{${nextRow}${nextCol}}.`,
      };
    }

    case "TOGGLE_HIGHLIGHT_PRODUCTS": {
      return {
        ...state,
        highlightProducts: !state.highlightProducts,
        liveAnnouncement: state.highlightProducts
          ? "Pairwise product highlighting disabled."
          : "Pairwise product highlighting enabled.",
      };
    }

    case "SET_PREDICTION_INPUT": {
      return {
        ...state,
        predictionInput: action.payload,
      };
    }

    case "TOGGLE_PREDICTION_REVEAL": {
      return {
        ...state,
        predictionRevealed: !state.predictionRevealed,
        liveAnnouncement: state.predictionRevealed
          ? "Prediction formula hidden."
          : "Prediction formula revealed.",
      };
    }

    case "SET_CHALLENGE_ROW": {
      return {
        ...state,
        challengeRow: action.payload,
        challengeCompleted: false,
      };
    }

    case "SET_CHALLENGE_COL": {
      return {
        ...state,
        challengeCol: action.payload,
        challengeCompleted: false,
      };
    }

    case "START_CHALLENGE": {
      const nextState = pushHistory(state);
      return {
        ...nextState,
        selectedRow: state.challengeRow,
        selectedCol: state.challengeCol,
        challengeStarted: true,
        challengeCompleted: state.challengeRow === 2 && state.challengeCol === 3,
        liveAnnouncement: `Challenge active: Row ${state.challengeRow} of A and Column ${state.challengeCol} of B selected to compute (AB)_{${state.challengeRow}${state.challengeCol}}.`,
      };
    }

    case "CHECK_CHALLENGE": {
      const isCorrect = state.selectedRow === 2 && state.selectedCol === 3;
      return {
        ...state,
        challengeCompleted: isCorrect,
        liveAnnouncement: isCorrect
          ? "Challenge complete! Entry (AB)_23 correctly formed by Row 2 of A dotted with Column 3 of B."
          : "Challenge incomplete: select Row 2 of A and Column 3 of B to compute (AB)_23.",
      };
    }

    case "SET_ACTIVE_STEP": {
      return {
        ...state,
        activeStep: Math.max(0, Math.min(5, action.payload)),
      };
    }

    case "SET_HINT_TIER": {
      return {
        ...state,
        hintTier: Math.max(0, Math.min(5, action.payload)),
      };
    }

    case "SET_LIVE_ANNOUNCEMENT": {
      return {
        ...state,
        liveAnnouncement: action.payload,
      };
    }

    case "UNDO": {
      if (state.history.length === 0) return state;
      const prev = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, -1);
      const currentSnapshot: Omit<ReducerState, "history" | "future"> = {
        selectedRow: state.selectedRow,
        selectedCol: state.selectedCol,
        highlightProducts: state.highlightProducts,
        predictionInput: state.predictionInput,
        predictionRevealed: state.predictionRevealed,
        challengeRow: state.challengeRow,
        challengeCol: state.challengeCol,
        challengeStarted: state.challengeStarted,
        challengeCompleted: state.challengeCompleted,
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
        selectedRow: state.selectedRow,
        selectedCol: state.selectedCol,
        highlightProducts: state.highlightProducts,
        predictionInput: state.predictionInput,
        predictionRevealed: state.predictionRevealed,
        challengeRow: state.challengeRow,
        challengeCol: state.challengeCol,
        challengeStarted: state.challengeStarted,
        challengeCompleted: state.challengeCompleted,
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

    case "RESET": {
      return initialState;
    }

    default:
      return state;
  }
}
