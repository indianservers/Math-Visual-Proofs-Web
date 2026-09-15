import { Point } from './geometry';
import { FourierWavePreset } from '../data/fourierData';

export interface HarmonicInfo {
  n: number;
  frequency: number;
  amplitude: number;
  phase: number;
  isNonZero: boolean;
}

export function evaluateFourierSeries(
  preset: FourierWavePreset,
  numHarmonics: number,
  t: number,
  omega0: number = 2 * Math.PI
): number {
  let sum = 0;
  // Handle DC offset if present (n = 0)
  const dc = preset.harmonicCoeff(0);
  sum += dc.a;

  for (let n = 1; n <= numHarmonics; n++) {
    const coeff = preset.harmonicCoeff(n);
    if (coeff.a !== 0) {
      sum += coeff.a * Math.cos(n * omega0 * t);
    }
    if (coeff.b !== 0) {
      sum += coeff.b * Math.sin(n * omega0 * t);
    }
  }

  return sum;
}

export function computeHarmonicsList(
  preset: FourierWavePreset,
  maxN: number = 15,
  omega0: number = 2 * Math.PI
): HarmonicInfo[] {
  const list: HarmonicInfo[] = [];
  for (let n = 1; n <= maxN; n++) {
    const coeff = preset.harmonicCoeff(n);
    const amp = Math.sqrt(coeff.a * coeff.a + coeff.b * coeff.b);
    const phase = Math.atan2(coeff.b, coeff.a);
    list.push({
      n,
      frequency: n * (omega0 / (2 * Math.PI)),
      amplitude: amp,
      phase,
      isNonZero: amp > 1e-4,
    });
  }
  return list;
}

export function generateWaveformPoints(
  preset: FourierWavePreset,
  numHarmonics: number,
  tRange: [number, number] = [0, 2],
  samples: number = 200,
  period: number = 1.0
): { targetPts: Point[]; fourierPts: Point[]; errorPts: Point[]; mse: number } {
  const targetPts: Point[] = [];
  const fourierPts: Point[] = [];
  const errorPts: Point[] = [];
  const dt = (tRange[1] - tRange[0]) / samples;
  const omega0 = (2 * Math.PI) / period;

  let sumSqError = 0;

  for (let i = 0; i <= samples; i++) {
    const t = tRange[0] + i * dt;
    const yTarget = preset.targetFn(t, period);
    const yFourier = evaluateFourierSeries(preset, numHarmonics, t, omega0);
    const err = Math.abs(yTarget - yFourier);

    targetPts.push({ x: t, y: yTarget });
    fourierPts.push({ x: t, y: yFourier });
    errorPts.push({ x: t, y: err });

    sumSqError += (yTarget - yFourier) * (yTarget - yFourier);
  }

  const mse = sumSqError / (samples + 1);

  return { targetPts, fourierPts, errorPts, mse };
}
