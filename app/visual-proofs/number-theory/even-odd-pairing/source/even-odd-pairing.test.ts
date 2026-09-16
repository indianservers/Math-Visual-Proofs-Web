import { describe, expect, it } from "vitest";
import {
  calculateParity,
  computePairSlots,
  computeArrayGrid,
  computeRemainderLaneJumps,
  checkParityInvariant,
} from "./even-odd-pairingMath";
import {
  initialState,
  proofReducer,
} from "./even-odd-pairingReducer";
import { evaluateProofProgress } from "./even-odd-pairingCompletion";
import { DEFAULT_CHALLENGE, PROOF_META, PROOF_STEPS, HINTS } from "./even-odd-pairingConfig";

describe("Visual Proof 073: Even and Odd Numbers as Pairing Patterns - Mathematics", () => {
  it("correctly identifies even numbers as n = 2k with 0 remainder", () => {
    [0, 2, 4, 6, 8, 14, 24].forEach((n) => {
      const result = calculateParity(n);
      expect(result.isEven).toBe(true);
      expect(result.isOdd).toBe(false);
      expect(result.remainder).toBe(0);
      expect(result.pairs).toBe(n / 2);
      expect(result.formulaTex).toBe(`${n} = 2 \\times ${n / 2}`);
      expect(result.generalFormulaTex).toBe("n = 2k");
    });
  });

  it("correctly identifies odd numbers as n = 2k + 1 with 1 remainder", () => {
    [1, 3, 5, 7, 23].forEach((n) => {
      const result = calculateParity(n);
      expect(result.isEven).toBe(false);
      expect(result.isOdd).toBe(true);
      expect(result.remainder).toBe(1);
      expect(result.pairs).toBe(Math.floor(n / 2));
      expect(result.formulaTex).toBe(`${n} = 2 \\times ${Math.floor(n / 2)} + 1`);
      expect(result.generalFormulaTex).toBe("n = 2k + 1");
    });
  });

  it("handles edge cases 0 and 1 cleanly", () => {
    const zero = calculateParity(0);
    expect(zero.pairs).toBe(0);
    expect(zero.remainder).toBe(0);
    expect(zero.isEven).toBe(true);

    const one = calculateParity(1);
    expect(one.pairs).toBe(0);
    expect(one.remainder).toBe(1);
    expect(one.isOdd).toBe(true);
  });

  it("generates pair slots correctly for n = 7", () => {
    const placed = {
      1: { slotIndex: 0, socketIndex: 0 as const },
      2: { slotIndex: 0, socketIndex: 1 as const },
      3: { slotIndex: 1, socketIndex: 0 as const },
      4: { slotIndex: 1, socketIndex: 1 as const },
      5: { slotIndex: 2, socketIndex: 0 as const },
      6: { slotIndex: 2, socketIndex: 1 as const },
    };
    const slots = computePairSlots(7, placed, 7);
    expect(slots.length).toBe(4);
    expect(slots[0].isComplete).toBe(true);
    expect(slots[1].isComplete).toBe(true);
    expect(slots[2].isComplete).toBe(true);
    expect(slots[3].isLeftoverOnly).toBe(true);
  });

  it("computes 2-row array layout geometry correctly", () => {
    const oddGrid = computeArrayGrid(7);
    expect(oddGrid.length).toBe(7);
    const topRow = oddGrid.filter((i) => i.row === 0);
    const bottomRow = oddGrid.filter((i) => i.row === 1);
    expect(topRow.length).toBe(4);
    expect(bottomRow.length).toBe(3);
    expect(topRow[3].isLeftover).toBe(true);

    const evenGrid = computeArrayGrid(6);
    expect(evenGrid.length).toBe(6);
    expect(evenGrid.filter((i) => i.row === 0).length).toBe(3);
    expect(evenGrid.filter((i) => i.row === 1).length).toBe(3);
  });

  it("computes remainder lane jumps correctly", () => {
    const jumps7 = computeRemainderLaneJumps(7);
    expect(jumps7.length).toBe(4); // 3 pairs of 2 + 1 remainder
    expect(jumps7[0]).toEqual({ from: 0, to: 2, stepIndex: 1, isRemainder: false });
    expect(jumps7[1]).toEqual({ from: 2, to: 4, stepIndex: 2, isRemainder: false });
    expect(jumps7[2]).toEqual({ from: 4, to: 6, stepIndex: 3, isRemainder: false });
    expect(jumps7[3]).toEqual({ from: 6, to: 7, stepIndex: 4, isRemainder: true });

    const jumps6 = computeRemainderLaneJumps(6);
    expect(jumps6.length).toBe(3);
    expect(jumps6.every((j) => !j.isRemainder)).toBe(true);
  });

  it("validates counter count invariant", () => {
    const valid = checkParityInvariant(7, 6, 0, 1);
    expect(valid.valid).toBe(true);

    const invalid = checkParityInvariant(7, 5, 0, 1);
    expect(invalid.valid).toBe(false);
  });
});

describe("Visual Proof 073: Reducer State Transitions & Invariants", () => {
  it("initializes with n = 7 and screenshot state", () => {
    expect(initialState.n).toBe(7);
    expect(initialState.model).toBe("pairs");
    expect(Object.keys(initialState.placedCounters).length).toBe(6);
    expect(initialState.leftoverCounterId).toBe(7);
    expect(initialState.predictionChoice).toBe("even");
    expect(initialState.challengeNumber).toBe(23);
  });

  it("handles SET_NUMBER and updates state and parity", () => {
    let state = proofReducer(initialState, { type: "SET_NUMBER", payload: 8 });
    expect(state.n).toBe(8);
    expect(Object.keys(state.placedCounters).length).toBe(8);
    expect(state.leftoverCounterId).toBeNull();

    state = proofReducer(state, { type: "SET_NUMBER", payload: 3 });
    expect(state.n).toBe(3);
    expect(Object.keys(state.placedCounters).length).toBe(2);
    expect(state.leftoverCounterId).toBe(3);
  });

  it("handles CLEAR_ALL and returns all counters to pool", () => {
    const cleared = proofReducer(initialState, { type: "CLEAR_ALL" });
    expect(Object.keys(cleared.placedCounters).length).toBe(0);
    expect(cleared.leftoverCounterId).toBeNull();
    expect(cleared.unplacedOrder.length).toBe(7);
  });

  it("handles AUTO_PAIR_STEP iteratively", () => {
    let state = proofReducer(initialState, { type: "CLEAR_ALL" });
    expect(state.unplacedOrder.length).toBe(7);

    // Place counter 1
    state = proofReducer(state, { type: "AUTO_PAIR_STEP" });
    expect(state.placedCounters[1]).toEqual({ slotIndex: 0, socketIndex: 0 });

    // Place counter 2
    state = proofReducer(state, { type: "AUTO_PAIR_STEP" });
    expect(state.placedCounters[2]).toEqual({ slotIndex: 0, socketIndex: 1 });
  });

  it("handles undo and redo deterministically", () => {
    let state = proofReducer(initialState, { type: "SET_NUMBER", payload: 10 });
    expect(state.n).toBe(10);
    expect(state.history.length).toBe(1);

    state = proofReducer(state, { type: "UNDO" });
    expect(state.n).toBe(7);
    expect(state.future.length).toBe(1);

    state = proofReducer(state, { type: "REDO" });
    expect(state.n).toBe(10);
  });

  it("evaluates prediction and challenge answers correctly", () => {
    let state = proofReducer(initialState, { type: "SELECT_PREDICTION", payload: "even" });
    state = proofReducer(state, { type: "REVEAL_PREDICTION" });
    expect(state.predictionRevealed).toBe(true);
    expect(state.predictionFeedback).toContain("14 is Even");

    state = proofReducer(state, { type: "SET_CHALLENGE_LEFTOVER", payload: 1 });
    state = proofReducer(state, { type: "CHECK_CHALLENGE" });
    expect(state.challengeChecked).toBe(true);
    expect(state.challengeCorrect).toBe(true);
  });
});

describe("Visual Proof 073: Completion & Pedagogical Integrity", () => {
  it("evaluates proof progress accurately", () => {
    const prog = evaluateProofProgress(initialState);
    expect(prog.inspectCompleted).toBe(true);
    expect(prog.manipulateCompleted).toBe(true);
    expect(prog.completionScore).toBeGreaterThanOrEqual(50);
  });

  it("has complete configuration metadata and 5 hint tiers", () => {
    expect(PROOF_META.id).toBe("even-odd-pairing");
    expect(PROOF_STEPS.length).toBe(6);
    expect(HINTS.length).toBe(5);
    expect(DEFAULT_CHALLENGE.number).toBe(23);
  });
});
