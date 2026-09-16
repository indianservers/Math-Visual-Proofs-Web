/** Orthographic projections from a height grid of cube stacks. */

export type HeightGrid = number[][];

export function emptyGrid(size: number): HeightGrid {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
}

export function cloneGrid(grid: HeightGrid): HeightGrid {
  return grid.map((row) => [...row]);
}

/** Top view: occupied cells (height > 0). */
export function topView(grid: HeightGrid): boolean[][] {
  return grid.map((row) => row.map((h) => h > 0));
}

/** Front view: max height in each column (looking from +y). */
export function frontView(grid: HeightGrid): number[] {
  const cols = grid[0]?.length ?? 0;
  const heights = Array.from({ length: cols }, () => 0);
  for (const row of grid) {
    for (let c = 0; c < cols; c += 1) {
      heights[c] = Math.max(heights[c]!, row[c] ?? 0);
    }
  }
  return heights;
}

/** Right/side view: max height in each row (looking from +x). */
export function sideView(grid: HeightGrid): number[] {
  return grid.map((row) => Math.max(0, ...row));
}

export function cubeCount(grid: HeightGrid): number {
  return grid.reduce(
    (sum, row) => sum + row.reduce((rowSum, h) => rowSum + h, 0),
    0,
  );
}

export function bumpCell(
  grid: HeightGrid,
  row: number,
  col: number,
  maxHeight: number,
): HeightGrid {
  const next = cloneGrid(grid);
  const current = next[row]?.[col] ?? 0;
  if (!next[row]) return grid;
  next[row][col] = current >= maxHeight ? 0 : current + 1;
  return next;
}

export function projectionsMatch(
  a: HeightGrid,
  b: HeightGrid,
): { top: boolean; front: boolean; side: boolean } {
  const topA = topView(a);
  const topB = topView(b);
  const top =
    topA.length === topB.length &&
    topA.every((row, r) => row.every((cell, c) => cell === topB[r]?.[c]));
  const frontA = frontView(a);
  const frontB = frontView(b);
  const front =
    frontA.length === frontB.length &&
    frontA.every((h, i) => h === frontB[i]);
  const sideA = sideView(a);
  const sideB = sideView(b);
  const side =
    sideA.length === sideB.length && sideA.every((h, i) => h === sideB[i]);
  return { top, front, side };
}
