import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/coordinate-geometry/slope-intercept-line-equation/proof.config";

describe("Equation of a Line: y = mx + c", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("slope-intercept-line-equation");
  });
});
