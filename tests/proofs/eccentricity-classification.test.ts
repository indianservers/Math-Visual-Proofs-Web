import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/conic-sections/eccentricity-classification/proof.config";

describe("Eccentricity: Circle, Ellipse, Parabola, Hyperbola", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("eccentricity-classification");
  });
});
