import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/trigonometry/cosine-rule-proof/proof.config";

describe("Cosine Rule / Law of Cosines", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("cosine-rule-proof");
  });
});
