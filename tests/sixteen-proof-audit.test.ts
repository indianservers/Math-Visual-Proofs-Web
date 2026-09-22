import { describe, expect, it } from "vitest";
import { readFile, access } from "node:fs/promises";
import { join } from "node:path";
import catalog from "../app/data/visual-proofs-detailed.json";

const expected: Record<string, string> = {
  "pythagorean-trig-identity": "trigonometry",
  "trig-graphs-from-unit-circle": "trigonometry",
  "complex-multiplication-rotation-scaling": "complex-numbers",
  "roots-of-unity": "complex-numbers",
  "derivative-slope-of-tangent": "calculus",
  "definite-integral-accumulated-area": "calculus",
  "derivative-power-rule": "calculus",
  "taylor-series-approximation": "calculus",
  "mean-value-theorem": "calculus",
  "geometric-series-sum-one-over-one-minus-r": "sequences-and-series",
  "binomial-theorem-pascal-expansion": "sequences-and-series",
  "sine-rule-proof": "trigonometry",
  "cauchy-schwarz-dot-product-bound": "matrices-linear-algebra",
  "bayes-theorem-tree-reversal": "probability",
  "central-limit-theorem": "statistics",
  "natural-exponential-e": "calculus",
};

describe("16-proof integration audit", () => {
  it("has exactly the requested unique catalog routes and categories", () => {
    expect(Object.keys(expected)).toHaveLength(16);
    const relevant = catalog.visualProofs.filter((proof) => proof.id in expected);
    expect(relevant).toHaveLength(16);
    expect(new Set(relevant.map((proof) => proof.route)).size).toBe(16);
    for (const proof of relevant) {
      expect(proof.categorySlug).toBe(expected[proof.id]);
      expect(proof.route).toBe(`/visual-proofs/${proof.categorySlug}/${proof.slug}`);
    }
  });

  it("has a direct page, active status, challenge, and no no-op tool", async () => {
    for (const [proofId, category] of Object.entries(expected)) {
      const proof = catalog.visualProofs.find((item) => item.id === proofId);
      expect(proof).toBeDefined();
      const manifest = JSON.parse(await readFile(join(process.cwd(), "app/proof-status", `${proofId}.json`), "utf8"));
      expect(manifest.status).toMatch(/interactive|verified/);
      expect(manifest.categorySlug).toBe(category);
      expect(manifest.route).toBe(proof!.route);
      const directory = join(process.cwd(), "app", ...manifest.route.slice(1).split("/"));
      await access(join(directory, "page.tsx"));
      const source = await readFile(join(directory, "Proof.tsx"), "utf8");
      expect(source).toMatch(/challenge=\{/);
      expect(source).not.toMatch(/onClick=\{\(\)\s*=>\s*\{\s*\}\}/);
      expect(source).not.toMatch(/<title>/);
      expect(source).not.toMatch(/(?:TODO|lorem ipsum|not implemented|mock only)/i);
    }
  });
});
