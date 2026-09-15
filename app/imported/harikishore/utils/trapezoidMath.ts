import { Point } from './geometry';
import { TrapezoidPreset } from '../data/trapezoidData';

export interface TrapezoidStrip {
  index: number;
  xLeft: number;
  xRight: number;
  yLeft: number;
  yRight: number;
  area: number;
}

export interface TrapezoidCalculation {
  n: number;
  h: number;
  nodes: { x: number; y: number; isInterior: boolean; multiplier: number }[];
  strips: TrapezoidStrip[];
  approxAreaTn: number;
  exactIntegral: number;
  error: number;
  percentError: number;
}

export function computeTrapezoidalApproximation(
  preset: TrapezoidPreset,
  n: number
): TrapezoidCalculation {
  const safeN = Math.max(1, Math.min(20, n));
  const h = (preset.b - preset.a) / safeN;
  const nodes = [];
  const strips: TrapezoidStrip[] = [];

  let interiorSum = 0;

  for (let k = 0; k <= safeN; k++) {
    const x = preset.a + k * h;
    const y = preset.fn(x);
    const isInterior = k > 0 && k < safeN;
    const multiplier = isInterior ? 2 : 1;
    nodes.push({ x, y, isInterior, multiplier });

    if (isInterior) {
      interiorSum += y;
    }
  }

  for (let k = 0; k < safeN; k++) {
    const xL = nodes[k].x;
    const xR = nodes[k + 1].x;
    const yL = nodes[k].y;
    const yR = nodes[k + 1].y;
    const stripArea = (h / 2) * (yL + yR);
    strips.push({
      index: k + 1,
      xLeft: xL,
      xRight: xR,
      yLeft: yL,
      yRight: yR,
      area: stripArea,
    });
  }

  const y0 = nodes[0].y;
  const yn = nodes[safeN].y;
  const approxAreaTn = (h / 2) * (y0 + 2 * interiorSum + yn);
  const error = approxAreaTn - preset.exactIntegral;
  const percentError = (Math.abs(error) / Math.max(0.001, Math.abs(preset.exactIntegral))) * 100;

  return {
    n: safeN,
    h,
    nodes,
    strips,
    approxAreaTn,
    exactIntegral: preset.exactIntegral,
    error,
    percentError,
  };
}

export function sampleCurvePoints(
  preset: TrapezoidPreset,
  samples: number = 80
): Point[] {
  const pts: Point[] = [];
  const dx = (preset.b - preset.a) / samples;
  for (let i = 0; i <= samples; i++) {
    const x = preset.a + i * dx;
    const y = preset.fn(x);
    pts.push({ x, y });
  }
  return pts;
}
