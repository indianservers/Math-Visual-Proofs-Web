// ─── Negative Exponent Rule — Configuration ────────────────────────────────────

export type ProofState =
  | 'inspect'
  | 'manipulate'
  | 'preserve'
  | 'connect'
  | 'conclude'
  | 'transfer';

export const HINTS = [
  { level: 1, title: 'Notice', body: 'Moving left on an exponent table divides by the base a each step.' },
  { level: 2, title: 'Choose', body: 'Drag the base or step left to cross from a^0 to negative exponents.' },
  { level: 3, title: 'Predict', body: 'Crossing below 0 places the repeated factors in the denominator.' },
  { level: 4, title: 'Guide', body: 'Observe: a^-1 = 1/a, a^-2 = 1/a^2, so a^-n = 1/a^n.' },
  { level: 5, title: 'Explain', body: 'Therefore a^-n denotes the reciprocal 1/a^n for any nonzero a.' },
];

export const PROOF_STATES: Record<ProofState, string> = {
  inspect: 'Inspect exponent power scale.',
  manipulate: 'Move left from a^0 to negative exponents.',
  preserve: 'Note base a ≠ 0.',
  connect: 'Observe factors move to denominator.',
  conclude: 'Conclude: a^-n = 1/a^n.',
  transfer: 'Test fresh negative exponent expressions.',
};

export const LIMITS = {
  minBase: 2,
  maxBase: 6,
  defaultBase: 3,
  minExp: -4,
  maxExp: 4,
  defaultExp: -2,
};
