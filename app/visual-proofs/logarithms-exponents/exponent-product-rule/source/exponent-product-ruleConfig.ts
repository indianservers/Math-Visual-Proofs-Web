// ─── Exponent Product Rule — Configuration ─────────────────────────────────────

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
    body: 'Look at the factor chains. a^m represents m copies of a, and a^n represents n copies of a.',
  },
  {
    level: 2,
    title: 'Choose',
    body: 'Drag the factor block from the n-chain into the m-chain to join them together.',
  },
  {
    level: 3,
    title: 'Predict',
    body: 'Notice: the base a never changes, only the total count of factors accumulates: m + n.',
  },
  {
    level: 4,
    title: 'Guide',
    body: 'Count the total factors in the joined m + n chain to confirm the exponent sum.',
  },
  {
    level: 5,
    title: 'Explain',
    body: 'Since a^m × a^n is (a × ... × a) [m times] × (a × ... × a) [n times], the total factor count is m + n, so a^m a^n = a^(m+n).',
  },
];

export const PROOF_STATES: Record<ProofState, string> = {
  inspect: 'Inspect the terms: identify base a and exponents m and n.',
  manipulate: 'Drag the factor block to join the m-chain and n-chain.',
  preserve: 'Notice: the base value a remains unchanged.',
  connect: 'Compare the combined factor count (m + n) to the new exponent.',
  conclude: 'Conclude: a^m × a^n = a^(m+n).',
  transfer: 'Test a fresh configuration to verify the product rule.',
};

export const LIMITS = {
  minBase: 2,
  maxBase: 10,
  defaultBase: 2,
  minM: 1,
  maxM: 6,
  defaultM: 3,
  minN: 1,
  maxN: 6,
  defaultN: 2,
  snapThreshold: 40,
  maxHistory: 50,
};
