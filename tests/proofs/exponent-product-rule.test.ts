import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/logarithms-exponents/exponent-product-rule/proof.config";

describe("Exponent Product Rule: a^m a^n = a^(m+n)", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("exponent-product-rule");
  });
});
