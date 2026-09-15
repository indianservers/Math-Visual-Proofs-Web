import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/coordinate-geometry/circle-equation/proof.config";

describe("Equation of a Circle", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("circle-equation");
  });
});
