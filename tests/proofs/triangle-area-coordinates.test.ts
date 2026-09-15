import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/coordinate-geometry/triangle-area-coordinates/proof.config";

describe("Area of Triangle Using Coordinates", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("triangle-area-coordinates");
  });
});
