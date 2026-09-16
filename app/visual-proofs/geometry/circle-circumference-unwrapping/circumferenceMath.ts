/** Pure math for circle circumference by rolling/unwrapping. */

export function circumference(radius: number): number {
  return 2 * Math.PI * radius;
}

/** Distance traveled after rolling through `turns` (1 = full rotation). */
export function travelDistance(radius: number, turns: number): number {
  return circumference(radius) * turns;
}

/** Rotation degrees for a given travel distance along the ground. */
export function rotationDegrees(radius: number, distance: number): number {
  if (radius <= 0) return 0;
  return (distance / circumference(radius)) * 360;
}

export function isFullRotation(turns: number, epsilon = 0.02): boolean {
  return Math.abs(turns - 1) <= epsilon || turns >= 1 - epsilon;
}

export function formatLength(value: number): string {
  return value.toFixed(2);
}
