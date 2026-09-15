import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/matrices-linear-algebra/determinant-area-scale-factor/proof.config";

describe("Determinant as Area Scale Factor", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("determinant-area-scale-factor");
  });
});
