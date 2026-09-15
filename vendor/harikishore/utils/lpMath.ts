import { Point } from './geometry';
import { LPPreset, LPVertex } from '../data/lpData';

export interface LPEvaluation {
  vertices: LPVertex[];
  optimumVertex: LPVertex;
  currentK: number;
  objectiveLinePoints: { p1: Point; p2: Point };
}

export function evaluateLPPreset(
  preset: LPPreset,
  currentK: number
): LPEvaluation {
  const evaluatedVertices: LPVertex[] = preset.vertices.map((v) => {
    const z = preset.c1 * v.x + preset.c2 * v.y;
    return {
      x: v.x,
      y: v.y,
      zValue: z,
      isOptimum: false,
      activeConstraints: v.activeConstraints,
    };
  });

  // Find optimum
  let optIdx = 0;
  if (preset.type === 'max') {
    let maxZ = -Infinity;
    evaluatedVertices.forEach((v, idx) => {
      if (v.zValue > maxZ) {
        maxZ = v.zValue;
        optIdx = idx;
      }
    });
  } else {
    let minZ = Infinity;
    evaluatedVertices.forEach((v, idx) => {
      if (v.zValue < minZ) {
        minZ = v.zValue;
        optIdx = idx;
      }
    });
  }

  evaluatedVertices[optIdx].isOptimum = true;

  // Compute objective line segment c1*x + c2*y = currentK for plotting in bounds [0, 6] x [0, 6]
  let p1: Point = { x: 0, y: 0 };
  let p2: Point = { x: 0, y: 0 };

  if (preset.c2 !== 0) {
    const yAt0 = currentK / preset.c2;
    const xAt0 = currentK / preset.c1;
    p1 = { x: 0, y: yAt0 };
    p2 = { x: xAt0, y: 0 };
  }

  return {
    vertices: evaluatedVertices,
    optimumVertex: evaluatedVertices[optIdx],
    currentK,
    objectiveLinePoints: { p1, p2 },
  };
}

export function mathToSvg(
  x: number,
  y: number,
  bounds: { minX: number; maxX: number; minY: number; maxY: number } = { minX: -0.5, maxX: 6.0, minY: -0.5, maxY: 5.5 },
  svgWidth: number = 420,
  svgHeight: number = 260
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
  bounds: { minX: number; maxX: number; minY: number; maxY: number } = { minX: -0.5, maxX: 6.0, minY: -0.5, maxY: 5.5 },
  svgWidth: number = 420,
  svgHeight: number = 260
): Point {
  const normX = sx / svgWidth;
  const normY = (svgHeight - sy) / svgHeight;
  return {
    x: bounds.minX + normX * (bounds.maxX - bounds.minX),
    y: bounds.minY + normY * (bounds.maxY - bounds.minY),
  };
}
