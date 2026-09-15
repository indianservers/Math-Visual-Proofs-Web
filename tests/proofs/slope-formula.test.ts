import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/coordinate-geometry/slope-formula/proof.config";

describe("Slope Formula", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("slope-formula");
  });
});
