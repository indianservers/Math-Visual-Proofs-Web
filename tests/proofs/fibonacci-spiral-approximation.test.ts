import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/sequences-and-series/fibonacci-spiral-approximation/proof.config";

describe("Fibonacci Spiral Approximation", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("fibonacci-spiral-approximation");
  });
});
