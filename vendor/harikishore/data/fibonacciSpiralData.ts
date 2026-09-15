export interface SpiralPreset {
  id: string;
  name: string;
  n: number;
  description: string;
}

export const SPIRAL_PRESETS: SpiralPreset[] = [
  {
    id: 'spiral-6',
    name: '6 Arcs (F₆ = 8, Ratio = 1.600)',
    n: 6,
    description: '6 quarter-circle arcs sweeping across squares 1 through 8. Error to φ is only 0.018.',
  },
  {
    id: 'spiral-4',
    name: '4 Arcs (F₄ = 3, Ratio = 1.500)',
    n: 4,
    description: 'First 4 arcs inside squares 1, 1, 2, 3.',
  },
  {
    id: 'spiral-5',
    name: '5 Arcs (F₅ = 5, Ratio = 1.667)',
    n: 5,
    description: '5 arcs showing alternating overshoot/undershoot around the golden ratio.',
  },
  {
    id: 'spiral-7',
    name: '7 Arcs (F₇ = 13, Ratio = 1.625)',
    n: 7,
    description: 'Full sweeping spiral across squares 1 through 13. High-precision golden approximation.',
  },
];

export const GOLDEN_RATIO = 1.618033988749895;