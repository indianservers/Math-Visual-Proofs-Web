import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/ratios/cross-multiplication-equal-rectangles/proof.config";

describe("Cross Multiplication as Equal Rectangles", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("cross-multiplication-equal-rectangles");
  });
});
