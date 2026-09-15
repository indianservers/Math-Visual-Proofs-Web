export const PROOF_META = {
  id: "matrix-linear-transformation-grid",
  title: "Matrix as Linear Transformation",
  subtitle: "A matrix transforms the basis vectors. Any vector is the same combination of those images.",
  mission: "Move a 2D vector through a matrix and watch the coordinate grid deform.",
  actionGoal: "Observe columns as images of e1 and e2, and Av as x(Ae1) + y(Ae2)",
  difficulty: "Intermediate",
  durationMinutes: 12,
  category: "Matrices and Linear Algebra",
  route: "/visual-proofs/matrices-linear-algebra/matrix-linear-transformation-grid",
};

export interface Matrix2x2 {
  a: number; // Row 1, Col 1
  c: number; // Row 1, Col 2
  b: number; // Row 2, Col 1
  d: number; // Row 2, Col 2
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface TransformationPreset {
  id: string;
  name: string;
  matrix: Matrix2x2;
  labelTex: string;
  description: string;
}

export const PRESETS: TransformationPreset[] = [
  {
    id: "default",
    name: "Custom (107)",
    matrix: { a: 1.2, c: 0.6, b: 0.3, d: 1.1 },
    labelTex: "\\begin{bmatrix} 1.20 & 0.60 \\\\ 0.30 & 1.10 \\end{bmatrix}",
    description: "General non-singular affine grid deformation",
  },
  {
    id: "identity",
    name: "Identity I",
    matrix: { a: 1, c: 0, b: 0, d: 1 },
    labelTex: "I = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}",
    description: "Leaves all vectors and grid unchanged",
  },
  {
    id: "stretch-x",
    name: "Stretch x",
    matrix: { a: 2, c: 0, b: 0, d: 1 },
    labelTex: "\\begin{bmatrix} 2 & 0 \\\\ 0 & 1 \\end{bmatrix}",
    description: "Scales x-coordinates by factor of 2",
  },
  {
    id: "shear",
    name: "Shear",
    matrix: { a: 1, c: 1, b: 0, d: 1 },
    labelTex: "\\begin{bmatrix} 1 & 1 \\\\ 0 & 1 \\end{bmatrix}",
    description: "Shears horizontally proportional to y",
  },
  {
    id: "rotate-30",
    name: "Rotate 30°",
    matrix: {
      a: Math.cos(Math.PI / 6),
      c: -Math.sin(Math.PI / 6),
      b: Math.sin(Math.PI / 6),
      d: Math.cos(Math.PI / 6),
    },
    labelTex: "\\begin{bmatrix} \\cos 30^\\circ & -\\sin 30^\\circ \\\\ \\sin 30^\\circ & \\cos 30^\\circ \\end{bmatrix}",
    description: "Rotates the entire plane counter-clockwise by 30°",
  },
];

export interface ChallengeQuestion {
  matrixA: Matrix2x2;
  vectorV: Vector2D;
  options: Array<{ id: "A" | "B" | "C" | "D"; vector: Vector2D; isCorrect: boolean }>;
  explanation: string;
}

export const DEFAULT_CHALLENGE: ChallengeQuestion = {
  matrixA: { a: 1, c: 2, b: -1, d: 3 },
  vectorV: { x: 2, y: -1 },
  options: [
    { id: "A", vector: { x: 0, y: -5 }, isCorrect: true },
    { id: "B", vector: { x: 1, y: -1 }, isCorrect: false },
    { id: "C", vector: { x: -4, y: 1 }, isCorrect: false },
    { id: "D", vector: { x: 4, y: -5 }, isCorrect: false },
  ],
  explanation: "Av = 2[1, -1]^T + (-1)[2, 3]^T = [2 - 2, -2 - 3]^T = [0, -5]^T.",
};

export type ProofStepId = "inspect" | "manipulate" | "preserve" | "connect" | "conclude" | "transfer";

export interface ProofStepInfo {
  id: ProofStepId;
  title: string;
  label: string;
  prompt: string;
  expectedAction: string;
}

export const PROOF_STEPS: ProofStepInfo[] = [
  {
    id: "inspect",
    title: "1. Canonical Basis",
    label: "Inspect basis vectors e1 = (1, 0) and e2 = (0, 1)",
    prompt: "Notice the standard unit vectors on the left coordinate grid.",
    expectedAction: "Inspect the standard coordinate system and basis vectors.",
  },
  {
    id: "manipulate",
    title: "2. Transform Basis",
    label: "Observe where Matrix A maps e1 and e2",
    prompt: "See that Ae1 = (1.20, 0.30) is the 1st column of A and Ae2 = (0.60, 1.10) is the 2nd column.",
    expectedAction: "Observe columns of A on the transformed grid.",
  },
  {
    id: "preserve",
    title: "3. Linear Combination",
    label: "Trace Av = x(Ae1) + y(Ae2)",
    prompt: "Any vector v = x e1 + y e2 transforms to Av = x(Ae1) + y(Ae2).",
    expectedAction: "Move vector v to see Av follow the same combination.",
  },
  {
    id: "connect",
    title: "4. Area Scale & Det",
    label: "Connect grid area scale to |det(A)|",
    prompt: "The determinant det(A) gives the factor by which areas scale.",
    expectedAction: "Review the determinant and orientation card.",
  },
  {
    id: "conclude",
    title: "5. Space Transformation",
    label: "Understand matrices as geometric transformations",
    prompt: "A matrix is not just a table of numbers: it is a geometric transformation of space.",
    expectedAction: "Review the transformation presets (Stretch, Shear, Rotate).",
  },
  {
    id: "transfer",
    title: "6. Exact Challenge",
    label: "Compute Av for A = [[1, 2], [-1, 3]] and v = [2, -1]",
    prompt: "Select the correct output vector Av.",
    expectedAction: "Answer the multiple-choice challenge.",
  },
];

export interface HintItem {
  tier: "notice" | "choose" | "predict" | "guide" | "explain";
  title: string;
  content: string;
}

export const HINTS: HintItem[] = [
  {
    tier: "notice",
    title: "Look at the columns of A",
    content: "The first column of A tells you where (1, 0) goes. The second column tells you where (0, 1) goes.",
  },
  {
    tier: "choose",
    title: "Decompose vector v",
    content: "Write v = 2 e1 + 1 e2. Then its transformed image must be Av = 2(Ae1) + 1(Ae2).",
  },
  {
    tier: "predict",
    title: "Predict Av coordinates",
    content: "For v = (2, 1): Av = 2*(1.20, 0.30) + 1*(0.60, 1.10) = (2.40 + 0.60, 0.60 + 1.10) = (3.00, 1.70).",
  },
  {
    tier: "guide",
    title: "Test with presets",
    content: "Click 'Stretch x' or 'Rotate 30°' to see how specific matrix patterns deform the grid.",
  },
  {
    tier: "explain",
    title: "Geometric meaning of determinant",
    content: "The determinant det(A) = ad - bc represents the signed area of the transformed unit square.",
  },
];
