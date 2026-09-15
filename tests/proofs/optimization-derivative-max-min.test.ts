import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/calculus/optimization-derivative-max-min/proof.config";

describe("Optimization: Maximum and Minimum from Derivative", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("optimization-derivative-max-min");
  });
});
