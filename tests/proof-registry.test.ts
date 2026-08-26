import { describe, expect, it } from "vitest";
import {
  adjacentProofs,
  getProofDefinition,
  metadataForProof,
  PROOF_DEFINITIONS,
} from "../app/lib/proofRegistry";

describe("visual proof registry", () => {
  it("keeps every proof on a unique dedicated route", () => {
    const routes = PROOF_DEFINITIONS.map((proof) => proof.route);
    expect(new Set(routes).size).toBe(routes.length);
    expect(routes.every((route) => route.startsWith("/proofs/"))).toBe(true);
  });

  it("builds route metadata from the authoritative definition", () => {
    const proof = getProofDefinition("triangle-area");
    const metadata = metadataForProof(proof.id);
    expect(metadata.title).toContain(proof.title);
    expect(metadata.description).toBe(proof.description);
  });

  it("provides circular previous and next navigation", () => {
    const first = PROOF_DEFINITIONS[0];
    const adjacent = adjacentProofs(first.id);
    expect(adjacent.previous.id).toBe(PROOF_DEFINITIONS.at(-1)?.id);
    expect(adjacent.next.id).toBe(PROOF_DEFINITIONS[1].id);
  });
});
