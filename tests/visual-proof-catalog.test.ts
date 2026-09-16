import { describe, expect, it } from "vitest";
import {
  getProofFeel,
  getProofFeelById,
  readinessForStatus,
  readinessLabel,
} from "../app/lib/proofFeel";
import {
  ALL_VISUAL_PROOFS,
  VISUAL_PROOF_CATEGORIES,
  catalogProofRoute,
  getCatalogProof,
  readinessForProof,
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

  it("maps planned and in-development to Upcoming for users", () => {
    expect(readinessLabel(readinessForStatus("planned"))).toBe("Upcoming");
    expect(readinessLabel(readinessForStatus("in-development"))).toBe(
      "Upcoming",
    );
    expect(readinessLabel(readinessForStatus(null))).toBe("Upcoming");
    expect(readinessLabel(readinessForStatus("interactive"))).toBe(
      "Interactive",
    );
    expect(readinessLabel(readinessForStatus("verified"))).toBe(
      "Visually verified",
    );
  });

  it("gives every proof a unique proof-feel cue", () => {
    const ahas = ALL_VISUAL_PROOFS.map(
      (proof) => getProofFeel(proof).provedWhen,
    );
    const enhancements = ALL_VISUAL_PROOFS.map(
      (proof) => getProofFeel(proof).uxEnhancement,
    );
    expect(new Set(ahas).size).toBe(ALL_VISUAL_PROOFS.length);
    expect(new Set(enhancements).size).toBe(ALL_VISUAL_PROOFS.length);
    for (const proof of ALL_VISUAL_PROOFS) {
      const feel = getProofFeel(proof);
      expect(feel.methodLabel.length).toBeGreaterThan(0);
      expect(feel.doThis.length).toBeGreaterThan(0);
      expect(feel.uxEnhancement.length).toBeGreaterThan(0);
      expect(getProofFeelById(proof.id)?.proofId).toBe(proof.id);
      expect(["upcoming", "interactive", "verified"]).toContain(
        readinessForProof(proof),
      );
    }
  });
});
