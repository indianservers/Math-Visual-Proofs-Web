/** Expand (a + b)(c + d) into four area tiles. */
export function expandDistributive(a: number, b: number, c: number, d: number) {
  return {
    ac: a * c,
    ad: a * d,
    bc: b * c,
    bd: b * d,
    total: (a + b) * (c + d),
    expanded: a * c + a * d + b * c + b * d,
  };
}
