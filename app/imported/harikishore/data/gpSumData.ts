export interface GPSumPreset {
  id: string;
  name: string;
  a: number;
  r: number;
  n: number;
  description: string;
}

export const GP_SUM_PRESETS: GPSumPreset[] = [
  {
    id: 'powers-of-two',
    name: 'Powers of 2 (a = 1, r = 2, n = 5)',
    a: 1,
    r: 2,
    n: 5,
    description: '1 + 2 + 4 + 8 + 16 = 31. S - 2S = 1 - 32 = -31, so S = 31.',
  },
  {
    id: 'halving-fractions',
    name: 'Halving (a = 1, r = 0.5, n = 4)',
    a: 1,
    r: 0.5,
    n: 4,
    description: '1 + 0.5 + 0.25 + 0.125 = 1.875. Approaches 2 as n grows.',
  },
  {
    id: 'base-3',
    name: 'Base 3 (a = 1, r = 3, n = 4)',
    a: 1,
    r: 3,
    n: 4,
    description: '1 + 3 + 9 + 27 = 40. (3⁴ - 1) / (3 - 1) = 80 / 2 = 40.',
  },
  {
    id: 'scaled-two',
    name: 'Scaled (a = 3, r = 2, n = 4)',
    a: 3,
    r: 2,
    n: 4,
    description: '3 + 6 + 12 + 24 = 45. 3(2⁴ - 1) / (2 - 1) = 3 × 15 = 45.',
  },
];
