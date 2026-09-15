export interface SquareOddLayerPreset {
  id: string;
  name: string;
  n: number;
  description: string;
}

export const SQUARE_ODD_LAYER_PRESETS: SquareOddLayerPreset[] = [
  {
    id: 'n-3',
    name: '3 × 3 Square (9 Tiles)',
    n: 3,
    description: '1 + 3 + 5 = 9. 3 concentric L-layers form a 3 × 3 square.',
  },
  {
    id: 'n-4',
    name: '4 × 4 Square (16 Tiles)',
    n: 4,
    description: '1 + 3 + 5 + 7 = 16. The 4th layer adds 2(4) - 1 = 7 tiles.',
  },
  {
    id: 'n-5',
    name: '5 × 5 Square (25 Tiles)',
    n: 5,
    description: '1 + 3 + 5 + 7 + 9 = 25. Layer 5 adds 9 tiles, proving 5² - 4² = 9.',
  },
  {
    id: 'n-6',
    name: '6 × 6 Square (36 Tiles)',
    n: 6,
    description: '1 + 3 + 5 + 7 + 9 + 11 = 36. Telescoping sum of first 6 odd numbers.',
  },
];

export const ODD_LAYER_PALETTE = [
  '#ef4444', // Red-500 (1)
  '#f97316', // Orange-500 (3)
  '#eab308', // Yellow-500 (5)
  '#10b981', // Emerald-500 (7)
  '#06b6d4', // Cyan-500 (9)
  '#6366f1', // Indigo-500 (11)
  '#a855f7', // Purple-500 (13)
  '#ec4899', // Pink-500 (15)
];