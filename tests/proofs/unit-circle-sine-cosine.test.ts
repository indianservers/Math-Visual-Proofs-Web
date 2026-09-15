import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/trigonometry/unit-circle-sine-cosine/proof.config";

describe("Sine and Cosine on the Unit Circle", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("unit-circle-sine-cosine");
  });
});
