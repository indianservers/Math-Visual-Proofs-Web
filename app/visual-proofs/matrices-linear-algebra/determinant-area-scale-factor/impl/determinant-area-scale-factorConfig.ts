export const PROOF_META = {
  id: "determinant-area-scale-factor",
  title: "Determinant as Area Scale Factor",
  subtitle: "A linear transformation scales area by det(A) and may flip orientation.",
  mission: "Transform the unit square and compare parallelogram area with ad-bc.",
  actionGoal: "Observe how matrix entries scale the unit square area by |det(A)| and reflect orientation when det(A) < 0",
  difficulty: "Intermediate",
  durationMinutes: 12,
  category: "Matrices and Linear Algebra",
  route: "/visual-proofs/matrices-linear-algebra/determinant-area-scale-factor",
};

export interface MatrixEntries {
  a: number; // Row 1, Col 1
  b: number; // Row 1, Col 2
  c: number; // Row 2, Col 1
  d: number; // Row 2, Col 2
}

export interface QuickMatrixPreset {
  id: string;
  letter: string;
  name: string;
  matrix: MatrixEntries;
  description: string;
}

export const QUICK_PRESETS: QuickMatrixPreset[] = [
  {
    id: "default",
    letter: "D",
    name: "Custom (108)",
    matrix: { a: 1.4, b: -0.6, c: 0.8, d: 1.1 },
    description: "det(A) = 1.4(1.1) - (-0.6)(0.8) = +2.02 ≈ +2.00",
  },
  {
    id: "identity",
    letter: "I",
    name: "Identity",
    matrix: { a: 1, b: 0, c: 0, d: 1 },
    description: "Area scale = 1.00×, det(A) = 1",
  },
  {
    id: "rotation",
    letter: "R",
    name: "Rotation 90°",
    matrix: { a: 0, b: -1, c: 1, d: 0 },
    description: "Pure rotation preserves area, det(A) = 1",
  },
  {
    id: "scale",
    letter: "S",
    name: "Scale (2, 0.5)",
    matrix: { a: 2, b: 0, c: 0, d: 0.5 },
    description: "Scales x by 2 and y by 0.5, det(A) = 1",
  },
  {
    id: "flip",
    letter: "F",
    name: "Flip X-axis",
    matrix: { a: 1, b: 0, c: 0, d: -1 },
    description: "Reflects across x-axis, det(A) = -1 (Orientation Reversed)",
  },
];

export interface ChallengeData {
  targetParallelogram: {
    p0: { x: number; y: number };
    p1: { x: number; y: number };
    p2: { x: number; y: number };
    p3: { x: number; y: number };
  };
  expectedMatrix: MatrixEntries;
  expectedDet: number;
}

export const DEFAULT_CHALLENGE: ChallengeData = {
  targetParallelogram: {
    p0: { x: 0, y: 0 },
    p1: { x: 2, y: 0.5 },
    p2: { x: 2.5, y: 2 },
    p3: { x: 0.5, y: 1.5 },
  },
  expectedMatrix: { a: 2, b: 0.5, c: 0.5, d: 1.5 },
  expectedDet: 2.75,
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
    title: "1. Unit Square Area",
    label: "Notice standard unit square has Area = 1",
    prompt: "The unit square spanned by e1 = (1, 0) and e2 = (0, 1) has area exactly 1.",
    expectedAction: "Inspect the unit square on the left canvas.",
  },
  {
    id: "manipulate",
    title: "2. Transform into Parallelogram",
    label: "Map unit square through matrix A to create parallelogram",
    prompt: "The image of the unit square is a parallelogram spanned by Ae1 and Ae2.",
    expectedAction: "Observe the transformed parallelogram on the right canvas.",
  },
  {
    id: "preserve",
    title: "3. Area Scale Factor",
    label: "Compare parallelogram area with |ad - bc|",
    prompt: "The geometric area of the parallelogram is always |det(A)| = |ad - bc|.",
    expectedAction: "Verify that Area(image) = |det(A)|.",
  },
  {
    id: "connect",
    title: "4. Orientation & Sign",
    label: "Observe orientation: positive det preserves, negative det reverses",
    prompt: "When det(A) > 0, the counter-clockwise order is preserved. When det(A) < 0, the space is reflected.",
    expectedAction: "Test Flip or negative determinant matrices.",
  },
  {
    id: "conclude",
    title: "5. General Determinant Rule",
    label: "Generalize: any 2D region area scales by |det(A)|",
    prompt: "Because any region can be approximated by tiny squares, all 2D areas scale by |det(A)|.",
    expectedAction: "Review the 2D visual proof pipeline.",
  },
  {
    id: "transfer",
    title: "6. Inverse Challenge",
    label: "Find matrix A for the shown target parallelogram",
    prompt: "Enter matrix entries that map the unit square to the target parallelogram.",
    expectedAction: "Complete the challenge by entering matrix A.",
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
    title: "Notice the formula det(A) = ad - bc",
    content: "For matrix [[a, b], [c, d]], the determinant is the product of the main diagonal (a*d) minus the off-diagonal (b*c).",
  },
  {
    tier: "choose",
    title: "Columns are the edges of the parallelogram",
    content: "Ae1 = (a, c) is the first edge and Ae2 = (b, d) is the second edge.",
  },
  {
    tier: "predict",
    title: "Predict area scale",
    content: "For A = [[1.40, -0.60], [0.80, 1.10]], det(A) = 1.40*1.10 - (-0.60)*0.80 = 1.54 + 0.48 = 2.02.",
  },
  {
    tier: "guide",
    title: "Explore presets",
    content: "Try Rotation (det=1), Scale (det=1), and Flip (det=-1) to see area and orientation changes.",
  },
  {
    tier: "explain",
    title: "Why singular matrices collapse area",
    content: "When det(A) = 0, the columns are linearly dependent (parallel), flattening the square into a line with area 0.",
  },
];
