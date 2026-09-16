import { describe, expect, it } from "vitest";
import {
  factorQuadratic,
  matchesFactorPair,
} from "../../app/visual-proofs/algebraic-identities/quadratic-factorization-area-model/factorMath";
import { proofConfig } from "../../app/visual-proofs/algebraic-identities/quadratic-factorization-area-model/proof.config";

describe("Quadratic Factorization Area Model", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("quadratic-factorization-area-model");
  });

  it("builds p and q from factor pair m,n", () => {
    const model = factorQuadratic(50, 70);
    expect(model.p).toBe(120);
    expect(model.q).toBe(3500);
    expect(matchesFactorPair(120, 3500, 50, 70)).toBe(true);
    expect(matchesFactorPair(120, 3500, 40, 80)).toBe(false);
  });
});
