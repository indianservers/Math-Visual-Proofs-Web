import { Matrix2x2 } from "./eigenvectors-directions-do-not-turnConfig";

export interface Vector2D {
  x: number;
  y: number;
}

export interface EigenResult {
  hasRealEigenvalues: boolean;
  lambda1: number;
  lambda2: number;
  v1: Vector2D;
  v2: Vector2D;
  v1Display: Vector2D; // Scaled for pleasant canvas display (length ~ 2.2)
  v2Display: Vector2D; // Scaled for pleasant canvas display (length ~ 1.8)
  discriminant: number;
}

export function transformVector(A: Matrix2x2, v: Vector2D): Vector2D {
  return {
    x: A.a * v.x + A.b * v.y,
    y: A.c * v.x + A.d * v.y,
  };
}

export function normalizeVector(v: Vector2D): Vector2D {
  const len = Math.sqrt(v.x * v.x + v.y * v.y);
  if (len < 0.0001) return { x: 1, y: 0 };
  return { x: v.x / len, y: v.y / len };
}

export function computeEigensystem(A: Matrix2x2): EigenResult {
  const trace = A.a + A.d;
  const det = A.a * A.d - A.b * A.c;
  const discriminant = trace * trace - 4 * det;

  if (discriminant < 0) {
    return {
      hasRealEigenvalues: false,
      lambda1: 0,
      lambda2: 0,
      v1: { x: 1, y: 0 },
      v2: { x: 0, y: 1 },
      v1Display: { x: 1, y: 0 },
      v2Display: { x: 0, y: 1 },
      discriminant,
    };
  }

  const sqrtDisc = Math.sqrt(discriminant);
  const lambda1 = (trace + sqrtDisc) / 2;
  const lambda2 = (trace - sqrtDisc) / 2;

  // Compute eigenvector 1 for lambda1: (A - lambda1 * I) * v1 = 0
  let v1Raw: Vector2D;
  if (Math.abs(A.b) > 0.0001) {
    v1Raw = { x: A.b, y: lambda1 - A.a };
  } else if (Math.abs(A.c) > 0.0001) {
    v1Raw = { x: lambda1 - A.d, y: A.c };
  } else {
    v1Raw = { x: 1, y: 0 };
  }

  // Compute eigenvector 2 for lambda2: (A - lambda2 * I) * v2 = 0
  let v2Raw: Vector2D;
  if (Math.abs(A.b) > 0.0001) {
    v2Raw = { x: A.b, y: lambda2 - A.a };
  } else if (Math.abs(A.c) > 0.0001) {
    v2Raw = { x: lambda2 - A.d, y: A.c };
  } else {
    v2Raw = { x: 0, y: 1 };
  }

  const v1Unit = normalizeVector(v1Raw);
  const v2Unit = normalizeVector(v2Raw);

  // Ensure positive x for consistency or canonical quadrant
  const v1Norm = v1Unit.x < 0 ? { x: -v1Unit.x, y: -v1Unit.y } : v1Unit;
  const v2Norm = v2Unit.x < 0 ? { x: -v2Unit.x, y: -v2Unit.y } : v2Unit;

  // Display scale: v1 displayed with length ~2.3, v2 with length ~1.8
  const v1Display = { x: v1Norm.x * 2.3, y: v1Norm.y * 2.3 };
  const v2Display = { x: v2Norm.x * 1.8, y: v2Norm.y * 1.8 };

  return {
    hasRealEigenvalues: true,
    lambda1,
    lambda2,
    v1: v1Norm,
    v2: v2Norm,
    v1Display,
    v2Display,
    discriminant,
  };
}

export function checkCollinearity(v: Vector2D, Av: Vector2D): {
  isCollinear: boolean;
  angleDeg: number;
  scaleFactor: number;
} {
  const lenV = Math.sqrt(v.x * v.x + v.y * v.y);
  const lenAv = Math.sqrt(Av.x * Av.x + Av.y * Av.y);

  if (lenV < 0.0001 || lenAv < 0.0001) {
    return { isCollinear: true, angleDeg: 0, scaleFactor: 0 };
  }

  const dot = v.x * Av.x + v.y * Av.y;
  const cosTheta = Math.max(-1, Math.min(1, dot / (lenV * lenAv)));
  const angleRad = Math.acos(cosTheta);
  const angleDeg = (angleRad * 180) / Math.PI;

  const cross = Math.abs(v.x * Av.y - v.y * Av.x);
  const isCollinear = cross < 0.01 || angleDeg < 0.5 || Math.abs(angleDeg - 180) < 0.5;
  const scaleFactor = lenAv / lenV;

  return { isCollinear, angleDeg, scaleFactor };
}

export function generateEllipsePath(A: Matrix2x2, scale: number = 20, center: Vector2D = { x: 110, y: 90 }): string {
  const numPoints = 48;
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i <= numPoints; i++) {
    const theta = (i / numPoints) * 2 * Math.PI;
    const u = { x: Math.cos(theta), y: Math.sin(theta) };
    const Au = transformVector(A, u);
    points.push({
      x: center.x + Au.x * scale,
      y: center.y - Au.y * scale,
    });
  }

  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") + " Z";
}
