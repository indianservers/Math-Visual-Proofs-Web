import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/matrices-linear-algebra/matrix-inverse-undo-transformation/proof.config";

describe("Matrix Inverse as Undoing a Transformation", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("matrix-inverse-undo-transformation");
  });
});
