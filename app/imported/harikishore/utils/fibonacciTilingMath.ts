import { FIBONACCI_COLORS } from '../data/fibonacciTilingData';

export interface FibonacciSquare {
  index: number; // 1 to n
  fibValue: number; // F_k
  x: number; // in logical grid coordinates
  y: number;
  size: number;
  color: string;
  adjacentFormula: string; // e.g., "1 + 1 = 2", "1 + 2 = 3"
}

export interface FibonacciTilingEvaluation {
  n: number;
  fibTerms: number[];
  currentFn: number;
  currentFnPlus1: number;
  rectWidth: number;
  rectHeight: number;
  totalRectArea: number; // F_n * F_{n+1}
  sumOfSquares: number;  // sum F_k^2
  squares: FibonacciSquare[];
  viewBox: { minX: number; minY: number; width: number; height: number };
}

export const FIB_NUMBERS = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];

export function computeFibonacciTiling(n: number): FibonacciTilingEvaluation {
  const clampedN = Math.max(1, Math.min(7, Math.floor(n)));
  const fibTerms = FIB_NUMBERS.slice(0, clampedN);

  const squares: FibonacciSquare[] = [];

  // Bounding box tracking in math grid units
  let minX = 0;
  let maxX = 1;
  let minY = 0;
  let maxY = 1;

  // 1. First square (size 1) at [0, 0]
  squares.push({
    index: 1,
    fibValue: 1,
    x: 0,
    y: 0,
    size: 1,
    color: FIBONACCI_COLORS[0],
    adjacentFormula: 'F₁ = 1',
  });

  if (clampedN >= 2) {
    // 2. Square 2 (size 1) placed to the left: [-1, 0] x [0, 1]
    squares.push({
      index: 2,
      fibValue: 1,
      x: -1,
      y: 0,
      size: 1,
      color: FIBONACCI_COLORS[1],
      adjacentFormula: 'F₂ = 1',
    });
    minX = -1;
  }

  // Successive directions: DOWN, RIGHT, UP, LEFT, DOWN, RIGHT...
  const directions: ('DOWN' | 'RIGHT' | 'UP' | 'LEFT')[] = [
    'DOWN',  // index 3 (size 2)
    'RIGHT', // index 4 (size 3)
    'UP',    // index 5 (size 5)
    'LEFT',  // index 6 (size 8)
    'DOWN',  // index 7 (size 13)
  ];

  for (let k = 3; k <= clampedN; k++) {
    const size = FIB_NUMBERS[k - 1];
    const dir = directions[(k - 3) % directions.length];
    let x = 0;
    let y = 0;

    if (dir === 'DOWN') {
      x = minX;
      y = minY - size;
      minY = y;
    } else if (dir === 'RIGHT') {
      x = maxX;
      y = minY;
      maxX = x + size;
    } else if (dir === 'UP') {
      x = minX;
      y = maxY;
      maxY = y + size;
    } else if (dir === 'LEFT') {
      x = minX - size;
      y = minY;
      minX = x;
    }

    const prev1 = FIB_NUMBERS[k - 2];
    const prev2 = FIB_NUMBERS[k - 3];

    squares.push({
      index: k,
      fibValue: size,
      x,
      y,
      size,
      color: FIBONACCI_COLORS[(k - 1) % FIBONACCI_COLORS.length],
      adjacentFormula: `F_${k} = F_${k-1} + F_${k-2} = ${prev1} + ${prev2} = ${size}`,
    });
  }

  const rectWidth = maxX - minX;
  const rectHeight = maxY - minY;
  const currentFn = FIB_NUMBERS[clampedN - 1];
  const currentFnPlus1 = FIB_NUMBERS[clampedN];
  const totalRectArea = rectWidth * rectHeight;
  const sumOfSquares = fibTerms.reduce((sum, f) => sum + f * f, 0);

  return {
    n: clampedN,
    fibTerms,
    currentFn,
    currentFnPlus1,
    rectWidth,
    rectHeight,
    totalRectArea,
    sumOfSquares,
    squares,
    viewBox: {
      minX,
      minY,
      width: rectWidth,
      height: rectHeight,
    },
  };
}