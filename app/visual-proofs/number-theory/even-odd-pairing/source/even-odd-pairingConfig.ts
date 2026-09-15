export const PROOF_META = {
  id: "even-odd-pairing",
  title: "Even and Odd Numbers as Pairing Patterns",
  subtitle: "Pair up the counters. If nothing is left over, the number is even. If one is left over, the number is odd.",
  mission: "Pair dots two by two to see even numbers leave no object and odd numbers leave one.",
  actionGoal: "Pair all counters to classify parity and discover n = 2k vs n = 2k + 1",
  difficulty: "Intermediate",
  durationMinutes: 10,
  category: "Number Theory",
  route: "/visual-proofs/number-theory/even-odd-pairing",
};

export type ModelType = "pairs" | "array" | "clock" | "remainder" | "factor";

export interface ModelOption {
  id: ModelType;
  label: string;
  icon: string;
  description: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  { id: "pairs", label: "Pairs", icon: "link", description: "Pair counters two by two in slots" },
  { id: "array", label: "Array", icon: "grid", description: "Arrange counters into 2 parallel rows" },
  { id: "clock", label: "Clock", icon: "clock", description: "Step through a modulo-2 cycle (0 ↔ 1)" },
  { id: "remainder", label: "Remainder lane", icon: "lanes", description: "Jump by 2s along the number line with remainder" },
  { id: "factor", label: "Factor tree", icon: "tree", description: "Inspect divisibility by 2 and remainder branch" },
];

export interface CounterTheme {
  id: number;
  bgGradient: string;
  shadowColor: string;
  textColor: string;
  borderColor: string;
}

// 24 unique vibrant spherical counter themes matching the visual style
export const COUNTER_THEMES: CounterTheme[] = [
  { id: 1, bgGradient: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)", shadowColor: "rgba(124, 58, 237, 0.35)", textColor: "#ffffff", borderColor: "#6d28d9" },
  { id: 2, bgGradient: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)", shadowColor: "rgba(37, 99, 235, 0.35)", textColor: "#ffffff", borderColor: "#1d4ed8" },
  { id: 3, bgGradient: "linear-gradient(135deg, #4ade80 0%, #059669 100%)", shadowColor: "rgba(5, 150, 105, 0.35)", textColor: "#ffffff", borderColor: "#047857" },
  { id: 4, bgGradient: "linear-gradient(135deg, #f87171 0%, #dc2626 100%)", shadowColor: "rgba(220, 38, 38, 0.35)", textColor: "#ffffff", borderColor: "#b91c1c" },
  { id: 5, bgGradient: "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)", shadowColor: "rgba(217, 119, 6, 0.35)", textColor: "#ffffff", borderColor: "#b45309" },
  { id: 6, bgGradient: "linear-gradient(135deg, #c084fc 0%, #9333ea 100%)", shadowColor: "rgba(147, 51, 234, 0.35)", textColor: "#ffffff", borderColor: "#7e22ce" },
  { id: 7, bgGradient: "linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)", shadowColor: "rgba(13, 148, 136, 0.35)", textColor: "#ffffff", borderColor: "#0f766e" },
  { id: 8, bgGradient: "linear-gradient(135deg, #f472b6 0%, #db2777 100%)", shadowColor: "rgba(219, 39, 119, 0.35)", textColor: "#ffffff", borderColor: "#be185d" },
  { id: 9, bgGradient: "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)", shadowColor: "rgba(2, 132, 199, 0.35)", textColor: "#ffffff", borderColor: "#0369a1" },
  { id: 10, bgGradient: "linear-gradient(135deg, #a3e635 0%, #65a30d 100%)", shadowColor: "rgba(101, 163, 13, 0.35)", textColor: "#ffffff", borderColor: "#4d7c0f" },
  { id: 11, bgGradient: "linear-gradient(135deg, #fb923c 0%, #ea580c 100%)", shadowColor: "rgba(234, 88, 12, 0.35)", textColor: "#ffffff", borderColor: "#c2410c" },
  { id: 12, bgGradient: "linear-gradient(135deg, #e879f9 0%, #c026d3 100%)", shadowColor: "rgba(192, 38, 211, 0.35)", textColor: "#ffffff", borderColor: "#a21caf" },
  { id: 13, bgGradient: "linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)", shadowColor: "rgba(79, 70, 229, 0.35)", textColor: "#ffffff", borderColor: "#4338ca" },
  { id: 14, bgGradient: "linear-gradient(135deg, #34d399 0%, #10b981 100%)", shadowColor: "rgba(16, 185, 129, 0.35)", textColor: "#ffffff", borderColor: "#047857" },
  { id: 15, bgGradient: "linear-gradient(135deg, #facc15 0%, #ca8a04 100%)", shadowColor: "rgba(202, 138, 4, 0.35)", textColor: "#ffffff", borderColor: "#a16207" },
  { id: 16, bgGradient: "linear-gradient(135deg, #fda4af 0%, #e11d48 100%)", shadowColor: "rgba(225, 29, 72, 0.35)", textColor: "#ffffff", borderColor: "#be123c" },
  { id: 17, bgGradient: "linear-gradient(135deg, #67e8f9 0%, #0891b2 100%)", shadowColor: "rgba(8, 145, 178, 0.35)", textColor: "#ffffff", borderColor: "#0e7490" },
  { id: 18, bgGradient: "linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 100%)", shadowColor: "rgba(139, 92, 246, 0.35)", textColor: "#ffffff", borderColor: "#7c3aed" },
  { id: 19, bgGradient: "linear-gradient(135deg, #fed7aa 0%, #f97316 100%)", shadowColor: "rgba(249, 115, 22, 0.35)", textColor: "#ffffff", borderColor: "#ea580c" },
  { id: 20, bgGradient: "linear-gradient(135deg, #99f6e4 0%, #14b8a6 100%)", shadowColor: "rgba(20, 184, 166, 0.35)", textColor: "#ffffff", borderColor: "#0d9488" },
  { id: 21, bgGradient: "linear-gradient(135deg, #fbcfe8 0%, #ec4899 100%)", shadowColor: "rgba(236, 72, 153, 0.35)", textColor: "#ffffff", borderColor: "#db2777" },
  { id: 22, bgGradient: "linear-gradient(135deg, #bae6fd 0%, #0ea5e9 100%)", shadowColor: "rgba(14, 165, 233, 0.35)", textColor: "#ffffff", borderColor: "#0284c7" },
  { id: 23, bgGradient: "linear-gradient(135deg, #d9f99d 0%, #84cc16 100%)", shadowColor: "rgba(132, 204, 22, 0.35)", textColor: "#ffffff", borderColor: "#65a30d" },
  { id: 24, bgGradient: "linear-gradient(135deg, #ddd6fe 0%, #a855f7 100%)", shadowColor: "rgba(168, 85, 247, 0.35)", textColor: "#ffffff", borderColor: "#9333ea" },
];

export function getCounterTheme(id: number): CounterTheme {
  const index = ((id - 1) % COUNTER_THEMES.length + COUNTER_THEMES.length) % COUNTER_THEMES.length;
  return COUNTER_THEMES[index];
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
    title: "1. Inspect Givens",
    label: "Identify the number of counters and the target group size (2)",
    prompt: "Notice the set of counters and the pairing area with slots of capacity 2.",
    expectedAction: "Count the total available items and review the pairing target.",
  },
  {
    id: "manipulate",
    title: "2. Manipulate & Pair",
    label: "Pair counters two by two into the pair slots",
    prompt: "Drag each counter to a pair slot. Notice how each completed pair contains exactly 2 counters.",
    expectedAction: "Pair up counters until all complete pairs are formed.",
  },
  {
    id: "preserve",
    title: "3. Preserve Invariant",
    label: "Observe that total count n is conserved across all pairs and leftovers",
    prompt: "No counters are created or lost: total counters = (2 × number of pairs) + leftovers.",
    expectedAction: "Check that sum of paired counters plus any leftover equals n.",
  },
  {
    id: "connect",
    title: "4. Connect Models",
    label: "Connect pairing to algebraic parity formulas n = 2k and n = 2k + 1",
    prompt: "When all counters form k complete pairs with 0 leftovers, n = 2k (Even). If 1 leftover remains, n = 2k + 1 (Odd).",
    expectedAction: "Inspect the formula breakdown showing 2 × pairs + remainder.",
  },
  {
    id: "conclude",
    title: "5. Conclude Parity Rule",
    label: "Generalize parity: every whole number is either even (n=2k) or odd (n=2k+1)",
    prompt: "Since dividing by 2 leaves only remainder 0 or 1, every whole number is uniquely even or odd.",
    expectedAction: "Predict parity on new cases and reveal the generalized theorem.",
  },
  {
    id: "transfer",
    title: "6. Transfer & Challenge",
    label: "Apply the pairing rule to larger numbers and verify with dot patterns",
    prompt: "Test with larger numbers like 23: calculate pairs (11) and leftovers (1) to confirm parity.",
    expectedAction: "Complete the challenge by entering the expected leftover for number 23.",
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
    title: "Notice the group size",
    content: "Each pair slot holds exactly 2 counters. An even number partitions completely into pairs with no counter left alone.",
  },
  {
    tier: "choose",
    title: "Choose the next counter",
    content: "Select the lowest numbered unplaced counter and move it to the next available socket in the pairing area.",
  },
  {
    tier: "predict",
    title: "Predict the remainder",
    content: "When grouping by 2, the leftover counter count can only ever be 0 or 1. If 2 counters were left over, they would form another pair!",
  },
  {
    tier: "guide",
    title: "Step-by-step pairing",
    content: "Use the 'Auto-Pair Step' or drag counters in sequential pairs (1–2, 3–4, 5–6...) to see if the last counter finds a partner.",
  },
  {
    tier: "explain",
    title: "Parity explanation",
    content: "If n = 2k, the number is Even (divisible by 2). If n = 2k + 1, the number is Odd (one more than an even number).",
  },
];

export interface PredictionOption {
  id: "even" | "odd";
  label: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ChallengeItem {
  number: number;
  question: string;
  subquestion: string;
  correctLeftover: number;
  correctPairs: number;
  parity: "even" | "odd";
  dots: number;
}

export const DEFAULT_CHALLENGE: ChallengeItem = {
  number: 23,
  question: "Try a bigger number: 23",
  subquestion: "Pair the counters. How many will be left over?",
  correctLeftover: 1,
  correctPairs: 11,
  parity: "odd",
  dots: 23,
};
