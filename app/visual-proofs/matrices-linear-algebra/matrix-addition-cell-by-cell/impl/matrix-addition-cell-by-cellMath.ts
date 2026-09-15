import { MatrixData } from "./matrix-addition-cell-by-cellConfig";

export function checkDimensionsEqual(A: MatrixData, B: MatrixData): boolean {
  return A.rows === B.rows && A.cols === B.cols;
}

export function addMatrices(A: MatrixData, B: MatrixData): MatrixData | null {
  if (!checkDimensionsEqual(A, B)) {
    return null;
  }

  const resultData: number[][] = [];
  for (let r = 0; r < A.rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < A.cols; c++) {
      row.push(A.data[r][c] + B.data[r][c]);
    }
    resultData.push(row);
  }

  return {
    rows: A.rows,
    cols: A.cols,
    data: resultData,
  };
}

export function formatCellSumString(a: number, b: number): string {
  const bStr = b < 0 ? `(${b})` : `${b}`;
  const sum = a + b;
  return `${a} + ${bStr} = ${sum}`;
}

export function formatCellSumExpression(a: number, b: number): string {
  if (b < 0) {
    return `${a}+(${b})`;
  }
  return `${a}+${b}`;
}

export function formatMatrixLatex(M: MatrixData): string {
  const rowsTex = M.data
    .map((row) => row.join(" & "))
    .join(" \\\\ ");
  return `\\begin{pmatrix} ${rowsTex} \\end{pmatrix}`;
}

export function checkMatrixAdditionInvariant(
  A: MatrixData,
  B: MatrixData,
  row: number,
  col: number,
  userVal: number,
): { isCorrect: boolean; expected: number; message: string } {
  const aVal = A.data[row][col];
  const bVal = B.data[row][col];
  const expected = aVal + bVal;
  const isCorrect = userVal === expected;

  return {
    isCorrect,
    expected,
    message: isCorrect
      ? `Correct: A(${row + 1}, ${col + 1}) + B(${row + 1}, ${col + 1}) = ${aVal} + ${bVal} = ${expected}.`
      : `Mismatch: Expected ${expected} (${aVal} + ${bVal}), received ${userVal}.`,
  };
}
