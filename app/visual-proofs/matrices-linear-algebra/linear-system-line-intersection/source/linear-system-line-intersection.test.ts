import { describe, expect, it } from "vitest";
import {
  computeDeterminant,
  solveLinearSystem,
  computeRowReducedEchelon,
  checkIntersectionInvariant,
} from "./linear-system-line-intersectionMath";
import {
  initialState,
  linearSystemReducer,
} from "./linear-system-line-intersectionReducer";
import { evaluateSystemProofProgress } from "./linear-system-line-intersectionCompletion";
import {
  PROOF_META,
  PROOF_STEPS,
  HINTS,
  DEFAULT_SYSTEM,
  DEFAULT_CHALLENGE_TARGET,
} from "./linear-system-line-intersectionConfig";

describe("Visual Proof 109: Linear Systems as Line Intersection - Mathematics", () => {
  it("computes determinant of 2x2 system accurately", () => {
    const det = computeDeterminant(2, 1, 1, -1);
    expect(det).toBe(-3);
  });

  it("solves standard 2x2 linear system (2x + y = 5, x - y = 1) -> (2, 1)", () => {
    const sol = solveLinearSystem(DEFAULT_SYSTEM.eq1, DEFAULT_SYSTEM.eq2);
    expect(sol.type).toBe("unique");
    expect(sol.intersection).toEqual({ x: 2, y: 1 });
    expect(sol.eq1Verified).toBe(true);
    expect(sol.eq2Verified).toBe(true);
  });

  it("correctly classifies parallel and coincident systems (det = 0)", () => {
    // Parallel: 2x + y = 5 and 2x + y = 1
    const parallel = solveLinearSystem({ a: 2, b: 1, c: 5 }, { a: 2, b: 1, c: 1 });
    expect(parallel.type).toBe("parallel");
    expect(parallel.intersection).toBeNull();

    // Coincident: 2x + y = 5 and 4x + 2y = 10
    const coincident = solveLinearSystem({ a: 2, b: 1, c: 5 }, { a: 4, b: 2, c: 10 });
    expect(coincident.type).toBe("coincident");
    expect(coincident.intersection).toBeNull();
  });

  it("computes row-reduced echelon form preserving solution", () => {
    const echelon = computeRowReducedEchelon(DEFAULT_SYSTEM.eq1, DEFAULT_SYSTEM.eq2);
    expect(echelon.r1[0]).toBe(1);
    expect(echelon.r1[1]).toBe(0.5);
    expect(echelon.r1[2]).toBe(2.5);

    expect(echelon.r2[0]).toBe(0);
    expect(echelon.r2[1]).toBe(-1.5);
    expect(echelon.r2[2]).toBe(-1.5);
  });

  it("verifies intersection invariant", () => {
    expect(
      checkIntersectionInvariant(DEFAULT_SYSTEM.eq1, DEFAULT_SYSTEM.eq2, 2, 1),
    ).toBe(true);
    expect(
      checkIntersectionInvariant(DEFAULT_SYSTEM.eq1, DEFAULT_SYSTEM.eq2, 0, 0),
    ).toBe(false);
  });
});

describe("Visual Proof 109: Reducer State Transitions & Invariants", () => {
  it("initializes with default system state", () => {
    expect(initialState.eq1).toEqual({ a: 2, b: 1, c: 5 });
    expect(initialState.eq2).toEqual({ a: 1, b: -1, c: 1 });
  });

  it("handles SET_EQ1_COEFF and SET_EQ2_COEFF", () => {
    let state = linearSystemReducer(initialState, {
      type: "SET_EQ1_COEFF",
      payload: { key: "c", value: 7 },
    });
    expect(state.eq1.c).toBe(7);

    state = linearSystemReducer(state, {
      type: "SET_EQ2_COEFF",
      payload: { key: "a", value: 3 },
    });
    expect(state.eq2.a).toBe(3);
  });

  it("handles row operations preserving the solution", () => {
    let state = linearSystemReducer(initialState, { type: "APPLY_ROW_OP_SWAP" });
    expect(state.eq1).toEqual(initialState.eq2);
    expect(state.eq2).toEqual(initialState.eq1);

    state = linearSystemReducer(initialState, { type: "APPLY_ROW_OP_ELIMINATE" });
    expect(state.eq2.a).toBe(0);
    expect(state.eq2.b).toBeCloseTo(-1.5, 2);
    expect(state.eq2.c).toBeCloseTo(-1.5, 2);
  });

  it("evaluates prediction checking", () => {
    let state = linearSystemReducer(initialState, {
      type: "SET_PREDICTION_CHOICE",
      payload: "none_or_infinite",
    });
    state = linearSystemReducer(state, { type: "CHECK_PREDICTION" });
    expect(state.predictionChecked).toBe(true);
  });

  it("handles challenge validation for (-1, 3)", () => {
    // 1*(-1) + 1*(3) = 2
    // 2*(-1) + 1*(3) = 1
    let state = linearSystemReducer(initialState, {
      type: "SET_CHALLENGE_EQ1",
      payload: { key: "a", value: 1 },
    });
    state = linearSystemReducer(state, {
      type: "SET_CHALLENGE_EQ1",
      payload: { key: "b", value: 1 },
    });
    state = linearSystemReducer(state, {
      type: "SET_CHALLENGE_EQ1",
      payload: { key: "c", value: 2 },
    });

    state = linearSystemReducer(state, {
      type: "SET_CHALLENGE_EQ2",
      payload: { key: "a", value: 2 },
    });
    state = linearSystemReducer(state, {
      type: "SET_CHALLENGE_EQ2",
      payload: { key: "b", value: 1 },
    });
    state = linearSystemReducer(state, {
      type: "SET_CHALLENGE_EQ2",
      payload: { key: "c", value: 1 },
    });

    state = linearSystemReducer(state, { type: "CHECK_CHALLENGE" });
    expect(state.challengeChecked).toBe(true);
    expect(state.challengeCorrect).toBe(true);
  });

  it("handles undo and redo deterministically", () => {
    let state = linearSystemReducer(initialState, {
      type: "SET_EQ1_COEFF",
      payload: { key: "a", value: 5 },
    });
    expect(state.eq1.a).toBe(5);
    expect(state.history.length).toBe(1);

    state = linearSystemReducer(state, { type: "UNDO" });
    expect(state.eq1.a).toBe(2);

    state = linearSystemReducer(state, { type: "REDO" });
    expect(state.eq1.a).toBe(5);
  });
});

describe("Visual Proof 109: Progress Evaluation & Metadata", () => {
  it("evaluates progress correctly", () => {
    const prog = evaluateSystemProofProgress(initialState);
    expect(prog.inspectCompleted).toBe(true);
    expect(prog.completionScore).toBeGreaterThanOrEqual(16);
  });

  it("has complete configuration metadata, steps, and hints", () => {
    expect(PROOF_META.id).toBe("linear-system-line-intersection");
    expect(PROOF_STEPS.length).toBe(6);
    expect(HINTS.length).toBe(5);
    expect(DEFAULT_CHALLENGE_TARGET).toEqual({ targetX: -1, targetY: 3 });
  });
});
