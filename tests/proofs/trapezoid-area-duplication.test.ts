import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/geometry/trapezoid-area-duplication/proof.config";

describe("Area of Trapezoid / Trapezium by Duplication", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("trapezoid-area-duplication");
  });
});
