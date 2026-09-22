export function factorial(n: number): number {
  let value = 1;
  for (let i = 2; i <= n; i++) value *= i;
  return value;
}

export function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let value = 1;
  for (let i = 1; i <= Math.min(k, n - k); i++) value = value * (n - i + 1) / i;
  return Math.round(value);
}

export function powerQuotientTerms(n: number, x: number, h: number): number[] {
  return Array.from({ length: n }, (_, index) => {
    const k = index + 1;
    return choose(n, k) * x ** (n - k) * h ** (k - 1);
  });
}

export type TaylorKind = "exp" | "sin" | "cos" | "log";

export const taylorDefinitions: Record<TaylorKind, { label: string; fn: (x: number) => number; derivative: (order: number, a: number) => number; domain: [number, number] }> = {
  exp: { label: "eˣ", fn: Math.exp, derivative: (_order, a) => Math.exp(a), domain: [-2.5, 2.5] },
  sin: { label: "sin x", fn: Math.sin, derivative: (order, a) => Math.sin(a + order * Math.PI / 2), domain: [-3.5, 3.5] },
  cos: { label: "cos x", fn: Math.cos, derivative: (order, a) => Math.cos(a + order * Math.PI / 2), domain: [-3.5, 3.5] },
  log: { label: "ln(1+x)", fn: Math.log1p, derivative: (order, a) => order === 0 ? Math.log1p(a) : (-1) ** (order - 1) * factorial(order - 1) / (1 + a) ** order, domain: [-0.95, 2.5] },
};

export function taylorCoefficients(kind: TaylorKind, a: number, order: number): number[] {
  return Array.from({ length: order + 1 }, (_, k) => taylorDefinitions[kind].derivative(k, a) / factorial(k));
}

export function evaluateTaylor(coefficients: number[], x: number, a: number): number {
  return coefficients.reduceRight((sum, coefficient) => sum * (x - a) + coefficient, 0);
}

export type MvtKind = "cubic" | "quadratic" | "sine";
export const mvtDefinitions: Record<MvtKind, { label: string; fn: (x: number) => number; derivative: (x: number) => number }> = {
  cubic: { label: "x³ − 3x", fn: (x) => x ** 3 - 3 * x, derivative: (x) => 3 * x ** 2 - 3 },
  quadratic: { label: "x²", fn: (x) => x ** 2, derivative: (x) => 2 * x },
  sine: { label: "sin x", fn: Math.sin, derivative: Math.cos },
};

export function meanValuePoints(kind: MvtKind, a: number, b: number): number[] {
  const { fn, derivative } = mvtDefinitions[kind];
  const slope = (fn(b) - fn(a)) / (b - a);
  const delta = (x: number) => derivative(x) - slope;
  const roots: number[] = [];
  const steps = 600;
  const add = (x: number) => { if (x > a + 1e-7 && x < b - 1e-7 && roots.every((root) => Math.abs(root - x) > 1e-4)) roots.push(x); };
  let previousX = a;
  let previousY = delta(a);
  for (let i = 1; i <= steps; i++) {
    const x = a + (b - a) * i / steps;
    const y = delta(x);
    if (Math.abs(y) < 1e-7) add(x);
    if (previousY * y < 0) {
      let lo = previousX, hi = x;
      for (let iteration = 0; iteration < 45; iteration++) {
        const mid = (lo + hi) / 2;
        if (delta(lo) * delta(mid) <= 0) hi = mid;
        else lo = mid;
      }
      add((lo + hi) / 2);
    }
    previousX = x;
    previousY = y;
  }
  // A repeated root only touches zero. Check local minima missed by sign changes.
  for (let i = 1; i < steps; i++) {
    const x = a + (b - a) * i / steps;
    if (Math.abs(delta(x)) < 1e-5 && roots.every((root) => Math.abs(root - x) > (b - a) / steps * 2)) add(x);
  }
  return roots.sort((x, y) => x - y);
}

export function geometricPartial(r: number, terms: number): number {
  return (1 - r ** terms) / (1 - r);
}

export function formatNumber(value: number, digits = 3): string {
  if (Math.abs(value) < 10 ** (-digits) / 2) return "0";
  return Number(value.toFixed(digits)).toString();
}
