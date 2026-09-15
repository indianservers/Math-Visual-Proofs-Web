import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/conic-sections/directrix-focus-standard-equations/proof.config";

describe("Directrix, Focus, and Standard Equations", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("directrix-focus-standard-equations");
  });
});
