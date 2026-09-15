// ─── Exponent Quotient Rule — Math Pure Helpers ─────────────────────────────────

export function computeQuotient(base: number, m: number, n: number): {
  am: number;
  an: number;
  remainingExp: number;
  quotient: number;
  isBaseValid: boolean;
} {
  const isBaseValid = base !== 0;
  const am = Math.pow(base, m);
  const an = Math.pow(base, n);
  const remainingExp = m - n;
  const quotient = isBaseValid ? am / an : NaN;
  return { am, an, remainingExp, quotient, isBaseValid };
}

export const VIEW_W = 680;
export const VIEW_H = 340;

export interface FactorNode {
  id: string;
  type: 'num' | 'den';
  index: number;
  x: number;
  y: number;
  isCancelled: boolean;
  cancelledWithId?: string;
  label: string;
}

export function calculateQuotientGeometry(
  base: number,
  m: number,
  n: number,
  cancelledCount: number
): {
  numFactors: FactorNode[];
  denFactors: FactorNode[];
  resultFactors: FactorNode[];
} {
  const ballR = 20;
  const gap = 16;

  // Numerator row (top)
  const numStartX = 80;
  const numY = 90;
  const numFactors: FactorNode[] = Array.from({ length: m }, (_, i) => ({
    id: `num-${i}`,
    type: 'num',
    index: i,
    x: numStartX + i * (ballR * 2 + gap),
    y: numY,
    isCancelled: i < cancelledCount,
    cancelledWithId: i < cancelledCount ? `den-${i}` : undefined,
    label: String(base),
  }));

  // Denominator row (bottom)
  const denStartX = 80;
  const denY = 190;
  const denFactors: FactorNode[] = Array.from({ length: n }, (_, i) => ({
    id: `den-${i}`,
    type: 'den',
    index: i,
    x: denStartX + i * (ballR * 2 + gap),
    y: denY,
    isCancelled: i < cancelledCount,
    cancelledWithId: i < cancelledCount ? `num-${i}` : undefined,
    label: String(base),
  }));

  // Result row (right side box)
  const remCount = Math.max(0, m - n);
  const resStartX = 520;
  const resY = 140;
  const resultFactors: FactorNode[] = Array.from({ length: remCount }, (_, i) => ({
    id: `res-${i}`,
    type: 'num',
    index: i,
    x: resStartX + i * (ballR * 2 + 10),
    y: resY,
    isCancelled: false,
    label: String(base),
  }));

  return { numFactors, denFactors, resultFactors };
}
