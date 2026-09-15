import { Matrix2x2, Vector2D } from "./matrix-inverse-undo-transformationConfig";

export interface InverseResult {
  isInvertible: boolean;
  det: number;
  inverse: Matrix2x2 | null;
  inverseTex: string;
}

export function computeDeterminant(A: Matrix2x2): number {
  return A.a * A.d - A.b * A.c;
}

export function computeInverse(A: Matrix2x2): InverseResult {
  const det = computeDeterminant(A);

  if (Math.abs(det) < 0.0001) {
    return {
      isInvertible: false,
      det: 0,
      inverse: null,
      inverseTex: "\\text{Not invertible (}\\det = 0\\text{)}",
    };
  }

  const invA: Matrix2x2 = {
    a: A.d / det,
    b: -A.b / det,
    c: -A.c / det,
    d: A.a / det,
  };

  const aTex = Number.isInteger(invA.a) ? `${invA.a}` : `${invA.a.toFixed(2)}`;
  const bTex = Number.isInteger(invA.b) ? `${invA.b}` : `${invA.b.toFixed(2)}`;
  const cTex = Number.isInteger(invA.c) ? `${invA.c}` : `${invA.c.toFixed(2)}`;
  const dTex = Number.isInteger(invA.d) ? `${invA.d}` : `${invA.d.toFixed(2)}`;

  const inverseTex = `\\begin{bmatrix} ${aTex} & ${bTex} \\\\ ${cTex} & ${dTex} \\end{bmatrix}`;

  return {
    isInvertible: true,
    det,
    inverse: invA,
    inverseTex,
  };
}

export function transformVector(A: Matrix2x2, v: Vector2D): Vector2D {
  return {
    x: A.a * v.x + A.b * v.y,
    y: A.c * v.x + A.d * v.y,
  };
}

export function computeUnitSquareParallelogram(A: Matrix2x2): Vector2D[] {
  const p0 = { x: 0, y: 0 };
  const p1 = { x: 1, y: 0 };
  const p2 = { x: 1, y: 1 };
  const p3 = { x: 0, y: 1 };

  return [
    transformVector(A, p0),
    transformVector(A, p1),
    transformVector(A, p2),
    transformVector(A, p3),
  ];
}

export function interpolateMatrix(
  from: Matrix2x2,
  to: Matrix2x2,
  t: number,
): Matrix2x2 {
  const clampedT = Math.max(0, Math.min(1, t));
  return {
    a: from.a + (to.a - from.a) * clampedT,
    b: from.b + (to.b - from.b) * clampedT,
    c: from.c + (to.c - from.c) * clampedT,
    d: from.d + (to.d - from.d) * clampedT,
  };
}
