// ─── Volume of a Pyramid — Math Pure Helpers ──────────────────────────────────

export function computePyramidVolume(B: number, h: number) {
  const Vprism = B * h;
  const Vpyramid = (1 / 3) * Vprism;
  return { Vprism, Vpyramid };
}
