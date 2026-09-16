import { Point } from './geometry';

export interface PlacedTile {
  id: string;
  cx: number;
  cy: number;
  rotationDeg: number;
  color?: string;
  strokeColor?: string;
}

/**
 * Generates an equilateral triangle centered at (cx, cy) with side length s
 */
export function getEquilateralTrianglePath(cx: number, cy: number, s: number, angleDeg: number = 0): string {
  const h = (s * Math.sqrt(3)) / 2;
  const r = (2 / 3) * h;
  const rad = (angleDeg * Math.PI) / 180;
  const pts: Point[] = [];

  for (let i = 0; i < 3; i++) {
    const theta = rad + (i * 2 * Math.PI) / 3 - Math.PI / 2;
    pts.push({
      x: cx + r * Math.cos(theta),
      y: cy + r * Math.sin(theta),
    });
  }
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';
}

/**
 * Generates a regular hexagon path centered at (cx, cy) with radius r
 */
export function getHexagonPath(cx: number, cy: number, r: number): string {
  const pts: Point[] = [];
  for (let i = 0; i < 6; i++) {
    const theta = (i * Math.PI) / 3;
    pts.push({
      x: cx + r * Math.cos(theta),
      y: cy + r * Math.sin(theta),
    });
  }
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';
}

/**
 * Generates a regular pentagon path centered at (cx, cy) with radius r
 */
export function getPentagonPath(cx: number, cy: number, r: number, rotationDeg: number = 0): string {
  const pts: Point[] = [];
  const startRad = ((rotationDeg - 90) * Math.PI) / 180;
  for (let i = 0; i < 5; i++) {
    const theta = startRad + (i * 2 * Math.PI) / 5;
    pts.push({
      x: cx + r * Math.cos(theta),
      y: cy + r * Math.sin(theta),
    });
  }
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';
}

/**
 * Generates regular grid tessellation coordinates
 */
export function generateHexTessellation(
  rows: number,
  cols: number,
  radius: number,
  originX: number = 140,
  originY: number = 120
): PlacedTile[] {
  const tiles: PlacedTile[] = [];
  const w = Math.sqrt(3) * radius;
  const h = 1.5 * radius;

  for (let r = -rows; r <= rows; r++) {
    for (let c = -cols; c <= cols; c++) {
      const cx = originX + c * w + (Math.abs(r) % 2 === 1 ? w / 2 : 0);
      const cy = originY + r * h;
      tiles.push({
        id: `hex-${r}-${c}`,
        cx,
        cy,
        rotationDeg: 0,
      });
    }
  }
  return tiles;
}

export function generateSquareTessellation(
  rows: number,
  cols: number,
  size: number,
  originX: number = 140,
  originY: number = 120
): PlacedTile[] {
  const tiles: PlacedTile[] = [];
  for (let r = -rows; r <= rows; r++) {
    for (let c = -cols; c <= cols; c++) {
      tiles.push({
        id: `sq-${r}-${c}`,
        cx: originX + c * size,
        cy: originY + r * size,
        rotationDeg: 0,
      });
    }
  }
  return tiles;
}
