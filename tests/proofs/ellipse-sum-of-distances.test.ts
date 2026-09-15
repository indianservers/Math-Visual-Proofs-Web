import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/conic-sections/ellipse-sum-of-distances/proof.config";

describe("Ellipse as Constant Sum of Distances", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("ellipse-sum-of-distances");
  });
});
