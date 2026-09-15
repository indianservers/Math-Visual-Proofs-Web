import { describe, it, expect } from "vitest";
import {
  u,
  uPrime,
  v,
  vPrime,
  computeProductGeometry,
  integrationByPartsValues,
  snapX,
  clamp,
  formatX,
  simpsonIntegral,
  computeTangentLine,
  computeSecantLine,
  computeApproximationStrips,
} from "./integration-by-parts-visual-proofMath";
import {
  initialState,
  proofReducer,
} from "./integration-by-parts-visual-proofReducer";
import { evaluateProofProgress } from "./integration-by-parts-visual-proofCompletion";

describe("Integration by Parts - Mathematical Calculations", () => {
  it("computes u(x) and its derivative correctly", () => {
    expect(u(0)).toBe(0);
    expect(u(2)).toBe(4);
    expect(uPrime(0)).toBe(0);
    expect(uPrime(3)).toBe(6);
  });

  it("computes v(x) and v'(x) correctly with lower bound a=0", () => {
    expect(v(0, 0)).toBeCloseTo(0, 5);
    expect(v(Math.PI / 2, 0)).toBeCloseTo(1, 5);
    expect(v(Math.PI, 0)).toBeCloseTo(0, 5);
    expect(vPrime(0)).toBeCloseTo(1, 5);
    expect(vPrime(Math.PI / 2)).toBeCloseTo(0, 5);
    expect(vPrime(Math.PI)).toBeCloseTo(-1, 5);
  });

  it("verifies the analytical Integration by Parts formula on [0, pi]", () => {
    const res = integrationByPartsValues(0, Math.PI);
    expect(res.uvBoundary).toBeCloseTo(0, 4);
    // Analytical integral of x^2 cos(x) from 0 to pi is -2*pi ≈ -6.283185
    expect(res.integralUDv).toBeCloseTo(-2 * Math.PI, 3);
    // Analytical integral of 2x sin(x) from 0 to pi is 2*pi ≈ 6.283185
    expect(res.integralVDu).toBeCloseTo(2 * Math.PI, 3);
    // Check [uv] - int(v du) == int(u dv) => 0 - 2pi == -2pi
    expect(res.difference).toBeLessThan(1e-3);
    expect(res.isValid).toBe(true);
  });

  it("accurately integrates with Simpson's rule", () => {
    // Integral of x^2 from 0 to 3 should be 9
    const val = simpsonIntegral(0, 3, (x) => x * x, 100);
    expect(val).toBeCloseTo(9, 5);
  });

  it("computes product geometry decomposition", () => {
    const geom = computeProductGeometry(0, 1.5, Math.PI);
    expect(geom.u1).toBe(0);
    expect(geom.u2).toBeCloseTo(2.25, 4);
    expect(geom.v1).toBeCloseTo(0, 4);
    expect(geom.v2).toBeCloseTo(Math.sin(1.5), 4);
    expect(geom.totalArea).toBeCloseTo(geom.u2 * geom.v2, 4);
  });

  it("computes tangent and secant lines", () => {
    const tangent = computeTangentLine(1, u, uPrime, 0.2);
    expect(tangent.x1).toBeCloseTo(0.8);
    expect(tangent.x2).toBeCloseTo(1.2);

    const secant = computeSecantLine(0, 2, u);
    expect(secant.y1).toBe(0);
    expect(secant.y2).toBe(4);
  });

  it("computes approximation strips for motion model", () => {
    const strips = computeApproximationStrips(0, 2, 4);
    expect(strips.length).toBe(4);
    expect(strips[0].width).toBeCloseTo(0.5);
  });

  it("snaps to key points when enabled and clamps correctly", () => {
    // Close to pi/2 (~1.5707)
    const snapped = snapX(1.55, 0, Math.PI, true);
    expect(snapped).toBeCloseTo(Math.PI / 2, 2);

    const nonSnapped = snapX(1.3, 0, Math.PI, false);
    expect(nonSnapped).toBeCloseTo(1.3, 2);

    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
    expect(formatX(Math.PI)).toBe("π");
    expect(formatX(Math.PI / 2)).toBe("π/2");
  });
});

describe("Integration by Parts - Reducer & State Transitions", () => {
  it("initializes with expected default values", () => {
    expect(initialState.a).toBe(0);
    expect(initialState.b).toBeCloseTo(Math.PI, 4);
    expect(initialState.x).toBe(1.78);
    expect(initialState.showLabels).toBe(true);
    expect(initialState.snapEnabled).toBe(true);
    expect(initialState.graphView).toBe("curve");
    expect(initialState.activeStep).toBe(0);
  });

  it("handles SET_X and records history", () => {
    const s1 = proofReducer(initialState, { type: "SET_X", value: 2.1, recordHistory: true });
    expect(s1.x).toBeCloseTo(2.1, 2);
    expect(s1.history.length).toBe(1);

    // Undo returns to previous x
    const s2 = proofReducer(s1, { type: "UNDO" });
    expect(s2.x).toBe(initialState.x);

    // Redo restores new x
    const s3 = proofReducer(s2, { type: "REDO" });
    expect(s3.x).toBeCloseTo(2.1, 2);
  });

  it("handles NUDGE_X keyboard navigation", () => {
    const s1 = proofReducer(initialState, { type: "NUDGE_X", delta: 0.1 });
    expect(s1.x).toBeGreaterThan(initialState.x);
  });

  it("toggles labels and snap settings", () => {
    const s1 = proofReducer(initialState, { type: "TOGGLE_LABELS" });
    expect(s1.showLabels).toBe(false);

    const s2 = proofReducer(s1, { type: "TOGGLE_SNAP" });
    expect(s2.snapEnabled).toBe(false);
  });

  it("changes graph view modes", () => {
    const s1 = proofReducer(initialState, { type: "SET_GRAPH_VIEW", value: "tangent" });
    expect(s1.graphView).toBe("tangent");

    const s2 = proofReducer(s1, { type: "SET_GRAPH_VIEW", value: "strips" });
    expect(s2.graphView).toBe("strips");
  });

  it("evaluates quiz choices and reveals feedback", () => {
    // Correct choice
    const s1 = proofReducer(initialState, { type: "SET_QUIZ", value: "a" });
    const s2 = proofReducer(s1, { type: "REVEAL_QUIZ" });
    expect(s2.quizRevealed).toBe(true);
    expect(s2.misconceptionMessage).toBeNull();

    // Wrong choice with plus sign misconception
    const s3 = proofReducer(initialState, { type: "SET_QUIZ", value: "b" });
    const s4 = proofReducer(s3, { type: "REVEAL_QUIZ" });
    expect(s4.quizRevealed).toBe(true);
    expect(s4.misconceptionMessage).toContain("Watch the sign");
  });

  it("handles challenge check and step progression", () => {
    const s1 = proofReducer(initialState, { type: "CHECK_CHALLENGE" });
    expect(s1.challengeChecked).toBe(true);
    expect(s1.activeStep).toBeGreaterThanOrEqual(5);
  });

  it("handles animation lifecycle", () => {
    const s1 = proofReducer(initialState, { type: "START_ANIMATION" });
    expect(s1.isPlayingAnimation).toBe(true);

    const s2 = proofReducer(s1, { type: "TICK_ANIMATION", dt: 0.5 });
    expect(s2.x).toBeGreaterThan(s1.x);

    const s3 = proofReducer(s2, { type: "PAUSE_ANIMATION" });
    expect(s3.isPlayingAnimation).toBe(false);
  });

  it("resets all state to initial", () => {
    const s1 = proofReducer(initialState, { type: "SET_X", value: 2.5, recordHistory: true });
    const s2 = proofReducer(s1, { type: "RESET_ALL" });
    expect(s2.x).toBe(initialState.x);
    expect(s2.history.length).toBe(0);
  });
});

describe("Integration by Parts - Proof Completion Logic", () => {
  it("calculates progression score properly", () => {
    const initialProgress = evaluateProofProgress(initialState);
    expect(initialProgress.inspectCompleted).toBe(true);
    expect(initialProgress.completionScore).toBeGreaterThanOrEqual(16);

    const completeState = {
      ...initialState,
      activeStep: 5,
      quizChoice: "a",
      quizRevealed: true,
      challengeChecked: true,
    };
    const finalProgress = evaluateProofProgress(completeState);
    expect(finalProgress.allCompleted).toBe(true);
    expect(finalProgress.completionScore).toBe(100);
    expect(finalProgress.unlockedOutcomes.length).toBe(3);
  });
});
