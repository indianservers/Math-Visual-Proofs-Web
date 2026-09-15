import { Point } from './geometry';

export interface SlopeSegment {
  x: number;
  y: number;
  slope: number;
  angleRad: number;
  screenX1: number;
  screenY1: number;
  screenX2: number;
  screenY2: number;
  magnitude: number;
}

/**
 * Converts math coordinate (x, y) to SVG screen coordinates
 */
export function mathToScreen(
  x: number,
  y: number,
  bounds: { minX: number; maxX: number; minY: number; maxY: number },
  svgWidth: number = 380,
  svgHeight: number = 240
): Point {
  const normX = (x - bounds.minX) / (bounds.maxX - bounds.minX);
  const normY = (y - bounds.minY) / (bounds.maxY - bounds.minY);
  return {
    x: normX * svgWidth,
    y: svgHeight - normY * svgHeight, // Invert y for screen space
  };
}

/**
 * Converts SVG screen coordinates back to math (x, y)
 */
export function screenToMath(
  sx: number,
  sy: number,
  bounds: { minX: number; maxX: number; minY: number; maxY: number },
  svgWidth: number = 380,
  svgHeight: number = 240
): Point {
  const normX = sx / svgWidth;
  const normY = (svgHeight - sy) / svgHeight;
  return {
    x: bounds.minX + normX * (bounds.maxX - bounds.minX),
    y: bounds.minY + normY * (bounds.maxY - bounds.minY),
  };
}

/**
 * Computes slope segments across a 2D sampled grid
 */
export function generateSlopeSegments(
  fn: (x: number, y: number) => number,
  bounds: { minX: number; maxX: number; minY: number; maxY: number } = { minX: -3.5, maxX: 3.5, minY: -2.5, maxY: 2.5 },
  gridStepX: number = 0.5,
  gridStepY: number = 0.5,
  segmentLengthScreen: number = 14,
  svgWidth: number = 380,
  svgHeight: number = 240
): SlopeSegment[] {
  const segments: SlopeSegment[] = [];

  for (let x = bounds.minX; x <= bounds.maxX + 0.01; x += gridStepX) {
    for (let y = bounds.minY; y <= bounds.maxY + 0.01; y += gridStepY) {
      let slope = fn(x, y);
      if (isNaN(slope) || !isFinite(slope)) slope = 1000;

      const angleRad = Math.atan(slope);
      const centerScreen = mathToScreen(x, y, bounds, svgWidth, svgHeight);

      const dx = (segmentLengthScreen / 2) * Math.cos(angleRad);
      const dy = (segmentLengthScreen / 2) * Math.sin(angleRad);

      segments.push({
        x,
        y,
        slope,
        angleRad,
        screenX1: centerScreen.x - dx,
        screenY1: centerScreen.y + dy, // Note: SVG y is inverted
        screenX2: centerScreen.x + dx,
        screenY2: centerScreen.y - dy,
        magnitude: Math.min(Math.abs(slope), 10),
      });
    }
  }

  return segments;
}

/**
 * RK4 numerical integrator to trace forward and backward from initial condition (x0, y0)
 */
export function traceSolutionCurve(
  fn: (x: number, y: number) => number,
  x0: number,
  y0: number,
  bounds: { minX: number; maxX: number; minY: number; maxY: number } = { minX: -3.5, maxX: 3.5, minY: -2.5, maxY: 2.5 },
  h: number = 0.04
): Point[] {
  const forwardPts: Point[] = [];
  const backwardPts: Point[] = [];

  // Forward integration from x0 to bounds.maxX
  let currX = x0;
  let currY = y0;
  forwardPts.push({ x: currX, y: currY });

  while (currX <= bounds.maxX && Math.abs(currY) <= bounds.maxY * 2) {
    const k1 = fn(currX, currY);
    const k2 = fn(currX + h / 2, currY + (h / 2) * k1);
    const k3 = fn(currX + h / 2, currY + (h / 2) * k2);
    const k4 = fn(currX + h, currY + h * k3);

    const nextY = currY + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    currX += h;
    currY = nextY;

    if (isNaN(currY) || !isFinite(currY)) break;
    forwardPts.push({ x: currX, y: currY });
  }

  // Backward integration from x0 to bounds.minX
  currX = x0;
  currY = y0;
  const negH = -h;

  while (currX >= bounds.minX && Math.abs(currY) <= bounds.maxY * 2) {
    const k1 = fn(currX, currY);
    const k2 = fn(currX + negH / 2, currY + (negH / 2) * k1);
    const k3 = fn(currX + negH / 2, currY + (negH / 2) * k2);
    const k4 = fn(currX + negH, currY + negH * k3);

    const prevY = currY + (negH / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    currX += negH;
    currY = prevY;

    if (isNaN(currY) || !isFinite(currY)) break;
    backwardPts.unshift({ x: currX, y: currY });
  }

  return [...backwardPts, ...forwardPts];
}

/**
 * Computes Euler step approximation points from (x0, y0)
 */
export function computeEulerSteps(
  fn: (x: number, y: number) => number,
  x0: number,
  y0: number,
  numSteps: number = 4,
  stepSizeH: number = 0.5
): Point[] {
  const steps: Point[] = [{ x: x0, y: y0 }];
  let cx = x0;
  let cy = y0;

  for (let i = 0; i < numSteps; i++) {
    const slope = fn(cx, cy);
    cx = cx + stepSizeH;
    cy = cy + stepSizeH * slope;
    steps.push({ x: cx, y: cy });
  }

  return steps;
}
