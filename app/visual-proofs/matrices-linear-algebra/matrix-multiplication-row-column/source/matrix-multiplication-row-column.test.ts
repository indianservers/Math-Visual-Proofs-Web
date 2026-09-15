import { describe, expect, it } from "vitest";
import {
  computePairwiseProducts,
  formatDotProductTex,
  formatTargetEntryTex,
  checkMultiplicationDimensions,
  checkDotProductInvariant,
} from "./matrix-multiplication-row-columnMath";
import {
  initialState,
  matrixMultReducer,
} from "./matrix-multiplication-row-columnReducer";
import { evaluateMultProofProgress } from "./matrix-multiplication-row-columnCompletion";
import { PROOF_META, PROOF_STEPS, HINTS } from "./matrix-multiplication-row-columnConfig";

describe("Visual Proof 106: Matrix Multiplication - Mathematical Engine", () => {
  it("computes 3 pairwise product terms for given row and column", () => {
    const terms = computePairwiseProducts(1, 2);
    expect(terms.length).toBe(3);
    expect(terms[0]).toEqual({
      k: 1,
      aSymbol: "a_{11}",
      bSymbol: "b_{12}",
      productTex: "a_{11} \\times b_{12}",
    });
    expect(terms[1]).toEqual({
      k: 2,
      aSymbol: "a_{12}",
      bSymbol: "b_{22}",
      productTex: "a_{12} \\times b_{22}",
    });
    expect(terms[2]).toEqual({
      k: 3,
      aSymbol: "a_{13}",
      bSymbol: "b_{32}",
      productTex: "a_{13} \\times b_{32}",
    });
  });

  it("formats dot product LaTeX string correctly", () => {
    const tex = formatDotProductTex(1, 2);
    expect(tex).toBe("a_{11} \\times b_{12} + a_{12} \\times b_{22} + a_{13} \\times b_{32}");
  });

  it("formats target entry LaTeX correctly", () => {
    expect(formatTargetEntryTex(1, 2)).toBe("(AB)_{12}");
    expect(formatTargetEntryTex(2, 3)).toBe("(AB)_{23}");
  });

  it("verifies inner dimension compatibility", () => {
    const valid = checkMultiplicationDimensions(3, 3);
    expect(valid.isCompatible).toBe(true);

    const invalid = checkMultiplicationDimensions(3, 4);
    expect(invalid.isCompatible).toBe(false);
  });

  it("validates row-column dot product invariant", () => {
    const valid = checkDotProductInvariant(1, 2, 1, 2);
    expect(valid.isValid).toBe(true);

    const invalid = checkDotProductInvariant(1, 2, 2, 3);
    expect(invalid.isValid).toBe(false);
  });
});

describe("Visual Proof 106: Reducer State Transitions & Invariants", () => {
  it("initializes with screenshot state (row 1, col 2)", () => {
    expect(initialState.selectedRow).toBe(1);
    expect(initialState.selectedCol).toBe(2);
    expect(initialState.highlightProducts).toBe(true);
    expect(initialState.challengeRow).toBe(2);
    expect(initialState.challengeCol).toBe(3);
  });

  it("handles SELECT_ROW and SELECT_COL", () => {
    let state = matrixMultReducer(initialState, { type: "SELECT_ROW", payload: 2 });
    expect(state.selectedRow).toBe(2);
    expect(state.selectedCol).toBe(2);

    state = matrixMultReducer(state, { type: "SELECT_COL", payload: 3 });
    expect(state.selectedRow).toBe(2);
    expect(state.selectedCol).toBe(3);
  });

  it("handles SET_ROW_AND_COL directly", () => {
    const state = matrixMultReducer(initialState, {
      type: "SET_ROW_AND_COL",
      payload: { row: 3, col: 1 },
    });
    expect(state.selectedRow).toBe(3);
    expect(state.selectedCol).toBe(1);
  });

  it("handles TOGGLE_HIGHLIGHT_PRODUCTS", () => {
    let state = matrixMultReducer(initialState, { type: "TOGGLE_HIGHLIGHT_PRODUCTS" });
    expect(state.highlightProducts).toBe(false);

    state = matrixMultReducer(state, { type: "TOGGLE_HIGHLIGHT_PRODUCTS" });
    expect(state.highlightProducts).toBe(true);
  });

  it("handles challenge state transitions", () => {
    let state = matrixMultReducer(initialState, { type: "SET_CHALLENGE_ROW", payload: 2 });
    state = matrixMultReducer(state, { type: "SET_CHALLENGE_COL", payload: 3 });
    state = matrixMultReducer(state, { type: "START_CHALLENGE" });

    expect(state.challengeStarted).toBe(true);
    expect(state.challengeCompleted).toBe(true);
    expect(state.selectedRow).toBe(2);
    expect(state.selectedCol).toBe(3);
  });

  it("handles undo and redo deterministically", () => {
    let state = matrixMultReducer(initialState, { type: "SELECT_ROW", payload: 3 });
    expect(state.selectedRow).toBe(3);
    expect(state.history.length).toBe(1);

    state = matrixMultReducer(state, { type: "UNDO" });
    expect(state.selectedRow).toBe(1);

    state = matrixMultReducer(state, { type: "REDO" });
    expect(state.selectedRow).toBe(3);
  });
});

describe("Visual Proof 106: Progress Evaluation & Metadata", () => {
  it("evaluates progress correctly", () => {
    const prog = evaluateMultProofProgress(initialState);
    expect(prog.inspectCompleted).toBe(true);
    expect(prog.completionScore).toBeGreaterThanOrEqual(16);
  });

  it("has complete configuration metadata and hints", () => {
    expect(PROOF_META.id).toBe("matrix-multiplication-row-column");
    expect(PROOF_STEPS.length).toBe(6);
    expect(HINTS.length).toBe(5);
  });
});
