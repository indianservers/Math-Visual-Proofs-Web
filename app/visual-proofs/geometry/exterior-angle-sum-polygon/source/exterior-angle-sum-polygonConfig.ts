// ─── Exterior Angle Sum of Polygon — Configuration ─────────────────────────────

export type ProofState =
  | 'inspect'
  | 'manipulate'
  | 'preserve'
  | 'connect'
  | 'conclude'
  | 'transfer';

export interface PolygonVertex {
  id: number;
  x: number;
  y: number;
  exteriorAngleDeg: number;
  color: string;
}

export const HINTS = [
  { level: 1, title: 'Notice', body: 'At each vertex of the polygon, you turn by an exterior angle when walking around it.' },
  { level: 2, title: 'Choose', body: 'Drag a vertex to reshape the polygon, or click Detach arcs to explore.' },
  { level: 3, title: 'Predict', body: 'No matter the shape or side lengths, a full circuit brings you back facing the same way.' },
  { level: 4, title: 'Guide', body: 'Accumulate the turning angles end-to-end to form one full 360° turn.' },
  { level: 5, title: 'Explain', body: 'Sum of exterior angles = 360° for any simple convex polygon.' },
];

export const PROOF_STATES: Record<ProofState, string> = {
  inspect: 'Inspect polygon vertices and exterior angles.',
  manipulate: 'Drag vertices to alter side lengths and interior angles.',
  preserve: 'Note that turning around the full perimeter remains one 360° turn.',
  connect: 'Join exterior angle arcs head-to-tail.',
  conclude: 'Conclude: Exterior angle sum = 360°.',
  transfer: 'Test with a different polygon (e.g. heptagon).',
};

export const DEFAULT_HEXAGON_VERTICES: PolygonVertex[] = [
  { id: 0, x: 260, y: 130, exteriorAngleDeg: 72, color: '#3b82f6' },
  { id: 1, x: 380, y: 160, exteriorAngleDeg: 96, color: '#10b981' },
  { id: 2, x: 360, y: 280, exteriorAngleDeg: 128, color: '#f43f5e' },
  { id: 3, x: 240, y: 320, exteriorAngleDeg: 64, color: '#f59e0b' },
  { id: 4, x: 160, y: 270, exteriorAngleDeg: 76, color: '#06b6d4' },
  { id: 5, x: 180, y: 170, exteriorAngleDeg: 104, color: '#a855f7' },
];
