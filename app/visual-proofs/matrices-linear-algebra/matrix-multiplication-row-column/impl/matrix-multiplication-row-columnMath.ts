export interface PairwiseProductTerm {
  k: number; // 1, 2, 3
  aSymbol: string; // e.g. "a_{11}"
  bSymbol: string; // e.g. "b_{12}"
  productTex: string; // e.g. "a_{11} \times b_{12}"
}

export function computePairwiseProducts(row: number, col: number): PairwiseProductTerm[] {
  // row: 1..3, col: 1..3
  const terms: PairwiseProductTerm[] = [];
  for (let k = 1; k <= 3; k++) {
    terms.push({
      k,
      aSymbol: `a_{${row}${k}}`,
      bSymbol: `b_{${k}${col}}`,
      productTex: `a_{${row}${k}} \\times b_{${k}${col}}`,
    });
  }
  return terms;
}

export function formatDotProductTex(row: number, col: number): string {
  return `a_{${row}1} \\times b_{1${col}} + a_{${row}2} \\times b_{2${col}} + a_{${row}3} \\times b_{3${col}}`;
}

export function formatTargetEntryTex(row: number, col: number): string {
  return `(AB)_{${row}${col}}`;
}

export function checkMultiplicationDimensions(
  colsA: number,
  rowsB: number,
): { isCompatible: boolean; message: string } {
  const isCompatible = colsA === rowsB;
  return {
    isCompatible,
    message: isCompatible
      ? `Inner dimensions match: Columns of A (${colsA}) = Rows of B (${rowsB}). Matrix multiplication is defined.`
      : `Inner dimensions mismatch: Columns of A (${colsA}) ≠ Rows of B (${rowsB}). Matrix multiplication is undefined.`,
  };
}

export function checkDotProductInvariant(
  selectedRow: number,
  selectedCol: number,
  targetRow: number,
  targetCol: number,
): { isValid: boolean; message: string } {
  const isValid = selectedRow === targetRow && selectedCol === targetCol;
  return {
    isValid,
    message: isValid
      ? `Invariant verified: Entry (AB)_{${targetRow}${targetCol}} is created strictly by Row ${selectedRow} of A and Column ${selectedCol} of B.`
      : `Mismatch: Selected Row ${selectedRow} and Column ${selectedCol} creates (AB)_{${selectedRow}${selectedCol}}, not (AB)_{${targetRow}${targetCol}}.`,
  };
}
