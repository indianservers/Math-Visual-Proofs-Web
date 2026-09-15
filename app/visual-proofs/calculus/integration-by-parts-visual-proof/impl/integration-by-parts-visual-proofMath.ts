/**
 * Mathematical models and geometric computations for Integration by Parts Visual Proof.
 * Theorem: ∫_a^b u(x) v'(x) dx = [u(x) v(x)]_a^b - ∫_a^b v(x) u'(x) dx
 * Invariant: Continuous differentiable functions u, v satisfy d(uv) = u dv + v du across all subintervals.
 */

/** Primary function u(x) = x² */
export function u(x: number): number {
  return x * x;
}

/** First derivative u′(x) = 2x */
export function uPrime(x: number): number {
  return 2 * x;
}

/** Second derivative u″(x) = 2 */
export function uDoublePrime(_x: number): number {
  return 2;
}

/** Derivative v′(x) = cos x */
export function vPrime(x: number): number {
  return Math.cos(x);
}

/** Integrated function v(x) = ∫_a^x cos(t) dt = sin(x) - sin(a) */
export function v(x: number, a = 0): number {
  return Math.sin(x) - Math.sin(a);
}

/** Second derivative v″(x) = -sin x */
export function vDoublePrime(x: number): number {
  return -Math.sin(x);
}

export interface ProductGeometry {
  a: number;
  b: number;
  x: number;
  u1: number;
  u2: number;
  v1: number;
  v2: number;
  uvArea: number;
  vDuStrip: number;
  uDvStrip: number;
  deltaU: number;
  deltaV: number;
  cornerArea: number;
  totalArea: number;
}

/**
 * Computes exact geometric decomposition for the Product Rectangle Model.
 * Total change Δ(uv) = u2*v2 - u1*v1 = v2*Δu + u1*Δv (or u2*Δv + v1*Δu)
 */
export function computeProductGeometry(a: number, x: number, b: number): ProductGeometry {
  const u1 = u(a);
  const u2 = u(x);
  const v1 = v(a, a); // 0
  const v2 = v(x, a);
  const deltaU = u2 - u1;
  const deltaV = v2 - v1;
  const uvArea = u1 * v1; // 0 at starting bound
  const vDuStrip = Math.max(0, v2 * deltaU);
  const uDvStrip = Math.max(0, u1 * deltaV);
  const cornerArea = Math.max(0, deltaU * deltaV);
  const totalArea = u2 * v2;

  return {
    a,
    b,
    x,
    u1,
    u2,
    v1,
    v2,
    uvArea,
    vDuStrip,
    uDvStrip,
    deltaU,
    deltaV,
    cornerArea,
    totalArea,
  };
}

export interface IBPResults {
  uvBoundary: number;
  integralUDv: number;
  integralVDu: number;
  difference: number;
  isValid: boolean;
}

/**
 * Calculates both exact and numerical values for integration by parts on [a, b].
 */
export function integrationByPartsValues(a: number, b: number): IBPResults {
  // Boundary term [uv]_a^b = u(b)v(b) - u(a)v(a)
  const uvBoundary = u(b) * v(b, a) - u(a) * v(a, a);

  // Numerical integrals using Simpson's 3/8 & 1/3 compound rule
  const integralUDv = simpsonIntegral(a, b, (t) => u(t) * vPrime(t), 400);
  const integralVDu = simpsonIntegral(a, b, (t) => v(t, a) * uPrime(t), 400);

  // Analytical check: ∫ x² cos x dx = x² sin x + 2x cos x - 2 sin x
  // ∫ 2x sin x dx = 2 sin x - 2x cos x
  const difference = Math.abs(integralUDv - (uvBoundary - integralVDu));
  const isValid = difference < 1e-4;

  return {
    uvBoundary,
    integralUDv,
    integralVDu,
    difference,
    isValid,
  };
}

export function simpsonIntegral(
  a: number,
  b: number,
  f: (x: number) => number,
  n = 200,
): number {
  if (Math.abs(b - a) < 1e-9) return 0;
  // Ensure n is even
  const steps = n % 2 === 0 ? n : n + 1;
  const h = (b - a) / steps;
  let sum = f(a) + f(b);

  for (let i = 1; i < steps; i += 2) {
    sum += 4 * f(a + i * h);
  }
  for (let i = 2; i < steps - 1; i += 2) {
    sum += 2 * f(a + i * h);
  }

  return (h / 3) * sum;
}

export interface CurvePoint {
  x: number;
  y: number;
}

export function sampleCurve(
  fn: (x: number) => number,
  a: number,
  b: number,
  count = 100,
): CurvePoint[] {
  const points: CurvePoint[] = [];
  const span = b - a;
  for (let i = 0; i <= count; i++) {
    const x = a + (span * i) / count;
    points.push({ x, y: fn(x) });
  }
  return points;
}

export interface LineSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function computeTangentLine(
  x0: number,
  fn: (x: number) => number,
  fnPrime: (x: number) => number,
  dx = 0.4,
): LineSegment {
  const y0 = fn(x0);
  const slope = fnPrime(x0);
  return {
    x1: x0 - dx,
    y1: y0 - slope * dx,
    x2: x0 + dx,
    y2: y0 + slope * dx,
  };
}

export function computeSecantLine(
  x1: number,
  x2: number,
  fn: (x: number) => number,
): LineSegment {
  const y1 = fn(x1);
  const y2 = fn(x2);
  return {
    x1,
    y1,
    x2,
    y2,
  };
}

export interface ApproximationStrip {
  index: number;
  xLeft: number;
  xRight: number;
  width: number;
  heightU: number;
  heightV: number;
}

export function computeApproximationStrips(
  a: number,
  x: number,
  stripCount = 8,
): ApproximationStrip[] {
  if (x <= a) return [];
  const strips: ApproximationStrip[] = [];
  const dx = (x - a) / stripCount;

  for (let i = 0; i < stripCount; i++) {
    const xLeft = a + i * dx;
    const xRight = xLeft + dx;
    const xMid = (xLeft + xRight) / 2;
    strips.push({
      index: i,
      xLeft,
      xRight,
      width: dx,
      heightU: u(xMid),
      heightV: Math.max(0, v(xMid, a)),
    });
  }

  return strips;
}

export function snapX(value: number, a: number, b: number, enabled: boolean): number {
  const clamped = clamp(value, a + 0.02, b);
  if (!enabled) return clamped;

  const keyPoints = [a, a + (b - a) * 0.25, a + (b - a) * 0.5, a + (b - a) * 0.75, b];
  let best = clamped;
  let minDiff = Infinity;

  for (const kp of keyPoints) {
    const diff = Math.abs(kp - clamped);
    if (diff < minDiff) {
      minDiff = diff;
      best = kp;
    }
  }

  // Snap threshold in math domain (~0.10)
  if (minDiff < 0.1) {
    return best;
  }
  return clamped;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function formatX(x: number): string {
  if (Math.abs(x - Math.PI) < 0.015) return "π";
  if (Math.abs(x - (3 * Math.PI) / 4) < 0.015) return "3π/4";
  if (Math.abs(x - Math.PI / 2) < 0.015) return "π/2";
  if (Math.abs(x - Math.PI / 4) < 0.015) return "π/4";
  if (Math.abs(x) < 0.015) return "0";
  return x.toFixed(2);
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  if (Math.abs(inMax - inMin) < 1e-9) return (outMin + outMax) / 2;
  const t = (value - inMin) / (inMax - inMin);
  return outMin + t * (outMax - outMin);
}

export function buildPolyline(
  points: CurvePoint[],
  mapX: (x: number) => number,
  mapY: (y: number) => number,
): string {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${mapX(p.x).toFixed(2)} ${mapY(p.y).toFixed(2)}`)
    .join(" ");
}

