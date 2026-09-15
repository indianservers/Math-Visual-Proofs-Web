import { Matrix2x2, Vector2D } from "./matrix-linear-transformation-gridConfig";

export function transformVector(A: Matrix2x2, v: Vector2D): Vector2D {
  return {
    x: A.a * v.x + A.c * v.y,
    y: A.b * v.x + A.d * v.y,
  };
}

export function computeDeterminant(A: Matrix2x2): number {
  return A.a * A.d - A.b * A.c;
}

export function computeAreaScale(A: Matrix2x2): number {
  return Math.abs(computeDeterminant(A));
}

export function getOrientationStatus(A: Matrix2x2): {
  status: "Preserved" | "Reversed" | "Collapsed";
  color: string;
} {
  const det = computeDeterminant(A);
  if (Math.abs(det) < 0.0001) {
    return { status: "Collapsed", color: "#dc2626" };
  }
  if (det > 0) {
    return { status: "Preserved", color: "#166534" };
  }
  return { status: "Reversed", color: "#d97706" };
}

export interface GridLineSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isAxis: boolean;
}

export function generateCartesianGrid(
  range: number = 3,
  step: number = 1,
): GridLineSegment[] {
  const lines: GridLineSegment[] = [];

  // Vertical lines
  for (let x = -range; x <= range; x += step) {
    lines.push({
      x1: x,
      y1: -range,
      x2: x,
      y2: range,
      isAxis: x === 0,
    });
  }

  // Horizontal lines
  for (let y = -range; y <= range; y += step) {
    lines.push({
      x1: -range,
      y1: y,
      x2: range,
      y2: y,
      isAxis: y === 0,
    });
  }

  return lines;
}

export function generateTransformedGrid(
  A: Matrix2x2,
  range: number = 3,
  step: number = 1,
): GridLineSegment[] {
  const baseLines = generateCartesianGrid(range, step);
  return baseLines.map((line) => {
    const p1 = transformVector(A, { x: line.x1, y: line.y1 });
    const p2 = transformVector(A, { x: line.x2, y: line.y2 });
    return {
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y,
      isAxis: line.isAxis,
    };
  });
}

export function checkLinearityInvariant(
  A: Matrix2x2,
  v: Vector2D,
): { isValid: boolean; Av: Vector2D; combination: Vector2D } {
  const Av = transformVector(A, v);
  const Ae1 = transformVector(A, { x: 1, y: 0 });
  const Ae2 = transformVector(A, { x: 0, y: 1 });

  const combination = {
    x: v.x * Ae1.x + v.y * Ae2.x,
    y: v.x * Ae1.y + v.y * Ae2.y,
  };

  const diffX = Math.abs(Av.x - combination.x);
  const diffY = Math.abs(Av.y - combination.y);
  const isValid = diffX < 0.0001 && diffY < 0.0001;

  return { isValid, Av, combination };
}
