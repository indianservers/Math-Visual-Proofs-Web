import { describe, expect, it } from "vitest";
import {
  solveAugmentedSystem,
  applyRowOp,
  checkEquivalenceInvariant,
} from "./row-operations-preserve-solutionsMath";
import {
  initialState,
  rowOpsProofReducer,
} from "./row-operations-preserve-solutionsReducer";
import { evaluateRowOpsProofProgress } from "./row-operations-preserve-solutionsCompletion";
import {
  INITIAL_SYSTEM_1,
  DEFAULT_CHALLENGE_TARGET,
  PROOF_META,
  PROOF_STEPS,
  HINTS,
} from "./row-operations-preserve-solutionsConfig";

describe("Visual Proof 110: Row Operations Preserve Solution Set - Mathematics", () => {
  it("solves System 1 uniquely at (2, 1)", () => {
    const sol = solveAugmentedSystem(INITIAL_SYSTEM_1);
    expect(sol.type).toBe("unique");
    expect(sol.intersection).toEqual({ x: 2, y: 1 });
    expect(sol.eq1Verified).toBe(true);
    expect(sol.eq2Verified).toBe(true);
  });

  it("preserves solution point (2, 1) under row swap (R1 <-> R2)", () => {
    const sys2 = applyRowOp(INITIAL_SYSTEM_1, "swap");
    const sol2 = solveAugmentedSystem(sys2);
    expect(sol2.type).toBe("unique");
    expect(sol2.intersection).toEqual({ x: 2, y: 1 });

    const inv = checkEquivalenceInvariant(INITIAL_SYSTEM_1, sys2);
    expect(inv.isEquivalent).toBe(true);
  });

  it("preserves solution point (2, 1) under row addition (R1 -> R1 + R2)", () => {
    const sys2 = applyRowOp(INITIAL_SYSTEM_1, "add_k_r2_to_r1", 1);
    // Row 1 becomes 3x + 0y = 6
    expect(sys2.row1).toEqual({ a: 3, b: 0, c: 6 });
    const sol2 = solveAugmentedSystem(sys2);
    expect(sol2.type).toBe("unique");
    expect(sol2.intersection).toEqual({ x: 2, y: 1 });

    const inv = checkEquivalenceInvariant(INITIAL_SYSTEM_1, sys2);
    expect(inv.isEquivalent).toBe(true);
  });

  it("preserves solution point (2, 1) under row addition (R2 -> R2 - 0.5R1)", () => {
    const sys2 = applyRowOp(INITIAL_SYSTEM_1, "add_k_r1_to_r2", -0.5);
    // Row 2 becomes 0x - 1.5y = -1.5
    expect(sys2.row2.a).toBe(0);
    expect(sys2.row2.b).toBeCloseTo(-1.5, 2);
    expect(sys2.row2.c).toBeCloseTo(-1.5, 2);
    const sol2 = solveAugmentedSystem(sys2);
    expect(sol2.type).toBe("unique");
    expect(sol2.intersection?.x).toBeCloseTo(2, 2);
    expect(sol2.intersection?.y).toBeCloseTo(1, 2);

    const inv = checkEquivalenceInvariant(INITIAL_SYSTEM_1, sys2);
    expect(inv.isEquivalent).toBe(true);
  });
});

describe("Visual Proof 110: Reducer State Transitions & Invariants", () => {
  it("initializes with default dual system state", () => {
    expect(initialState.system1).toEqual(INITIAL_SYSTEM_1);
    expect(initialState.system2).toEqual(applyRowOp(INITIAL_SYSTEM_1, "swap"));
    expect(initialState.activeOp).toBe("swap");
  });

  it("handles SET_SYS1_ENTRY and propagates to System 2", () => {
    const state = rowOpsProofReducer(initialState, {
      type: "SET_SYS1_ENTRY",
      payload: { row: "row1", key: "c", value: 7 },
    });
    expect(state.system1.row1.c).toBe(7);
    expect(state.system2.row2.c).toBe(7); // Since activeOp is swap
  });

  it("handles APPLY_ROW_OP", () => {
    const state = rowOpsProofReducer(initialState, {
      type: "APPLY_ROW_OP",
      payload: { op: "add_k_r2_to_r1", k: 2 },
    });
    expect(state.activeOp).toBe("add_k_r2_to_r1");
    expect(state.system2.row1).toEqual({ a: 4, b: -1, c: 7 });
  });

  it("handles predict choice and validation", () => {
    let state = rowOpsProofReducer(initialState, {
      type: "SET_PREDICT_CHOICE",
      payload: "A",
    });
    state = rowOpsProofReducer(state, { type: "CHECK_PREDICT" });
    expect(state.predictChecked).toBe(true);
  });

  it("validates challenge steps against target matrix", () => {
    let state = rowOpsProofReducer(initialState, { type: "RESET_CHALLENGE_STEPS" });
    state = rowOpsProofReducer(state, {
      type: "ADD_CHALLENGE_STEP",
      payload: { op: "swap" },
    });
    state = rowOpsProofReducer(state, { type: "CHECK_CHALLENGE" });
    expect(state.challengeChecked).toBe(true);
    expect(state.challengeCorrect).toBe(true);
  });

  it("handles undo and redo deterministically", () => {
    let state = rowOpsProofReducer(initialState, {
      type: "SET_SYS1_ENTRY",
      payload: { row: "row1", key: "a", value: 6 },
    });
    expect(state.system1.row1.a).toBe(6);
    expect(state.history.length).toBe(1);

    state = rowOpsProofReducer(state, { type: "UNDO" });
    expect(state.system1.row1.a).toBe(2);

    state = rowOpsProofReducer(state, { type: "REDO" });
    expect(state.system1.row1.a).toBe(6);
  });
});

describe("Visual Proof 110: Progress Evaluation & Metadata", () => {
  it("evaluates progress correctly", () => {
    const prog = evaluateRowOpsProofProgress(initialState);
    expect(prog.inspectCompleted).toBe(true);
    expect(prog.completionScore).toBeGreaterThanOrEqual(16);
  });

  it("has complete configuration metadata, steps, and hints", () => {
    expect(PROOF_META.id).toBe("row-operations-preserve-solutions");
    expect(PROOF_STEPS.length).toBe(6);
    expect(HINTS.length).toBe(5);
    expect(DEFAULT_CHALLENGE_TARGET).toEqual({
      row1: { a: 1, b: -1, c: 1 },
      row2: { a: 2, b: 1, c: 5 },
    });
  });
});
