import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/coordinate-geometry/midpoint-formula/proof.config";

describe("Midpoint Formula", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("midpoint-formula");
  });
});
