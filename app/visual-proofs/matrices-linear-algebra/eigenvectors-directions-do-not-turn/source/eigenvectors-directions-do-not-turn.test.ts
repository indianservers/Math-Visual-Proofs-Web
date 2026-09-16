import { describe, expect, it } from "vitest";
import {
  computeEigensystem,
  transformVector,
  checkCollinearity,
} from "./eigenvectors-directions-do-not-turnMath";
import {
  initialState,
  eigenvectorsReducer,
} from "./eigenvectors-directions-do-not-turnReducer";
import { evaluateEigenvectorsProofProgress } from "./eigenvectors-directions-do-not-turnCompletion";
import {
  DEFAULT_MATRIX,
  PROOF_META,
  PROOF_STEPS,
  HINTS,
} from "./eigenvectors-directions-do-not-turnConfig";

describe("Visual Proof 111: Eigenvectors - Mathematics", () => {
  it("computes eigenvalues and eigenvectors for symmetric matrix A = [[2, 1], [1, 3]]", () => {
    const eigen = computeEigensystem(DEFAULT_MATRIX);
    expect(eigen.hasRealEigenvalues).toBe(true);

    // lambda1 = (5 + sqrt(5))/2 approx 3.618
    expect(eigen.lambda1).toBeCloseTo(3.618, 2);
    // lambda2 = (5 - sqrt(5))/2 approx 1.382
    expect(eigen.lambda2).toBeCloseTo(1.382, 2);

    // Verify Av1 = lambda1 * v1
    const Av1 = transformVector(DEFAULT_MATRIX, eigen.v1);
    expect(Av1.x).toBeCloseTo(eigen.lambda1 * eigen.v1.x, 2);
    expect(Av1.y).toBeCloseTo(eigen.lambda1 * eigen.v1.y, 2);

    // Verify Av2 = lambda2 * v2
    const Av2 = transformVector(DEFAULT_MATRIX, eigen.v2);
    expect(Av2.x).toBeCloseTo(eigen.lambda2 * eigen.v2.x, 2);
    expect(Av2.y).toBeCloseTo(eigen.lambda2 * eigen.v2.y, 2);
  });

  it("verifies collinearity invariant: eigenvectors do not turn (angle ~ 0)", () => {
    const eigen = computeEigensystem(DEFAULT_MATRIX);
    const Av1 = transformVector(DEFAULT_MATRIX, eigen.v1);
    const col1 = checkCollinearity(eigen.v1, Av1);
    expect(col1.isCollinear).toBe(true);
    expect(col1.angleDeg).toBeCloseTo(0, 1);

    // Non-eigenvector: e1 = [1, 0]^T -> [2, 1]^T, angle = atan(1/2) approx 26.56 deg
    const e1 = { x: 1, y: 0 };
    const Ae1 = transformVector(DEFAULT_MATRIX, e1);
    const colE1 = checkCollinearity(e1, Ae1);
    expect(colE1.isCollinear).toBe(false);
    expect(colE1.angleDeg).toBeGreaterThan(15);
  });
});

describe("Visual Proof 111: Reducer State Transitions & Invariants", () => {
  it("initializes with default matrix state", () => {
    expect(initialState.matrix).toEqual(DEFAULT_MATRIX);
    expect(initialState.selectedVector).toBe("v1");
  });

  it("handles SET_MATRIX_ENTRY", () => {
    const state = eigenvectorsReducer(initialState, {
      type: "SET_MATRIX_ENTRY",
      payload: { key: "a", value: 4 },
    });
    expect(state.matrix.a).toBe(4);
    expect(state.history.length).toBe(1);
  });

  it("handles view mode and matrix tab switches", () => {
    let state = eigenvectorsReducer(initialState, {
      type: "SET_VIEW_MODE",
      payload: "grid",
    });
    expect(state.viewMode).toBe("grid");

    state = eigenvectorsReducer(state, {
      type: "SET_MATRIX_TAB",
      payload: "transformation",
    });
    expect(state.activeMatrixTab).toBe("transformation");
  });

  it("handles predict checking", () => {
    let state = eigenvectorsReducer(initialState, {
      type: "SET_SELECTED_VECTOR",
      payload: "v1",
    });
    state = eigenvectorsReducer(state, { type: "CHECK_PREDICT" });
    expect(state.predictChecked).toBe(true);
  });

  it("handles challenge validation", () => {
    let state = eigenvectorsReducer(initialState, {
      type: "SET_CHALLENGE_INPUT",
      payload: { key: "lambda1", value: "3.618" },
    });
    state = eigenvectorsReducer(state, {
      type: "SET_CHALLENGE_INPUT",
      payload: { key: "lambda2", value: "1.382" },
    });
    state = eigenvectorsReducer(state, { type: "CHECK_CHALLENGE" });
    expect(state.challengeChecked).toBe(true);
    expect(state.challengeCorrect).toBe(true);
  });

  it("handles undo and redo deterministically", () => {
    let state = eigenvectorsReducer(initialState, {
      type: "SET_MATRIX_ENTRY",
      payload: { key: "d", value: 6 },
    });
    expect(state.matrix.d).toBe(6);

    state = eigenvectorsReducer(state, { type: "UNDO" });
    expect(state.matrix.d).toBe(3);

    state = eigenvectorsReducer(state, { type: "REDO" });
    expect(state.matrix.d).toBe(6);
  });
});

describe("Visual Proof 111: Progress Evaluation & Metadata", () => {
  it("evaluates progress correctly", () => {
    const prog = evaluateEigenvectorsProofProgress(initialState);
    expect(prog.inspectCompleted).toBe(true);
    expect(prog.completionScore).toBeGreaterThanOrEqual(16);
  });

  it("has complete configuration metadata, steps, and hints", () => {
    expect(PROOF_META.id).toBe("eigenvectors-directions-do-not-turn");
    expect(PROOF_STEPS.length).toBe(6);
    expect(HINTS.length).toBe(5);
  });
});
