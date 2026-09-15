import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/engineering-mathematics/trapezoidal-rule-numerical-integration/proof.config";

describe("Numerical Integration: Trapezoidal Rule", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("trapezoidal-rule-numerical-integration");
  });
});
