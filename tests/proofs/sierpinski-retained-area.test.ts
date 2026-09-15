import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/sequences-and-series/sierpinski-retained-area/proof.config";

describe("Sierpinski Carpet Retained Area", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("sierpinski-retained-area");
  });
});
