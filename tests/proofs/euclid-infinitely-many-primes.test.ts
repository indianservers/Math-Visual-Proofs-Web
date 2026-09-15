import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/number-theory/euclid-infinitely-many-primes/proof.config";

describe("Euclid's Proof of Infinitely Many Primes", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("euclid-infinitely-many-primes");
  });
});
