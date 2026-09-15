import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/number-theory/divisibility-equal-grouping/proof.config";

describe("Divisibility as Equal Grouping", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("divisibility-equal-grouping");
  });
});
