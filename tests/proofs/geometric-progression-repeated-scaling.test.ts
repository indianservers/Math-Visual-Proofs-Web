import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/sequences-and-series/geometric-progression-repeated-scaling/proof.config";

describe("Geometric Progression as Repeated Scaling", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("geometric-progression-repeated-scaling");
  });
});
