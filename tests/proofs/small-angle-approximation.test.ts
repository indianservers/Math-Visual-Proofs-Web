import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/trigonometry/small-angle-approximation/proof.config";

describe("Small Angle Approximation: sin theta is approximately theta", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("small-angle-approximation");
  });
});
