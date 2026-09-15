export const PROOF_META = {
  id: "matrix-multiplication-row-column",
  title: "Matrix Multiplication as Row-by-Column Dot Product",
  subtitle: "Multiply A by B: each entry of AB is a row of A dotted with a column of B.",
  mission: "Select one product entry and see the row-column dot product that creates it.",
  actionGoal: "Pick row i of A and column j of B to compute the dot product entry (AB)_ij",
  difficulty: "Intermediate",
  durationMinutes: 10,
  category: "Matrices and Linear Algebra",
  route: "/visual-proofs/matrices-linear-algebra/matrix-multiplication-row-column",
};

export interface MatrixSymbolicData {
  rows: number;
  cols: number;
  symbol: string; // 'a' | 'b' | '(AB)'
}

export const MATRIX_A_DIM = { rows: 3, cols: 3, label: "Matrix A (m × n)", symbol: "a" };
export const MATRIX_B_DIM = { rows: 3, cols: 3, label: "Matrix B (n × p)", symbol: "b" };
export const MATRIX_AB_DIM = { rows: 3, cols: 3, label: "Product AB (m × p)", symbol: "AB" };

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
    title: "1. Inner Dimensions",
    label: "Check that columns of A equal rows of B (n = n)",
    prompt: "Matrix multiplication requires A to be m × n and B to be n × p. The product AB has dimension m × p.",
    expectedAction: "Inspect the dimension annotations on Matrix A and Matrix B.",
  },
  {
    id: "manipulate",
    title: "2. Row-by-Column Pairing",
    label: "Select row i of A and column j of B",
    prompt: "Click on row 1 of A and column 2 of B to highlight their corresponding entries.",
    expectedAction: "Select row 1 and column 2 to compute entry (AB)_12.",
  },
  {
    id: "preserve",
    title: "3. Dot Product Invariant",
    label: "Observe pairwise multiplication and sum",
    prompt: "Notice how a_ik multiplies b_kj for k = 1, 2, 3 and their sum equals (AB)_ij.",
    expectedAction: "Trace the pairwise product cards leading to the sum.",
  },
  {
    id: "connect",
    title: "4. Connect to Sigma Notation",
    label: "Connect the visual sum to the formal formula (AB)_ij = ∑ a_ik b_kj",
    prompt: "Formulate the general equation: (AB)_ij = a_i1 b_1j + a_i2 b_2j + ... + a_in b_nj.",
    expectedAction: "View the algebraic breakdown in the Why It Works panel.",
  },
  {
    id: "conclude",
    title: "5. Avoid Cell-by-Cell Pitfall",
    label: "Distinguish matrix multiplication from cell-by-cell addition",
    prompt: "Unlike matrix addition, matrix multiplication is NOT entrywise: it involves row-column dot products!",
    expectedAction: "Review the non-entrywise nature of matrix multiplication.",
  },
  {
    id: "transfer",
    title: "6. Challenge: Compute (AB)_23",
    label: "Apply the row-by-column rule to compute entry (AB)_23",
    prompt: "Set row of A = 2 and column of B = 3 to construct entry (AB)_23.",
    expectedAction: "Complete the challenge for entry (2, 3).",
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
    title: "Notice row and column orientation",
    content: "We always take a HORIZONTAL row from Matrix A and a VERTICAL column from Matrix B.",
  },
  {
    tier: "choose",
    title: "Choose the target position",
    content: "To find entry (AB)_12 (row 1, column 2 of the result), select Row 1 of A and Column 2 of B.",
  },
  {
    tier: "predict",
    title: "Predict pairwise terms",
    content: "For (AB)_12, the terms are: a_11 × b_12, a_12 × b_22, and a_13 × b_32.",
  },
  {
    tier: "guide",
    title: "Step-by-step calculation",
    content: "Multiply each pair of corresponding elements, then add all products together to get the scalar sum.",
  },
  {
    tier: "explain",
    title: "Why matrix multiplication is not cell-by-cell",
    content: "Matrix multiplication represents composition of linear transformations, which mathematically produces row-column dot products.",
  },
];
