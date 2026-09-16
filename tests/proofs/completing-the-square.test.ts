import { describe, expect, it } from "vitest";
import { completeTheSquare } from "../../app/visual-proofs/algebraic-identities/completing-the-square/completeSquareMath";
import { proofConfig } from "../../app/visual-proofs/algebraic-identities/completing-the-square/proof.config";

describe("Completing the Square", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("completing-the-square");
  });

  it("adds the missing corner (b/2)^2", () => {
    const model = completeTheSquare(10, 6);
    expect(model.half).toBe(3);
    expect(model.corner).toBe(9);
    expect(model.completed).toBe(169);
    expect(model.identity).toBe(true);
  });
});
