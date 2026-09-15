import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/coordinate-geometry/shoelace-formula/proof.config";

describe("Shoelace Formula", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("shoelace-formula");
  });
});
