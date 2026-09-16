// ─── Shoelace Formula — Configuration ─────────────────────────────────────────

export type ProofState = 'inspect' | 'manipulate' | 'preserve' | 'connect' | 'conclude' | 'transfer';

export interface PolygonPoint {
  id: string;
  name: string;
  x: number;
  y: number;
}

export const HINTS = [
  { level: 1, title: 'Coordinates Loop', body: 'List coordinates in order and repeat the first point.' },
  { level: 2, title: 'Diagonal Products', body: 'Multiply down-right (x_i * y_{i+1}) and up-right (y_i * x_{i+1}).' },
  { level: 3, title: 'Subtract Sums', body: 'Signed difference = Σ(x_i y_{i+1}) - Σ(y_i x_{i+1}) = 2 × Area.' },
  { level: 4, title: 'Determinant Connection', body: 'Each cross-product term is a 2x2 determinant.' },
];

export const PROOF_STATES: Record<ProofState, string> = {
  inspect: 'Inspect polygon vertices on coordinate plane.',
  manipulate: 'Drag vertices to alter polygon coordinates.',
  preserve: 'Preserve cyclic order of vertices.',
  connect: 'Calculate down-right and up-right shoelace sums.',
  conclude: 'Conclude Shoelace Formula: 2 × Area = Σ(x_i y_{i+1} - y_i x_{i+1}).',
  transfer: 'Test a fresh polygon configuration.',
};

export const DEFAULT_SHOELACE_POINTS: PolygonPoint[] = [
  { id: 'A', name: 'A', x: -4, y: 1 },
  { id: 'B', name: 'B', x: -1, y: 4 },
  { id: 'C', name: 'C', x: 3, y: 3 },
  { id: 'D', name: 'D', x: 5, y: -1 },
  { id: 'E', name: 'E', x: 1, y: -3 },
];
