export interface ODEPreset {
  id: string;
  name: string;
  latexODE: string;
  latexSolution: string;
  fn: (x: number, y: number) => number;
  exactSolution?: (x: number, x0: number, y0: number) => number;
  description: string;
  equilibriumPoints?: string;
  domainX: [number, number];
  domainY: [number, number];
  isCustom?: boolean;
}

export const ODE_PRESETS: ODEPreset[] = [
  {
    id: 'x_minus_y',
    name: 'Linear Inhomogeneous',
    latexODE: '\\frac{dy}{dx} = x - y',
    latexSolution: 'y(x) = x - 1 + (y_0 - x_0 + 1)e^{-(x - x_0)}',
    fn: (x, y) => x - y,
    exactSolution: (x, x0, y0) => x - 1 + (y0 - x0 + 1) * Math.exp(-(x - x0)),
    description: 'Classic first-order linear ODE. As x → ∞, all solution curves converge asymptotically to the line y = x - 1.',
    equilibriumPoints: 'Asymptotic to y = x - 1',
    domainX: [-3.5, 3.5],
    domainY: [-2.5, 2.5],
  },
  {
    id: 'circle_neg_x_over_y',
    name: 'Concentric Circles',
    latexODE: '\\frac{dy}{dx} = -\\frac{x}{y}',
    latexSolution: 'x^2 + y^2 = x_0^2 + y_0^2 = R^2',
    fn: (x, y) => (Math.abs(y) < 0.05 ? (x > 0 ? -100 : 100) : -x / y),
    exactSolution: (x, x0, y0) => {
      const r2 = x0 * x0 + y0 * y0;
      const rem = r2 - x * x;
      if (rem < 0) return 0;
      return y0 >= 0 ? Math.sqrt(rem) : -Math.sqrt(rem);
    },
    description: 'Separable ODE yielding concentric circles centered at origin. Tangent vectors are perpendicular to the radius vector.',
    equilibriumPoints: 'Center at (0, 0)',
    domainX: [-3.5, 3.5],
    domainY: [-2.5, 2.5],
  },
  {
    id: 'exponential_y',
    name: 'Exponential Growth',
    latexODE: '\\frac{dy}{dx} = y',
    latexSolution: 'y(x) = y_0 e^{x - x_0}',
    fn: (x, y) => y,
    exactSolution: (x, x0, y0) => y0 * Math.exp(x - x0),
    description: 'Rate of change is directly proportional to current value. Yields exponential growth (y > 0) or decay (y < 0).',
    equilibriumPoints: 'Unstable equilibrium at y = 0',
    domainX: [-3.5, 3.5],
    domainY: [-2.5, 2.5],
  },
  {
    id: 'harmonic_sin_x',
    name: 'Trigonometric Integral',
    latexODE: '\\frac{dy}{dx} = \\sin(x)',
    latexSolution: 'y(x) = -\\cos(x) + (y_0 + \\cos(x_0))',
    fn: (x, _y) => Math.sin(x),
    exactSolution: (x, x0, y0) => -Math.cos(x) + (y0 + Math.cos(x0)),
    description: 'Purely x-dependent slope field creating parallel sinusoidal waves shifted vertically by integration constant C.',
    equilibriumPoints: 'Zero slopes at x = kπ',
    domainX: [-3.5, 3.5],
    domainY: [-2.5, 2.5],
  },
  {
    id: 'logistic_y_1_minus_y',
    name: 'Logistic S-Curve',
    latexODE: '\\frac{dy}{dx} = y(1 - y)',
    latexSolution: 'y(x) = \\frac{1}{1 + \\left(\\frac{1 - y_0}{y_0}\\right)e^{-(x - x_0)}}',
    fn: (x, y) => y * (1 - y),
    exactSolution: (x, x0, y0) => {
      if (Math.abs(y0) < 0.001) return 0;
      if (Math.abs(y0 - 1) < 0.001) return 1;
      const c = (1 - y0) / y0;
      return 1 / (1 + c * Math.exp(-(x - x0)));
    },
    description: 'Models population growth with carrying capacity y = 1. Stable equilibrium at y = 1 and unstable at y = 0.',
    equilibriumPoints: 'y = 0 (unstable), y = 1 (stable)',
    domainX: [-3.5, 3.5],
    domainY: [-2.5, 2.5],
  },
  {
    id: 'custom',
    name: 'Custom Equation',
    latexODE: '\\frac{dy}{dx} = f(x,y)',
    latexSolution: 'Custom',
    fn: (x, y) => x - y,
    description: 'Enter your own differential equation using the custom input field.',
    equilibriumPoints: 'Depends on equation',
    domainX: [-3.5, 3.5],
    domainY: [-2.5, 2.5],
    isCustom: true,
  },
];
