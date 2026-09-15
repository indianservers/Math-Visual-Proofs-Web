import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/geometry/area-of-circle-by-unrolling/proof.config";

describe("Area of Circle by Unrolling Circumference", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("area-circle-unrolling");
  });
});
