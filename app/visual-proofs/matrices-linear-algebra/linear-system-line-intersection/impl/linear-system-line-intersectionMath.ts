import { LinearEquation } from "./linear-system-line-intersectionConfig";

export interface SystemSolution {
  type: "unique" | "parallel" | "coincident";
  det: number;
  intersection: { x: number; y: number } | null;
  eq1Verified: boolean;
  eq2Verified: boolean;
  explanation: string;
}

export function computeDeterminant(
  a1: number,
  b1: number,
  a2: number,
  b2: number,
): number {
  return a1 * b2 - b1 * a2;
}

export function solveLinearSystem(
  eq1: LinearEquation,
  eq2: LinearEquation,
): SystemSolution {
  const det = computeDeterminant(eq1.a, eq1.b, eq2.a, eq2.b);

  if (Math.abs(det) < 0.0001) {
    // Check if lines are coincident (infinitely many solutions) or parallel (no solution)
    const cross1 = eq1.a * eq2.c - eq1.c * eq2.a;
    const cross2 = eq1.b * eq2.c - eq1.c * eq2.b;

    if (Math.abs(cross1) < 0.0001 && Math.abs(cross2) < 0.0001) {
      return {
        type: "coincident",
        det: 0,
        intersection: null,
        eq1Verified: true,
        eq2Verified: true,
        explanation: "det(A) = 0 and constants are proportional: Coincident lines (infinitely many solutions).",
      };
    } else {
      return {
        type: "parallel",
        det: 0,
        intersection: null,
        eq1Verified: false,
        eq2Verified: false,
        explanation: "det(A) = 0 and constants are not proportional: Parallel lines (no solution).",
      };
    }
  }

  // Cramer's rule for unique solution
  const x = (eq1.c * eq2.b - eq1.b * eq2.c) / det;
  const y = (eq1.a * eq2.c - eq1.c * eq2.a) / det;

  const eq1Val = eq1.a * x + eq1.b * y;
  const eq2Val = eq2.a * x + eq2.b * y;

  const eq1Verified = Math.abs(eq1Val - eq1.c) < 0.001;
  const eq2Verified = Math.abs(eq2Val - eq2.c) < 0.001;

  return {
    type: "unique",
    det,
    intersection: { x, y },
    eq1Verified,
    eq2Verified,
    explanation: `det(A) = ${det.toFixed(1)} ≠ 0 implies a unique intersection at (${x.toFixed(1)}, ${y.toFixed(1)}).`,
  };
}

export interface LineSegmentCoords {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function computeLineSegment(
  eq: LinearEquation,
  bound: number = 7,
): LineSegmentCoords {
  // ax + by = c
  if (Math.abs(eq.b) > 0.0001) {
    // y = (c - ax) / b
    const x1 = -bound;
    const y1 = (eq.c - eq.a * x1) / eq.b;
    const x2 = bound;
    const y2 = (eq.c - eq.a * x2) / eq.b;
    return { x1, y1, x2, y2 };
  } else if (Math.abs(eq.a) > 0.0001) {
    // Vertical line x = c / a
    const x = eq.c / eq.a;
    return { x1: x, y1: -bound, x2: x, y2: bound };
  }
  return { x1: 0, y1: 0, x2: 0, y2: 0 };
}

export function toFraction(val: number, maxDenom: number = 12): { num: number; den: number } {
  if (Math.abs(val - Math.round(val)) < 0.0001) {
    return { num: Math.round(val), den: 1 };
  }
  const sign = val < 0 ? -1 : 1;
  const absVal = Math.abs(val);

  let bestNum = Math.round(absVal);
  let bestDen = 1;
  let bestErr = Math.abs(absVal - bestNum);

  for (let den = 2; den <= maxDenom; den++) {
    const num = Math.round(absVal * den);
    const err = Math.abs(absVal - num / den);
    if (err < bestErr && err < 0.005) {
      bestNum = num;
      bestDen = den;
      bestErr = err;
    }
  }

  return { num: sign * bestNum, den: bestDen };
}

export function toFractionTex(val: number): string {
  const { num, den } = toFraction(val);
  if (den === 1) return `${num}`;
  if (num < 0) return `-\\frac{${Math.abs(num)}}{${den}}`;
  return `\\frac{${num}}{${den}}`;
}

export function formatEquation(eq: LinearEquation): string {
  let str = "";
  if (eq.a === 1) str += "x";
  else if (eq.a === -1) str += "-x";
  else if (eq.a !== 0) str += `${eq.a}x`;

  if (eq.b === 1) {
    str += str ? " + y" : "y";
  } else if (eq.b === -1) {
    str += str ? " - y" : "-y";
  } else if (eq.b > 0) {
    str += str ? ` + ${eq.b}y` : `${eq.b}y`;
  } else if (eq.b < 0) {
    str += str ? ` - ${Math.abs(eq.b)}y` : `-${Math.abs(eq.b)}y`;
  }

  if (!str) str = "0";
  str += ` = ${eq.c}`;
  return str;
}

export function formatDeterminantCalculationTex(
  eq1: LinearEquation,
  eq2: LinearEquation,
): string {
  const b1Str = eq1.b < 0 ? `(${eq1.b})` : `${eq1.b}`;
  const a2Str = eq2.a < 0 ? `(${eq2.a})` : `${eq2.a}`;
  const b2Str = eq2.b < 0 ? `(${eq2.b})` : `${eq2.b}`;
  const det = computeDeterminant(eq1.a, eq1.b, eq2.a, eq2.b);

  return `\\det(A) = ${eq1.a}${b2Str} - ${b1Str}${a2Str} = ${det.toFixed(0)}`;
}

export interface RowReducedData {
  r1: [number, number, number];
  r2: [number, number, number];
  r1Tex: [string, string, string];
  r2Tex: [string, string, string];
  matrixTex: string;
}

export function computeRowReducedEchelon(
  eq1: LinearEquation,
  eq2: LinearEquation,
): RowReducedData {
  if (Math.abs(eq1.a) > 0.0001) {
    const scale1 = eq1.a;
    const r1_0 = 1;
    const r1_1 = eq1.b / scale1;
    const r1_2 = eq1.c / scale1;

    const factor = eq2.a;
    const r2_0 = 0;
    const r2_1 = eq2.b - factor * r1_1;
    const r2_2 = eq2.c - factor * r1_2;

    const r1Tex: [string, string, string] = [
      "1",
      toFractionTex(r1_1),
      toFractionTex(r1_2),
    ];
    const r2Tex: [string, string, string] = [
      "0",
      toFractionTex(r2_1),
      toFractionTex(r2_2),
    ];

    const matrixTex = `\\begin{bmatrix} ${r1Tex[0]} & ${r1Tex[1]} & ${r1Tex[2]} \\\\ ${r2Tex[0]} & ${r2Tex[1]} & ${r2Tex[2]} \\end{bmatrix}`;

    return {
      r1: [r1_0, r1_1, r1_2],
      r2: [r2_0, r2_1, r2_2],
      r1Tex,
      r2Tex,
      matrixTex,
    };
  }

  const r1Tex: [string, string, string] = [
    toFractionTex(eq1.a),
    toFractionTex(eq1.b),
    toFractionTex(eq1.c),
  ];
  const r2Tex: [string, string, string] = [
    toFractionTex(eq2.a),
    toFractionTex(eq2.b),
    toFractionTex(eq2.c),
  ];

  const matrixTex = `\\begin{bmatrix} ${r1Tex[0]} & ${r1Tex[1]} & ${r1Tex[2]} \\\\ ${r2Tex[0]} & ${r2Tex[1]} & ${r2Tex[2]} \\end{bmatrix}`;

  return {
    r1: [eq1.a, eq1.b, eq1.c],
    r2: [eq2.a, eq2.b, eq2.c],
    r1Tex,
    r2Tex,
    matrixTex,
  };
}

export interface ReductionStep {
  stepIndex: number;
  title: string;
  operationLabel: string;
  explanation: string;
  r1: [number, number, number];
  r2: [number, number, number];
  r1Tex: [string, string, string];
  r2Tex: [string, string, string];
  matrixTex: string;
}

export function computeStepByStepReduction(
  eq1: LinearEquation,
  eq2: LinearEquation,
): ReductionStep[] {
  const steps: ReductionStep[] = [];

  // Step 0: Original Augmented Matrix [A | b]
  const r1_0: [number, number, number] = [eq1.a, eq1.b, eq1.c];
  const r2_0: [number, number, number] = [eq2.a, eq2.b, eq2.c];
  const r1Tex_0: [string, string, string] = [
    toFractionTex(eq1.a),
    toFractionTex(eq1.b),
    toFractionTex(eq1.c),
  ];
  const r2Tex_0: [string, string, string] = [
    toFractionTex(eq2.a),
    toFractionTex(eq2.b),
    toFractionTex(eq2.c),
  ];
  steps.push({
    stepIndex: 0,
    title: "Step 0: Initial Augmented Matrix",
    operationLabel: "[A | b]",
    explanation: "Original system of equations represented in augmented matrix form.",
    r1: r1_0,
    r2: r2_0,
    r1Tex: r1Tex_0,
    r2Tex: r2Tex_0,
    matrixTex: `\\begin{bmatrix} ${r1Tex_0[0]} & ${r1Tex_0[1]} & | & ${r1Tex_0[2]} \\\\ ${r2Tex_0[0]} & ${r2Tex_0[1]} & | & ${r2Tex_0[2]} \\end{bmatrix}`,
  });

  if (Math.abs(eq1.a) < 0.0001) {
    return steps;
  }

  // Step 1: Eliminate x from Row 2 (R2 -> R2 - (a2/a1)R1)
  const factor = eq2.a / eq1.a;
  const r1_1: [number, number, number] = [eq1.a, eq1.b, eq1.c];
  const r2_1: [number, number, number] = [
    0,
    eq2.b - factor * eq1.b,
    eq2.c - factor * eq1.c,
  ];
  const r1Tex_1 = r1Tex_0;
  const r2Tex_1: [string, string, string] = [
    "0",
    toFractionTex(r2_1[1]),
    toFractionTex(r2_1[2]),
  ];
  steps.push({
    stepIndex: 1,
    title: "Step 1: Eliminate x from Row 2",
    operationLabel: `R₂ → R₂ - (${toFractionTex(factor)})R₁`,
    explanation: `Multiplied Row 1 by ${toFractionTex(factor)} and subtracted from Row 2 to create a zero in the first column.`,
    r1: r1_1,
    r2: r2_1,
    r1Tex: r1Tex_1,
    r2Tex: r2Tex_1,
    matrixTex: `\\begin{bmatrix} ${r1Tex_1[0]} & ${r1Tex_1[1]} & | & ${r1Tex_1[2]} \\\\ ${r2Tex_1[0]} & ${r2Tex_1[1]} & | & ${r2Tex_1[2]} \\end{bmatrix}`,
  });

  if (Math.abs(r2_1[1]) < 0.0001) {
    return steps;
  }

  // Step 2: Normalize Row 2 to solve for y (R2 -> R2 / b2')
  const scale2 = r2_1[1];
  const r1_2 = r1_1;
  const r2_2: [number, number, number] = [0, 1, r2_1[2] / scale2];
  const r1Tex_2 = r1Tex_1;
  const r2Tex_2: [string, string, string] = ["0", "1", toFractionTex(r2_2[2])];
  steps.push({
    stepIndex: 2,
    title: "Step 2: Solve for y in Row 2",
    operationLabel: `R₂ → R₂ / (${toFractionTex(scale2)})`,
    explanation: `Divided Row 2 by ${toFractionTex(scale2)} to get y = ${toFractionTex(r2_2[2])}.`,
    r1: r1_2,
    r2: r2_2,
    r1Tex: r1Tex_2,
    r2Tex: r2Tex_2,
    matrixTex: `\\begin{bmatrix} ${r1Tex_2[0]} & ${r1Tex_2[1]} & | & ${r1Tex_2[2]} \\\\ ${r2Tex_2[0]} & ${r2Tex_2[1]} & | & ${r2Tex_2[2]} \\end{bmatrix}`,
  });

  // Step 3: Back-substitute into Row 1 to find x (Reduced Row Echelon Form)
  const yVal = r2_2[2];
  const xVal = (eq1.c - eq1.b * yVal) / eq1.a;
  const r1_3: [number, number, number] = [1, 0, xVal];
  const r2_3: [number, number, number] = [0, 1, yVal];
  const r1Tex_3: [string, string, string] = ["1", "0", toFractionTex(xVal)];
  const r2Tex_3: [string, string, string] = ["0", "1", toFractionTex(yVal)];
  steps.push({
    stepIndex: 3,
    title: "Step 3: Back-Substitute to Find x (RREF)",
    operationLabel: "R₁ → (R₁ - b₁R₂) / a₁",
    explanation: `Substituted y = ${toFractionTex(yVal)} back into Row 1 to get x = ${toFractionTex(xVal)}. Full identity matrix [I | x] reached!`,
    r1: r1_3,
    r2: r2_3,
    r1Tex: r1Tex_3,
    r2Tex: r2Tex_3,
    matrixTex: `\\begin{bmatrix} 1 & 0 & | & ${r1Tex_3[2]} \\\\ 0 & 1 & | & ${r2Tex_3[2]} \\end{bmatrix}`,
  });

  return steps;
}

export function formatRowOpEliminateLabel(
  eq1: LinearEquation,
  eq2: LinearEquation,
): string {
  if (Math.abs(eq1.a) < 0.0001) return "R₂ → R₂";
  const factor = eq2.a / eq1.a;
  if (Math.abs(factor - 0.5) < 0.01) {
    return "R₂ → R₂ - ½R₁";
  }
  if (Math.abs(factor - 1) < 0.01) {
    return "R₂ → R₂ - R₁";
  }
  if (Math.abs(factor - 2) < 0.01) {
    return "R₂ → R₂ - 2R₁";
  }
  const frac = toFraction(factor);
  if (frac.den === 1) {
    return factor > 0 ? `R₂ → R₂ - ${frac.num}R₁` : `R₂ → R₂ + ${Math.abs(frac.num)}R₁`;
  }
  return factor > 0
    ? `R₂ → R₂ - (${frac.num}/${frac.den})R₁`
    : `R₂ → R₂ + (${Math.abs(frac.num)}/${frac.den})R₁`;
}

export function checkIntersectionInvariant(
  eq1: LinearEquation,
  eq2: LinearEquation,
  x: number,
  y: number,
): boolean {
  const check1 = Math.abs(eq1.a * x + eq1.b * y - eq1.c) < 0.001;
  const check2 = Math.abs(eq2.a * x + eq2.b * y - eq2.c) < 0.001;
  return check1 && check2;
}
