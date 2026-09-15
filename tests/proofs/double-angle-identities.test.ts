import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/trigonometry/double-angle-identities/proof.config";

describe("Double Angle Identities", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("double-angle-identities");
  });
});
