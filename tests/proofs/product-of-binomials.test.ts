import { describe, expect, it } from "vitest";
import { expandBinomialProduct } from "../../app/visual-proofs/algebraic-identities/product-of-binomials/binomialMath";
import { proofConfig } from "../../app/visual-proofs/algebraic-identities/product-of-binomials/proof.config";

describe("Product of Binomials", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("product-of-binomials");
  });

  it("expands (x+a)(x+b) into four area terms", () => {
    const model = expandBinomialProduct(10, 3, 4);
    expect(model.x2).toBe(100);
    expect(model.ax).toBe(30);
    expect(model.bx).toBe(40);
    expect(model.ab).toBe(12);
    expect(model.total).toBe(182);
    expect(model.expanded).toBe(182);
  });
});
