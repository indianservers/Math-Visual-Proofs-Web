export type CuboidDimensions = {
  length: number;
  width: number;
  height: number;
};

export function wholeDimension(value: number) {
  return Math.max(1, Math.min(10, Math.round(value)));
}

export function cuboidMeasures({ length, width, height }: CuboidDimensions) {
  const baseArea = length * width;
  return { baseArea, layers: height, volume: baseArea * height };
}

export function cubeDimensions(side: number): CuboidDimensions {
  return { length: side, width: side, height: side };
}

export function visibleCubesAtProgress(progress: number, dimensions: CuboidDimensions) {
  const { length, width, height } = dimensions;
  const baseArea = length * width;
  const total = baseArea * height;
  const p = Math.max(0, Math.min(1, progress));
  if (p < 0.08) return 0;
  if (p < 0.24) return Math.min(length, Math.ceil(((p - 0.08) / 0.16) * length));
  if (p < 0.46) return Math.min(baseArea, length + Math.ceil(((p - 0.24) / 0.22) * (baseArea - length)));
  if (p < 0.82) return Math.min(total, baseArea + Math.ceil(((p - 0.46) / 0.36) * (total - baseArea)));
  return total;
}

export function animationStep(progress: number) {
  if (progress < 0.08) return 0;
  if (progress < 0.24) return 1;
  if (progress < 0.46) return 2;
  if (progress < 0.82) return 3;
  return 4;
}
