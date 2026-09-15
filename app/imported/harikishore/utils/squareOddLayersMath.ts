import { ODD_LAYER_PALETTE } from '../data/squareOddLayersData';

export interface OddLayerTile {
  id: string;
  row: number; // 0 to n-1
  col: number; // 0 to n-1
  x: number;
  y: number;
  size: number;
  layer: number; // 1 to n
  color: string;
  isCorner: boolean;
}

export interface OddLayerDetails {
  layer: number;
  oddValue: number; // 2k - 1
  prevArea: number; // (k-1)^2
  newArea: number;  // k^2
  difference: number; // 2k - 1
  armLength: number; // k - 1
  color: string;
}

export interface SquareOddLayersEvaluation {
  n: number;
  totalArea: number; // n^2
  prevSquareArea: number; // (n-1)^2
  latestLayerTilesCount: number; // 2n - 1
  layers: OddLayerDetails[];
  tiles: OddLayerTile[];
}

export function computeSquareOddLayers(
  n: number,
  tileSize: number = 44,
  originX: number = 40,
  originY: number = 40
): SquareOddLayersEvaluation {
  const clampedN = Math.max(1, Math.min(8, Math.floor(n)));
  const totalArea = clampedN * clampedN;
  const prevSquareArea = (clampedN - 1) * (clampedN - 1);
  const latestLayerTilesCount = 2 * clampedN - 1;

  const layers: OddLayerDetails[] = [];
  const tiles: OddLayerTile[] = [];

  for (let k = 1; k <= clampedN; k++) {
    const oddValue = 2 * k - 1;
    const color = ODD_LAYER_PALETTE[(k - 1) % ODD_LAYER_PALETTE.length];

    layers.push({
      layer: k,
      oddValue,
      prevArea: (k - 1) * (k - 1),
      newArea: k * k,
      difference: oddValue,
      armLength: k - 1,
      color,
    });

    const layerIdx = k - 1;

    // Corner tile at (layerIdx, layerIdx)
    tiles.push({
      id: `tile-${layerIdx}-${layerIdx}`,
      row: layerIdx,
      col: layerIdx,
      x: originX + layerIdx * tileSize,
      y: originY + layerIdx * tileSize,
      size: tileSize,
      layer: k,
      color,
      isCorner: true,
    });

    // Horizontal arm: cells (r = layerIdx, c = 0 to layerIdx - 1)
    for (let c = 0; c < layerIdx; c++) {
      tiles.push({
        id: `tile-${layerIdx}-${c}`,
        row: layerIdx,
        col: c,
        x: originX + c * tileSize,
        y: originY + layerIdx * tileSize,
        size: tileSize,
        layer: k,
        color,
        isCorner: false,
      });
    }

    // Vertical arm: cells (r = 0 to layerIdx - 1, c = layerIdx)
    for (let r = 0; r < layerIdx; r++) {
      tiles.push({
        id: `tile-${r}-${layerIdx}`,
        row: r,
        col: layerIdx,
        x: originX + layerIdx * tileSize,
        y: originY + r * tileSize,
        size: tileSize,
        layer: k,
        color,
        isCorner: false,
      });
    }
  }

  return {
    n: clampedN,
    totalArea,
    prevSquareArea,
    latestLayerTilesCount,
    layers,
    tiles,
  };
}