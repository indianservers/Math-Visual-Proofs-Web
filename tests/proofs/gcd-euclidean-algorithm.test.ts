import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/number-theory/gcd-euclidean-algorithm/proof.config";

describe("GCD by Euclidean Algorithm", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("gcd-euclidean-algorithm");
  });
});
