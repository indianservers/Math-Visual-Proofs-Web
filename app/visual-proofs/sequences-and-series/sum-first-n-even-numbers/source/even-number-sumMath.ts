// ─── Sum of First n Even Numbers — Mathematics & geometry ────────────────────
import { N_MAX, N_MIN, ROW_COLORS } from './even-number-sumConfig';

/** SVG proof-coordinate system: origin top-left, x right, y down. */
export const VIEW_W = 920;
export const VIEW_H = 430;

export const DOT_R = 7;
/** Invisible row-handle radius in SVG units (≥ 44 CSS px at typical canvas size). */
export const HIT_R = 22;

export interface Point {
  x: number;
  y: number;
}

export interface DotGeom {
  x: number;
  y: number;
  row: number; // 1..n
  half: 'a' | 'b' | 'home';
  indexInHalf: number;
}

export interface RowLayout {
  i: number;
  color: string;
  evenValue: number;
  homeDots: Point[];
  homeCentroid: Point;
  /** i dots on rectangle row i (left triangle A). */
  groupA: Point[];
  /** i dots on rectangle row n+1-i (right triangle B). */
  groupB: Point[];
  dockCentroid: Point;
}

export interface RectLayout {
  x: number;
  y: number;
  cell: number;
  cols: number;
  rows: number;
  width: number;
  height: number;
}

/**
 * Claim: for every integer n ≥ 1,
 *   2 + 4 + … + 2n = n(n+1).
 * Domain: positive integers. n = 1 is allowed (2 = 1·2).
 * n is capped at N_MAX for the canvas, not by the theorem.
 */
export function assertDomain(n: number): number {
  if (!Number.isInteger(n)) {
    throw new Error('n must be an integer.');
  }
  if (n < N_MIN) {
    throw new Error('n must be at least 1 — there is no empty even-number sum here.');
  }
  if (n > N_MAX) {
    throw new Error(`This canvas shows n up to ${N_MAX}. The identity still holds for larger n.`);
  }
  return n;
}

export function clampN(n: number): number {
  if (!Number.isFinite(n)) return N_MIN;
  return Math.max(N_MIN, Math.min(N_MAX, Math.round(n)));
}

/** i-th even number, i ≥ 1. */
export function evenTerm(i: number): number {
  return 2 * i;
}

/** 2 + 4 + … + 2n */
export function evenSum(n: number): number {
  let s = 0;
  for (let i = 1; i <= n; i++) s += evenTerm(i);
  return s;
}

/** Closed form n(n+1). */
export function rectangleArea(n: number): number {
  return n * (n + 1);
}

/** Triangular number T_n = n(n+1)/2. */
export function triangular(n: number): number {
  return (n * (n + 1)) / 2;
}

export function rowColor(i: number): string {
  return ROW_COLORS[(i - 1) % ROW_COLORS.length];
}

export function pxToSvg(px: number, svgEl: SVGSVGElement | null): number {
  if (!svgEl) return px;
  const w = svgEl.getBoundingClientRect().width;
  if (w <= 0) return px;
  return (px / w) * VIEW_W;
}

function centroid(pts: Point[]): Point {
  if (pts.length === 0) return { x: 0, y: 0 };
  let x = 0, y = 0;
  for (const p of pts) { x += p.x; y += p.y; }
  return { x: x / pts.length, y: y / pts.length };
}

export function getRectLayout(n: number): RectLayout {
  const cols = n + 1;
  const rows = n;
  const cell = Math.min(26, 300 / cols, 310 / Math.max(rows, 1));
  const width = cols * cell;
  const height = rows * cell;
  return {
    x: 560,
    y: 64 + (310 - height) / 2,
    cell,
    cols,
    rows,
    width,
    height,
  };
}

/**
 * Rectangle cell (row r, col c) in 0-based indices, top-left of the grid.
 * Even-row i fills:
 *   - triangle A: row i-1, columns 0 .. i-1
 *   - triangle B: row n-i, columns (n+1-i) .. n
 * Together each rectangle row k has k + (n+1-k) = n+1 cells.
 */
export function cellCenter(rect: RectLayout, row: number, col: number): Point {
  return {
    x: rect.x + (col + 0.5) * rect.cell,
    y: rect.y + (row + 0.5) * rect.cell,
  };
}

export function getRowLayouts(n: number): RowLayout[] {
  const nn = assertDomain(n);
  const rect = getRectLayout(nn);
  const leftCenterX = 248;
  const topY = 72;
  const availH = 300;
  const rowGap = Math.min(36, availH / nn);
  const colGap = Math.min(18, 300 / (2 * nn));

  const layouts: RowLayout[] = [];
  for (let i = 1; i <= nn; i++) {
    const dots = evenTerm(i);
    const y = topY + (i - 1) * rowGap + rowGap * 0.15;
    const totalW = (dots - 1) * colGap;
    const startX = leftCenterX - totalW / 2;
    const homeDots: Point[] = [];
    for (let d = 0; d < dots; d++) {
      homeDots.push({ x: startX + d * colGap, y });
    }

    const groupA: Point[] = [];
    for (let c = 0; c < i; c++) {
      groupA.push(cellCenter(rect, i - 1, c));
    }
    const groupB: Point[] = [];
    const bRow = nn - i;
    const bStartCol = nn + 1 - i;
    for (let k = 0; k < i; k++) {
      groupB.push(cellCenter(rect, bRow, bStartCol + k));
    }

    layouts.push({
      i,
      color: rowColor(i),
      evenValue: dots,
      homeDots,
      homeCentroid: centroid(homeDots),
      groupA,
      groupB,
      dockCentroid: centroid([...groupA, ...groupB]),
    });
  }
  return layouts;
}

export function getSnapTargets(n: number): { i: number; x: number; y: number }[] {
  return getRowLayouts(n).map((r) => ({ i: r.i, x: r.dockCentroid.x, y: r.dockCentroid.y }));
}

/** Count-preserving dock: only row i may occupy the cells assigned to even-term 2i. */
export function isCompatibleRow(dragRow: number, targetRow: number): boolean {
  return dragRow === targetRow;
}

export function rowTargetPoints(layout: RowLayout): Point[] {
  return [centroid(layout.groupA), centroid(layout.groupB), layout.dockCentroid];
}

export function minDistToRowTarget(x: number, y: number, layout: RowLayout): number {
  return Math.min(...rowTargetPoints(layout).map((p) => Math.hypot(x - p.x, y - p.y)));
}

export function targetBounds(layout: RowLayout): { x: number; y: number; w: number; h: number } {
  const pts = [...layout.groupA, ...layout.groupB];
  const pad = DOT_R + 5;
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  return {
    x: minX,
    y: minY,
    w: Math.max(...xs) - minX + pad,
    h: Math.max(...ys) - minY + pad,
  };
}

export function countDotsInRows(n: number): number {
  return evenSum(n);
}

export function invariantHolds(n: number): boolean {
  return evenSum(n) === rectangleArea(n) && evenSum(n) === 2 * triangular(n);
}
