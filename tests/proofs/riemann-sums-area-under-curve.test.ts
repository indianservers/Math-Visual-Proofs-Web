import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/calculus/riemann-sums-area-under-curve/proof.config";

describe("Area Under a Curve by Riemann Sums", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("riemann-sums-area-under-curve");
  });
});
