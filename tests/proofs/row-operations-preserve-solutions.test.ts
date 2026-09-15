import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/matrices-linear-algebra/row-operations-preserve-solutions/proof.config";

describe("Row Operations Preserve Solution Set", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("row-operations-preserve-solutions");
  });
});
