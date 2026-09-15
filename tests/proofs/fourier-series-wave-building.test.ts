import { describe, expect, it } from "vitest";
import { proofConfig } from "../../app/visual-proofs/engineering-mathematics/fourier-series-wave-building/proof.config";

describe("Fourier Series as Wave Building", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("fourier-series-wave-building");
  });
});
