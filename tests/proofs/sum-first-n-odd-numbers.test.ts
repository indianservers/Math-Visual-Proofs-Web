import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/sequences-and-series/sum-first-n-odd-numbers/proof.config";

describe("Sum of First n Odd Numbers", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("sum-first-n-odd-numbers");
  });
});
