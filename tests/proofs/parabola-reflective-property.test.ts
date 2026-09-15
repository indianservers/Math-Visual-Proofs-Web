import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/conic-sections/parabola-reflective-property/proof.config";

describe("Tangent and Reflective Property of Parabola", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("parabola-reflective-property");
  });
});
