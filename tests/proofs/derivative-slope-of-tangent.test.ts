import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/calculus/derivative-slope-of-tangent/proof.config";

describe("Derivative as Slope of Tangent", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("derivative-slope-of-tangent");
  });
});
