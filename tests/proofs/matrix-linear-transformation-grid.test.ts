import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/matrices-linear-algebra/matrix-linear-transformation-grid/proof.config";

describe("Matrix as Linear Transformation", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("matrix-linear-transformation-grid");
  });
});
