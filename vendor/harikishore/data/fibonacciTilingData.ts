export interface FibonacciPreset {
  id: string;
  name: string;
  n: number;
  description: string;
}

export const FIBONACCI_PRESETS: FibonacciPreset[] = [
  {
    id: 'fib-6',
    name: '6 Tiles: up to F₆ = 8 (8 × 13 Rect)',
    n: 6,
    description: 'Squares 1, 1, 2, 3, 5, 8. Total area: 1² + 1² + 2² + 3² + 5² + 8² = 104 = 8 × 13.',
  },
  {
    id: 'fib-4',
    name: '4 Tiles: up to F₄ = 3 (3 × 5 Rect)',
    n: 4,
    description: 'Squares 1, 1, 2, 3. Total area: 1² + 1² + 2² + 3² = 15 = 3 × 5.',
  },
  {
    id: 'fib-5',
    name: '5 Tiles: up to F₅ = 5 (5 × 8 Rect)',
    n: 5,
    description: 'Squares 1, 1, 2, 3, 5. Total area: 1² + 1² + 2² + 3² + 5² = 40 = 5 × 8.',
  },
  {
    id: 'fib-7',
    name: '7 Tiles: up to F₇ = 13 (13 × 21 Rect)',
    n: 7,
    description: 'Squares 1, 1, 2, 3, 5, 8, 13. Area: sum of F_k² = 273 = 13 × 21.',
  },
];

export const FIBONACCI_COLORS = [
  '#f43f5e', // Rose-500 (1)
  '#fb923c', // Orange-400 (1)
  '#eab308', // Yellow-500 (2)
  '#10b981', // Emerald-500 (3)
  '#06b6d4', // Cyan-500 (5)
  '#3b82f6', // Blue-500 (8)
  '#8b5cf6', // Violet-500 (13)
  '#d946ef', // Fuchsia-500 (21)
];