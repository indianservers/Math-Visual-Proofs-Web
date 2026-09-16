/** Expand (a + b + c)^2 into nine regions with paired cross terms. */
export function expandThreeTermSquare(a: number, b: number, c: number) {
  const squares = a * a + b * b + c * c;
  const cross = 2 * a * b + 2 * b * c + 2 * c * a;
  return {
    a2: a * a,
    b2: b * b,
    c2: c * c,
    ab: a * b,
    bc: b * c,
    ca: c * a,
    squares,
    cross,
    total: (a + b + c) * (a + b + c),
    expanded: squares + cross,
  };
}
