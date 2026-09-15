import { Point } from './geometry';
import { DivCurlPreset } from '../data/divCurlData';

export interface VectorArrow {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
}

export interface ProbeEvaluation {
  x: number;
  y: number;
  radius: number;
  divergence: number;
  curlZ: number;
  boundaryFlux: number;
  boundaryCirculation: number;
  boundaryPoints: { x: number; y: number; nx: number; ny: number; tx: number; ty: number; fx: number; fy: number }[];
}

export function generateVectorGrid(
  preset: DivCurlPreset,
  bounds: { minX: number; maxX: number; minY: number; maxY: number } = { minX: -2.5, maxX: 2.5, minY: -2.0, maxY: 2.0 },
  step: number = 0.5
): VectorArrow[] {
  const arrows: VectorArrow[] = [];
  for (let x = bounds.minX; x <= bounds.maxX + 1e-4; x += step) {
    for (let y = bounds.minY; y <= bounds.maxY + 1e-4; y += step) {
      const { P, Q } = preset.F(x, y);
      const len = Math.sqrt(P * P + Q * Q);
      arrows.push({ x, y, vx: P, vy: Q, length: len });
    }
  }
  return arrows;
}

export function evaluateProbe(
  preset: DivCurlPreset,
  cx: number,
  cy: number,
  radius: number = 0.6,
  samples: number = 16
): ProbeEvaluation {
  const divVal = preset.div(cx, cy);
  const curlVal = preset.curl(cx, cy);

  let fluxSum = 0;
  let circSum = 0;
  const boundaryPoints = [];

  const dTheta = (2 * Math.PI) / samples;
  const ds = radius * dTheta;

  for (let i = 0; i < samples; i++) {
    const theta = i * dTheta;
    const px = cx + radius * Math.cos(theta);
    const py = cy + radius * Math.sin(theta);

    // Normal vector pointing outward: (cos θ, sin θ)
    const nx = Math.cos(theta);
    const ny = Math.sin(theta);

    // Tangent vector counterclockwise: (-sin θ, cos θ)
    const tx = -Math.sin(theta);
    const ty = Math.cos(theta);

    const { P, Q } = preset.F(px, py);

    // Flux contribution = (F · n) ds
    const fluxContr = (P * nx + Q * ny) * ds;
    fluxSum += fluxContr;

    // Circulation contribution = (F · T) ds
    const circContr = (P * tx + Q * ty) * ds;
    circSum += circContr;

    boundaryPoints.push({ x: px, y: py, nx, ny, tx, ty, fx: P, fy: Q });
  }

  return {
    x: cx,
    y: cy,
    radius,
    divergence: divVal,
    curlZ: curlVal,
    boundaryFlux: fluxSum,
    boundaryCirculation: circSum,
    boundaryPoints,
  };
}

export function mathToSvg(
  x: number,
  y: number,
  bounds: { minX: number; maxX: number; minY: number; maxY: number } = { minX: -2.8, maxX: 2.8, minY: -2.2, maxY: 2.2 },
  svgWidth: number = 420,
  svgHeight: number = 250
): Point {
  const normX = (x - bounds.minX) / (bounds.maxX - bounds.minX);
  const normY = (y - bounds.minY) / (bounds.maxY - bounds.minY);
  return {
    x: normX * svgWidth,
    y: svgHeight - normY * svgHeight,
  };
}

export function svgToMath(
  sx: number,
  sy: number,
  bounds: { minX: number; maxX: number; minY: number; maxY: number } = { minX: -2.8, maxX: 2.8, minY: -2.2, maxY: 2.2 },
  svgWidth: number = 420,
  svgHeight: number = 250
): Point {
  const normX = sx / svgWidth;
  const normY = (svgHeight - sy) / svgHeight;
  return {
    x: bounds.minX + normX * (bounds.maxX - bounds.minX),
    y: bounds.minY + normY * (bounds.maxY - bounds.minY),
  };
}
