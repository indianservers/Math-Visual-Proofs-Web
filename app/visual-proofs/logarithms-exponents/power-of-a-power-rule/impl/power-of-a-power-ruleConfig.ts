// ─── Power of a Power Rule — Configuration ──────────────────────────────────────

export type ProofState =
  | 'inspect'
  | 'manipulate'
  | 'preserve'
  | 'connect'
  | 'conclude'
  | 'transfer';

export const HINTS = [
  { level: 1, title: 'Notice', body: '(a^m)^n means n groups, each containing m factors of a.' },
  { level: 2, title: 'Choose', body: 'Drag factor tiles from the palette to fill the n × m grid.' },
  { level: 3, title: 'Predict', body: 'Arranging in an n × m grid gives n rows of m factors, totaling m × n factors.' },
  { level: 4, title: 'Guide', body: 'Flatten the n × m grid to a single row of m × n factors.' },
  { level: 5, title: 'Explain', body: 'Since there are n groups of m factors, total factors = m × n, so (a^m)^n = a^(mn).' },
];

export const PROOF_STATES: Record<ProofState, string> = {
  inspect: 'Inspect (a^m)^n: n groups of m factors.',
  manipulate: 'Build the n × m factor grid.',
  preserve: 'Preserve the base value a across all groups.',
  connect: 'Flatten the grid into a single row of m × n factors.',
  conclude: 'Conclude: (a^m)^n = a^(mn).',
  transfer: 'Test a new configuration.',
};

export const LIMITS = {
  minBase: 2,
  maxBase: 5,
  defaultBase: 2,
  minM: 1,
  maxM: 5,
  defaultM: 3,
  minN: 1,
  maxN: 5,
  defaultN: 4,
};
