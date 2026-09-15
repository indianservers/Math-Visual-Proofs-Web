import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/inequalities/am-gm-inequality/proof.config";

describe("AM-GM Inequality", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("am-gm-inequality");
  });
});
