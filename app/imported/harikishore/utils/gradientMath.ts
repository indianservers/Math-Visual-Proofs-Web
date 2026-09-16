import { Point } from './geometry';

export interface GradientEvaluation {
  x: number;
  y: number;
  z: number;
  dfdx: number;
  dfdy: number;
  magnitude: number;
  angleRad: number;
  angleDeg: number;
  directionalDerivative: number;
  tangentVector: { x: number; y: number };
}

export function evaluateGradientAt(
  fn: (x: number, y: number) => number,
  gradFn: (x: number, y: number) => { dfdx: number; dfdy: number },
  x: number,
  y: number,
  testAngleRad: number = 0
): GradientEvaluation {
  const z = fn(x, y);
  const { dfdx, dfdy } = gradFn(x, y);
  const magnitude = Math.sqrt(dfdx * dfdx + dfdy * dfdy);
  const angleRad = Math.atan2(dfdy, dfdx);
  const angleDeg = (angleRad * 180) / Math.PI;

  const ux = Math.cos(testAngleRad);
  const uy = Math.sin(testAngleRad);
  const directionalDerivative = dfdx * ux + dfdy * uy;

  // Tangent vector orthogonal to gradient: (-dfdy, dfdx)
  const normT = Math.max(0.001, magnitude);
  const tangentVector = {
    x: -dfdy / normT,
    y: dfdx / normT,
  };

  return {
    x,
    y,
    z,
    dfdx,
    dfdy,
    magnitude,
    angleRad,
    angleDeg,
    directionalDerivative,
    tangentVector,
  };
}

export function mathToSvg(
  x: number,
  y: number,
  bounds: { minX: number; maxX: number; minY: number; maxY: number } = { minX: -3, maxX: 3, minY: -3, maxY: 3 },
  svgWidth: number = 380,
  svgHeight: number = 240
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
  bounds: { minX: number; maxX: number; minY: number; maxY: number } = { minX: -3, maxX: 3, minY: -3, maxY: 3 },
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
