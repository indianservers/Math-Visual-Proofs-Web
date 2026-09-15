import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/engineering-mathematics/gradient-steepest-increase/proof.config";

describe("Gradient and Direction of Steepest Increase", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("gradient-steepest-increase");
  });
});
