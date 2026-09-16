export interface OddSumPreset {
  id: string;
  name: string;
  n: number;
  description: string;
}

export const ODD_SUM_PRESETS: OddSumPreset[] = [
  {
    id: 'n4',
    name: 'n = 4 (Square 4 × 4 = 16)',
    n: 4,
    description: '1 + 3 + 5 + 7 = 16. Four nested rainbow L-layers wrap together into a 4 × 4 square.',
  },
  {
    id: 'n5',
    name: 'n = 5 (Square 5 × 5 = 25)',
    n: 5,
    description: '1 + 3 + 5 + 7 + 9 = 25. Five layers produce a 5 × 5 square.',
  },
  {
    id: 'n3',
    name: 'n = 3 (Square 3 × 3 = 9)',
    n: 3,
    description: '1 + 3 + 5 = 9. Three layers build a 3 × 3 square.',
  },
  {
    id: 'n6',
    name: 'n = 6 (Square 6 × 6 = 36)',
    n: 6,
    description: '1 + 3 + 5 + 7 + 9 + 11 = 36. Six layers assemble into a 36-block square.',
  },
];

export const LAYER_COLORS = [
  '#ef4444', // Red (Layer 1: 1)
  '#f97316', // Orange (Layer 2: 3)
  '#eab308', // Yellow (Layer 3: 5)
  '#22c55e', // Green (Layer 4: 7)
  '#06b6d4', // Cyan (Layer 5: 9)
  '#6366f1', // Indigo (Layer 6: 11)
  '#a855f7', // Purple (Layer 7: 13)
  '#ec4899', // Pink (Layer 8: 15)
];
