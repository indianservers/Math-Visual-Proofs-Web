import { describe, expect, it } from "vitest";
import {
  calculateDeterminant,
  calculateAreaScale,
  getOrientation,
  computeParallelogramVertices,
  checkDeterminantAreaInvariant,
} from "./determinant-area-scale-factorMath";
import {
  initialState,
  determinantProofReducer,
} from "./determinant-area-scale-factorReducer";
import { evaluateDetProofProgress } from "./determinant-area-scale-factorCompletion";
import {
  PROOF_META,
  PROOF_STEPS,
  HINTS,
  QUICK_PRESETS,
} from "./determinant-area-scale-factorConfig";

describe("Visual Proof 108: Determinant as Area Scale Factor - Mathematics", () => {
  const customA = { a: 1.4, b: -0.6, c: 0.8, d: 1.1 };

  it("calculates determinant ad - bc correctly", () => {
    // 1.4 * 1.1 - (-0.6) * 0.8 = 1.54 + 0.48 = 2.02
    const det = calculateDeterminant(customA);
    expect(det).toBeCloseTo(2.02, 2);
  });

  it("calculates area scale factor as |det(A)|", () => {
    const area = calculateAreaScale(customA);
    expect(area).toBeCloseTo(2.02, 2);
  });

  it("identifies orientation status correctly", () => {
    expect(getOrientation(customA).status).toBe("Preserved");

    const flipA = { a: 1, b: 0, c: 0, d: -1 };
    expect(getOrientation(flipA).status).toBe("Reversed");
    expect(getOrientation(flipA).signText).toBe("-1.00×");

    const singular = { a: 2, b: 4, c: 1, d: 2 };
    expect(getOrientation(singular).status).toBe("Collapsed");
  });

  it("computes parallelogram vertices and verifies area invariant with shoelace formula", () => {
    const vertices = computeParallelogramVertices(customA);
    expect(vertices.p0).toEqual({ x: 0, y: 0 });
    expect(vertices.p1).toEqual({ x: 1.4, y: 0.8 });
    expect(vertices.p3).toEqual({ x: -0.6, y: 1.1 });
    expect(vertices.p2.x).toBeCloseTo(0.8, 5);
    expect(vertices.p2.y).toBeCloseTo(1.9, 5);

    const invariant = checkDeterminantAreaInvariant(customA);
    expect(invariant.isValid).toBe(true);
  });
});

describe("Visual Proof 108: Reducer State Transitions & Invariants", () => {
  it("initializes with default matrix and state", () => {
    expect(initialState.matrixA).toEqual({ a: 1.4, b: -0.6, c: 0.8, d: 1.1 });
    expect(initialState.showPath).toBe(true);
    expect(initialState.activePreset).toBe("default");
  });

  it("handles SET_MATRIX_ENTRY", () => {
    const state = determinantProofReducer(initialState, {
      type: "SET_MATRIX_ENTRY",
      payload: { key: "a", value: 2.0 },
    });
    expect(state.matrixA.a).toBe(2.0);
  });

  it("handles APPLY_PRESET for Identity and Flip", () => {
    let state = determinantProofReducer(initialState, {
      type: "APPLY_PRESET",
      payload: "identity",
    });
    expect(state.matrixA).toEqual({ a: 1, b: 0, c: 0, d: 1 });
    expect(state.activePreset).toBe("identity");

    state = determinantProofReducer(state, {
      type: "APPLY_PRESET",
      payload: "flip",
    });
    expect(state.matrixA).toEqual({ a: 1, b: 0, c: 0, d: -1 });
    expect(state.activePreset).toBe("flip");
  });

  it("evaluates prediction checking", () => {
    let state = determinantProofReducer(initialState, {
      type: "SET_PREDICTION_INPUT",
      payload: "2.02",
    });
    state = determinantProofReducer(state, { type: "CHECK_PREDICTION" });
    expect(state.predictionChecked).toBe(true);
    expect(state.predictionCorrect).toBe(true);
  });

  it("handles challenge state and validation", () => {
    let state = determinantProofReducer(initialState, {
      type: "SET_CHALLENGE_ENTRY",
      payload: { key: "a", value: 2 },
    });
    state = determinantProofReducer(state, {
      type: "SET_CHALLENGE_ENTRY",
      payload: { key: "b", value: 0.5 },
    });
    state = determinantProofReducer(state, {
      type: "SET_CHALLENGE_ENTRY",
      payload: { key: "c", value: 0.5 },
    });
    state = determinantProofReducer(state, {
      type: "SET_CHALLENGE_ENTRY",
      payload: { key: "d", value: 1.5 },
    });
    state = determinantProofReducer(state, { type: "CHECK_CHALLENGE" });

    expect(state.challengeChecked).toBe(true);
    expect(state.challengeCorrect).toBe(true);
  });

  it("handles undo and redo deterministically", () => {
    let state = determinantProofReducer(initialState, {
      type: "SET_MATRIX_ENTRY",
      payload: { key: "a", value: 3.0 },
    });
    expect(state.matrixA.a).toBe(3.0);
    expect(state.history.length).toBe(1);

    state = determinantProofReducer(state, { type: "UNDO" });
    expect(state.matrixA.a).toBe(1.4);

    state = determinantProofReducer(state, { type: "REDO" });
    expect(state.matrixA.a).toBe(3.0);
  });
});

describe("Visual Proof 108: Progress Evaluation & Metadata", () => {
  it("evaluates progress correctly", () => {
    const prog = evaluateDetProofProgress(initialState);
    expect(prog.inspectCompleted).toBe(true);
    expect(prog.completionScore).toBeGreaterThanOrEqual(16);
  });

  it("has complete configuration metadata, presets, and hints", () => {
    expect(PROOF_META.id).toBe("determinant-area-scale-factor");
    expect(QUICK_PRESETS.length).toBe(5);
    expect(PROOF_STEPS.length).toBe(6);
    expect(HINTS.length).toBe(5);
  });
});
