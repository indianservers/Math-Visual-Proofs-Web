import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/number-theory/fundamental-theorem-arithmetic-factor-trees/proof.config";

describe("Fundamental Theorem of Arithmetic through Factor Trees", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("fundamental-theorem-arithmetic-factor-trees");
  });
});
