import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/inequalities/triangle-inequality/proof.config";

describe("Triangle Inequality", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("triangle-inequality");
  });
});
