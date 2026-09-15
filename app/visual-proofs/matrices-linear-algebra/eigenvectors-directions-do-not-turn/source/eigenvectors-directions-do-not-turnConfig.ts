export const PROOF_META = {
  id: "eigenvectors-directions-do-not-turn",
  title: "Eigenvectors as Directions That Do Not Turn",
  subtitle: "Compare v and Av to find directions that stay on their own line.",
  mission: "Show that eigenvectors keep their direction under a linear transformation.",
  actionGoal: "Pick a vector and see what happens — eigenvectors scale without turning.",
  difficulty: "Intermediate",
  durationMinutes: 12,
  category: "Matrices and Linear Algebra",
  route: "/visual-proofs/matrices-linear-algebra/eigenvectors-directions-do-not-turn",
};

export interface Matrix2x2 {
  a: number;
  b: number;
  c: number;
  d: number;
}

export const DEFAULT_MATRIX: Matrix2x2 = {
  a: 2,
  b: 1,
  c: 1,
  d: 3,
};

export interface MatrixPreset {
  id: string;
  name: string;
  matrix: Matrix2x2;
}

export const MATRIX_PRESETS: MatrixPreset[] = [
  {
    id: "default",
    name: "Custom grid (2, 1; 1, 3)",
    matrix: { a: 2, b: 1, c: 1, d: 3 },
  },
  {
    id: "stretch_diag",
    name: "Diagonal Stretch (3, 0; 0, 1.5)",
    matrix: { a: 3, b: 0, c: 0, d: 1.5 },
  },
  {
    id: "shear",
    name: "Horizontal Shear (1, 1.5; 0, 1)",
    matrix: { a: 1, b: 1.5, c: 0, d: 1 },
  },
  {
    id: "reflection",
    name: "Reflection across y=x (0, 1; 1, 0)",
    matrix: { a: 0, b: 1, c: 1, d: 0 },
  },
];

export type ViewMode = "grid" | "vector" | "both";
export type MatrixViewTab = "entries" | "row_column" | "systems" | "transformation";

export interface PredictOption {
  id: string;
  label: string;
  vectorId: "v1" | "v2" | "arbitrary";
}

export const PREDICT_OPTIONS: PredictOption[] = [
  { id: "v1", label: "Eigenvector v₁", vectorId: "v1" },
  { id: "v2", label: "Eigenvector v₂", vectorId: "v2" },
  { id: "arbitrary", label: "Arbitrary vector (e.g. e₁)", vectorId: "arbitrary" },
];

export interface ChallengeInputState {
  lambda1: string;
  v1_x: string;
  v1_y: string;
  lambda2: string;
  v2_x: string;
  v2_y: string;
}

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
    title: "1. Transformation Grid",
    label: "Observe matrix A = [[2, 1], [1, 3]] and the initial vectors",
    prompt: "A linear transformation maps every vector v to Av. Most vectors turn, but some special directions do not.",
    expectedAction: "Inspect the Before and After transformation grids.",
  },
  {
    id: "manipulate",
    title: "2. Vector Comparison",
    label: "Compare v1 and Av1 to see collinearity",
    prompt: "Notice that Av1 lies directly on the same span line as v1.",
    expectedAction: "Select v1 in the Predict dropdown and observe the mapping.",
  },
  {
    id: "preserve",
    title: "3. Direction Invariance",
    label: "Identify that the angle between v and Av is 0 (or 180°)",
    prompt: "Eigenvectors are defined by the property that Av is a scalar multiple of v.",
    expectedAction: "Verify that v1 and v2 remain on their span lines.",
  },
  {
    id: "connect",
    title: "4. Eigenvalues as Stretch Factors",
    label: "Interpret λ1 and λ2 as length scale multipliers",
    prompt: "The eigenvalue λ tells you how much the vector stretches (or shrinks) along that invariant line.",
    expectedAction: "Review the stretch factor comparisons (|λ| > 1, |λ| = 1, |λ| < 1).",
  },
  {
    id: "conclude",
    title: "5. One-Line Formula Av = λv",
    label: "Connect Av = λv to the fundamental geometric definition",
    prompt: "Av (image) equals λ (stretch) times v (same direction).",
    expectedAction: "Review the Visual Proof in One Line panel.",
  },
  {
    id: "transfer",
    title: "6. Exact Challenge",
    label: "Calculate exact eigenvalues and eigenvectors for matrix A",
    prompt: "Solve the characteristic polynomial det(A - λI) = 0 and find the eigenvectors.",
    expectedAction: "Enter the values in the Challenge card and click 'Check answers'.",
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
    title: "Notice the lines through the origin",
    content: "The blue line and green line are span lines. Vectors lying along these lines only stretch when transformed by A.",
  },
  {
    tier: "choose",
    title: "Choose a test vector",
    content: "Select an arbitrary vector and notice that Av rotates away from v, unlike the eigenvectors v1 and v2.",
  },
  {
    tier: "predict",
    title: "Predict the transformation",
    content: "Because Av = λv, the vector Av must have the exact same angle (or opposite angle if λ < 0) as v.",
  },
  {
    tier: "guide",
    title: "Finding the eigenvalues",
    content: "Compute det(A - λI) = (2 - λ)(3 - λ) - 1*1 = λ² - 5λ + 5 = 0, which yields λ = (5 ± √5)/2.",
  },
  {
    tier: "explain",
    title: "Why eigenvectors are essential",
    content: "Eigenvectors form a natural coordinate system where the matrix acts as simple independent 1D scalings along each axis.",
  },
];
