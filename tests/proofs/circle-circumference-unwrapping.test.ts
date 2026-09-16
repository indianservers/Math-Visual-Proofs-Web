import { describe, expect, it } from "vitest";
import {
  circumference,
  isFullRotation,
  travelDistance,
} from "../../app/visual-proofs/geometry/circle-circumference-unwrapping/circumferenceMath";
import { proofConfig } from "../../app/visual-proofs/geometry/circle-circumference-unwrapping/proof.config";

describe("Circle Circumference by Rolling/Unwrapping", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("circle-circumference-unwrapping");
  });

  it("matches travel distance to circumference after one turn", () => {
    const r = 48;
    expect(travelDistance(r, 1)).toBeCloseTo(circumference(r));
    expect(isFullRotation(1)).toBe(true);
    expect(isFullRotation(0.5)).toBe(false);
  });
});
