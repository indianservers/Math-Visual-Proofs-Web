/** Pure math for (a - b)^2 area model. */

export function expandSquareOfDifference(a: number, b: number) {
  const a2 = a * a;
  const ab = a * b;
  const b2 = b * b;
  const leftover = a2 - 2 * ab + b2;
  return {
    a2,
    twoAb: 2 * ab,
    b2,
    leftover,
    identity: leftover === (a - b) * (a - b),
  };
}

export function isValidPair(a: number, b: number): boolean {
  return a > 0 && b > 0 && b < a;
}
