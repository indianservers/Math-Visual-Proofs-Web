/** Pure math for sector area formula. */

export function sectorAreaDegrees(radius: number, degrees: number): number {
  return (degrees / 360) * Math.PI * radius * radius;
}

export function sectorAreaRadians(radius: number, radians: number): number {
  return 0.5 * radius * radius * radians;
}

export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function arcLength(radius: number, degrees: number): number {
  return (degrees / 360) * 2 * Math.PI * radius;
}

export function areaFraction(degrees: number): number {
  return degrees / 360;
}
