import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/algebraic-identities/square-of-sum/proof.config";

describe("Square of a Sum: (a + b)^2", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("square-of-sum");
  });
});
