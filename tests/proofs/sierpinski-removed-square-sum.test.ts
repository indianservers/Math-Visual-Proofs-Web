import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/sequences-and-series/sierpinski-removed-square-sum/proof.config";

describe("Sierpinski Removed Square Sum", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("sierpinski-removed-square-sum");
  });
});
