import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/inequalities/compound-inequalities-intervals/proof.config";

describe("Compound Inequalities and Intervals", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("compound-inequalities-intervals");
  });
});
