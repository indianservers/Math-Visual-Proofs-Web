import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/trigonometry/law-of-cosines-circle-construction/proof.config";

describe("Law of Cosines Circle Construction", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("law-of-cosines-circle-construction");
  });
});
