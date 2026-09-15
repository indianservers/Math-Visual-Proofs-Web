import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/sequences-and-series/arithmetic-progression-equal-steps/proof.config";

describe("Arithmetic Progression as Equal Steps", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("arithmetic-progression-equal-steps");
  });
});
