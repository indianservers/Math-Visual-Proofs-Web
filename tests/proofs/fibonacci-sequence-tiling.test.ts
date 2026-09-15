import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/sequences-and-series/fibonacci-sequence-tiling/proof.config";

describe("Fibonacci Sequence by Tiling", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("fibonacci-sequence-tiling");
  });
});
