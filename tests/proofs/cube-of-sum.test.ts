import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/algebraic-identities/cube-of-sum/proof.config";

describe("Cube of a Sum: (a + b)^3", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("cube-of-sum");
  });
});
