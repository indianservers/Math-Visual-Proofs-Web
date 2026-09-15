export interface LPConstraint {
  id: string;
  name: string;
  a1: number;
  a2: number;
  op: '<=' | '>=';
  b: number;
  latex: string;
}

export interface LPVertex {
  x: number;
  y: number;
  zValue: number;
  isOptimum: boolean;
  activeConstraints: string[];
}

export interface LPPreset {
  id: string;
  name: string;
  type: 'max' | 'min';
  c1: number;
  c2: number;
  latexObjective: string;
  constraints: LPConstraint[];
  description: string;
  vertices: { x: number; y: number; activeConstraints: string[] }[];
  defaultK: number;
  kMin: number;
  kMax: number;
}

export const LP_PRESETS: LPPreset[] = [
  {
    id: 'production',
    name: 'Production Profit Maximization',
    type: 'max',
    c1: 3,
    c2: 2,
    latexObjective: '\\max Z = 3x + 2y',
    constraints: [
      { id: 'c1', name: 'Machine Hours', a1: 1, a2: 2, op: '<=', b: 8, latex: 'x + 2y \\le 8' },
      { id: 'c2', name: 'Labor Hours', a1: 1, a2: 1, op: '<=', b: 5, latex: 'x + y \\le 5' },
      { id: 'c3', name: 'Raw Material', a1: 1, a2: 0, op: '<=', b: 4, latex: 'x \\le 4' },
      { id: 'c4', name: 'Non-negativity X', a1: 1, a2: 0, op: '>=', b: 0, latex: 'x \\ge 0' },
      { id: 'c5', name: 'Non-negativity Y', a1: 0, a2: 1, op: '>=', b: 0, latex: 'y \\ge 0' },
    ],
    description: 'Find the optimal production quantities x and y that maximize profit without exceeding capacity limits.',
    vertices: [
      { x: 0, y: 0, activeConstraints: ['c4', 'c5'] },
      { x: 4, y: 0, activeConstraints: ['c3', 'c5'] },
      { x: 4, y: 1, activeConstraints: ['c2', 'c3'] },
      { x: 2, y: 3, activeConstraints: ['c1', 'c2'] },
      { x: 0, y: 4, activeConstraints: ['c1', 'c4'] },
    ],
    defaultK: 14,
    kMin: 0,
    kMax: 20,
  },
  {
    id: 'resource',
    name: 'Resource Allocation (2x+y ≤ 10, x+2y ≤ 8)',
    type: 'max',
    c1: 4,
    c2: 5,
    latexObjective: '\\max Z = 4x + 5y',
    constraints: [
      { id: 'c1', name: 'Resource A', a1: 2, a2: 1, op: '<=', b: 10, latex: '2x + y \\le 10' },
      { id: 'c2', name: 'Resource B', a1: 1, a2: 2, op: '<=', b: 8, latex: 'x + 2y \\le 8' },
      { id: 'c3', name: 'Non-negativity X', a1: 1, a2: 0, op: '>=', b: 0, latex: 'x \\ge 0' },
      { id: 'c4', name: 'Non-negativity Y', a1: 0, a2: 1, op: '>=', b: 0, latex: 'y \\ge 0' },
    ],
    description: 'Symmetric linear problem with corner vertex at the intersection of Resource A and Resource B.',
    vertices: [
      { x: 0, y: 0, activeConstraints: ['c3', 'c4'] },
      { x: 5, y: 0, activeConstraints: ['c1', 'c4'] },
      { x: 4, y: 2, activeConstraints: ['c1', 'c2'] },
      { x: 0, y: 4, activeConstraints: ['c2', 'c3'] },
    ],
    defaultK: 26,
    kMin: 0,
    kMax: 35,
  },
  {
    id: 'diet',
    name: 'Diet Cost Minimization (x+y ≥ 3, 2x+y ≥ 4)',
    type: 'min',
    c1: 2,
    c2: 3,
    latexObjective: '\\min Z = 2x + 3y',
    constraints: [
      { id: 'c1', name: 'Nutrient 1', a1: 1, a2: 1, op: '>=', b: 3, latex: 'x + y \\ge 3' },
      { id: 'c2', name: 'Nutrient 2', a1: 2, a2: 1, op: '>=', b: 4, latex: '2x + y \\ge 4' },
      { id: 'c3', name: 'Upper Bound X', a1: 1, a2: 0, op: '<=', b: 5, latex: 'x \\le 5' },
      { id: 'c4', name: 'Upper Bound Y', a1: 0, a2: 1, op: '<=', b: 5, latex: 'y \\le 5' },
    ],
    description: 'Minimizing objective function over an unbounded/capped requirement region. Optimum sits at (1, 2).',
    vertices: [
      { x: 0, y: 4, activeConstraints: ['c2', 'x=0'] },
      { x: 1, y: 2, activeConstraints: ['c1', 'c2'] },
      { x: 3, y: 0, activeConstraints: ['c1', 'y=0'] },
      { x: 5, y: 0, activeConstraints: ['c3', 'y=0'] },
      { x: 5, y: 5, activeConstraints: ['c3', 'c4'] },
      { x: 0, y: 5, activeConstraints: ['x=0', 'c4'] },
    ],
    defaultK: 8,
    kMin: 0,
    kMax: 25,
  },
];
