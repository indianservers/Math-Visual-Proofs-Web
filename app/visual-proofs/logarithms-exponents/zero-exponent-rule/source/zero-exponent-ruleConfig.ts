// ─── Zero Exponent Rule — Configuration ────────────────────────────────────────

export type ProofState =
  | 'inspect'
  | 'manipulate'
  | 'preserve'
  | 'connect'
  | 'conclude'
  | 'transfer';

export const HINTS = [
  { level: 1, title: 'Notice', body: 'Look at a^n / a^n. Any non-zero number divided by itself equals 1.' },
  { level: 2, title: 'Choose', body: 'Cancel matching factor pairs in numerator and denominator.' },
  { level: 3, title: 'Predict', body: 'Cancelling all n factors leaves an empty product, which equals the identity 1.' },
  { level: 4, title: 'Guide', body: 'Using quotient rule: a^n / a^n = a^(n-n) = a^0.' },
  { level: 5, title: 'Explain', body: 'Therefore a^0 = 1 for any nonzero a (a ≠ 0).' },
];

export const PROOF_STATES: Record<ProofState, string> = {
  inspect: 'Inspect a^n / a^n.',
  manipulate: 'Cancel all factor pairs.',
  preserve: 'Note the condition: base a ≠ 0.',
  connect: 'Observe empty product = 1 and a^(n-n) = a^0.',
  conclude: 'Conclude: a^0 = 1 for all a ≠ 0.',
  transfer: 'Test another base.',
};

export const LIMITS = {
  minBase: 0.5,
  maxBase: 5,
  defaultBase: 2.5,
  minN: 1,
  maxN: 5,
  defaultN: 3,
};
