import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/number-theory/irrationality-of-square-root-2/proof.config";

describe("Why sqrt(2) is Irrational", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("irrationality-of-square-root-2");
  });
});
