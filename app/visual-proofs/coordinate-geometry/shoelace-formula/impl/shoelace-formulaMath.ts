// ─── Shoelace Formula — Math Pure Helpers ─────────────────────────────────────
import type { PolygonPoint } from './shoelace-formulaConfig';

export function computeShoelace(points: PolygonPoint[]) {
  const n = points.length;
  let downRightSum = 0;
  let upRightSum = 0;
  const terms: { name1: string; name2: string; dr: number; ur: number }[] = [];

  for (let i = 0; i < n; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % n];

    const dr = p1.x * p2.y;
    const ur = p1.y * p2.x;

    downRightSum += dr;
    upRightSum += ur;

    terms.push({ name1: p1.name, name2: p2.name, dr, ur });
  }

  const signedDiff = downRightSum - upRightSum;
  const twiceArea = signedDiff;
  const signedArea = signedDiff / 2;
  const absoluteArea = Math.abs(signedArea);

  return { terms, downRightSum, upRightSum, signedDiff, twiceArea, signedArea, absoluteArea };
}
