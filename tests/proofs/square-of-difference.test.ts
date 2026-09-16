import { describe, expect, it } from "vitest";
import {
  expandSquareOfDifference,
  isValidPair,
} from "../../app/visual-proofs/algebraic-identities/square-of-difference/squareDiffMath";
import { proofConfig } from "../../app/visual-proofs/algebraic-identities/square-of-difference/proof.config";

describe("Square of a Difference", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("square-of-difference");
  });

  it("expands (a-b)^2 visually", () => {
    expect(isValidPair(10, 3)).toBe(true);
    const model = expandSquareOfDifference(10, 3);
    expect(model.leftover).toBe(49);
    expect(model.identity).toBe(true);
  });
});
