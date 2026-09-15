import { LAYER_COLORS } from '../data/oddSumData';

export interface OddBlock {
  id: string;
  row: number; // 0 to n-1
  col: number; // 0 to n-1
  layer: number; // 1-indexed
  color: string;
  isCorner: boolean;
}

export interface OddLayerInfo {
  layer: number;
  oddValue: number; // 2k - 1
  partialSum: number; // k^2
  color: string;
  blockCount: number;
}

export interface OddSumEvaluation {
  n: number;
  totalSum: number; // n^2
  layers: OddLayerInfo[];
  blocks: OddBlock[];
}

export function computeOddSum(n: number): OddSumEvaluation {
  const clampedN = Math.max(1, Math.min(8, Math.floor(n)));
  const totalSum = clampedN * clampedN;

  const layers: OddLayerInfo[] = [];
  const blocks: OddBlock[] = [];

  let runningSum = 0;
  for (let k = 1; k <= clampedN; k++) {
    const oddValue = 2 * k - 1;
    runningSum += oddValue;
    const color = LAYER_COLORS[(k - 1) % LAYER_COLORS.length];

    layers.push({
      layer: k,
      oddValue,
      partialSum: runningSum,
      color,
      blockCount: oddValue,
    });

    // Generate blocks for Layer k (0-indexed indices from 0 to k-1)
    const edge = k - 1;

    // Corner block at (edge, edge)
    blocks.push({
      id: `block-${k}-corner`,
      row: edge,
      col: edge,
      layer: k,
      color,
      isCorner: true,
    });

    // Horizontal arm along row 'edge', cols from 0 to edge - 1
    for (let c = 0; c < edge; c++) {
      blocks.push({
        id: `block-${k}-row-${c}`,
        row: edge,
        col: c,
        layer: k,
        color,
        isCorner: false,
      });
    }

    // Vertical arm along col 'edge', rows from 0 to edge - 1
    for (let r = 0; r < edge; r++) {
      blocks.push({
        id: `block-${k}-col-${r}`,
        row: r,
        col: edge,
        layer: k,
        color,
        isCorner: false,
      });
    }
  }

  return {
    n: clampedN,
    totalSum,
    layers,
    blocks,
  };
}
