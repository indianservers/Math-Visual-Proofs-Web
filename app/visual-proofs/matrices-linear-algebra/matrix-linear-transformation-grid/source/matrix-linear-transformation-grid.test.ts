import { describe, expect, it } from "vitest";
import {
  transformVector,
  computeDeterminant,
  computeAreaScale,
  getOrientationStatus,
  checkLinearityInvariant,
} from "./matrix-linear-transformation-gridMath";
import {
  initialState,
  linearTransformReducer,
} from "./matrix-linear-transformation-gridReducer";
import { evaluateTransformProofProgress } from "./matrix-linear-transformation-gridCompletion";
import {
  PROOF_META,
  PROOF_STEPS,
  HINTS,
  PRESETS,
  DEFAULT_CHALLENGE,
} from "./matrix-linear-transformation-gridConfig";

describe("Visual Proof 107: Matrix as Linear Transformation - Mathematics", () => {
  const customA = { a: 1.2, c: 0.6, b: 0.3, d: 1.1 };

  it("transforms basis vectors to the exact columns of Matrix A", () => {
    const Ae1 = transformVector(customA, { x: 1, y: 0 });
    expect(Ae1.x).toBeCloseTo(1.2, 5);
    expect(Ae1.y).toBeCloseTo(0.3, 5);

    const Ae2 = transformVector(customA, { x: 0, y: 1 });
    expect(Ae2.x).toBeCloseTo(0.6, 5);
    expect(Ae2.y).toBeCloseTo(1.1, 5);
  });

  it("transforms vector v = (2, 1) to (3.00, 1.70)", () => {
    const Av = transformVector(customA, { x: 2, y: 1 });
    expect(Av.x).toBeCloseTo(3.0, 5);
    expect(Av.y).toBeCloseTo(1.7, 5);
  });

  it("verifies linearity invariant Av = x(Ae1) + y(Ae2)", () => {
    const invariant = checkLinearityInvariant(customA, { x: 2, y: 1 });
    expect(invariant.isValid).toBe(true);
    expect(invariant.Av.x).toBeCloseTo(invariant.combination.x, 5);
    expect(invariant.Av.y).toBeCloseTo(invariant.combination.y, 5);
  });

  it("computes determinant and area scaling accurately", () => {
    // det(customA) = 1.2 * 1.1 - 0.3 * 0.6 = 1.32 - 0.18 = 1.14
    // Or with exact floating point
    const det = computeDeterminant(customA);
    expect(det).toBeCloseTo(1.14, 2);
    expect(computeAreaScale(customA)).toBeCloseTo(1.14, 2);
    expect(getOrientationStatus(customA).status).toBe("Preserved");
  });

  it("handles reflection and singular matrices", () => {
    const reflection = { a: -1, c: 0, b: 0, d: 1 };
    expect(computeDeterminant(reflection)).toBe(-1);
    expect(getOrientationStatus(reflection).status).toBe("Reversed");

    const singular = { a: 1, c: 2, b: 2, d: 4 };
    expect(computeDeterminant(singular)).toBe(0);
    expect(getOrientationStatus(singular).status).toBe("Collapsed");
  });
});

describe("Visual Proof 107: Reducer State Transitions & Invariants", () => {
  it("initializes with screenshot state", () => {
    expect(initialState.matrixA).toEqual({ a: 1.2, c: 0.6, b: 0.3, d: 1.1 });
    expect(initialState.vectorV).toEqual({ x: 2, y: 1 });
    expect(initialState.showGrid).toBe(true);
    expect(initialState.showBasis).toBe(true);
  });

  it("handles SET_VECTOR_V and updates live announcement", () => {
    const state = linearTransformReducer(initialState, {
      type: "SET_VECTOR_V",
      payload: { x: 1, y: 2 },
    });
    expect(state.vectorV).toEqual({ x: 1, y: 2 });
    expect(state.liveAnnouncement).toContain("v moved to (1.0, 2.0)");
  });

  it("handles APPLY_PRESET for Identity, Stretch, and Shear", () => {
    let state = linearTransformReducer(initialState, {
      type: "APPLY_PRESET",
      payload: "identity",
    });
    expect(state.matrixA).toEqual({ a: 1, c: 0, b: 0, d: 1 });
    expect(state.activePreset).toBe("identity");

    state = linearTransformReducer(state, {
      type: "APPLY_PRESET",
      payload: "shear",
    });
    expect(state.matrixA).toEqual({ a: 1, c: 1, b: 0, d: 1 });
  });

  it("handles SET_MATRIX_ENTRY", () => {
    const state = linearTransformReducer(initialState, {
      type: "SET_MATRIX_ENTRY",
      payload: { key: "a", value: 2.5 },
    });
    expect(state.matrixA.a).toBe(2.5);
  });

  it("evaluates multiple-choice challenge", () => {
    let state = linearTransformReducer(initialState, {
      type: "SELECT_CHALLENGE_CHOICE",
      payload: "A",
    });
    state = linearTransformReducer(state, { type: "CHECK_CHALLENGE" });
    expect(state.challengeChecked).toBe(true);
    expect(DEFAULT_CHALLENGE.options.find((o) => o.id === "A")?.isCorrect).toBe(true);
  });

  it("handles undo and redo deterministically", () => {
    let state = linearTransformReducer(initialState, {
      type: "SET_VECTOR_V",
      payload: { x: 3, y: 3 },
    });
    expect(state.vectorV).toEqual({ x: 3, y: 3 });
    expect(state.history.length).toBe(1);

    state = linearTransformReducer(state, { type: "UNDO" });
    expect(state.vectorV).toEqual({ x: 2, y: 1 });

    state = linearTransformReducer(state, { type: "REDO" });
    expect(state.vectorV).toEqual({ x: 3, y: 3 });
  });
});

describe("Visual Proof 107: Progress Evaluation & Metadata", () => {
  it("evaluates progress correctly", () => {
    const prog = evaluateTransformProofProgress(initialState);
    expect(prog.inspectCompleted).toBe(true);
    expect(prog.completionScore).toBeGreaterThanOrEqual(16);
  });

  it("has complete configuration metadata, presets, and hints", () => {
    expect(PROOF_META.id).toBe("matrix-linear-transformation-grid");
    expect(PRESETS.length).toBeGreaterThanOrEqual(4);
    expect(PROOF_STEPS.length).toBe(6);
    expect(HINTS.length).toBe(5);
  });
});
