// ─── Negative Exponent Rule — Math Pure Helpers ────────────────────────────────

export function computeNegativeExponent(base: number, exp: number) {
  const isBaseNonZero = base !== 0;
  const absExp = Math.abs(exp);
  const isNegative = exp < 0;
  const denominatorVal = Math.pow(base, absExp);
  const value = isNegative ? 1 / denominatorVal : Math.pow(base, exp);

  return { isBaseNonZero, absExp, isNegative, denominatorVal, value };
}
