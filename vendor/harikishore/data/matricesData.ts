export interface MatrixPreset {
  id: string;
  name: string;
  matrix: [number, number, number, number]; // [a, c, b, d] representing [[a, c], [b, d]]
  det: number;
  description: string;
  type: 'identity' | 'rotation' | 'scale' | 'reflection' | 'shear' | 'singular' | 'custom';
  isCustom?: boolean;
}

export const MATRIX_PRESETS: MatrixPreset[] = [
  {
    id: 'identity',
    name: 'Identity (No Change)',
    matrix: [1, 0, 0, 1],
    det: 1,
    description: 'Basis vectors remain î = (1, 0) and ĵ = (0, 1). Area and orientation preserved.',
    type: 'identity',
  },
  {
    id: 'rotation-45',
    name: 'Rotation by +45°',
    matrix: [0.71, -0.71, 0.71, 0.71],
    det: 1,
    description: 'Rotates all vectors counter-clockwise by 45°. Distance and area preserved.',
    type: 'rotation',
  },
  {
    id: 'rotation-90',
    name: 'Rotation by +90°',
    matrix: [0, -1, 1, 0],
    det: 1,
    description: 'Maps î → (0, 1) and ĵ → (-1, 0). Det = 1.',
    type: 'rotation',
  },
  {
    id: 'scale-2',
    name: 'Uniform Scale (2×)',
    matrix: [2, 0, 0, 2],
    det: 4,
    description: 'Doubles lengths along both axes. Area is multiplied by 4 (det = 4).',
    type: 'scale',
  },
  {
    id: 'non-uniform-scale',
    name: 'Non-Uniform Scale (2×, 0.5×)',
    matrix: [2, 0, 0, 0.5],
    det: 1,
    description: 'Stretches horizontally by 2 and compresses vertically by 0.5. Area preserved (det = 1).',
    type: 'scale',
  },
  {
    id: 'reflect-y',
    name: 'Reflection (across y-axis)',
    matrix: [-1, 0, 0, 1],
    det: -1,
    description: 'Flips the horizontal sign. Determinant = -1 indicates orientation reversal.',
    type: 'reflection',
  },
  {
    id: 'shear-x',
    name: 'Horizontal Shear (k = 1)',
    matrix: [1, 1, 0, 1],
    det: 1,
    description: 'Slides horizontal layers proportionally to y. Area is preserved (det = 1).',
    type: 'shear',
  },
  {
    id: 'singular',
    name: 'Singular Projection (det = 0)',
    matrix: [1, 1, 1, 1],
    det: 0,
    description: 'Collapses the entire 2D plane onto the line y = x. Area drops to 0.',
    type: 'singular',
  },
  {
    id: 'custom',
    name: 'Custom Matrix',
    matrix: [1, 0, 0, 1],
    det: 1,
    description: 'Enter your own 2x2 transformation matrix values.',
    type: 'custom',
    isCustom: true,
  },
];
