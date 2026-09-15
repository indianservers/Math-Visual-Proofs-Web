import { Point } from './geometry';
import { LaplacePreset } from '../data/laplaceData';

export interface LaplaceSystemMetrics {
  decayRateA: number;
  timeConstantTau: number;
  halfLife: number;
  settlingTime4Tau: number;
  isStable: boolean;
}

export function computeLaplaceMetrics(a: number): LaplaceSystemMetrics {
  const safeA = Math.max(0.001, a);
  return {
    decayRateA: a,
    timeConstantTau: 1 / safeA,
    halfLife: Math.LN2 / safeA,
    settlingTime4Tau: 4 / safeA,
    isStable: a > 0,
  };
}

export function generateTimeDomainPoints(
  preset: LaplacePreset,
  a: number,
  tMax: number = 5.0,
  samples: number = 100
): Point[] {
  const pts: Point[] = [];
  const dt = tMax / samples;

  for (let i = 0; i <= samples; i++) {
    const t = i * dt;
    const y = preset.timeFn(t, a, preset.omega0);
    pts.push({ x: t, y });
  }

  return pts;
}
