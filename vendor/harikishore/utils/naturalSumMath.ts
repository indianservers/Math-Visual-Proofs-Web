export interface DotPoint {
  id: string;
  row: number; // 1-indexed
  col: number; // 1-indexed
  x: number;   // calculated SVG coordinate
  y: number;
  isDuplicate: boolean;
  color: string;
}

export interface NaturalSumEvaluation {
  n: number;
  triangleSum: number;
  rectangleWidth: number;
  rectangleHeight: number;
  rectangleTotalDots: number;
  originalDots: DotPoint[];
  duplicateDots: DotPoint[];
}

export function computeNaturalSum(
  n: number,
  interlockProgress: number = 1.0, // 0 = separated, 1 = perfectly interlocked
  dotSpacing: number = 24,
  originX: number = 40,
  originY: number = 30
): NaturalSumEvaluation {
  const clampedN = Math.max(1, Math.min(10, Math.floor(n)));
  const triangleSum = (clampedN * (clampedN + 1)) / 2;
  const rectangleWidth = clampedN + 1;
  const rectangleHeight = clampedN;
  const rectangleTotalDots = clampedN * (clampedN + 1);

  const originalDots: DotPoint[] = [];
  const duplicateDots: DotPoint[] = [];

  // 1. Original staircase dots (blue)
  // Row r (from 1 to n) has r dots at columns 1 to r
  for (let r = 1; r <= clampedN; r++) {
    for (let c = 1; c <= r; c++) {
      const x = originX + (c - 1) * dotSpacing;
      const y = originY + (r - 1) * dotSpacing;
      originalDots.push({
        id: `orig-${r}-${c}`,
        row: r,
        col: c,
        x,
        y,
        isDuplicate: false,
        color: '#3b82f6', // vibrant blue
      });
    }
  }

  // 2. Duplicate staircase dots (orange/amber)
  // When interlocked (progress = 1), on row r, the duplicate dots occupy columns (r + 1) to (n + 1).
  // There are (n + 1 - r) dots on row r.
  // When separated (progress = 0), they sit to the right shifted by offset.
  const separationOffsetX = (clampedN + 3) * dotSpacing;
  const separationOffsetY = 0;

  for (let r = 1; r <= clampedN; r++) {
    const numDotsInRow = clampedN + 1 - r;
    for (let k = 1; k <= numDotsInRow; k++) {
      // Interlocked target coordinate
      const targetCol = r + k;
      const interlockedX = originX + (targetCol - 1) * dotSpacing;
      const interlockedY = originY + (r - 1) * dotSpacing;

      // Separated position (rotated staircase standing on its own)
      const sepCol = k;
      const sepRow = clampedN + 1 - r;
      const separatedX = originX + separationOffsetX + (sepCol - 1) * dotSpacing;
      const separatedY = originY + separationOffsetY + (sepRow - 1) * dotSpacing;

      // Interpolate with smooth easing
      const t = Math.max(0, Math.min(1, interlockProgress));
      const currentX = separatedX + (interlockedX - separatedX) * t;
      const currentY = separatedY + (interlockedY - separatedY) * t;

      duplicateDots.push({
        id: `dup-${r}-${k}`,
        row: r,
        col: targetCol,
        x: currentX,
        y: currentY,
        isDuplicate: true,
        color: '#f59e0b', // vibrant amber
      });
    }
  }

  return {
    n: clampedN,
    triangleSum,
    rectangleWidth,
    rectangleHeight,
    rectangleTotalDots,
    originalDots,
    duplicateDots,
  };
}
