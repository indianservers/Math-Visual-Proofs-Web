import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/trigonometry/trig-graphs-from-unit-circle/proof.config";

describe("Trigonometric Graphs from the Unit Circle", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("trig-graphs-from-unit-circle");
  });
});
