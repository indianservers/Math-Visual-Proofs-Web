import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/engineering-mathematics/first-order-differential-equation-slope-field/proof.config";

describe("First-Order Differential Equation: Slope Field", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("first-order-differential-equation-slope-field");
  });
});
