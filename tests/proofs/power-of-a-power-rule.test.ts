import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/logarithms-exponents/power-of-a-power-rule/proof.config";

describe("Power of a Power: (a^m)^n = a^(mn)", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("power-of-a-power-rule");
  });
});
