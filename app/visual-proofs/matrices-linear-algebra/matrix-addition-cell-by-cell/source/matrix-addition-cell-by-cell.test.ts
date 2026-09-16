import { describe, expect, it } from "vitest";
import {
  addMatrices,
  checkDimensionsEqual,
  formatCellSumString,
  formatCellSumExpression,
  checkMatrixAdditionInvariant,
} from "./matrix-addition-cell-by-cellMath";
import {
  initialState,
  matrixProofReducer,
} from "./matrix-addition-cell-by-cellReducer";
import { evaluateMatrixProofProgress } from "./matrix-addition-cell-by-cellCompletion";
import {
  DEFAULT_MATRIX_A,
  DEFAULT_MATRIX_B,
  PROOF_META,
  PROOF_STEPS,
  HINTS,
} from "./matrix-addition-cell-by-cellConfig";

describe("Visual Proof 105: Matrix Addition - Mathematical Engine", () => {
  it("adds two 2x3 matrices cell-by-cell correctly", () => {
    const C = addMatrices(DEFAULT_MATRIX_A, DEFAULT_MATRIX_B);
    expect(C).not.toBeNull();
    expect(C!.rows).toBe(2);
    expect(C!.cols).toBe(3);
    expect(C!.data).toEqual([
      [3, 5, 2],
      [1, 6, 7],
    ]);
  });

  it("verifies dimension match and rejects dimension mismatch", () => {
    expect(checkDimensionsEqual(DEFAULT_MATRIX_A, DEFAULT_MATRIX_B)).toBe(true);

    const mismatchMatrix = {
      rows: 3,
      cols: 2,
      data: [
        [1, 2],
        [3, 4],
        [5, 6],
      ],
    };
    expect(checkDimensionsEqual(DEFAULT_MATRIX_A, mismatchMatrix)).toBe(false);
    expect(addMatrices(DEFAULT_MATRIX_A, mismatchMatrix)).toBeNull();
  });

  it("formats cell sum string with positive and negative numbers", () => {
    expect(formatCellSumString(1, 2)).toBe("1 + 2 = 3");
    expect(formatCellSumString(3, -1)).toBe("3 + (-1) = 2");
    expect(formatCellSumString(-2, 7)).toBe("-2 + 7 = 5");
  });

  it("formats cell sum expressions correctly", () => {
    expect(formatCellSumExpression(1, 2)).toBe("1+2");
    expect(formatCellSumExpression(3, -1)).toBe("3+(-1)");
  });

  it("validates position-by-position invariant", () => {
    const valid = checkMatrixAdditionInvariant(DEFAULT_MATRIX_A, DEFAULT_MATRIX_B, 0, 0, 3);
    expect(valid.isCorrect).toBe(true);
    expect(valid.expected).toBe(3);

    const invalid = checkMatrixAdditionInvariant(DEFAULT_MATRIX_A, DEFAULT_MATRIX_B, 0, 0, 99);
    expect(invalid.isCorrect).toBe(false);
    expect(invalid.expected).toBe(3);
  });
});

describe("Visual Proof 105: Reducer State Transitions & Invariants", () => {
  it("initializes with screenshot state", () => {
    expect(initialState.placedCells["0,0"]).toBe(3);
    expect(initialState.selectedCell).toEqual({ row: 0, col: 0 });
    expect(initialState.showPath).toBe(true);
  });

  it("handles SELECT_CELL and updates selection and announcement", () => {
    const state = matrixProofReducer(initialState, {
      type: "SELECT_CELL",
      payload: { row: 1, col: 2 },
    });
    expect(state.selectedCell).toEqual({ row: 1, col: 2 });
    expect(state.liveAnnouncement).toContain("5 + 2 = 7");
  });

  it("handles PLACE_CELL and CLEAR_C", () => {
    let state = matrixProofReducer(initialState, {
      type: "PLACE_CELL",
      payload: { row: 0, col: 1 },
    });
    expect(state.placedCells["0,1"]).toBe(5);

    state = matrixProofReducer(state, { type: "CLEAR_C" });
    expect(Object.keys(state.placedCells).length).toBe(0);
  });

  it("handles AUTO_FILL_ALL to complete Matrix C", () => {
    const state = matrixProofReducer(initialState, { type: "AUTO_FILL_ALL" });
    expect(Object.keys(state.placedCells).length).toBe(6);
    expect(state.placedCells["0,0"]).toBe(3);
    expect(state.placedCells["0,1"]).toBe(5);
    expect(state.placedCells["0,2"]).toBe(2);
    expect(state.placedCells["1,0"]).toBe(1);
    expect(state.placedCells["1,1"]).toBe(6);
    expect(state.placedCells["1,2"]).toBe(7);
  });

  it("evaluates prediction for C(2, 3) correctly", () => {
    let state = matrixProofReducer(initialState, {
      type: "SET_PREDICTION_INPUT",
      payload: "7",
    });
    state = matrixProofReducer(state, { type: "CHECK_PREDICTION" });
    expect(state.predictionChecked).toBe(true);
    expect(state.predictionCorrect).toBe(true);
  });

  it("evaluates 2x2 challenge matrix correctly", () => {
    let state = matrixProofReducer(initialState, {
      type: "SET_CHALLENGE_CELL",
      payload: { key: "0,0", value: "7" },
    });
    state = matrixProofReducer(state, {
      type: "SET_CHALLENGE_CELL",
      payload: { key: "0,1", value: "5" },
    });
    state = matrixProofReducer(state, {
      type: "SET_CHALLENGE_CELL",
      payload: { key: "1,0", value: "1" },
    });
    state = matrixProofReducer(state, {
      type: "SET_CHALLENGE_CELL",
      payload: { key: "1,1", value: "7" },
    });
    state = matrixProofReducer(state, { type: "CHECK_CHALLENGE" });
    expect(state.challengeChecked).toBe(true);
    expect(state.challengeCorrect).toBe(true);
  });

  it("handles undo and redo deterministically", () => {
    let state = matrixProofReducer(initialState, {
      type: "PLACE_CELL",
      payload: { row: 1, col: 1 },
    });
    expect(state.placedCells["1,1"]).toBe(6);
    expect(state.history.length).toBe(1);

    state = matrixProofReducer(state, { type: "UNDO" });
    expect(state.placedCells["1,1"]).toBeUndefined();

    state = matrixProofReducer(state, { type: "REDO" });
    expect(state.placedCells["1,1"]).toBe(6);
  });
});

describe("Visual Proof 105: Progress Evaluation & Metadata", () => {
  it("evaluates progress correctly", () => {
    const prog = evaluateMatrixProofProgress(initialState);
    expect(prog.inspectCompleted).toBe(true);
    expect(prog.completionScore).toBeGreaterThanOrEqual(16);
  });

  it("has complete configuration metadata and hints", () => {
    expect(PROOF_META.id).toBe("matrix-addition-cell-by-cell");
    expect(PROOF_STEPS.length).toBe(6);
    expect(HINTS.length).toBe(5);
  });
});
