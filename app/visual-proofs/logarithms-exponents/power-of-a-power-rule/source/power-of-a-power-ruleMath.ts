// ─── Power of a Power Rule — Math Pure Helpers ─────────────────────────────────

export function computePowerOfPower(base: number, m: number, n: number) {
  const am = Math.pow(base, m);
  const totalExponent = m * n;
  const result = Math.pow(base, totalExponent);
  return { am, totalExponent, result };
}

export interface GridTile {
  row: number;
  col: number;
  label: string;
}

export function generateGridTiles(base: number, m: number, n: number): GridTile[] {
  const tiles: GridTile[] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < m; c++) {
      tiles.push({ row: r, col: c, label: String(base) });
    }
  }
  return tiles;
}
