import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/sequences-and-series/triangular-numbers/proof.config";

describe("Triangular Numbers", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("triangular-numbers");
  });
});
