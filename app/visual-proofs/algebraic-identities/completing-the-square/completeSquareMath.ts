/** Complete the square for x^2 + b x. */
export function completeTheSquare(x: number, b: number) {
  const half = b / 2;
  const corner = half * half;
  return {
    x2: x * x,
    bx: b * x,
    half,
    corner,
    completed: (x + half) * (x + half),
    identity: x * x + b * x + corner === (x + half) * (x + half),
  };
}
