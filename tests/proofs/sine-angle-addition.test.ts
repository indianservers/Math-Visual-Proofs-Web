import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/trigonometry/sine-angle-addition/proof.config";

describe("Angle Addition Formula for Sine", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("sine-angle-addition");
  });
});
