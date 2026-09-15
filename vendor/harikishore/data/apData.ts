export interface APPreset {
  id: string;
  name: string;
  a: number;
  d: number;
  n: number;
  latexSeq: string;
  description: string;
}

export const AP_PRESETS: APPreset[] = [
  {
    id: 'evens',
    name: 'Natural Evens (a = 2, d = 2)',
    a: 2,
    d: 2,
    n: 6,
    latexSeq: '2, 4, 6, 8, 10, 12, \\dots',
    description: 'Starting at a = 2 with step d = 2. Each step adds 2 units on the number line.',
  },
  {
    id: 'step3',
    name: 'Odd Multi-Step (a = 1, d = 3)',
    a: 1,
    d: 3,
    n: 5,
    latexSeq: '1, 4, 7, 10, 13, \\dots',
    description: 'Starting at a = 1 with step d = 3. Reaching term n = 5 requires 4 jumps of 3 units.',
  },
  {
    id: 'offset5',
    name: 'Base Offset (a = 5, d = 4)',
    a: 5,
    d: 4,
    n: 5,
    latexSeq: '5, 9, 13, 17, 21, \\dots',
    description: 'Initial constant a = 5 plus consecutive additions of common difference d = 4.',
  },
  {
    id: 'descending',
    name: 'Descending AP (a = 15, d = -3)',
    a: 15,
    d: -3,
    n: 5,
    latexSeq: '15, 12, 9, 6, 3, \\dots',
    description: 'Negative common difference d = -3 jumps leftward down the number line.',
  },
];
