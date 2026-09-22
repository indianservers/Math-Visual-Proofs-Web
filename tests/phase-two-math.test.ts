import { describe, expect, it } from "vitest";
import { choose, evaluateTaylor, geometricPartial, meanValuePoints, powerQuotientTerms, taylorCoefficients } from "../app/lib/phaseTwoMath";

describe("Phase 2 proof mathematics", () => {
  it("expands the power-rule difference quotient and leaves the derivative at h=0", () => {
    for (let n = 1; n <= 8; n++) {
      const terms = powerQuotientTerms(n, 1.2, .15);
      expect(terms.reduce((sum, term) => sum + term, 0)).toBeCloseTo(((1.35 ** n) - 1.2 ** n) / .15, 7);
      expect(powerQuotientTerms(n, 1.2, 0)[0]).toBeCloseTo(n * 1.2 ** (n - 1));
    }
  });
  it("matches Taylor coefficients and evaluates near the center", () => {
    expect(taylorCoefficients("exp", 0, 3)).toEqual([1, 1, .5, 1 / 6]);
    expect(taylorCoefficients("log", 0, 3)).toEqual([0, 1, -.5, 1 / 3]);
    expect(evaluateTaylor(taylorCoefficients("sin", 0, 9), .2, 0)).toBeCloseTo(Math.sin(.2), 9);
  });
  it("finds every MVT point in the standard cubic example", () => {
    const roots = meanValuePoints("cubic", -2, 2);
    expect(roots).toHaveLength(2);
    expect(roots[0]).toBeCloseTo(-Math.sqrt(4 / 3), 4);
    expect(roots[1]).toBeCloseTo(Math.sqrt(4 / 3), 4);
    expect(meanValuePoints("quadratic", 1, 3)).toEqual([2]);
  });
  it("calculates finite geometric sums and Pascal coefficients", () => {
    expect(geometricPartial(.5, 5)).toBeCloseTo(1.9375);
    expect(choose(6, 2)).toBe(15);
    for (let n = 0; n <= 10; n++) expect(Array.from({ length: n + 1 }, (_, k) => choose(n, k)).reduce((a, b) => a + b, 0)).toBe(2 ** n);
  });
});
