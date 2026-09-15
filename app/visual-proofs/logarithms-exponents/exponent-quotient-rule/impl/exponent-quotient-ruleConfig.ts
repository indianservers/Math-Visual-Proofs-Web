// ─── Exponent Quotient Rule — Configuration ────────────────────────────────────

export type ProofState =
  | 'inspect'
  | 'manipulate'
  | 'preserve'
  | 'connect'
  | 'conclude'
  | 'transfer';

export interface Hint {
  level: number;
  title: string;
  body: string;
}

export const HINTS: Hint[] = [
  {
    level: 1,
    title: 'Notice',
    body: 'Notice the fraction: a^m in numerator (m copies of a) divided by a^n in denominator (n copies of a).',
  },
  {
    level: 2,
    title: 'Choose',
    body: 'Click or drag matching factor pairs (one top, one bottom) to cancel them out.',
  },
  {
    level: 3,
    title: 'Predict',
    body: 'Each cancellation reduces both top and bottom factor counts by 1: a/a = 1.',
  },
  {
    level: 4,
    title: 'Guide',
    body: 'Cancel all n matching factors. The remaining factors in the numerator equal m - n.',
  },
  {
    level: 5,
    title: 'Explain',
    body: 'Since n factors cancel out from m factors, a^m / a^n = a^(m-n) (provided a ≠ 0).',
  },
];

export const PROOF_STATES: Record<ProofState, string> = {
  inspect: 'Inspect numerator a^m and denominator a^n.',
  manipulate: 'Cancel matching factor pairs from numerator and denominator.',
  preserve: 'State the nonzero-base condition: base a ≠ 0.',
  connect: 'Count the remaining factors in the numerator (m - n).',
  conclude: 'Conclude: a^m / a^n = a^(m-n).',
  transfer: 'Test a new configuration to verify exponent subtraction.',
};

export const LIMITS = {
  minBase: 2,
  maxBase: 9,
  defaultBase: 3,
  minM: 1,
  maxM: 7,
  defaultM: 5,
  minN: 1,
  maxN: 6,
  defaultN: 2,
  snapThreshold: 40,
  maxHistory: 50,
};
