import { describe, expect, it } from "vitest";
import { demonstrateAmbiguity } from "../../app/visual-proofs/geometry/non-unique-solid-projections/nonUniqueMath";
import { proofConfig } from "../../app/visual-proofs/geometry/non-unique-solid-projections/proof.config";

describe("Non-Unique Solid Projections", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("non-unique-solid-projections");
  });

  it("shows matching views with different cube counts", () => {
    const demo = demonstrateAmbiguity();
    expect(demo.sameProjections).toBe(true);
    expect(demo.differentCounts).toBe(true);
    expect(demo.countA).toBe(7);
    expect(demo.countB).toBe(8);
  });
});
