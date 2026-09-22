import { describe, expect, it } from "vitest";
import { bayesCells, compoundAmount, distributions, drawSample, stepCompoundAmount, triangleMeasurements, vectorMetrics } from "../app/lib/phaseThreeMath";

describe("Phase 3 proof mathematics", () => {
  it("keeps all sine-rule ratios equal for an inscribed acute or obtuse triangle", () => {
    for (const angles of [[-1.5, .4, 2.5], [-2.8, -.1, 1.9]]) {
      const points = angles.map((angle) => ({ x: Math.cos(angle), y: Math.sin(angle) }));
      const values = triangleMeasurements(points[0], points[1], points[2], 1);
      for (const ratio of values.ratios) expect(ratio).toBeCloseTo(2, 9);
      expect(values.angles.reduce((sum, angle) => sum + angle, 0)).toBeCloseTo(Math.PI, 9);
    }
  });
  it("enforces Cauchy-Schwarz including equality and zero-vector cases", () => {
    for (const [u, v] of [[{ x: 1.6, y: 1.2 }, { x: 2.4, y: .8 }], [{ x: -3, y: 2 }, { x: 1, y: 4 }]]) {
      const result = vectorMetrics(u, v);
      expect(Math.abs(result.product)).toBeLessThanOrEqual(result.bound + 1e-10);
    }
    expect(vectorMetrics({ x: 3, y: 0 }, { x: -4, y: 0 }).equality).toBe(true);
    expect(vectorMetrics({ x: 0, y: 0 }, { x: 0, y: 4 }).projection).toEqual({ x: 0, y: 0 });
    expect(vectorMetrics({ x: 1, y: 2 }, { x: 0, y: 0 }).projection).toBeNull();
  });
  it("partitions probability exactly and handles impossible evidence", () => {
    const cells = bayesCells(.1, .8, .2);
    expect(cells.ab + cells.aNotB + cells.notAB + cells.notANotB).toBeCloseTo(1);
    expect(cells.posterior).toBeCloseTo(.08 / .26);
    expect(bayesCells(.5, 0, 0).posterior).toBeNull();
  });
  it("uses finite-variance source distributions and correct sampling formulas", () => {
    expect(distributions.bernoulli.sd ** 2).toBeCloseTo(.3 * .7);
    expect(distributions.bimodal.sd ** 2).toBeCloseTo(4.25);
    const sample = drawSample("exponential", 100, () => .5);
    expect(sample).toHaveLength(100);
    expect(sample[0]).toBeCloseTo(Math.log(2));
    expect(distributions.uniform.sd / Math.sqrt(36)).toBeCloseTo(Math.sqrt(1 / 12) / 6);
  });
  it("separates completed-period step growth from the continuous-time formula", () => {
    expect(compoundAmount(1, 1, 12, 1)).toBeCloseTo((1 + 1 / 12) ** 12);
    expect(stepCompoundAmount(1, 1, 2, .75)).toBeCloseTo(1.5);
    expect(compoundAmount(1, 1, 10000, 1)).toBeCloseTo(Math.E, 3);
  });
});
