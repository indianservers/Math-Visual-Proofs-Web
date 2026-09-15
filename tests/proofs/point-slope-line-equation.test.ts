import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/coordinate-geometry/point-slope-line-equation/proof.config";

describe("Point-Slope Form of a Line", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("point-slope-line-equation");
  });
});
