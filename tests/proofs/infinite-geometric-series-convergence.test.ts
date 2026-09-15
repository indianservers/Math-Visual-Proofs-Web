import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/sequences-and-series/infinite-geometric-series-convergence/proof.config";

describe("Infinite Geometric Series Convergence", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("infinite-geometric-series-convergence");
  });
});
