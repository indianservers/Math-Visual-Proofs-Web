export interface APBarColumn {
  index: number; // 1-indexed
  originalVal: number; // a_k
  invertedVal: number; // a_{n - k + 1}
  pairSum: number; // a + l
}

export interface APSumEvaluation {
  a: number;
  d: number;
  n: number;
  lastTermL: number;
  pairSumConst: number; // a + l
  totalSumSn: number; // (n / 2) * (a + l)
  rectangleArea: number; // n * (a + l)
  columns: APBarColumn[];
}

export function computeAPSum(a: number, d: number, n: number): APSumEvaluation {
  const clampedN = Math.max(1, Math.min(8, Math.floor(n)));
  const lastTermL = a + (clampedN - 1) * d;
  const pairSumConst = a + lastTermL;
  const totalSumSn = (clampedN * pairSumConst) / 2;
  const rectangleArea = clampedN * pairSumConst;

  const columns: APBarColumn[] = [];
  for (let k = 1; k <= clampedN; k++) {
    const originalVal = a + (k - 1) * d;
    const invertedVal = a + (clampedN - k) * d;
    columns.push({
      index: k,
      originalVal,
      invertedVal,
      pairSum: originalVal + invertedVal, // always equals pairSumConst!
    });
  }

  return {
    a,
    d,
    n: clampedN,
    lastTermL,
    pairSumConst,
    totalSumSn,
    rectangleArea,
    columns,
  };
}
