import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/coordinate-geometry/parallel-lines-slope/proof.config";

describe("Parallel Lines Have Equal Slopes", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("parallel-lines-slope");
  });
});
