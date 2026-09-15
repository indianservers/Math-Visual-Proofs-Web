import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/mensuration/sphere-surface-area-volume/proof.config";

describe("Sphere Surface Area and Volume", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("sphere-surface-area-volume");
  });
});
