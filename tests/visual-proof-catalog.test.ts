import { describe, expect, it } from "vitest";
import {
  ALL_VISUAL_PROOFS,
  VISUAL_PROOF_CATEGORIES,
  catalogProofRoute,
  getCatalogProof,
} from "../app/lib/visualProofCatalog";

describe("visual proof catalog", () => {
  it("registers all supplied proofs and categories", () => {
    expect(ALL_VISUAL_PROOFS).toHaveLength(223);
    expect(VISUAL_PROOF_CATEGORIES).toHaveLength(19);
  });

  it("gives every proof a unique dedicated route", () => {
    const routes = ALL_VISUAL_PROOFS.map(catalogProofRoute);
    expect(new Set(routes).size).toBe(ALL_VISUAL_PROOFS.length);
    for (const proof of ALL_VISUAL_PROOFS) {
      expect(getCatalogProof(proof.categorySlug, proof.slug)?.id).toBe(
        proof.id,
      );
    }
  });

  it("keeps category proof counts consistent", () => {
    for (const category of VISUAL_PROOF_CATEGORIES) {
      const actual = ALL_VISUAL_PROOFS.filter(
        (proof) => proof.categorySlug === category.slug,
      ).length;
      expect(actual).toBe(category.actualProofCount);
    }
  });
});
