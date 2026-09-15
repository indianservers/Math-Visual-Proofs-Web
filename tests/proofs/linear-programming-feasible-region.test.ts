import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/engineering-mathematics/linear-programming-feasible-region/proof.config";

describe("Linear Programming Feasible Region", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("linear-programming-feasible-region");
  });
});
