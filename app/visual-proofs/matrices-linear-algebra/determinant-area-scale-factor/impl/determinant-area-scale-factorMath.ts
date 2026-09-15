import { MatrixEntries } from "./determinant-area-scale-factorConfig";

export interface ParallelogramVertices {
  p0: { x: number; y: number }; // Origin (0, 0)
  p1: { x: number; y: number }; // Ae1 = (a, c)
  p2: { x: number; y: number }; // C' = Ae1 + Ae2 = (a + b, c + d)
  p3: { x: number; y: number }; // D' = Ae2 = (b, d)
}

export function calculateDeterminant(A: MatrixEntries): number {
  return A.a * A.d - A.b * A.c;
}

export function calculateAreaScale(A: MatrixEntries): number {
  return Math.abs(calculateDeterminant(A));
}

export function getOrientation(A: MatrixEntries): {
  status: "Preserved" | "Reversed" | "Collapsed";
  color: string;
  signText: string;
} {
  const det = calculateDeterminant(A);
  const formatted = (det >= 0 ? `+${det.toFixed(2)}` : det.toFixed(2)) + "×";

  if (Math.abs(det) < 0.0001) {
    return { status: "Collapsed", color: "#dc2626", signText: "0.00×" };
  }
  if (det > 0) {
    return { status: "Preserved", color: "#166534", signText: formatted };
  }
  return { status: "Reversed", color: "#d97706", signText: formatted };
}

export function computeParallelogramVertices(A: MatrixEntries): ParallelogramVertices {
  return {
    p0: { x: 0, y: 0 },
    p1: { x: A.a, y: A.c },
    p2: { x: A.a + A.b, y: A.c + A.d },
    p3: { x: A.b, y: A.d },
  };
}

export function formatDeterminantCalculationTex(A: MatrixEntries): string {
  const ad = (A.a * A.d).toFixed(2);
  const bc = (A.b * A.c).toFixed(2);
  const det = calculateDeterminant(A).toFixed(2);
  const bFormatted = A.b < 0 ? `(${A.b.toFixed(2)})` : A.b.toFixed(2);
  return `\\det(A) = (${A.a.toFixed(2)})(${A.d.toFixed(2)}) - (${bFormatted})(${A.c.toFixed(2)}) = ${ad} - (${bc}) = ${det}`;
}

export function checkDeterminantAreaInvariant(
  A: MatrixEntries,
): { isValid: boolean; computedDet: number; area: number } {
  const det = calculateDeterminant(A);
  const area = calculateAreaScale(A);
  const vertices = computeParallelogramVertices(A);

  // Shoelace formula for polygon area:
  // 0.5 * |(x0*y1 - y0*x1) + (x1*y2 - y1*x2) + (x2*y3 - y2*x3) + (x3*y0 - y3*x0)|
  const shoelace =
    0.5 *
    Math.abs(
      vertices.p0.x * vertices.p1.y -
        vertices.p0.y * vertices.p1.x +
        (vertices.p1.x * vertices.p2.y - vertices.p1.y * vertices.p2.x) +
        (vertices.p2.x * vertices.p3.y - vertices.p2.y * vertices.p3.x) +
        (vertices.p3.x * vertices.p0.y - vertices.p3.y * vertices.p0.x),
    );

  const isValid = Math.abs(shoelace - area) < 0.0001;
  return { isValid, computedDet: det, area };
}
