export const PROOF_META = {
  id: "matrix-addition-cell-by-cell",
  title: "Matrix Addition as Cell-by-Cell Addition",
  subtitle: "Matrix addition requires the same dimensions and adds entries position by position.",
  mission: "Highlight matching entries in A and B to build the result matrix one cell at a time.",
  actionGoal: "Fill each position in C by adding the matching entries from A and B",
  difficulty: "Intermediate",
  durationMinutes: 12,
  category: "Matrices and Linear Algebra",
  route: "/visual-proofs/matrices-linear-algebra/matrix-addition-cell-by-cell",
};

export interface MatrixData {
  rows: number;
  cols: number;
  data: number[][];
}

export const DEFAULT_MATRIX_A: MatrixData = {
  rows: 2,
  cols: 3,
  data: [
    [1, -2, 3],
    [4, 0, 5],
  ],
};

export const DEFAULT_MATRIX_B: MatrixData = {
  rows: 2,
  cols: 3,
  data: [
    [2, 7, -1],
    [-3, 6, 2],
  ],
};

export const CHALLENGE_MATRIX_A: MatrixData = {
  rows: 2,
  cols: 2,
  data: [
    [3, -1],
    [2, 5],
  ],
};

export const CHALLENGE_MATRIX_B: MatrixData = {
  rows: 2,
  cols: 2,
  data: [
    [4, 6],
    [-1, 2],
  ],
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
    title: "1. Check Dimensions",
    label: "Verify that Matrix A and Matrix B have identical dimensions",
    prompt: "Notice that both A and B are 2 × 3 matrices. Matrix addition is defined only when dimensions match.",
    expectedAction: "Inspect rows and columns of Matrix A and Matrix B.",
  },
  {
    id: "manipulate",
    title: "2. Cell-by-Cell Addition",
    label: "Add entries at each corresponding (i, j) coordinate",
    prompt: "Click or drag each entry sum to its matching position in Matrix C.",
    expectedAction: "Fill each cell in Matrix C with a_ij + b_ij.",
  },
  {
    id: "preserve",
    title: "3. Position Invariant",
    label: "Observe that each cell c_ij depends solely on a_ij and b_ij",
    prompt: "No row or column mixing occurs: position (1, 1) in C is strictly A(1,1) + B(1,1).",
    expectedAction: "Trace the path from source entries to target cell.",
  },
  {
    id: "connect",
    title: "4. Connect to Algebra",
    label: "Connect grid visual addition to the formal definition c_ij = a_ij + b_ij",
    prompt: "Formulate the algebraic rule: [A + B]_ij = A_ij + B_ij for all 1 ≤ i ≤ m, 1 ≤ j ≤ n.",
    expectedAction: "View the cell formula expansion in the reasoning card.",
  },
  {
    id: "conclude",
    title: "5. Conclude Definition",
    label: "Assemble the complete result matrix C = A + B",
    prompt: "The entire result matrix is obtained once all m × n cell additions are computed.",
    expectedAction: "Reveal the full visual proof and verify all entries.",
  },
  {
    id: "transfer",
    title: "6. Exact Challenge",
    label: "Apply cell-by-cell addition to a fresh 2 × 2 matrix pair",
    prompt: "Complete the challenge matrix sum by computing all 4 entries in the 2 × 2 result.",
    expectedAction: "Enter the values for the 2 × 2 challenge matrix.",
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
    title: "Notice matching positions",
    content: "Matrix addition is strictly position-by-position. To find C(1, 1), look at A(1, 1) and B(1, 1).",
  },
  {
    tier: "choose",
    title: "Choose the active cell",
    content: "Select any empty dashed cell in Matrix C to highlight its corresponding source values in A and B.",
  },
  {
    tier: "predict",
    title: "Predict the sum",
    content: "For position (1, 1): 1 + 2 = 3. For position (1, 2): -2 + 7 = 5. Negative numbers add just like normal integers!",
  },
  {
    tier: "guide",
    title: "Step-by-step placement",
    content: "Click on any empty cell in Matrix C to auto-calculate and place the matching sum.",
  },
  {
    tier: "explain",
    title: "Why same dimensions are required",
    content: "If dimensions differed, some cells would have no matching partner to add with, leaving addition undefined.",
  },
];
