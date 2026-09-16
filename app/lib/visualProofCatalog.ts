import catalogData from "../data/visual-proofs-detailed.json";
import { getProofFeel, readinessForStatus } from "./proofFeel";
import { getProofImplementation } from "./proofImplementation";

export type VisualProofCategory = {
  title: string;
  slug: string;
  description: string;
  difficultyRange: string;
  targetAudience: string;
  iconName: string;
  proofCount: number;
  status: string;
  actualProofCount: number;
};

export type CatalogVisualProof = {
  catalogNumber: number;
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  difficulty: string;
  tags: string[];
  estimatedTime: string;
  prerequisites: string[];
  learningOutcomes: string[];
  componentKey: string;
  categorySlug: string;
  level: string;
  route: string;
  status: string;
  proofLearningModel: string;
  proofUpgradeStatus: string;
  hasKeyboardControls: boolean;
  hasFormulaTokens: boolean;
  hasPredictionPrompt: boolean;
};

type VisualProofCatalog = {
  metadata: {
    title: string;
    description: string;
    totalVisualProofs: number;
    totalCategories: number;
  };
  categories: VisualProofCategory[];
  visualProofs: CatalogVisualProof[];
};

export const VISUAL_PROOF_CATALOG = catalogData as VisualProofCatalog;
export const VISUAL_PROOF_CATEGORIES = VISUAL_PROOF_CATALOG.categories;
export const ALL_VISUAL_PROOFS = VISUAL_PROOF_CATALOG.visualProofs;

export function catalogProofRoute(proof: CatalogVisualProof) {
  return `/visual-proofs/${proof.categorySlug}/${proof.slug}`;
}

export function interactiveRouteForProof(proof: CatalogVisualProof) {
  const implementation = getProofImplementation(proof.id);
  if (
    implementation?.status === "interactive" ||
    implementation?.status === "verified"
  ) {
    return implementation.route;
  }
  return null;
}

export function implementationStatusForProof(proof: CatalogVisualProof) {
  return getProofImplementation(proof.id)?.status ?? "planned";
}

export function readinessForProof(proof: CatalogVisualProof) {
  return readinessForStatus(getProofImplementation(proof.id)?.status);
}

export function proofFeelForProof(proof: CatalogVisualProof) {
  return getProofFeel(proof);
}

export function getCatalogProof(categorySlug: string, proofSlug: string) {
  return ALL_VISUAL_PROOFS.find(
    (proof) => proof.categorySlug === categorySlug && proof.slug === proofSlug,
  );
}

export function getCatalogCategory(categorySlug: string) {
  return VISUAL_PROOF_CATEGORIES.find(
    (category) => category.slug === categorySlug,
  );
}
