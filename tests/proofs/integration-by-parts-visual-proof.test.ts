import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/calculus/integration-by-parts-visual-proof/proof.config";

describe("Integration by Parts", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("integration-by-parts-visual-proof");
  });
});
