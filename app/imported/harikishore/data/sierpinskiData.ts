export interface SierpinskiPreset {
  id: string;
  name: string;
  level: number;
  description: string;
}

export const SIERPINSKI_PRESETS: SierpinskiPreset[] = [
  {
    id: 'level-1',
    name: 'Iteration 1 (8/9 ≈ 88.9%)',
    level: 1,
    description: 'Initial 3 × 3 grid with 1 center cutout. 8 of 9 squares kept.',
  },
  {
    id: 'level-2',
    name: 'Iteration 2 (64/81 ≈ 79.0%)',
    level: 2,
    description: 'Each of the 8 squares is punched in the center. 64 tiny squares remain.',
  },
  {
    id: 'level-3',
    name: 'Iteration 3 (512/729 ≈ 70.2%)',
    level: 3,
    description: '512 microscopic squares remain. Notice self-similarity at every scale.',
  },
  {
    id: 'level-0',
    name: 'Iteration 0 (Base Square 100%)',
    level: 0,
    description: 'Solid square before any holes are punched: Area = 1.0.',
  },
];
