import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/calculus/derivative-of-exponential/proof.config";

describe("Derivative of e^x", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("derivative-of-exponential");
  });
});
