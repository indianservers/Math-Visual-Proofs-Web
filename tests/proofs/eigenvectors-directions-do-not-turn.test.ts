import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/matrices-linear-algebra/eigenvectors-directions-do-not-turn/proof.config";

describe("Eigenvectors as Directions That Do Not Turn", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("eigenvectors-directions-do-not-turn");
  });
});
