export interface TrapezoidPreset {
  id: string;
  name: string;
  latexFn: string;
  latexIntegral: string;
  description: string;
  a: number;
  b: number;
  fn: (x: number) => number;
  exactIntegral: number;
  defaultN: number;
}

export const TRAPEZOID_PRESETS: TrapezoidPreset[] = [
  {
    id: 'parabola',
    name: 'Parabola f(x) = x²',
    latexFn: 'f(x) = x^2',
    latexIntegral: '\\int_0^3 x^2 \\, dx = \\left[ \\frac{x^3}{3} \\right]_0^3 = 9.000',
    description: 'Convex curve (f" > 0). Trapezoids connect secant lines that lie strictly above the curve, producing a slight overestimate.',
    a: 0,
    b: 3,
    fn: (x) => x * x,
    exactIntegral: 9.0,
    defaultN: 4,
  },
  {
    id: 'sine',
    name: 'Sine Wave f(x) = sin(x)',
    latexFn: 'f(x) = \\sin(x)',
    latexIntegral: '\\int_0^\\pi \\sin(x) \\, dx = [-\\cos(x)]_0^\\pi = 2.000',
    description: 'Concave curve (f" < 0). Trapezoid secant lines lie strictly below the peak, producing a slight underestimate.',
    a: 0,
    b: Math.PI,
    fn: (x) => Math.sin(x),
    exactIntegral: 2.0,
    defaultN: 6,
  },
  {
    id: 'exponential',
    name: 'Exponential f(x) = e^x',
    latexFn: 'f(x) = e^x',
    latexIntegral: '\\int_0^2 e^x \\, dx = [e^x]_0^2 = e^2 - 1 \\approx 6.389',
    description: 'Rapidly growing convex function. Demonstrates fast O(h²) error reduction as subinterval count n increases.',
    a: 0,
    b: 2,
    fn: (x) => Math.exp(x),
    exactIntegral: Math.exp(2) - 1,
    defaultN: 4,
  },
  {
    id: 'inverted_parabola',
    name: 'Arch f(x) = 4 - x²',
    latexFn: 'f(x) = 4 - x^2',
    latexIntegral: '\\int_0^2 (4 - x^2) \\, dx = \\left[ 4x - \\frac{x^3}{3} \\right]_0^2 = \\frac{16}{3} \\approx 5.333',
    description: 'Classic parabolic arch. Area under the arch is split into vertical trapezoid strips.',
    a: 0,
    b: 2,
    fn: (x) => 4 - x * x,
    exactIntegral: 16 / 3,
    defaultN: 4,
  },
  {
    id: 'rational',
    name: 'Witch of Agnesi f(x) = 4/(1 + x²)',
    latexFn: 'f(x) = \\frac{4}{1 + x^2}',
    latexIntegral: '\\int_0^1 \\frac{4}{1 + x^2} \\, dx = [4\\arctan(x)]_0^1 = \\pi \\approx 3.1416',
    description: 'Numerical approximation of π using the trapezoidal rule on the derivative of arctan(x).',
    a: 0,
    b: 1,
    fn: (x) => 4 / (1 + x * x),
    exactIntegral: Math.PI,
    defaultN: 5,
  },
];
