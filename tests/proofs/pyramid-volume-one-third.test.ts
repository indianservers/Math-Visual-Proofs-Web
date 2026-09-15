import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/mensuration/pyramid-volume-one-third/proof.config";

describe("Volume of a Pyramid: V = (1/3)Bh", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("pyramid-volume-one-third");
  });
});
