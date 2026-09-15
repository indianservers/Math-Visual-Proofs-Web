import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/number-theory/lcm-grid-alignment/proof.config";

describe("LCM by Grid Alignment", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("lcm-grid-alignment");
  });
});
