export interface TriangularDot {
  id: string;
  row: number; // 1 to n
  col: number; // 1 to row or complementary
  x: number;
  y: number;
  isDuplicate: boolean;
  color: string;
}

export interface TriangularRowInfo {
  row: number;
  dotsInRow: number;
  cumulativeTn: number;
}

export interface TriangularEvaluation {
  n: number;
  tn: number; // n*(n+1)/2
  rectWidth: number; // n + 1
  rectHeight: number; // n
  rectDots: number; // n*(n+1)
  rows: TriangularRowInfo[];
  originalDots: TriangularDot[];
  duplicateDots: TriangularDot[];
}

export function computeTriangular(
  n: number,
  interlockProgress: number = 1.0,
  dotSpacing: number = 36,
  originX: number = 50,
  originY: number = 50
): TriangularEvaluation {
  const clampedN = Math.max(1, Math.min(8, Math.floor(n)));
  const tn = (clampedN * (clampedN + 1)) / 2;
  const rectWidth = clampedN + 1;
  const rectHeight = clampedN;
  const rectDots = clampedN * (clampedN + 1);

  const rows: TriangularRowInfo[] = [];
  let running = 0;
  for (let r = 1; r <= clampedN; r++) {
    running += r;
    rows.push({
      row: r,
      dotsInRow: r,
      cumulativeTn: running,
    });
  }

  const originalDots: TriangularDot[] = [];
  const duplicateDots: TriangularDot[] = [];

  // 1. Original triangle (vibrant cyan/blue dots): row r has r dots from col 1 to r
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
        color: '#0284c7', // Sky-600
      });
    }
  }

  // 2. Duplicate inverted triangle (amber/orange dots):
  // When interlocked (progress = 1): on row r, dots occupy col (r + 1) to (n + 1).
  // When separated (progress = 0): shifted right by (n + 2) * dotSpacing.
  const separationOffsetX = (clampedN + 2) * dotSpacing;
  const separationOffsetY = 0;

  for (let r = 1; r <= clampedN; r++) {
    const dotsInThisRow = clampedN + 1 - r;
    for (let i = 0; i < dotsInThisRow; i++) {
      const targetCol = r + 1 + i;
      const targetX = originX + (targetCol - 1) * dotSpacing;
      const targetY = originY + (r - 1) * dotSpacing;

      // Start position (when separated)
      const startX = originX + separationOffsetX + i * dotSpacing;
      const startY = originY + separationOffsetY + (r - 1) * dotSpacing;

      const currentX = startX + (targetX - startX) * interlockProgress;
      const currentY = startY + (targetY - startY) * interlockProgress;

      duplicateDots.push({
        id: `dup-${r}-${i}`,
        row: r,
        col: targetCol,
        x: currentX,
        y: currentY,
        isDuplicate: true,
        color: '#f59e0b', // Amber-500
      });
    }
  }

  return {
    n: clampedN,
    tn,
    rectWidth,
    rectHeight,
    rectDots,
    rows,
    originalDots,
    duplicateDots,
  };
}