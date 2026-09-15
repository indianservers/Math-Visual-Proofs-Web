import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/trigonometry/complementary-angle-identities/proof.config";

describe("Complementary Angle Identities", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("complementary-angle-identities");
  });
});
