import { describe, expect, it } from "vitest";
import { expandDistributive } from "../../app/visual-proofs/algebraic-identities/distributive-law-area-model/distributiveMath";
import { proofConfig } from "../../app/visual-proofs/algebraic-identities/distributive-law-area-model/proof.config";

describe("Distributive Law Area Model", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("distributive-law-area-model");
  });

  it("expands (a+b)(c+d) into four products", () => {
    const model = expandDistributive(2, 3, 4, 5);
    expect(model.ac).toBe(8);
    expect(model.ad).toBe(10);
    expect(model.bc).toBe(12);
    expect(model.bd).toBe(15);
    expect(model.total).toBe(45);
  });
});
