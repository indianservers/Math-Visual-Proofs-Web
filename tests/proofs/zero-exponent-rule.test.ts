import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/logarithms-exponents/zero-exponent-rule/proof.config";

describe("Zero Exponent Rule: a^0 = 1", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("zero-exponent-rule");
  });
});
