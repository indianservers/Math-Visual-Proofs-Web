import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/sequences-and-series/sum-first-n-even-numbers/proof.config";

describe("Sum of First n Even Numbers: 2 + 4 + ... + 2n = n(n + 1)", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("even-number-sum");
  });
});
