import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/sequences-and-series/square-numbers-odd-layers/proof.config";

describe("Square Numbers from Odd Number Layers", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("square-numbers-odd-layers");
  });
});
