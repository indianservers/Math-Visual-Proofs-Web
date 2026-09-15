export const PROOF_META = {
  id: "linear-system-line-intersection",
  title: "Solving 2×2 Linear Systems as Line Intersection",
  subtitle: "The solution is the unique point where both lines meet.",
  mission: "Graph two equations and read their intersection as the shared solution.",
  actionGoal: "Relate systems, matrices, and line intersection through structure and transformation",
  difficulty: "Intermediate",
  durationMinutes: 10,
  category: "Matrices and Linear Algebra",
  route: "/visual-proofs/matrices-linear-algebra/linear-system-line-intersection",
};

export interface LinearEquation {
  a: number; // coefficient of x
  b: number; // coefficient of y
  c: number; // constant term (ax + by = c)
}

export interface LinearSystemState {
  eq1: LinearEquation;
  eq2: LinearEquation;
}

export const DEFAULT_SYSTEM: LinearSystemState = {
  eq1: { a: 2, b: 1, c: 5 },
  eq2: { a: 1, b: -1, c: 1 },
};

export type PredictOutcome =
  | "none_or_infinite"
  | "always_one"
  | "always_none"
  | "always_infinite";

export const PREDICT_OPTIONS: Array<{ id: PredictOutcome; label: string; isCorrect: boolean }> = [
  {
    id: "none_or_infinite",
    label: "Either parallel (no solution) or coincident (infinite solutions)",
    isCorrect: true,
  },
  {
    id: "always_one",
    label: "Always exactly one solution",
    isCorrect: false,
  },
  {
    id: "always_none",
    label: "Always no solution (lines always distinct parallel)",
    isCorrect: false,
  },
  {
    id: "always_infinite",
    label: "Always infinitely many solutions",
    isCorrect: false,
  },
];

export interface ChallengeTarget {
  targetX: number;
  targetY: number;
}

export const DEFAULT_CHALLENGE_TARGET: ChallengeTarget = {
  targetX: -1,
  targetY: 3,
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
    title: "1. System to Lines",
    label: "Inspect 2x + y = 5 and x - y = 1 as lines on the grid",
    prompt: "Each linear equation ax + by = c defines a straight line in the coordinate plane.",
    expectedAction: "Inspect the equations and their corresponding lines.",
  },
  {
    id: "manipulate",
    title: "2. Line Intersection",
    label: "Find the intersection point (2, 1)",
    prompt: "The unique point (2, 1) lies on both lines and satisfies both equations simultaneously.",
    expectedAction: "Observe the intersection point on the coordinate graph.",
  },
  {
    id: "preserve",
    title: "3. Determinant & Uniqueness",
    label: "Check det(A) = 2(-1) - 1(1) = -3 ≠ 0",
    prompt: "A non-zero determinant ensures the slopes differ, guaranteeing a unique intersection.",
    expectedAction: "Review the determinant card.",
  },
  {
    id: "connect",
    title: "4. Row Operations",
    label: "Apply row operations (R2 -> R2 - 1/2 R1)",
    prompt: "Row operations tilt and slide the lines, but the intersection point remains invariant.",
    expectedAction: "Click row operations in the Transformations panel.",
  },
  {
    id: "conclude",
    title: "5. Row-Reduced Form",
    label: "Read y = 1, then back-substitute x = 2",
    prompt: "The row-reduced echelon form makes the coordinates of the intersection immediately obvious.",
    expectedAction: "View the row-reduced matrix.",
  },
  {
    id: "transfer",
    title: "6. Target Challenge",
    label: "Adjust coefficients to make the lines intersect at (-1, 3)",
    prompt: "Construct a system of equations whose solution is (-1, 3).",
    expectedAction: "Complete the challenge in the bottom panel.",
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
    title: "Look at the intersection point",
    content: "The coordinates (x, y) where the purple line and teal line cross solve both equations simultaneously.",
  },
  {
    tier: "choose",
    title: "Change a coefficient",
    content: "Increasing the coefficient of x makes the line steeper; changing the constant shifts the line parallel to itself.",
  },
  {
    tier: "predict",
    title: "Predict the effect of row operations",
    content: "Row operations combine equations into new lines that still pass through the exact same intersection point (2, 1).",
  },
  {
    tier: "guide",
    title: "Test determinant",
    content: "If det(A) = 0, the lines have identical slopes: they are either parallel (no intersection) or the exact same line (infinite intersections).",
  },
  {
    tier: "explain",
    title: "Solving the challenge for (-1, 3)",
    content: "For (-1, 3), choose simple coefficients like 1*(-1) + 1*(3) = 2 (so x + y = 2) and 2*(-1) + 1*(3) = 1 (so 2x + y = 1).",
  },
];
