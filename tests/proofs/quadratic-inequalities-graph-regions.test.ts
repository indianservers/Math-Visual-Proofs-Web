import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/inequalities/quadratic-inequalities-graph-regions/proof.config";

describe("Quadratic Inequalities by Graph Regions", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("quadratic-inequalities-graph-regions");
  });
});
