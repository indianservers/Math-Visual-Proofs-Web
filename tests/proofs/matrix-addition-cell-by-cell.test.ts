import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/matrices-linear-algebra/matrix-addition-cell-by-cell/proof.config";

describe("Matrix Addition as Cell-by-Cell Addition", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("matrix-addition-cell-by-cell");
  });
});
