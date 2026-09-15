import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/matrices-linear-algebra/linear-system-line-intersection/proof.config";

describe("Solving 2x2 Linear Systems as Line Intersection", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("linear-system-line-intersection");
  });
});
