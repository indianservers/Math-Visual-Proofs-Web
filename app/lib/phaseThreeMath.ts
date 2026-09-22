export type Vec2 = { x: number; y: number };
export const length = (v: Vec2) => Math.hypot(v.x, v.y);
export const dot = (u: Vec2, v: Vec2) => u.x * v.x + u.y * v.y;
export const distance = (u: Vec2, v: Vec2) => Math.hypot(u.x - v.x, u.y - v.y);

export function triangleMeasurements(a: Vec2, b: Vec2, c: Vec2, radius: number) {
  const angle = (p: Vec2, q: Vec2, r: Vec2) => {
    const u = { x: p.x - q.x, y: p.y - q.y }, v = { x: r.x - q.x, y: r.y - q.y };
    return Math.acos(Math.max(-1, Math.min(1, dot(u, v) / (length(u) * length(v)))));
  };
  const angles = [angle(b, a, c), angle(a, b, c), angle(a, c, b)];
  const sides = [distance(b, c), distance(c, a), distance(a, b)];
  return { angles, sides, ratios: sides.map((side, i) => side / Math.sin(angles[i])), diameter: 2 * radius };
}

export function vectorMetrics(u: Vec2, v: Vec2) {
  const uLength = length(u), vLength = length(v), product = dot(u, v), bound = uLength * vLength;
  const cosine = bound ? Math.max(-1, Math.min(1, product / bound)) : null;
  const angle = cosine === null ? null : Math.acos(cosine);
  const projection = vLength ? { x: product / (vLength ** 2) * v.x, y: product / (vLength ** 2) * v.y } : null;
  return { uLength, vLength, product, bound, cosine, angle, projection, equality: bound === 0 || Math.abs(Math.abs(product) - bound) <= 1e-8 * bound };
}

export function bayesCells(prior: number, sensitivity: number, falsePositive: number) {
  const ab = prior * sensitivity, aNotB = prior * (1 - sensitivity);
  const notAB = (1 - prior) * falsePositive, notANotB = (1 - prior) * (1 - falsePositive);
  const evidence = ab + notAB;
  return { ab, aNotB, notAB, notANotB, evidence, posterior: evidence === 0 ? null : ab / evidence };
}

export type DistributionKind = "normal" | "uniform" | "exponential" | "bernoulli" | "bimodal";
export const distributions: Record<DistributionKind, { label: string; mean: number; sd: number; draw: (rng: () => number) => number; density: (x: number) => number }> = {
  normal: { label: "Normal N(0,1)", mean: 0, sd: 1, draw: normalRandom, density: (x) => normalDensity(x, 0, 1) },
  uniform: { label: "Uniform [0,1]", mean: .5, sd: Math.sqrt(1 / 12), draw: (rng) => rng(), density: (x) => x >= 0 && x <= 1 ? 1 : 0 },
  exponential: { label: "Exponential (mean 1)", mean: 1, sd: 1, draw: (rng) => -Math.log(Math.max(1e-12, 1 - rng())), density: (x) => x >= 0 ? Math.exp(-x) : 0 },
  bernoulli: { label: "Bernoulli (p=0.3)", mean: .3, sd: Math.sqrt(.21), draw: (rng) => rng() < .3 ? 1 : 0, density: () => 0 },
  bimodal: { label: "Bimodal mixture", mean: 0, sd: Math.sqrt(4.25), draw: (rng) => (rng() < .5 ? -2 : 2) + .5 * normalRandom(rng), density: (x) => .5 * normalDensity(x, -2, .5) + .5 * normalDensity(x, 2, .5) },
};

export function normalRandom(rng: () => number): number {
  return Math.sqrt(-2 * Math.log(Math.max(1e-12, rng()))) * Math.cos(2 * Math.PI * rng());
}

export function normalDensity(x: number, mean: number, sd: number): number {
  const z = (x - mean) / sd;
  return Math.exp(-z * z / 2) / (sd * Math.sqrt(2 * Math.PI));
}

export function drawSample(kind: DistributionKind, n: number, rng: () => number = Math.random) {
  return Array.from({ length: n }, () => distributions[kind].draw(rng));
}

export function compoundAmount(principal: number, rate: number, n: number, time: number) {
  return principal * (1 + rate / n) ** (n * time);
}

export function stepCompoundAmount(principal: number, rate: number, n: number, time: number) {
  return principal * (1 + rate / n) ** Math.floor(n * time + 1e-9);
}
