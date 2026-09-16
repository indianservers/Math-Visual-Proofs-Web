import { describe, expect, it } from "vitest";
import {
  computeDeterminant,
  computeInverse,
  transformVector,
} from "./matrix-inverse-undo-transformationMath";
import {
  initialState,
  matrixInverseReducer,
} from "./matrix-inverse-undo-transformationReducer";
import { evaluateMatrixInverseProofProgress } from "./matrix-inverse-undo-transformationCompletion";
import {
  DEFAULT_MATRIX_A,
  PROOF_META,
  PROOF_STEPS,
  HINTS,
} from "./matrix-inverse-undo-transformationConfig";

describe("Visual Proof 112: Matrix Inverse - Mathematics", () => {
  it("computes determinant and inverse of default matrix A = [[2, 1], [1, 1]]", () => {
    const det = computeDeterminant(DEFAULT_MATRIX_A);
    expect(det).toBe(1);

    const invResult = computeInverse(DEFAULT_MATRIX_A);
    expect(invResult.isInvertible).toBe(true);
    expect(invResult.inverse).toEqual({
      a: 1,
      b: -1,
      c: -1,
      d: 2,
    });
  });

  it("verifies round-trip vector transformation A⁻¹(Ap) = p", () => {
    const p = { x: 0.5, y: 0.8 };
    const Ap = transformVector(DEFAULT_MATRIX_A, p);
    expect(Ap).toEqual({
      x: 2 * 0.5 + 1 * 0.8, // 1.8
      y: 1 * 0.5 + 1 * 0.8, // 1.3
    });

    const inv = computeInverse(DEFAULT_MATRIX_A).inverse!;
    const returnedP = transformVector(inv, Ap);
    expect(returnedP.x).toBeCloseTo(p.x, 5);
    expect(returnedP.y).toBeCloseTo(p.y, 5);
  });

  it("correctly identifies non-invertible singular matrices (det = 0)", () => {
    const singularMatrix = { a: 1, b: 2, c: 2, d: 4 };
    const invResult = computeInverse(singularMatrix);
    expect(invResult.isInvertible).toBe(false);
    expect(invResult.inverse).toBeNull();
  });
});

describe("Visual Proof 112: Reducer State Transitions & Invariants", () => {
  it("initializes with default matrix state", () => {
    expect(initialState.matrixA).toEqual(DEFAULT_MATRIX_A);
    expect(initialState.stage).toBe("apply_a");
  });

  it("handles SET_MATRIX_A_ENTRY", () => {
    const state = matrixInverseReducer(initialState, {
      type: "SET_MATRIX_A_ENTRY",
      payload: { key: "a", value: 3 },
    });
    expect(state.matrixA.a).toBe(3);
    expect(state.history.length).toBe(1);
  });

  it("handles stage transitions and point movements", () => {
    let state = matrixInverseReducer(initialState, {
      type: "SET_STAGE",
      payload: "apply_a_inv",
    });
    expect(state.stage).toBe("apply_a_inv");

    state = matrixInverseReducer(state, {
      type: "SET_POINT_P",
      payload: { x: 1, y: 1 },
    });
    expect(state.pointP).toEqual({ x: 1, y: 1 });
  });

  it("handles challenge validation for A = [[3, -1], [2, 1]]", () => {
    let state = matrixInverseReducer(initialState, {
      type: "SET_CHALLENGE_ENTRY",
      payload: { key: "a", value: "1/5" },
    });
    state = matrixInverseReducer(state, {
      type: "SET_CHALLENGE_ENTRY",
      payload: { key: "b", value: "1/5" },
    });
    state = matrixInverseReducer(state, {
      type: "SET_CHALLENGE_ENTRY",
      payload: { key: "c", value: "-2/5" },
    });
    state = matrixInverseReducer(state, {
      type: "SET_CHALLENGE_ENTRY",
      payload: { key: "d", value: "3/5" },
    });

    state = matrixInverseReducer(state, { type: "CHECK_CHALLENGE" });
    expect(state.challengeChecked).toBe(true);
    expect(state.challengeCorrect).toBe(true);
  });

  it("handles undo and redo deterministically", () => {
    let state = matrixInverseReducer(initialState, {
      type: "SET_MATRIX_A_ENTRY",
      payload: { key: "d", value: 4 },
    });
    expect(state.matrixA.d).toBe(4);

    state = matrixInverseReducer(state, { type: "UNDO" });
    expect(state.matrixA.d).toBe(1);

    state = matrixInverseReducer(state, { type: "REDO" });
    expect(state.matrixA.d).toBe(4);
  });
});

describe("Visual Proof 112: Progress Evaluation & Metadata", () => {
  it("evaluates progress correctly", () => {
    const prog = evaluateMatrixInverseProofProgress(initialState);
    expect(prog.inspectCompleted).toBe(true);
    expect(prog.completionScore).toBeGreaterThanOrEqual(16);
  });

  it("has complete configuration metadata, steps, and hints", () => {
    expect(PROOF_META.id).toBe("matrix-inverse-undo-transformation");
    expect(PROOF_STEPS.length).toBe(6);
    expect(HINTS.length).toBe(5);
  });
});
