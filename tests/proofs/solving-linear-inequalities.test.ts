import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/inequalities/solving-linear-inequalities/proof.config";

describe("Solving Linear Inequalities", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("solving-linear-inequalities");
  });
});
