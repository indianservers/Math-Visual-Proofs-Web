import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/trigonometry/triangle-area-sine-formula/proof.config";

describe("Area of a Triangle Using Sine: A = 1/2 ab sin C", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("triangle-area-sine-formula");
  });
});
