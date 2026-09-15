import {
  AugmentedMatrixState,
  AugmentedRow,
  RowOperationType,
} from "./row-operations-preserve-solutionsConfig";

export interface SystemIntersection {
  type: "unique" | "parallel" | "coincident";
  det: number;
  intersection: { x: number; y: number } | null;
  eq1Verified: boolean;
  eq2Verified: boolean;
}

export function solveAugmentedSystem(matrix: AugmentedMatrixState): SystemIntersection {
  const det = matrix.row1.a * matrix.row2.b - matrix.row1.b * matrix.row2.a;

  if (Math.abs(det) < 0.0001) {
    const cross1 = matrix.row1.a * matrix.row2.c - matrix.row1.c * matrix.row2.a;
    const cross2 = matrix.row1.b * matrix.row2.c - matrix.row1.c * matrix.row2.b;

    if (Math.abs(cross1) < 0.0001 && Math.abs(cross2) < 0.0001) {
      return {
        type: "coincident",
        det: 0,
        intersection: null,
        eq1Verified: true,
        eq2Verified: true,
      };
    } else {
      return {
        type: "parallel",
        det: 0,
        intersection: null,
        eq1Verified: false,
        eq2Verified: false,
      };
    }
  }

  const x = (matrix.row1.c * matrix.row2.b - matrix.row1.b * matrix.row2.c) / det;
  const y = (matrix.row1.a * matrix.row2.c - matrix.row1.c * matrix.row2.a) / det;

  const eq1Val = matrix.row1.a * x + matrix.row1.b * y;
  const eq2Val = matrix.row2.a * x + matrix.row2.b * y;

  return {
    type: "unique",
    det,
    intersection: { x, y },
    eq1Verified: Math.abs(eq1Val - matrix.row1.c) < 0.001,
    eq2Verified: Math.abs(eq2Val - matrix.row2.c) < 0.001,
  };
}

export function applyRowOp(
  matrix: AugmentedMatrixState,
  op: RowOperationType,
  k: number = 1,
): AugmentedMatrixState {
  switch (op) {
    case "swap":
      return {
        row1: { ...matrix.row2 },
        row2: { ...matrix.row1 },
      };

    case "add_k_r2_to_r1":
      return {
        row1: {
          a: matrix.row1.a + k * matrix.row2.a,
          b: matrix.row1.b + k * matrix.row2.b,
          c: matrix.row1.c + k * matrix.row2.c,
        },
        row2: { ...matrix.row2 },
      };

    case "add_k_r1_to_r2":
      return {
        row1: { ...matrix.row1 },
        row2: {
          a: matrix.row2.a + k * matrix.row1.a,
          b: matrix.row2.b + k * matrix.row1.b,
          c: matrix.row2.c + k * matrix.row1.c,
        },
      };

    case "scale_r1":
      return {
        row1: {
          a: matrix.row1.a * k,
          b: matrix.row1.b * k,
          c: matrix.row1.c * k,
        },
        row2: { ...matrix.row2 },
      };

    case "scale_r2":
      return {
        row1: { ...matrix.row1 },
        row2: {
          a: matrix.row2.a * k,
          b: matrix.row2.b * k,
          c: matrix.row2.c * k,
        },
      };

    default:
      return matrix;
  }
}

export interface LineSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function computeLineSegment(row: AugmentedRow, bound: number = 5): LineSegment {
  if (Math.abs(row.b) > 0.0001) {
    const x1 = -bound;
    const y1 = (row.c - row.a * x1) / row.b;
    const x2 = bound;
    const y2 = (row.c - row.a * x2) / row.b;
    return { x1, y1, x2, y2 };
  } else if (Math.abs(row.a) > 0.0001) {
    const x = row.c / row.a;
    return { x1: x, y1: -bound, x2: x, y2: bound };
  }
  return { x1: 0, y1: 0, x2: 0, y2: 0 };
}

export function formatEquation(row: AugmentedRow): string {
  let str = "";
  if (row.a === 1) str += "x";
  else if (row.a === -1) str += "-x";
  else if (row.a !== 0) str += `${row.a}x`;

  if (row.b === 1) {
    str += str ? " + y" : "y";
  } else if (row.b === -1) {
    str += str ? " - y" : "-y";
  } else if (row.b > 0) {
    str += str ? ` + ${row.b}y` : `${row.b}y`;
  } else if (row.b < 0) {
    str += str ? ` - ${Math.abs(row.b)}y` : `-${Math.abs(row.b)}y`;
  }

  if (!str) str = "0";
  str += ` = ${row.c}`;
  return str;
}

export function checkEquivalenceInvariant(
  sys1: AugmentedMatrixState,
  sys2: AugmentedMatrixState,
): { isEquivalent: boolean; sol1: SystemIntersection; sol2: SystemIntersection } {
  const sol1 = solveAugmentedSystem(sys1);
  const sol2 = solveAugmentedSystem(sys2);

  if (sol1.type !== sol2.type) {
    return { isEquivalent: false, sol1, sol2 };
  }

  if (sol1.type === "unique" && sol2.type === "unique") {
    const diffX = Math.abs(sol1.intersection!.x - sol2.intersection!.x);
    const diffY = Math.abs(sol1.intersection!.y - sol2.intersection!.y);
    const isEquivalent = diffX < 0.001 && diffY < 0.001;
    return { isEquivalent, sol1, sol2 };
  }

  return { isEquivalent: true, sol1, sol2 };
}
