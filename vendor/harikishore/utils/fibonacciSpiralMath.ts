import { computeFibonacciTiling, FibonacciSquare, FIB_NUMBERS } from './fibonacciTilingMath';
import { GOLDEN_RATIO } from '../data/fibonacciSpiralData';

export interface SpiralArc {
  index: number;
  radius: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  centerX: number;
  centerY: number;
  svgPath: string;
}

export interface RatioStep {
  step: number;
  ratioFraction: string;
  ratioDecimal: number;
  error: number;
}

export interface FibonacciSpiralEvaluation {
  n: number;
  tiling: ReturnType<typeof computeFibonacciTiling>;
  arcs: SpiralArc[];
  ratios: RatioStep[];
  currentRatio: number;
  currentError: number;
  fullSpiralPath: string;
}

export function computeFibonacciSpiral(n: number): FibonacciSpiralEvaluation {
  const tiling = computeFibonacciTiling(n);
  const clampedN = tiling.n;

  // Exact arc definitions matching our verified tiling coordinates
  const arcSpecs = [
    { startX: 1,  startY: 0,   endX: 0,   endY: 1,   centerX: 0,  centerY: 0,  r: 1,  sweep: 0 },
    { startX: 0,  startY: 1,   endX: -1,  endY: 0,   centerX: 0,  centerY: 0,  r: 1,  sweep: 0 },
    { startX: -1, startY: 0,   endX: 1,   endY: -2,  centerX: 1,  centerY: 0,  r: 2,  sweep: 0 },
    { startX: 1,  startY: -2,  endX: 4,   endY: 1,   centerX: 1,  centerY: 1,  r: 3,  sweep: 0 },
    { startX: 4,  startY: 1,   endX: -1,  endY: 6,   centerX: -1, centerY: 1,  r: 5,  sweep: 0 },
    { startX: -1, startY: 6,   endX: -9,  endY: -2,  centerX: -1, centerY: -2, r: 8,  sweep: 0 },
    { startX: -9, startY: -2,  endX: 4,   endY: -15, centerX: 4,  centerY: -2, r: 13, sweep: 0 },
  ];

  const arcs: SpiralArc[] = [];
  let combinedPath = '';

  for (let i = 0; i < clampedN; i++) {
    const spec = arcSpecs[i];
    // SVG Arc: M startX startY A r r 0 0 sweepFlag endX endY
    // Note: in SVG, y is inverted (downwards is positive), so sweep flag 0 or 1
    const path = `M ${spec.startX} ${spec.startY} A ${spec.r} ${spec.r} 0 0 0 ${spec.endX} ${spec.endY}`;
    arcs.push({
      index: i + 1,
      radius: spec.r,
      startX: spec.startX,
      startY: spec.startY,
      endX: spec.endX,
      endY: spec.endY,
      centerX: spec.centerX,
      centerY: spec.centerY,
      svgPath: path,
    });

    if (i === 0) {
      combinedPath = `M ${spec.startX} ${spec.startY} A ${spec.r} ${spec.r} 0 0 0 ${spec.endX} ${spec.endY}`;
    } else {
      combinedPath += ` A ${spec.r} ${spec.r} 0 0 0 ${spec.endX} ${spec.endY}`;
    }
  }

  const ratios: RatioStep[] = [];
  for (let k = 1; k <= clampedN; k++) {
    const fK = FIB_NUMBERS[k - 1];
    const fKPlus1 = FIB_NUMBERS[k];
    const ratioDecimal = Math.round((fKPlus1 / fK) * 10000) / 10000;
    const error = Math.round(Math.abs(ratioDecimal - GOLDEN_RATIO) * 10000) / 10000;
    ratios.push({
      step: k,
      ratioFraction: `${fKPlus1} / ${fK}`,
      ratioDecimal,
      error,
    });
  }

  const currentRatio = ratios[ratios.length - 1].ratioDecimal;
  const currentError = ratios[ratios.length - 1].error;

  return {
    n: clampedN,
    tiling,
    arcs,
    ratios,
    currentRatio,
    currentError,
    fullSpiralPath: combinedPath,
  };
}