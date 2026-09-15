// ─── Heron's Formula — Configuration ─────────────────────────────────────────

export type ProofState = 'inspect' | 'manipulate' | 'preserve' | 'connect' | 'conclude' | 'transfer';

export const HINTS = [
  { level: 1, title: 'Define semiperimeter', body: 's = (a + b + c) / 2 is half the perimeter.' },
  { level: 2, title: 'Altitude & Base', body: 'The altitude h divides the base a into segments x and y: x + y = a.' },
  { level: 3, title: 'Two Right Triangles', body: 'Using Pythagorean theorem: h^2 = c^2 - x^2 = b^2 - y^2.' },
  { level: 4, title: 'Algebraic Relation', body: 'Area A = (1/2) * a * h, so 16 A^2 = 4 a^2 h^2.' },
  { level: 5, title: 'Heron Result', body: 'Area A = sqrt(s(s-a)(s-b)(s-c)).' },
];

export const PROOF_STATES: Record<ProofState, string> = {
  inspect: 'Inspect triangle side lengths a, b, c and altitude h.',
  manipulate: 'Drag vertex A to adjust triangle shape and altitude.',
  preserve: 'Preserve base length a = x + y.',
  connect: 'Relate segment lengths x, y to semiperimeter s.',
  conclude: 'Conclude Heron\'s Formula: A = sqrt(s(s-a)(s-b)(s-c)).',
  transfer: 'Test with a fresh scalene triangle.',
};

export interface TrianglePoint {
  x: number;
  y: number;
}
