export type Point = Readonly<{ x: number; y: number }>;
export type Bounds = Readonly<{
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}>;

export const EPSILON = 1e-9;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function add(a: Point, b: Point): Point {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function subtract(a: Point, b: Point): Point {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function scale(point: Point, factor: number): Point {
  return { x: point.x * factor, y: point.y * factor };
}

export function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function constrainPoint(point: Point, bounds: Bounds): Point {
  return {
    x: clamp(point.x, bounds.minX, bounds.maxX),
    y: clamp(point.y, bounds.minY, bounds.maxY),
  };
}

export function rotateAround(
  point: Point,
  center: Point,
  degrees: number,
): Point {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const translated = subtract(point, center);
  return add(center, {
    x: translated.x * cos - translated.y * sin,
    y: translated.x * sin + translated.y * cos,
  });
}

export function polygonArea(points: readonly Point[]) {
  if (points.length < 3) return 0;
  return Math.abs(
    points.reduce((sum, point, index) => {
      const next = points[(index + 1) % points.length];
      return sum + point.x * next.y - next.x * point.y;
    }, 0) / 2,
  );
}

export function angleAt(vertex: Point, a: Point, b: Point) {
  const va = subtract(a, vertex);
  const vb = subtract(b, vertex);
  const denominator = Math.hypot(va.x, va.y) * Math.hypot(vb.x, vb.y);
  if (denominator <= EPSILON) return 0;
  const cosine = clamp((va.x * vb.x + va.y * vb.y) / denominator, -1, 1);
  return (Math.acos(cosine) * 180) / Math.PI;
}

export function nearestPointSnap(
  point: Point,
  targets: readonly Point[],
  radius: number,
) {
  if (targets.length === 0) return { point, snapped: false, targetIndex: -1 };
  let targetIndex = 0;
  let nearestDistance = distance(point, targets[0]);
  for (let index = 1; index < targets.length; index += 1) {
    const nextDistance = distance(point, targets[index]);
    if (nextDistance < nearestDistance) {
      targetIndex = index;
      nearestDistance = nextDistance;
    }
  }
  const snapped = nearestDistance <= radius;
  return {
    point: snapped ? targets[targetIndex] : point,
    snapped,
    targetIndex,
  };
}

export function pointsToSvg(points: readonly Point[]) {
  return points.map(({ x, y }) => `${x},${y}`).join(" ");
}
