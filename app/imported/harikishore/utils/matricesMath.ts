import { Point } from './geometry';

export interface Matrix2x2 {
  a: number; // M[0][0] = i'_x
  b: number; // M[1][0] = i'_y
  c: number; // M[0][1] = j'_x
  d: number; // M[1][1] = j'_y
}

export const IDENTITY_MATRIX: Matrix2x2 = { a: 1, b: 0, c: 0, d: 1 };

export function transformPoint(p: Point, m: Matrix2x2): Point {
  return {
    x: m.a * p.x + m.c * p.y,
    y: m.b * p.x + m.d * p.y,
  };
}

export function getDeterminant(m: Matrix2x2): number {
  return m.a * m.d - m.b * m.c;
}

export interface MatrixInverseDetails {
  isInvertible: boolean;
  det: number;
  detSteps: string;
  adjugate: Matrix2x2;
  inverse: Matrix2x2 | null;
  inverseFormatted: {
    a: string;
    b: string;
    c: string;
    d: string;
  } | null;
  reasonNonInvertible?: string;
}

export function computeMatrixInverse(m: Matrix2x2): MatrixInverseDetails {
  const det = m.a * m.d - m.b * m.c;
  const roundedDet = Math.round(det * 10000) / 10000;
  const detSteps = `(${m.a})(${m.d}) - (${m.b})(${m.c}) = ${roundedDet}`;

  const adjugate: Matrix2x2 = {
    a: m.d,
    b: -m.b,
    c: -m.c,
    d: m.a,
  };

  if (Math.abs(roundedDet) < 1e-5) {
    return {
      isInvertible: false,
      det: roundedDet,
      detSteps,
      adjugate,
      inverse: null,
      inverseFormatted: null,
      reasonNonInvertible:
        'The determinant is 0. This matrix squashes the entire 2D plane into a flat 1D line or single point. Since multiple points collapse together, this action cannot be reversed (no inverse exists).',
    };
  }

  const inv: Matrix2x2 = {
    a: Math.round((m.d / det) * 100) / 100,
    b: Math.round((-m.b / det) * 100) / 100,
    c: Math.round((-m.c / det) * 100) / 100,
    d: Math.round((m.a / det) * 100) / 100,
  };

  return {
    isInvertible: true,
    det: roundedDet,
    detSteps,
    adjugate,
    inverse: inv,
    inverseFormatted: {
      a: `${inv.a}`,
      b: `${inv.b}`,
      c: `${inv.c}`,
      d: `${inv.d}`,
    },
  };
}

export function multiplyMatrices(m1: Matrix2x2, m2: Matrix2x2): Matrix2x2 {
  return {
    a: Math.round((m1.a * m2.a + m1.c * m2.b) * 1000) / 1000,
    b: Math.round((m1.b * m2.a + m1.d * m2.b) * 1000) / 1000,
    c: Math.round((m1.a * m2.c + m1.c * m2.d) * 1000) / 1000,
    d: Math.round((m1.b * m2.c + m1.d * m2.d) * 1000) / 1000,
  };
}

export function interpolateMatrix(from: Matrix2x2, to: Matrix2x2, t: number): Matrix2x2 {
  const ease = 0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, Math.min(1, t)));
  return {
    a: from.a + (to.a - from.a) * ease,
    b: from.b + (to.b - from.b) * ease,
    c: from.c + (to.c - from.c) * ease,
    d: from.d + (to.d - from.d) * ease,
  };
}

export function pointsToSvgPolygon(points: Point[], scale: number = 40, cx: number = 140, cy: number = 120): string {
  return points
    .map((p, i) => {
      const screenX = cx + p.x * scale;
      const screenY = cy - p.y * scale;
      return `${i === 0 ? 'M' : 'L'} ${screenX.toFixed(1)},${screenY.toFixed(1)}`;
    })
    .join(' ') + ' Z';
}

export function generateTransformedGridLines(
  m: Matrix2x2,
  range: number = 3,
  scale: number = 40,
  cx: number = 140,
  cy: number = 120
): { xLines: { x1: number; y1: number; x2: number; y2: number }[]; yLines: { x1: number; y1: number; x2: number; y2: number }[] } {
  const xLines = [];
  const yLines = [];

  for (let i = -range; i <= range; i++) {
    const p1 = transformPoint({ x: i, y: -range }, m);
    const p2 = transformPoint({ x: i, y: range }, m);
    xLines.push({
      x1: cx + p1.x * scale,
      y1: cy - p1.y * scale,
      x2: cx + p2.x * scale,
      y2: cy - p2.y * scale,
    });

    const hp1 = transformPoint({ x: -range, y: i }, m);
    const hp2 = transformPoint({ x: range, y: i }, m);
    yLines.push({
      x1: cx + hp1.x * scale,
      y1: cy - hp1.y * scale,
      x2: cx + hp2.x * scale,
      y2: cy - hp2.y * scale,
    });
  }

  return { xLines, yLines };
}
