import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/conic-sections/hyperbola-difference-of-distances/proof.config";

describe("Hyperbola as Constant Difference of Distances", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("hyperbola-difference-of-distances");
  });
});
