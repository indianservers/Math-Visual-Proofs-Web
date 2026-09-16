import { describe, expect, it } from "vitest";
import {
  areaFraction,
  sectorAreaDegrees,
} from "../../app/visual-proofs/geometry/sector-area-formula/sectorMath";
import { proofConfig } from "../../app/visual-proofs/geometry/sector-area-formula/proof.config";

describe("Sector Area Formula", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("sector-area-formula");
  });

  it("uses angle fraction of the full circle", () => {
    const r = 10;
    expect(areaFraction(90)).toBeCloseTo(0.25);
    expect(sectorAreaDegrees(r, 90)).toBeCloseTo(0.25 * Math.PI * r * r);
  });
});
