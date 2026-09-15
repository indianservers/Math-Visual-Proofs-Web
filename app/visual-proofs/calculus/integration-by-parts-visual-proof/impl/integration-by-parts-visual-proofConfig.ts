export const PROOF_META = {
  id: "integration-by-parts-visual-proof",
  title: "Integration by Parts",
  subtitle: "Area balance of a product",
  mission: "Make the two models agree — move, explore, understand.",
  actionGoal: "Rearrange the product rule to derive integration by parts",
  difficulty: "Intermediate",
  durationMinutes: 12,
  category: "Calculus Visual Proofs",
};

export const DEFAULT_A = 0;
export const DEFAULT_B = Math.PI;
export const DEFAULT_X = 1.78;

export const KEY_X_POINTS = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI];

export const SNAP_RADIUS_PX = 18;

export type GraphViewMode = "curve" | "secant" | "tangent" | "strips";

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
    title: "1. Inspect Givens",
    label: "Identify the product area and its two differential strips",
    prompt: "Notice the product rectangle uv and the two strips v Δu and u Δv.",
    expectedAction: "Inspect the rectangle dimensions and formula d(uv) = u dv + v du.",
  },
  {
    id: "manipulate",
    title: "2. Manipulate",
    label: "Move x to see Δu and Δv balance d(uv)",
    prompt: "Drag handle x₂ vertically to observe how changing x adjusts both strips concurrently.",
    expectedAction: "Drag x₂ or adjust slider x to change Δu and Δv.",
  },
  {
    id: "preserve",
    title: "3. Preserve Invariant",
    label: "Name what stayed fixed: u(x), v(x), and interval [a, b]",
    prompt: "The base function curves and integration limits remain fixed while differential slices vary.",
    expectedAction: "Notice that total area is conserved across the partition.",
  },
  {
    id: "connect",
    title: "4. Connect Models",
    label: "Connect the rectangle model to the graph model",
    prompt: "See how the height u(x) on the graph maps directly to the rectangle height in the product model.",
    expectedAction: "Switch graph view modes to inspect slopes and strips.",
  },
  {
    id: "conclude",
    title: "5. Conclude Theorem",
    label: "Integrate both sides and isolate ∫ u dv",
    prompt: "Integrate d(uv) = u dv + v du from a to b to get [uv]_a^b = ∫ u dv + ∫ v du, then rearrange.",
    expectedAction: "Select the correct prediction and reveal the theorem.",
  },
  {
    id: "transfer",
    title: "6. Transfer & Challenge",
    label: "Verify with u(x)=x² and v′(x)=cos x on [0, π]",
    prompt: "Check numerical balance on [0, π] to confirm exact analytical equality.",
    expectedAction: "Click 'Check my work' to evaluate integrals.",
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
    title: "1. Notice Givens",
    content: "The product of two functions u and v defines a rectangle of area uv. Any small step in x increases u by Δu and v by Δv.",
  },
  {
    tier: "choose",
    title: "2. Choose Control",
    content: "Drag the circular purple handle at the top-right corner of the rectangle or drag slider x to change Δu and Δv.",
  },
  {
    tier: "predict",
    title: "3. Predict Invariant",
    content: "As x moves from a to b, the cumulative sum of the horizontal strips v Δu and vertical strips u Δv equals the total change [uv]_a^b.",
  },
  {
    tier: "guide",
    title: "4. Guided Step",
    content: "In the motion graph, observe how u'(x) is the slope of u(x), and v(x) accumulates area under v'(x). Together they generate the differential strips.",
  },
  {
    tier: "explain",
    title: "5. Mathematical Conclusion",
    content: "Rearranging ∫_a^b d(uv) = ∫_a^b u dv + ∫_a^b v du isolates the desired unknown integral: ∫_a^b u dv = [uv]_a^b - ∫_a^b v du.",
  },
];

export const MISCONCEPTIONS = [
  {
    id: "wrong-sign",
    trigger: "selected_plus",
    message: "Watch the sign: isolating ∫ u dv requires subtracting ∫ v du from [uv]_a^b, not adding.",
    correction: "Subtract ∫ v du from both sides of [uv]_a^b = ∫ u dv + ∫ v du.",
  },
  {
    id: "omitted-boundary",
    trigger: "forgot_boundary",
    message: "Do not forget the evaluation boundary term [uv]_a^b = u(b)v(b) - u(a)v(a).",
    correction: "Integrals of exact differentials evaluate to the boundary difference by FTC.",
  },
];

export const QUIZ_OPTIONS = [
  { id: "a", label: "[uv]_a^b - ∫_a^b v du", correct: true },
  { id: "b", label: "[uv]_a^b + ∫_a^b v du", correct: false },
  { id: "c", label: "∫_a^b u du - ∫_a^b v dv", correct: false },
  { id: "d", label: "u(b)v(b) - u(a)v(a)", correct: false },
];

export const WHY_IT_WORKS_STEPS = [
  {
    title: "Product rule",
    latex: String.raw`d(uv) = u\,dv + v\,du`,
    detail: "A small change in the product area splits into a horizontal strip v Δu and a vertical strip u Δv.",
  },
  {
    title: "Integrate from a to b",
    latex: String.raw`\int_a^b d(uv) = \int_a^b u\,dv + \int_a^b v\,du`,
    detail: "Integrating both sides accumulates the total change in uv across the interval.",
  },
  {
    title: "Solve for ∫ u dv",
    latex: String.raw`\int_a^b u\,dv = [uv]_a^b - \int_a^b v\,du`,
    detail: "Rearranging isolates the integral of u dv — integration by parts.",
  },
];

export const ONE_LINE_PROOF = [
  { kind: "rect" as const, label: "uv" },
  { kind: "equals" as const },
  { kind: "strip-h" as const, label: "v\\,du" },
  { kind: "plus" as const },
  { kind: "strip-v" as const, label: "u\\,dv" },
  { kind: "arrow" as const, label: "Integrate" },
  { kind: "formula" as const, label: String.raw`\int_a^b d(uv)=\int_a^b (u\,dv+v\,du)` },
  { kind: "arrow" as const },
  { kind: "formula" as const, label: String.raw`\int_a^b u\,dv=[uv]_a^b-\int_a^b v\,du` },
];

