export const PROOF_META = {
  id: "matrix-inverse-undo-transformation",
  title: "Matrix Inverse as Undoing a Transformation",
  subtitle: "Applying A then A⁻¹ returns every vector to where it started.",
  mission: "Apply A and then A⁻¹ to return a vector and grid to the original state.",
  actionGoal: "Drag the matrix to transform the grid. Watch the path go out and come back.",
  difficulty: "Intermediate",
  durationMinutes: 10,
  category: "Matrices and Linear Algebra",
  route: "/visual-proofs/matrices-linear-algebra/matrix-inverse-undo-transformation",
};

export interface Matrix2x2 {
  a: number;
  b: number;
  c: number;
  d: number;
}

export const DEFAULT_MATRIX_A: Matrix2x2 = {
  a: 2,
  b: 1,
  c: 1,
  d: 1,
};

export interface Vector2D {
  x: number;
  y: number;
}

export const DEFAULT_POINT_P: Vector2D = {
  x: 0.5,
  y: 0.8,
};

export type AnimationStage = "start" | "apply_a" | "apply_a_inv" | "result";

export interface StageInfo {
  id: AnimationStage;
  label: string;
  sublabel: string;
}

export const ANIMATION_STAGES: StageInfo[] = [
  { id: "start", label: "Start", sublabel: "Initial unit square and point p" },
  { id: "apply_a", label: "Apply A", sublabel: "Forward transformation to Ap" },
  { id: "apply_a_inv", label: "Apply A⁻¹", sublabel: "Inverse transformation A⁻¹(Ap)" },
  { id: "result", label: "Result", sublabel: "Exact return to point p (A⁻¹A = I)" },
];

export interface ChallengeMatrixState {
  a: string;
  b: string;
  c: string;
  d: string;
}

export const CHALLENGE_MATRIX: Matrix2x2 = {
  a: 3,
  b: -1,
  c: 2,
  d: 1,
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
    title: "1. Initial Grid & Point p",
    label: "Inspect matrix A = [[2, 1], [1, 1]] and unit square",
    prompt: "The determinant det(A) = 2(1) - 1(1) = 1 (or 2) != 0, ensuring an inverse exists.",
    expectedAction: "Inspect the Before canvas.",
  },
  {
    id: "manipulate",
    title: "2. Forward Transformation A",
    label: "Apply A to transform unit square into sheared parallelogram",
    prompt: "Point p moves to Ap, and basis vectors e1, e2 map to Ae1, Ae2.",
    expectedAction: "Click 'Apply A' in the playback bar.",
  },
  {
    id: "preserve",
    title: "3. Inverse Matrix Calculation",
    label: "Compute A⁻¹ = (1/det(A)) * [[d, -b], [-c, a]]",
    prompt: "The inverse matrix reverses every stretch, shear, and rotation of A.",
    expectedAction: "Inspect the 2) Apply A⁻¹ matrix card.",
  },
  {
    id: "connect",
    title: "4. Return to Start",
    label: "Apply A⁻¹ to return Ap back to original point p",
    prompt: "A⁻¹(Ap) = (A⁻¹A)p = Ip = p.",
    expectedAction: "Click 'Apply A⁻¹' in the playback bar.",
  },
  {
    id: "conclude",
    title: "5. Identity Composition A⁻¹A = I",
    label: "Confirm that A⁻¹A acts as the identity transformation",
    prompt: "Every point and shape returns exactly to where it started.",
    expectedAction: "Review the Visual Proof pipeline.",
  },
  {
    id: "transfer",
    title: "6. Exact Challenge",
    label: "Compute the exact inverse for A = [[3, -1], [2, 1]]",
    prompt: "Find the 4 rational entries of A⁻¹ and click Check.",
    expectedAction: "Enter the values in the Challenge card.",
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
    title: "Notice the determinant",
    content: "If det(A) = 0, the matrix collapses space into a line or point, making it impossible to uniquely undo.",
  },
  {
    tier: "choose",
    title: "Choose the inverse formula",
    content: "For a 2x2 matrix [[a, b], [c, d]], the inverse is (1/(ad - bc)) * [[d, -b], [-c, a]].",
  },
  {
    tier: "predict",
    title: "Predict the composition",
    content: "Because A⁻¹ undoes A, applying both in sequence does nothing: A⁻¹A = I.",
  },
  {
    tier: "guide",
    title: "Challenge hint",
    content: "For A = [[3, -1], [2, 1]], det(A) = 3(1) - (-1)(2) = 5. So A⁻¹ = 1/5 * [[1, 1], [-2, 3]].",
  },
  {
    tier: "explain",
    title: "Why invertibility matters",
    content: "Invertibility guarantees that no information is lost during transformation, allowing full reconstruction.",
  },
];
