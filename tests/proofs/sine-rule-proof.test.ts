import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/trigonometry/sine-rule-proof/proof.config";

describe("Sine Rule / Law of Sines", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("sine-rule-proof");
  });
});
