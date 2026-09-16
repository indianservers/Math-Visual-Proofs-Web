// ─── Divisibility by 3 — Mathematics ─────────────────────────────────────────
import type { LaneName, PlaceValueColumn } from './divisibility-by-3Config';
import { PLACE_VALUE_COLUMNS, REMAINDER_LANES } from './divisibility-by-3Config';

// ── Core Arithmetic ──────────────────────────────────────────────────────────

/** Convert a digit array (MSB first) to the integer value. */
export function digitsToNumber(digits: number[]): number {
  return parseInt(digits.join(''), 10) || 0;
}

/** Sum of all digits. */
export function digitSum(digits: number[]): number {
  return digits.reduce((acc, d) => acc + d, 0);
}

/** Number mod 3 — computed from the actual integer. */
export function numberMod3(digits: number[]): number {
  return digitsToNumber(digits) % 3;
}

/** Digit-sum mod 3. */
export function digitSumMod3(digits: number[]): number {
  return digitSum(digits) % 3;
}

/**
 * The KEY invariant: 10^k ≡ 1 (mod 3) for all k ≥ 0.
 * Proof: 10 = 9 + 1 ≡ 1 (mod 3), so 10^k ≡ 1^k = 1 (mod 3).
 */
export function placeValueMod3(_power: number): 1 {
  return 1;
}

/**
 * Given a digit d at power k, its contribution mod 3 is:
 *   d × 10^k ≡ d × 1 = d  (mod 3)
 */
export function digitContributionMod3(digit: number, _power: number): number {
  return digit % 3;
}

/** Determine the correct remainder lane name for any place-value column. */
export function correctRemainderLane(_power: number): 'rem0' | 'rem1' | 'rem2' {
  // Always 1 for divisibility by 3
  const rem = placeValueMod3(_power); // always 1
  return (['rem0', 'rem1', 'rem2'] as const)[rem];
}

// ── Display Geometry ──────────────────────────────────────────────────────────

// Re-export LIMITS so the page component can import it from the math module
export { LIMITS } from './divisibility-by-3Config';

/**
 * SVG viewBox used by the workspace canvas: 900 × 530
 * Extra height gives the remainder lanes room without overlapping columns.
 */
export const VIEW_W = 900;
export const VIEW_H = 530;

/** Counter ball radius in SVG units. */
export const BALL_R = 15;

/** Invisible hit-target radius (≥ 44 CSS px equivalent). */
export const HIT_R = 22;

export interface ColumnLayout {
  col: PlaceValueColumn;
  /** Left edge of the column card in SVG units */
  cardX: number;
  /** Width of the column card in SVG units */
  cardW: number;
  /** Y start of the card */
  cardY: number;
  /** Y height of the card */
  cardH: number;
  /** Centre X of the column — where counters are placed */
  centerX: number;
  /** Y of the first counter row */
  firstCounterY: number;
  /** Vertical spacing between counter rows */
  rowSpacing: number;
}

/** Palette card (leftmost) geometry. */
export const PALETTE_CARD = { x: 10, y: 10, w: 144, h: 308 };

/** Column cards — wider gaps, taller cards. */
const COL_START_X = 164;
const COL_GAP     = 8;
const COL_W       = 172;
const COL_Y       = 10;
const COL_H       = 308;

export function getColumnLayouts(): ColumnLayout[] {
  return PLACE_VALUE_COLUMNS.map((col, i) => {
    const cardX   = COL_START_X + i * (COL_W + COL_GAP);
    const centerX = cardX + COL_W / 2;
    return {
      col,
      cardX,
      cardW: COL_W,
      cardY: COL_Y,
      cardH: COL_H,
      centerX,
      firstCounterY: COL_Y + 78,   // more room below 3-line header
      rowSpacing: BALL_R * 2 + 8,  // looser vertical spacing
    };
  });
}

/** Remainder lanes sit below the place-value columns — well-separated. */
const REM_CARD_Y   = 332;  // 10 (top margin) + 308 (col height) + 14 (gap)
const REM_CARD_H   = 140;
const REM_LANE_W   = 186;
const REM_LANE_GAP = 16;
const REM_START_X  = 164;

export interface RemainderLaneLayout {
  name: 'rem0' | 'rem1' | 'rem2';
  cardX: number;
  cardY: number;
  cardW: number;
  cardH: number;
  centerX: number;
  centerY: number;
  /** Y for the counter circle when docked */
  counterY: number;
  label: string;
  value: number;
  color: string;
  borderColor: string;
  bgColor: string;
}

export function getRemainderLaneLayouts(): RemainderLaneLayout[] {
  return REMAINDER_LANES.map((lane, i) => {
    const cardX   = REM_START_X + i * (REM_LANE_W + REM_LANE_GAP);
    const centerX = cardX + REM_LANE_W / 2;
    const centerY = REM_CARD_Y + REM_CARD_H / 2;
    return {
      ...lane,
      cardX,
      cardY: REM_CARD_Y,
      cardW: REM_LANE_W,
      cardH: REM_CARD_H,
      centerX,
      centerY,
      counterY: REM_CARD_Y + 50,
    };
  });
}

export interface SnapTarget {
  id: string;
  lane: LaneName;
  /** Column power (0-3) or -1 for remainder/palette */
  power: number;
  /** Slot index within this lane */
  slotIdx: number;
  x: number;
  y: number;
}

/**
 * Generate all valid snap targets for the current digit configuration.
 * Palette slots, column slots, and remainder lane slots.
 */
export function generateSnapTargets(digits: number[]): SnapTarget[] {
  const targets: SnapTarget[] = [];

  // ── Palette slots (return positions) ────────────────────────────────────────
  const palCenterX = PALETTE_CARD.x + PALETTE_CARD.w / 2;
  for (let i = 0; i < digits.length; i++) {
    const row = Math.floor(i / 2);
    const col = i % 2;
    targets.push({
      id: `palette-${i}`,
      lane: 'palette',
      power: -1,
      slotIdx: i,
      x: palCenterX - 18 + col * 36,
      y: PALETTE_CARD.y + 65 + row * (BALL_R * 2 + 8),
    });
  }

  // ── Column slots ─────────────────────────────────────────────────────────────
  const colLayouts = getColumnLayouts();
  for (const cl of colLayouts) {
    const colName = cl.col.name;
    for (let slot = 0; slot < 12; slot++) {
      const row = Math.floor(slot / 3);
      const col = slot % 3;
      targets.push({
        id: `${colName}-${slot}`,
        lane: colName,
        power: cl.col.power,
        slotIdx: slot,
        x: cl.cardX + 22 + col * (BALL_R * 2 + 10),
        y: cl.firstCounterY + row * cl.rowSpacing,
      });
    }
  }

  // ── Remainder lane slots ─────────────────────────────────────────────────────
  const remLayouts = getRemainderLaneLayouts();
  for (const rl of remLayouts) {
    for (let slot = 0; slot < 6; slot++) {
      const col = slot % 3;
      const row = Math.floor(slot / 3);
      targets.push({
        id: `${rl.name}-${slot}`,
        lane: rl.name,
        power: -1,
        slotIdx: slot,
        x: rl.cardX + 24 + col * (BALL_R * 2 + 12),
        y: rl.cardY + 48 + row * (BALL_R * 2 + 10),
      });
    }
  }

  return targets;
}

/** Get counter fill colour from its current lane. */
export function getCounterColor(lane: LaneName): string {
  switch (lane) {
    case 'thousands': return PLACE_VALUE_COLUMNS[0].color;
    case 'hundreds':  return PLACE_VALUE_COLUMNS[1].color;
    case 'tens':      return PLACE_VALUE_COLUMNS[2].color;
    case 'ones':      return PLACE_VALUE_COLUMNS[3].color;
    case 'rem1':      return '#3ecf8e';
    case 'rem0':      return '#6a38ff';
    case 'rem2':      return '#f76b72';
    default:          return '#7c5cfc';
  }
}

/** Compatibility predicate: can a counter from `fromLane` dock into `toLane`? */
export function isCompatible(fromLane: LaneName, toLane: LaneName): boolean {
  // Palette ↔ column: always allowed
  if (toLane === 'palette') return true;
  const cols = ['thousands', 'hundreds', 'tens', 'ones'] as string[];
  if (fromLane === 'palette' && cols.includes(toLane as string)) return true;
  if (cols.includes(fromLane as string) && (toLane as string) === 'palette') return true;

  // Column → remainder: only rem1 is valid
  if (cols.includes(fromLane as string)) {
    return toLane === 'rem1';
  }

  // Remainder → column: allowed (let learner undo)
  if ((fromLane as string).startsWith('rem') && cols.includes(toLane as string)) return true;

  return false;
}
