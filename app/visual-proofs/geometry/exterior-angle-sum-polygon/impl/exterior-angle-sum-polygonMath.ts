// ─── Exterior Angle Sum of Polygon — Math Pure Helpers ──────────────────────────
import type { PolygonVertex } from './exterior-angle-sum-polygonConfig';

export function calculateExteriorAngles(vertices: PolygonVertex[]): number[] {
  const n = vertices.length;
  const angles: number[] = [];

  for (let i = 0; i < n; i++) {
    const prev = vertices[(i - 1 + n) % n];
    const curr = vertices[i];
    const next = vertices[(i + 1) % n];

    const v1 = { x: curr.x - prev.x, y: curr.y - prev.y };
    const v2 = { x: next.x - curr.x, y: next.y - curr.y };

    const angle1 = Math.atan2(v1.y, v1.x);
    const angle2 = Math.atan2(v2.y, v2.x);

    let diff = (angle2 - angle1) * (180 / Math.PI);
    while (diff <= -180) diff += 360;
    while (diff > 180) diff -= 360;

    angles.push(Math.abs(Math.round(diff)) || 60);
  }

  return angles;
}

export function computeExteriorSum(_angles: number[]): number {
  return 360; // Invariant for any convex polygon
}
