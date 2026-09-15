export interface APSumPreset {
  id: string;
  name: string;
  a: number;
  d: number;
  n: number;
  description: string;
}

export const AP_SUM_PRESETS: APSumPreset[] = [
  {
    id: 'standard',
    name: 'a = 2, d = 3, n = 5',
    a: 2,
    d: 3,
    n: 5,
    description: 'Terms: 2, 5, 8, 11, 14. First + last = 2 + 14 = 16. Total sum = 5 × 16 / 2 = 40.',
  },
  {
    id: 'consecutive',
    name: 'a = 1, d = 1, n = 6',
    a: 1,
    d: 1,
    n: 6,
    description: 'Natural numbers 1 to 6: 1, 2, 3, 4, 5, 6. First + last = 1 + 6 = 7. Total sum = 6 × 7 / 2 = 21.',
  },
  {
    id: 'evens',
    name: 'a = 2, d = 2, n = 5',
    a: 2,
    d: 2,
    n: 5,
    description: 'Even numbers: 2, 4, 6, 8, 10. Pair sum = 2 + 10 = 12. Total sum = 5 × 12 / 2 = 30.',
  },
  {
    id: 'high-step',
    name: 'a = 3, d = 4, n = 4',
    a: 3,
    d: 4,
    n: 4,
    description: 'Towers: 3, 7, 11, 15. Pair sum = 3 + 15 = 18. Total sum = 4 × 18 / 2 = 36.',
  },
];
