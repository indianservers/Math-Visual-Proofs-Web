import type { Metadata } from "next";
import { z } from "zod";

const proofDefinitionSchema = z.object({
  id: z.string().min(1),
  route: z.string().startsWith("/proofs/"),
  title: z.string().min(1),
  shortTitle: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  minutes: z.number().int().positive(),
  interaction: z.enum(["rearrange", "drag", "dock", "extend", "resize"]),
});

export type ProofDefinition = z.infer<typeof proofDefinitionSchema>;

export const PROOF_DEFINITIONS = z.array(proofDefinitionSchema).parse([
  {
    id: "pythagorean-theorem",
    route: "/proofs/pythagorean-theorem",
    title: "Pythagorean Theorem",
    shortTitle: "Pythagorean",
    description: "Rearrange four right triangles to prove a² + b² = c².",
    category: "Geometry",
    difficulty: "Intermediate",
    minutes: 10,
    interaction: "rearrange",
  },
  {
    id: "triangle-area",
    route: "/proofs/triangle-area",
    title: "Area of a Triangle",
    shortTitle: "Triangle Area",
    description:
      "See why a triangle has half the area of a matching rectangle.",
    category: "Geometry",
    difficulty: "Beginner",
    minutes: 7,
    interaction: "drag",
  },
  {
    id: "triangle-angle-sum",
    route: "/proofs/triangle-angle-sum",
    title: "Angle Sum of a Triangle",
    shortTitle: "Angle Sum",
    description: "Lift three corner angles to make a straight angle of 180°.",
    category: "Geometry",
    difficulty: "Intermediate",
    minutes: 10,
    interaction: "dock",
  },
  {
    id: "exterior-angle-theorem",
    route: "/proofs/exterior-angle-theorem",
    title: "Exterior Angle Theorem",
    shortTitle: "Exterior Angle",
    description: "Extend a triangle side to prove the exterior-angle theorem.",
    category: "Geometry",
    difficulty: "Intermediate",
    minutes: 8,
    interaction: "extend",
  },
  {
    id: "similar-triangles",
    route: "/proofs/similar-triangles",
    title: "Similar Triangles and Proportional Sides",
    shortTitle: "Similar Triangles",
    description:
      "Resize a similar triangle and observe proportional corresponding sides.",
    category: "Geometry",
    difficulty: "Intermediate",
    minutes: 9,
    interaction: "resize",
  },
] satisfies ProofDefinition[]);

export function getProofDefinition(id: string) {
  const proof = PROOF_DEFINITIONS.find((item) => item.id === id);
  if (!proof) throw new Error(`Unknown visual proof: ${id}`);
  return proof;
}

export function metadataForProof(id: string): Metadata {
  const proof = getProofDefinition(id);
  const title = `${proof.title} — Visual Proof`;
  return {
    title,
    description: proof.description,
    openGraph: { title, description: proof.description, images: [] },
    twitter: { title, description: proof.description, images: [] },
  };
}

export function adjacentProofs(id: string) {
  const index = PROOF_DEFINITIONS.findIndex((proof) => proof.id === id);
  if (index < 0) throw new Error(`Unknown visual proof: ${id}`);
  return {
    previous:
      PROOF_DEFINITIONS[
        (index - 1 + PROOF_DEFINITIONS.length) % PROOF_DEFINITIONS.length
      ],
    next: PROOF_DEFINITIONS[(index + 1) % PROOF_DEFINITIONS.length],
  };
}
