export interface TriangularPreset {
  id: string;
  name: string;
  n: number;
  description: string;
}

export const TRIANGULAR_PRESETS: TriangularPreset[] = [
  {
    id: 't-4',
    name: 'T₄ = 10 Dots (Tetractys)',
    n: 4,
    description: '1 + 2 + 3 + 4 = 10. Forms a 4 × 5 rectangle when duplicated.',
  },
  {
    id: 't-3',
    name: 'T₃ = 6 Dots (Bowling Triangle)',
    n: 3,
    description: '1 + 2 + 3 = 6 dots. Duplicates into a 3 × 4 = 12 rectangle.',
  },
  {
    id: 't-5',
    name: 'T₅ = 15 Dots',
    n: 5,
    description: '1 + 2 + 3 + 4 + 5 = 15 dots. Duplicates into a 5 × 6 = 30 rectangle.',
  },
  {
    id: 't-6',
    name: 'T₆ = 21 Dots',
    n: 6,
    description: '1 + 2 + 3 + 4 + 5 + 6 = 21 dots. Duplicates into a 6 × 7 = 42 rectangle.',
  },
];