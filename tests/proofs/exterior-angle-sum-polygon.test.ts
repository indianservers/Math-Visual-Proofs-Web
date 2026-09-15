import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/geometry/exterior-angle-sum-polygon/proof.config";

describe("Exterior Angle Sum of a Polygon: 360 degrees", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("exterior-angle-sum-polygon");
  });
});
