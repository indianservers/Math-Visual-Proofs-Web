import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/logarithms-exponents/negative-exponent-rule/proof.config";

describe("Negative Exponent Rule: a^(-n) = 1 / a^n", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("negative-exponent-rule");
  });
});
