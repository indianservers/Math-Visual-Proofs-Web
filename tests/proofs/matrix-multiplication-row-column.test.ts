import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/matrices-linear-algebra/matrix-multiplication-row-column/proof.config";

describe("Matrix Multiplication as Row-by-Column Dot Product", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("matrix-multiplication-row-column");
  });
});
