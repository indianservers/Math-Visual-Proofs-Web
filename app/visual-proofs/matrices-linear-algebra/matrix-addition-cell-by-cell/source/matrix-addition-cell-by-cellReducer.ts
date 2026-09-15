import {
  DEFAULT_MATRIX_A,
  DEFAULT_MATRIX_B,
  MatrixData,
} from "./matrix-addition-cell-by-cellConfig";
import { formatCellSumString } from "./matrix-addition-cell-by-cellMath";

export interface ReducerState {
  matrixA: MatrixData;
  matrixB: MatrixData;
  placedCells: Record<string, number>; // key: "r,c", value: sum
  selectedCell: { row: number; col: number };
  showPath: boolean;
  predictionInput: string;
  predictionChecked: boolean;
  predictionCorrect: boolean;
  revealFullProof: boolean;
  challengeCells: Record<string, string>;
  challengeChecked: boolean;
  challengeCorrect: boolean;
  activeStep: number;
  hintTier: number;
  liveAnnouncement: string;
  history: Array<Omit<ReducerState, "history" | "future">>;
  future: Array<Omit<ReducerState, "history" | "future">>;
}

export type ReducerAction =
  | { type: "SELECT_CELL"; payload: { row: number; col: number } }
  | { type: "PLACE_CELL"; payload: { row: number; col: number; val?: number } }
  | { type: "AUTO_FILL_ALL" }
  | { type: "CLEAR_C" }
  | { type: "TOGGLE_SHOW_PATH" }
  | { type: "SET_PREDICTION_INPUT"; payload: string }
  | { type: "CHECK_PREDICTION" }
  | { type: "TOGGLE_REVEAL_PROOF" }
  | { type: "SET_CHALLENGE_CELL"; payload: { key: string; value: string } }
  | { type: "CHECK_CHALLENGE" }
  | { type: "SET_ACTIVE_STEP"; payload: number }
  | { type: "SET_HINT_TIER"; payload: number }
  | { type: "SET_LIVE_ANNOUNCEMENT"; payload: string }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESET" };

export const initialState: ReducerState = {
  matrixA: DEFAULT_MATRIX_A,
  matrixB: DEFAULT_MATRIX_B,
  placedCells: { "0,0": 3 }, // Matching the screenshot where (1, 1) has value 3 placed
  selectedCell: { row: 0, col: 0 },
  showPath: true,
  predictionInput: "",
  predictionChecked: false,
  predictionCorrect: false,
  revealFullProof: false,
  challengeCells: { "0,0": "", "0,1": "", "1,0": "", "1,1": "" },
  challengeChecked: false,
  challengeCorrect: false,
  activeStep: 0,
  hintTier: 0,
  liveAnnouncement: "Matrix Addition visual proof loaded. Position (1, 1): 1 + 2 = 3 placed in Matrix C.",
  history: [],
  future: [],
};

function pushHistory(state: ReducerState): ReducerState {
  const snapshot: Omit<ReducerState, "history" | "future"> = {
    matrixA: state.matrixA,
    matrixB: state.matrixB,
    placedCells: { ...state.placedCells },
    selectedCell: { ...state.selectedCell },
    showPath: state.showPath,
    predictionInput: state.predictionInput,
    predictionChecked: state.predictionChecked,
    predictionCorrect: state.predictionCorrect,
    revealFullProof: state.revealFullProof,
    challengeCells: { ...state.challengeCells },
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

export function matrixProofReducer(state: ReducerState, action: ReducerAction): ReducerState {
  switch (action.type) {
    case "SELECT_CELL": {
      const { row, col } = action.payload;
      const aVal = state.matrixA.data[row][col];
      const bVal = state.matrixB.data[row][col];
      const sumStr = formatCellSumString(aVal, bVal);
      return {
        ...state,
        selectedCell: { row, col },
        liveAnnouncement: `Selected position (${row + 1}, ${col + 1}): ${sumStr}`,
      };
    }

    case "PLACE_CELL": {
      const { row, col, val } = action.payload;
      const key = `${row},${col}`;
      const aVal = state.matrixA.data[row][col];
      const bVal = state.matrixB.data[row][col];
      const computed = val !== undefined ? val : aVal + bVal;

      const nextState = pushHistory(state);
      const nextPlaced = { ...nextState.placedCells, [key]: computed };

      return {
        ...nextState,
        placedCells: nextPlaced,
        selectedCell: { row, col },
        liveAnnouncement: `Placed ${computed} into position (${row + 1}, ${col + 1}).`,
      };
    }

    case "AUTO_FILL_ALL": {
      const nextState = pushHistory(state);
      const allPlaced: Record<string, number> = {};
      for (let r = 0; r < state.matrixA.rows; r++) {
        for (let c = 0; c < state.matrixA.cols; c++) {
          allPlaced[`${r},${c}`] = state.matrixA.data[r][c] + state.matrixB.data[r][c];
        }
      }
      return {
        ...nextState,
        placedCells: allPlaced,
        liveAnnouncement: "All entries in Matrix C computed and placed.",
      };
    }

    case "CLEAR_C": {
      const nextState = pushHistory(state);
      return {
        ...nextState,
        placedCells: {},
        liveAnnouncement: "Cleared Matrix C. All target cells reset to empty.",
      };
    }

    case "TOGGLE_SHOW_PATH": {
      return {
        ...state,
        showPath: !state.showPath,
        liveAnnouncement: state.showPath ? "Path line hidden." : "Path line shown.",
      };
    }

    case "SET_PREDICTION_INPUT": {
      return {
        ...state,
        predictionInput: action.payload,
        predictionChecked: false,
      };
    }

    case "CHECK_PREDICTION": {
      // Prediction asks for C(2, 3) -> row index 1, col index 2.
      // A(2, 3) = 5, B(2, 3) = 2 -> sum = 7
      const trimmed = state.predictionInput.trim();
      const isCorrect = trimmed === "7" || trimmed === "5+2" || trimmed === "5 + 2";
      return {
        ...state,
        predictionChecked: true,
        predictionCorrect: isCorrect,
        liveAnnouncement: isCorrect
          ? "Correct! Position C(2, 3) = A(2, 3) + B(2, 3) = 5 + 2 = 7."
          : `Prediction answer "${state.predictionInput}" is incorrect. Position C(2, 3) = 5 + 2 = 7.`,
      };
    }

    case "TOGGLE_REVEAL_PROOF": {
      return {
        ...state,
        revealFullProof: !state.revealFullProof,
      };
    }

    case "SET_CHALLENGE_CELL": {
      const { key, value } = action.payload;
      return {
        ...state,
        challengeCells: {
          ...state.challengeCells,
          [key]: value,
        },
        challengeChecked: false,
      };
    }

    case "CHECK_CHALLENGE": {
      // Challenge 2x2:
      // A: [ [3, -1], [2, 5] ]
      // B: [ [4, 6], [-1, 2] ]
      // C: [ [7, 5], [1, 7] ]
      const c00 = parseInt(state.challengeCells["0,0"], 10);
      const c01 = parseInt(state.challengeCells["0,1"], 10);
      const c10 = parseInt(state.challengeCells["1,0"], 10);
      const c11 = parseInt(state.challengeCells["1,1"], 10);

      const isCorrect =
        c00 === 7 && c01 === 5 && c10 === 1 && c11 === 7;

      return {
        ...state,
        challengeChecked: true,
        challengeCorrect: isCorrect,
        liveAnnouncement: isCorrect
          ? "Challenge complete! 2x2 sum matrix is [[7, 5], [1, 7]]."
          : "Some values in the challenge matrix are incorrect. Remember: add entries in the same position!",
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
        matrixA: state.matrixA,
        matrixB: state.matrixB,
        placedCells: { ...state.placedCells },
        selectedCell: { ...state.selectedCell },
        showPath: state.showPath,
        predictionInput: state.predictionInput,
        predictionChecked: state.predictionChecked,
        predictionCorrect: state.predictionCorrect,
        revealFullProof: state.revealFullProof,
        challengeCells: { ...state.challengeCells },
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
        matrixA: state.matrixA,
        matrixB: state.matrixB,
        placedCells: { ...state.placedCells },
        selectedCell: { ...state.selectedCell },
        showPath: state.showPath,
        predictionInput: state.predictionInput,
        predictionChecked: state.predictionChecked,
        predictionCorrect: state.predictionCorrect,
        revealFullProof: state.revealFullProof,
        challengeCells: { ...state.challengeCells },
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

    case "RESET": {
      return initialState;
    }

    default:
      return state;
  }
}
