// ─── Heron's Formula — Math Pure Helpers ─────────────────────────────────────
import type { TrianglePoint } from './herons-formula-visual-proofConfig';

export function computeHeron(A: TrianglePoint, B: TrianglePoint, C: TrianglePoint) {
  const c = Math.hypot(A.x - B.x, A.y - B.y) / 40;
  const b = Math.hypot(A.x - C.x, A.y - C.y) / 40;
  const a = Math.hypot(C.x - B.x, C.y - B.y) / 40;

  const s = (a + b + c) / 2;
  const areaSq = s * (s - a) * (s - b) * (s - c);
  const area = Math.sqrt(Math.max(0, areaSq));

  const h = (2 * area) / a;
  const x = Math.sqrt(Math.max(0, c * c - h * h));
  const y = a - x;

  return { a, b, c, s, h, x, y, area };
}
