export interface GPScalingPreset {
  id: string;
  name: string;
  a: number;
  r: number;
  n: number;
  description: string;
  type: 'growth' | 'decay';
}

export const GP_SCALING_PRESETS: GPScalingPreset[] = [
  {
    id: 'doubling',
    name: 'Doubling (r = 2)',
    a: 1,
    r: 2,
    n: 5,
    description: 'Terms double at each step: 1, 2, 4, 8, 16. Fast exponential growth.',
    type: 'growth',
  },
  {
    id: 'halving',
    name: 'Halving (r = 0.5)',
    a: 16,
    r: 0.5,
    n: 5,
    description: 'Each term is cut in half: 16, 8, 4, 2, 1. Rapid exponential decay.',
    type: 'decay',
  },
  {
    id: 'tripling',
    name: 'Tripling (r = 3)',
    a: 1,
    r: 3,
    n: 4,
    description: 'Terms multiply by 3: 1, 3, 9, 27. Steep scaling.',
    type: 'growth',
  },
  {
    id: 'thirds',
    name: 'One-Third (r = 1/3)',
    a: 27,
    r: 1 / 3,
    n: 4,
    description: 'Each term shrinks by a factor of 3: 27, 9, 3, 1.',
    type: 'decay',
  },
];
