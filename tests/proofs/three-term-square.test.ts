import { describe, expect, it } from "vitest";
import { expandThreeTermSquare } from "../../app/visual-proofs/algebraic-identities/three-term-square/threeTermMath";
import { proofConfig } from "../../app/visual-proofs/algebraic-identities/three-term-square/proof.config";

describe("Three-Term Square", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("three-term-square");
  });

  it("expands (a+b+c)^2 with doubled cross terms", () => {
    const model = expandThreeTermSquare(2, 3, 4);
    expect(model.squares).toBe(4 + 9 + 16);
    expect(model.cross).toBe(2 * 2 * 3 + 2 * 3 * 4 + 2 * 4 * 2);
    expect(model.total).toBe(81);
    expect(model.expanded).toBe(81);
  });
});
