import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/logarithms-exponents/exponent-quotient-rule/proof.config";

describe("Exponent Quotient Rule: a^m / a^n = a^(m-n)", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("exponent-quotient-rule");
  });
});
