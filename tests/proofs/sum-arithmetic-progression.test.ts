import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/sequences-and-series/sum-arithmetic-progression/proof.config";

describe("Sum of Arithmetic Progression", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("sum-arithmetic-progression");
  });
});
