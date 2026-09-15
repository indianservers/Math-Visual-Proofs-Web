import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/number-theory/primes-non-rectangular-arrays/proof.config";

describe("Prime Numbers as Non-Rectangular Arrays", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("primes-non-rectangular-arrays");
  });
});
