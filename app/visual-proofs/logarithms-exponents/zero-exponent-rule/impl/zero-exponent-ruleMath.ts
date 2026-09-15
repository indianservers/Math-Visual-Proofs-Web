// ─── Zero Exponent Rule — Math Pure Helpers ─────────────────────────────────────

export function computeZeroExponent(base: number, n: number) {
  const isBaseNonZero = base !== 0;
  const numValue = Math.pow(base, n);
  const result = isBaseNonZero ? 1 : NaN;
  return { isBaseNonZero, numValue, result };
}
