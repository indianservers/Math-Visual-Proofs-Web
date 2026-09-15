import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/sequences-and-series/finite-geometric-series-sum/proof.config";

describe("Sum of Finite Geometric Series", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("finite-geometric-series-sum");
  });
});
