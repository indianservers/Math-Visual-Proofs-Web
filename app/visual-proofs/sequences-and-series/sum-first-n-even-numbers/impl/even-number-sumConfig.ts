// ─── Sum of First n Even Numbers — Configuration ─────────────────────────────

export type ProofState =
  | 'inspect'
  | 'manipulate'
  | 'preserve'
  | 'connect'
  | 'conclude'
  | 'transfer';

export const PROOF_STATES: ProofState[] = [
  'inspect',
  'manipulate',
  'preserve',
  'connect',
  'conclude',
  'transfer',
];

export const N_MIN = 1;
export const N_MAX = 10;
export const DEFAULT_N = 5;

/** Row colours cycle through the reference palette. */
export const ROW_COLORS = [
  '#7c5cfc',
  '#3b9eff',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#a855f7',
  '#06b6d4',
  '#84cc16',
  '#f97316',
  '#e11d48',
];

export const HINTS = [
  {
    level: 1,
    title: 'Notice',
    text: 'Row i is an even number: it has exactly 2i dots. That is two copies of the triangular row of i dots.',
  },
  {
    level: 2,
    title: 'Choose',
    text: 'Drag an even-number row onto its matching slot in the n × (n+1) rectangle. Only the row with 2i dots fits layer i.',
  },
  {
    level: 3,
    title: 'Predict',
    text: 'Before you dock: every dot is counted once. Splitting row i into two groups of i does not create or destroy dots.',
  },
  {
    level: 4,
    title: 'Guide',
    text: 'Move the still-floating row along the mirror path into the dashed target. Stop if you like — you complete the dock.',
  },
  {
    level: 5,
    title: 'Explain',
    text: 'Two copies of 1+2+…+n fill an n by (n+1) rectangle, so 2+4+…+2n = n(n+1). Area is the same count as the sum.',
  },
] as const;

export const LIMITS = {
  snapDiscoverPx: 56,
  snapAttractPx: 32,
  snapCommitPx: 18,
  maxHistory: 80,
};

export const MISCONCEPTION_OPTIONS = [
  {
    key: 'square',
    text: 'The dots make an n × n square, so the sum is n².',
  },
  {
    key: 'correct',
    text: 'Each even row is two triangular rows. Two copies of Tₙ make an n × (n+1) rectangle, so the sum is n(n+1).',
  },
  {
    key: 'width_n',
    text: 'Every even row already has n dots, so stacking them is enough.',
  },
] as const;
