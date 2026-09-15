// ─── Divisibility by 3 — Configuration ───────────────────────────────────────

export type ProofState =
  | 'inspect'
  | 'manipulate'
  | 'preserve'
  | 'connect'
  | 'conclude'
  | 'transfer';

export type LaneName =
  | 'palette'      // starting position (counter palette)
  | 'thousands'    // place-value column: 10^3
  | 'hundreds'     // place-value column: 10^2
  | 'tens'         // place-value column: 10^1
  | 'ones'         // place-value column: 10^0
  | 'rem0'         // remainder lane 0
  | 'rem1'         // remainder lane 1  ← every power of 10 lands here
  | 'rem2';        // remainder lane 2

export interface PlaceValueColumn {
  name: 'thousands' | 'hundreds' | 'tens' | 'ones';
  label: string;
  power: number;       // 3, 2, 1, 0
  mod3: number;        // always 1
  color: string;       // fill colour for counters
  strokeColor: string; // border colour
  headerBg: string;    // column header background
}

export const PLACE_VALUE_COLUMNS: PlaceValueColumn[] = [
  {
    name: 'thousands',
    label: 'Thousands\n1000',
    power: 3,
    mod3: 1,
    color: '#7c5cfc',
    strokeColor: '#5b38d6',
    headerBg: '#f0eeff',
  },
  {
    name: 'hundreds',
    label: 'Hundreds\n100',
    power: 2,
    mod3: 1,
    color: '#38b2f7',
    strokeColor: '#1890d8',
    headerBg: '#eaf7ff',
  },
  {
    name: 'tens',
    label: 'Tens\n10',
    power: 1,
    mod3: 1,
    color: '#3ecf8e',
    strokeColor: '#18a067',
    headerBg: '#e6fdf4',
  },
  {
    name: 'ones',
    label: 'Ones\n1',
    power: 0,
    mod3: 1,
    color: '#f76b72',
    strokeColor: '#d64049',
    headerBg: '#fff0f1',
  },
];

export interface RemainderLane {
  name: 'rem0' | 'rem1' | 'rem2';
  label: string;
  value: number;
  color: string;
  borderColor: string;
  bgColor: string;
}

export const REMAINDER_LANES: RemainderLane[] = [
  {
    name: 'rem0',
    label: 'Remainder 0',
    value: 0,
    color: '#6a38ff',
    borderColor: '#a88bff',
    bgColor: '#f4f1ff',
  },
  {
    name: 'rem1',
    label: 'Remainder 1',
    value: 1,
    color: '#3ecf8e',
    borderColor: '#7ddfc0',
    bgColor: '#e6fdf4',
  },
  {
    name: 'rem2',
    label: 'Remainder 2',
    value: 2,
    color: '#f76b72',
    borderColor: '#f9a8ac',
    bgColor: '#fff0f1',
  },
];

export const LIMITS = {
  /** Default digits (left-to-right, most significant first) */
  defaultDigits: [4, 7, 2, 1] as number[],
  minDigits: 1,
  maxDigits: 6,
  /**
   * Snap radius in SVG-user-unit pixels.
   * Client pixels ≈ SVG units × (clientWidth / viewBoxWidth).
   * At 1536 wide with viewBox 900, ratio ≈ 1.7 — so 44 CSS px ≈ 26 SVG units.
   * We use 30 SVG units so the zone is always ≥ 44 CSS px at the reference viewport.
   */
  snapThreshold: 30,
  maxCountersPerColumn: 12,
};

export interface Hint {
  title: string;
  text: string;
}

export const HINTS: Record<number, Hint> = {
  1: {
    title: 'Notice the place values',
    text:
      'Look at your number. Each digit sits in a place: ones, tens, hundreds, thousands. ' +
      'Your mission is to find out what each place-value weight is modulo 3.',
  },
  2: {
    title: 'Drag counters into place-value columns',
    text:
      'Drag the coloured counter circles from the palette into the matching column ' +
      '(Thousands / Hundreds / Tens / Ones). Each circle represents one unit in that place.',
  },
  3: {
    title: 'What stays the same when you collapse?',
    text:
      'Before you drag blocks to the remainder lanes, predict: which remainder lane ' +
      'will each column land in? Remember — no unit is created or destroyed.',
  },
  4: {
    title: 'Move blocks to the remainder lanes',
    text:
      'Drag each column\'s block to the correct remainder lane (0, 1, or 2). ' +
      'Watch where every power of 10 lands — is there a pattern?',
  },
  5: {
    title: 'Build the general rule',
    text:
      'Every place value ended up in Remainder 1. That means digit × place ≡ digit × 1 = digit (mod 3). ' +
      'So N ≡ sum of digits (mod 3). Can you explain why in your own words?',
  },
};

export const PROOF_STATE_LABELS: Record<ProofState, string> = {
  inspect: 'Inspect',
  manipulate: 'Manipulate',
  preserve: 'Preserve',
  connect: 'Connect',
  conclude: 'Conclude',
  transfer: 'Transfer',
};

export const PROOF_STATES: ProofState[] = [
  'inspect',
  'manipulate',
  'preserve',
  'connect',
  'conclude',
  'transfer',
];
