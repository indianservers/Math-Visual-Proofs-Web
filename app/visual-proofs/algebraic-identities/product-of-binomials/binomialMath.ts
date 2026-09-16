/** Expand (x + a)(x + b) into area tiles. */
export function expandBinomialProduct(x: number, a: number, b: number) {
  return {
    x2: x * x,
    ax: a * x,
    bx: b * x,
    ab: a * b,
    total: (x + a) * (x + b),
    expanded: x * x + a * x + b * x + a * b,
  };
}

export function isValidLengths(...values: number[]) {
  return values.every((value) => value > 0);
}
