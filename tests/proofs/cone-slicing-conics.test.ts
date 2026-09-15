import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/conic-sections/cone-slicing-conics/proof.config";

describe("Conic Sections from Slicing a Cone", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("cone-slicing-conics");
  });
});
