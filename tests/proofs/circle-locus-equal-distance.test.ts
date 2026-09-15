import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/conic-sections/circle-locus-equal-distance/proof.config";

describe("Circle as Equal Distance from Center", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("circle-locus-equal-distance");
  });
});
