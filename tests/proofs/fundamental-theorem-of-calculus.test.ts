import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/calculus/fundamental-theorem-of-calculus/proof.config";

describe("Fundamental Theorem of Calculus", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("fundamental-theorem-of-calculus");
  });
});
