// ─── Divisibility by 9 — Mathematics & Geometry ──────────────────────────────
import type { LaneName, PlaceValueColumn } from './divisibility-by-9Config';
import { PLACE_VALUE_COLUMNS, REMAINDER_LANES } from './divisibility-by-9Config';

// ── Core Arithmetic ──────────────────────────────────────────────────────────

/** Convert a digit array (MSB first) to the integer value. */
export function digitsToNumber(digits: number[]): number {
  return parseInt(digits.join(''), 10) || 0;
}

/** Sum of all digits. */
export function digitSum(digits: number[]): number {
  return digits.reduce((acc, d) => acc + d, 0);
}

/** Number mod 9. */
export function numberMod9(digits: number[]): number {
  return digitsToNumber(digits) % 9;
}

/** Digit-sum mod 9. */
export function digitSumMod9(digits: number[]): number {
  return digitSum(digits) % 9;
}

/**
 * The KEY invariant: 10^k ≡ 1 (mod 9) for all k ≥ 0.
 * Proof: 10 = 9 + 1 ≡ 1 (mod 9), so 10^k ≡ 1^k = 1 (mod 9).
 */
export function placeValueMod9(_power: number): 1 {
  return 1;
}

// ── Display Geometry ──────────────────────────────────────────────────────────

export { LIMITS } from './divisibility-by-9Config';

/**
 * SVG viewBox: 1100 × 520
 * Wide enough for 6 place-value columns + palette.
 */
export const VIEW_W = 1100;
export const VIEW_H = 600;

export const BALL_R = 14;
export const HIT_R  = 22;

export interface ColumnLayout {
  col: PlaceValueColumn;
  cardX: number;
  cardW: number;
  cardY: number;
  cardH: number;
  centerX: number;
  firstCounterY: number;
  rowSpacing: number;
}

export const PALETTE_CARD = { x: 8, y: 8, w: 128, h: 290 };

const COL_START_X = 144;
const COL_GAP     = 6;
const COL_W       = 152;
const COL_Y       = 8;
const COL_H       = 290;

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
      firstCounterY: COL_Y + 72,
      rowSpacing: BALL_R * 2 + 7,
    };
  });
}

// Digit-sum tray geometry
export const TRAY_CARD = { x: 144, y: 324, w: 540, h: 84 };

// Remainder lanes row geometry (9 lanes, 0-8)
const REM_CARD_Y   = 435;
const REM_CARD_H   = 112;
const REM_LANE_W   = 108;
const REM_LANE_GAP = 9;
const REM_START_X  = 144;

export interface RemainderLaneLayout {
  name: LaneName;
  cardX: number;
  cardY: number;
  cardW: number;
  cardH: number;
  centerX: number;
  centerY: number;
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
    };
  });
}

export interface SnapTarget {
  id: string;
  lane: LaneName;
  power: number;
  slotIdx: number;
  x: number;
  y: number;
}

export function generateSnapTargets(digits: number[]): SnapTarget[] {
  const targets: SnapTarget[] = [];

  // Palette slots
  const palCX = PALETTE_CARD.x + PALETTE_CARD.w / 2;
  for (let i = 0; i < digits.length; i++) {
    const row = Math.floor(i / 2);
    const col = i % 2;
    targets.push({
      id: `palette-${i}`,
      lane: 'palette',
      power: -1,
      slotIdx: i,
      x: palCX - 16 + col * 32,
      y: PALETTE_CARD.y + 60 + row * (BALL_R * 2 + 7),
    });
  }

  // Column slots
  const colLayouts = getColumnLayouts();
  for (const cl of colLayouts) {
    const colName = cl.col.name;
    for (let slot = 0; slot < 9; slot++) {
      const row = Math.floor(slot / 3);
      const col = slot % 3;
      targets.push({
        id: `${colName}-${slot}`,
        lane: colName,
        power: cl.col.power,
        slotIdx: slot,
        x: cl.cardX + 20 + col * (BALL_R * 2 + 9),
        y: cl.firstCounterY + row * cl.rowSpacing,
      });
    }
  }

  // Tray slots — 12 slots in a row
  for (let slot = 0; slot < 12; slot++) {
    targets.push({
      id: `tray-${slot}`,
      lane: 'tray',
      power: -1,
      slotIdx: slot,
      x: TRAY_CARD.x + 24 + slot * (BALL_R * 2 + 10),
      y: TRAY_CARD.y + TRAY_CARD.h / 2,
    });
  }

  // Remainder lane slots — 2 slots each
  const remLayouts = getRemainderLaneLayouts();
  for (const rl of remLayouts) {
    for (let slot = 0; slot < 2; slot++) {
      targets.push({
        id: `${rl.name}-${slot}`,
        lane: rl.name,
        power: -1,
        slotIdx: slot,
        x: rl.centerX + (slot === 0 ? -14 : 14),
        y: rl.cardY + 70,
      });
    }
  }

  return targets;
}

/** Get counter fill colour by its current lane. */
export function getCounterColor(lane: LaneName): string {
  const col = PLACE_VALUE_COLUMNS.find(c => c.name === lane);
  if (col) return col.color;
  if (lane === 'tray')  return '#7c3aed';
  if ((lane as string).startsWith('rem')) return '#6d28d9';
  return '#64748b';
}

/**
 * Compatibility predicate:
 * - palette ↔ column: allowed
 * - column → tray: allowed (core manipulation)
 * - tray → column: allowed (undo)
 * - tray / column → rem lane: NOT via counter drag; N and S tokens handle that
 */
export function isCompatible(fromLane: LaneName, toLane: LaneName): boolean {
  if (toLane === 'palette') return true;
  const cols = PLACE_VALUE_COLUMNS.map(c => c.name as string);
  if (fromLane === 'palette' && cols.includes(toLane as string)) return true;
  if (cols.includes(fromLane as string) && toLane === 'tray') return true;
  if (fromLane === 'tray' && cols.includes(toLane as string)) return true;
  return false;
}
