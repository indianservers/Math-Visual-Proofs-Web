import { Point } from './geometry';

export interface SHMState {
  t: number;
  x: number;
  v: number;
  a: number;
  kineticEnergy: number;
  potentialEnergy: number;
  totalEnergy: number;
  period: number;
  frequency: number;
}

export function computeSHMState(
  t: number,
  A: number,
  omega: number,
  phi: number,
  mass: number = 1,
  k: number = 4
): SHMState {
  const angle = omega * t + phi;
  const x = A * Math.cos(angle);
  const v = -A * omega * Math.sin(angle);
  const a = -A * omega * omega * Math.cos(angle);

  const ke = 0.5 * mass * v * v;
  const pe = 0.5 * k * x * x;
  const total = 0.5 * k * A * A;

  return {
    t,
    x,
    v,
    a,
    kineticEnergy: ke,
    potentialEnergy: pe,
    totalEnergy: total,
    period: (2 * Math.PI) / omega,
    frequency: omega / (2 * Math.PI),
  };
}

/**
 * Generates an SVG path for a coiled zigzag spring from (startX, y) to (endX, y)
 */
export function generateSpringPath(
  startX: number,
  endX: number,
  y: number,
  coils: number = 9,
  height: number = 14
): string {
  const totalWidth = endX - startX;
  const leadLength = 12; // straight lead at ends
  const springWidth = Math.max(20, totalWidth - 2 * leadLength);
  const segmentWidth = springWidth / (coils * 2);

  let path = `M ${startX.toFixed(1)},${y.toFixed(1)} L ${(startX + leadLength).toFixed(1)},${y.toFixed(1)}`;
  let currX = startX + leadLength;

  for (let i = 0; i < coils * 2; i++) {
    const nextX = currX + segmentWidth;
    const nextY = i % 2 === 0 ? y - height : y + height;
    path += ` L ${nextX.toFixed(1)},${nextY.toFixed(1)}`;
    currX = nextX;
  }

  path += ` L ${endX.toFixed(1)},${y.toFixed(1)}`;
  return path;
}

/**
 * Generates plotted waveform points for x(t) over a window [0, tMax]
 */
export function generateCosineWaveform(
  A: number,
  omega: number,
  phi: number,
  tMax: number = 6.0,
  samples: number = 120
): Point[] {
  const pts: Point[] = [];
  const dt = tMax / samples;

  for (let i = 0; i <= samples; i++) {
    const t = i * dt;
    const x = A * Math.cos(omega * t + phi);
    pts.push({ x: t, y: x });
  }

  return pts;
}
