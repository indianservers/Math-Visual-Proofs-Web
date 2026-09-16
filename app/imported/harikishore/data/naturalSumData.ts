export interface NaturalSumPreset {
  id: string;
  name: string;
  n: number;
  description: string;
}

export const NATURAL_SUM_PRESETS: NaturalSumPreset[] = [
  {
    id: 'n4',
    name: 'n = 4 (T₄ = 10)',
    n: 4,
    description: '4 rows of dots: 1 + 2 + 3 + 4 = 10. Interlocks into a 4 × 5 rectangle (20 dots).',
  },
  {
    id: 'n5',
    name: 'n = 5 (T₅ = 15)',
    n: 5,
    description: '5 rows of dots: 1 + 2 + 3 + 4 + 5 = 15. Interlocks into a 5 × 6 rectangle (30 dots).',
  },
  {
    id: 'n6',
    name: 'n = 6 (T₆ = 21)',
    n: 6,
    description: '6 rows of dots: 1 + 2 + 3 + 4 + 5 + 6 = 21. Interlocks into a 6 × 7 rectangle (42 dots).',
  },
  {
    id: 'n3',
    name: 'n = 3 (T₃ = 6)',
    n: 3,
    description: 'Simple beginner case: 1 + 2 + 3 = 6. Interlocks into a 3 × 4 rectangle (12 dots).',
  },
];
