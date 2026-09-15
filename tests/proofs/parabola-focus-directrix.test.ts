import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/conic-sections/parabola-focus-directrix/proof.config";

describe("Parabola as Focus-Directrix Locus", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("parabola-focus-directrix");
  });
});
