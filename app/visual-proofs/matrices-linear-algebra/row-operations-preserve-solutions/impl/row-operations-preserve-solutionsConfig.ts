export const PROOF_META = {
  id: "row-operations-preserve-solutions",
  title: "Row Operations Preserve Solution Set",
  subtitle: "Elementary row operations transform equations, not solutions.",
  mission: "Apply an elementary row operation and watch the solution point stay fixed.",
  actionGoal: "See how the system and lines change — the intersection stays the same",
  difficulty: "Intermediate",
  durationMinutes: 12,
  category: "Matrices and Linear Algebra",
  route: "/visual-proofs/matrices-linear-algebra/row-operations-preserve-solutions",
};

export interface AugmentedRow {
  a: number; // Coeff of x
  b: number; // Coeff of y
  c: number; // Constant
}

export interface AugmentedMatrixState {
  row1: AugmentedRow;
  row2: AugmentedRow;
}

export const INITIAL_SYSTEM_1: AugmentedMatrixState = {
  row1: { a: 2, b: 1, c: 5 },
  row2: { a: 1, b: -1, c: 1 },
};

export type RowOperationType = "swap" | "add_k_r2_to_r1" | "add_k_r1_to_r2" | "scale_r1" | "scale_r2";

export interface RowOperationOption {
  id: RowOperationType;
  title: string;
  sublabel: string;
  tex: string;
  defaultK?: number;
}

export const ROW_OPERATIONS: RowOperationOption[] = [
  {
    id: "swap",
    title: "R₁ ↔ R₂",
    sublabel: "Swap rows",
    tex: "R_1 \\leftrightarrow R_2",
  },
  {
    id: "add_k_r2_to_r1",
    title: "R₁ → R₁ + kR₂",
    sublabel: "Add multiple",
    tex: "R_1 \\to R_1 + kR_2",
    defaultK: 1,
  },
  {
    id: "add_k_r1_to_r2",
    title: "R₂ → R₂ + kR₁",
    sublabel: "Add multiple",
    tex: "R_2 \\to R_2 + kR_1",
    defaultK: -0.5,
  },
];

export interface PredictOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

export const PREDICT_OPTIONS: PredictOption[] = [
  { id: "A", label: "(2, 1)", isCorrect: true },
  { id: "B", label: "(1, 2)", isCorrect: false },
  { id: "C", label: "No solution", isCorrect: false },
];

export interface ChallengeStep {
  stepNumber: number;
  operation: RowOperationType;
  k?: number;
  label: string;
}

export const DEFAULT_CHALLENGE_TARGET: AugmentedMatrixState = {
  row1: { a: 1, b: -1, c: 1 },
  row2: { a: 2, b: 1, c: 5 },
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
    title: "1. System 1 Model",
    label: "Inspect augmented matrix [A | b] and lines intersecting at (2, 1)",
    prompt: "The initial system 2x + y = 5 and x - y = 1 has a unique intersection at (2, 1).",
    expectedAction: "Inspect System 1 on the left canvas.",
  },
  {
    id: "manipulate",
    title: "2. Row Swap Operation",
    label: "Apply R1 <-> R2 to construct System 2",
    prompt: "Swapping equations transforms the matrix without altering the intersection point.",
    expectedAction: "Click R1 <-> R2 in the Row Operations panel.",
  },
  {
    id: "preserve",
    title: "3. Solution Invariance",
    label: "Verify both systems share identical solution (2, 1)",
    prompt: "Both System 1 and System 2 evaluate to true for x = 2 and y = 1.",
    expectedAction: "Check the solution badges on both graphs.",
  },
  {
    id: "connect",
    title: "4. Row Additions & Linear Combinations",
    label: "Test R2 -> R2 + kR1 to see lines pivot around (2, 1)",
    prompt: "Adding a multiple of one row to another rotates or tilts the line through the exact same point.",
    expectedAction: "Try row addition operations.",
  },
  {
    id: "conclude",
    title: "5. Elementary Matrix Multiplier",
    label: "Connect row operations to invertible matrix multiplication EAx = Eb",
    prompt: "Because each elementary matrix E is invertible, the solution set is strictly preserved.",
    expectedAction: "Review the Visual Proof elementary matrix pipeline.",
  },
  {
    id: "transfer",
    title: "6. Equivalence Challenge",
    label: "Complete the row operation steps to match target matrix",
    prompt: "Construct the sequence of row operations to reach the target augmented matrix.",
    expectedAction: "Click 'Check my steps' in the challenge card.",
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
    title: "Notice the intersection point",
    content: "The intersection of the blue line and red line is at (2, 1) in both System 1 and System 2.",
  },
  {
    tier: "choose",
    title: "Choose a row operation",
    content: "Click 'R1 <-> R2' or 'R2 -> R2 + kR1' to see how the equations and lines change while the intersection stays locked.",
  },
  {
    tier: "predict",
    title: "Predict the new line",
    content: "When you add rows, the new line must pass through (2, 1) because (2, 1) satisfies both original equations.",
  },
  {
    tier: "guide",
    title: "Why row operations work",
    content: "If a point (x, y) makes Equation 1 = 0 and Equation 2 = 0, then any combination c1*(Eq 1) + c2*(Eq 2) is also 0.",
  },
  {
    tier: "explain",
    title: "Matrix invertibility",
    content: "Every elementary row operation corresponds to left-multiplying by an invertible matrix E. Since E is reversible, no solutions are lost or gained.",
  },
];
