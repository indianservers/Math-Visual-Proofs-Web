// ─── Divisibility by 9 — Configuration ───────────────────────────────────────

export type ProofState =
  | 'inspect'
  | 'manipulate'
  | 'preserve'
  | 'connect'
  | 'conclude'
  | 'transfer';

/**
 * All lanes a counter or token can inhabit.
 * - 'palette'        : starting supply of counters
 * - 'hundredThousands' … 'ones': the six place-value columns
 * - 'tray'           : digit-sum tray (counters dragged here lose place-value weight)
 * - 'rem0' … 'rem8'  : the nine remainder lanes (mod 9)
 * - 'nToken'         : the draggable [N] token slot
 * - 'sToken'         : the draggable [S] token slot
 */
export type LaneName =
  | 'palette'
  | 'hundredThousands'
  | 'tenThousands'
  | 'thousands'
  | 'hundreds'
  | 'tens'
  | 'ones'
  | 'tray'
  | 'rem0' | 'rem1' | 'rem2' | 'rem3' | 'rem4'
  | 'rem5' | 'rem6' | 'rem7' | 'rem8'
  | 'nToken'
  | 'sToken';

/** A single place-value column descriptor */
export interface PlaceValueColumn {
  name: LaneName;
  label: string;
  power: number;
  color: string;
  strokeColor: string;
  headerBg: string;
}

/** Six columns: 10^5 down to 10^0 */
export const PLACE_VALUE_COLUMNS: PlaceValueColumn[] = [
  {
    name: 'hundredThousands',
    label: 'Hundred thousands',
    power: 5,
    color: '#7c3aed',
    strokeColor: '#6d28d9',
    headerBg: '#ede9fe',
  },
  {
    name: 'tenThousands',
    label: 'Ten thousands',
    power: 4,
    color: '#2563eb',
    strokeColor: '#1d4ed8',
    headerBg: '#dbeafe',
  },
  {
    name: 'thousands',
    label: 'Thousands',
    power: 3,
    color: '#0891b2',
    strokeColor: '#0e7490',
    headerBg: '#cffafe',
  },
  {
    name: 'hundreds',
    label: 'Hundreds',
    power: 2,
    color: '#059669',
    strokeColor: '#047857',
    headerBg: '#d1fae5',
  },
  {
    name: 'tens',
    label: 'Tens',
    power: 1,
    color: '#d97706',
    strokeColor: '#b45309',
    headerBg: '#fef3c7',
  },
  {
    name: 'ones',
    label: 'Ones',
    power: 0,
    color: '#dc2626',
    strokeColor: '#b91c1c',
    headerBg: '#fee2e2',
  },
];

/** Config for the nine remainder lanes */
export interface RemainderLane {
  name: LaneName;
  label: string;
  value: number;
  color: string;
  borderColor: string;
  bgColor: string;
}

export const REMAINDER_LANES: RemainderLane[] = Array.from({ length: 9 }, (_, i) => ({
  name: `rem${i}` as LaneName,
  label: `Remainder ${i}`,
  value: i,
  color:       i === 0 ? '#059669' : '#6d28d9',
  borderColor: i === 0 ? '#34d399' : '#a78bfa',
  bgColor:     i === 0 ? '#ecfdf5' : '#f5f3ff',
}));

export const HINTS = [
  {
    level: 1,
    title: 'Notice',
    body: 'Look at the "Why it works" panel. What is 10 divided by 9? What is the remainder?',
  },
  {
    level: 2,
    title: 'Choose',
    body: 'Drag each coloured counter from a place-value column into the Digit-sum tray. Each counter carries one digit.',
  },
  {
    level: 3,
    title: 'Predict',
    body: 'Before you drag N and S to their remainder lanes — what do you think their remainders will be? Will they match?',
  },
  {
    level: 4,
    title: 'Guide',
    body: 'Now drag the [N] block to its remainder lane. Count from 0. Hint: the digit sum and the original number must land in the same lane.',
  },
  {
    level: 5,
    title: 'Explain',
    body: 'Both [N] and [S] landed in the same lane. Why? Because 10 ≡ 1 (mod 9), so 10^k ≡ 1 for every k. The digit sum and the number always share the same mod-9 remainder.',
  },
];

export const PROOF_STATES: Record<ProofState, string> = {
  inspect:    'Inspect the number — identify its digits and place values.',
  manipulate: 'Drag each place-value counter into the Digit-sum tray.',
  preserve:   'Notice: no counter was created or destroyed — only the place-value label changed.',
  connect:    'Now drag [N] and [S] to their remainder lanes to compare.',
  conclude:   'N ≡ S (mod 9) — they share the same remainder!',
  transfer:   'Test a new number. Does the rule always hold?',
};

export const LIMITS = {
  maxDigits: 6,
  snapThreshold: 28,
  maxHistory: 80,
};
