import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/inequalities/inequality-number-line/proof.config";

describe("Inequality on a Number Line", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("inequality-number-line");
  });
});
