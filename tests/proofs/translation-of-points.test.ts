import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/coordinate-geometry/translation-of-points/proof.config";

describe("Translation of Points", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("translation-of-points");
  });
});
