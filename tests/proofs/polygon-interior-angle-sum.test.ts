import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/geometry/polygon-interior-angle-sum/proof.config";

describe("Sum of Interior Angles of a Polygon", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("polygon-interior-angle-sum");
  });
});
