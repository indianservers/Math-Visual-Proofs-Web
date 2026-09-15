import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/calculus/derivative-of-sine/proof.config";

describe("Derivative of sin x", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("derivative-of-sine");
  });
});
