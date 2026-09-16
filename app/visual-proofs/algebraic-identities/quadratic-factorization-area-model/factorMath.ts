/** Factor x^2 + p x + q as (x + m)(x + n) when p = m+n and q = mn. */
export function factorQuadratic(m: number, n: number) {
  return {
    m,
    n,
    p: m + n,
    q: m * n,
    expanded: (x: number) => x * x + (m + n) * x + m * n,
  };
}

export function matchesFactorPair(p: number, q: number, m: number, n: number) {
  return m + n === p && m * n === q;
}
