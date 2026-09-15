import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/algebraic-identities/difference-of-squares/proof.config";

describe("Difference of Squares: a^2 - b^2", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("difference-of-squares");
  });
});
