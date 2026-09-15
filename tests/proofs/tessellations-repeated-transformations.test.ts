import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/transformations-symmetry/tessellations-repeated-transformations/proof.config";

describe("Tessellations by Repeated Transformations", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("tessellations-repeated-transformations");
  });
});
