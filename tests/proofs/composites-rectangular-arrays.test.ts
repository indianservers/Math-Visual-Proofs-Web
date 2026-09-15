import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/number-theory/composites-rectangular-arrays/proof.config";

describe("Composite Numbers as Rectangular Arrays", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("composites-rectangular-arrays");
  });
});
