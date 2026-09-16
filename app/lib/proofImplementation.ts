import { z } from "zod";

export const proofImplementationStatusSchema = z.enum([
  "planned",
  "in-development",
  "interactive",
  "verified",
]);

export const proofImplementationManifestSchema = z.object({
  version: z.literal(1),
  proofId: z.string().min(1),
  categorySlug: z.string().min(1),
  slug: z.string().min(1),
  route: z.string().startsWith("/"),
  status: proofImplementationStatusSchema,
  owner: z.string().min(1).optional(),
  notes: z.string().optional(),
});

export type ProofImplementationStatus = z.infer<
  typeof proofImplementationStatusSchema
>;

export type ProofImplementationManifest = z.infer<
  typeof proofImplementationManifestSchema
>;

type ManifestModule = { default: unknown };

const manifestModules = import.meta.glob<ManifestModule>(
  "../proof-status/*.json",
  { eager: true },
);

export const PROOF_IMPLEMENTATIONS = Object.entries(manifestModules).map(
  ([file, module]) => {
    const parsed = proofImplementationManifestSchema.safeParse(module.default);
    if (!parsed.success) {
      throw new Error(
        `Invalid proof implementation manifest ${file}: ${parsed.error.message}`,
      );
    }
    return parsed.data;
  },
);

const implementationByProofId = new Map<string, ProofImplementationManifest>();

for (const manifest of PROOF_IMPLEMENTATIONS) {
  if (implementationByProofId.has(manifest.proofId)) {
    throw new Error(`Duplicate implementation manifest for ${manifest.proofId}`);
  }
  implementationByProofId.set(manifest.proofId, manifest);
}

export function getProofImplementation(proofId: string) {
  return implementationByProofId.get(proofId) ?? null;
}
