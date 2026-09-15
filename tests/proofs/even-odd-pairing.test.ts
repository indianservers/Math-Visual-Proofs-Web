import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/number-theory/even-odd-pairing/proof.config";

describe("Even and Odd Numbers as Pairing Patterns", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("even-odd-pairing");
  });
});
