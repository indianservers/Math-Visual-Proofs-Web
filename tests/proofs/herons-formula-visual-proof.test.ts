import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/geometry/herons-formula-visual-proof/proof.config";

describe("Heron's Formula", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("herons-formula-visual-proof");
  });
});
