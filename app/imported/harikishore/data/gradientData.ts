export interface GradientFieldPreset {
  id: string;
  name: string;
  latexField: string;
  latexGradient: string;
  description: string;
  defaultPos: { x: number; y: number };
  fn: (x: number, y: number) => number;
  grad: (x: number, y: number) => { dfdx: number; dfdy: number };
  contourLevels: number[];
}

export const GRADIENT_PRESETS: GradientFieldPreset[] = [
  {
    id: 'paraboloid',
    name: 'Paraboloid Bowl',
    latexField: 'f(x, y) = x^2 + y^2',
    latexGradient: '\\nabla f(x, y) = \\begin{bmatrix} 2x \\\\ 2y \\end{bmatrix}',
    description: 'Concentric circular contours centered at the origin. Gradient vectors point radially outward in the direction of steepest ascent.',
    defaultPos: { x: 1.5, y: 1.0 },
    fn: (x, y) => x * x + y * y,
    grad: (x, y) => ({ dfdx: 2 * x, dfdy: 2 * y }),
    contourLevels: [0.5, 1.5, 3.0, 5.0, 7.5, 10.5],
  },
  {
    id: 'saddle',
    name: 'Saddle Surface',
    latexField: 'f(x, y) = x^2 - y^2',
    latexGradient: '\\nabla f(x, y) = \\begin{bmatrix} 2x \\\\ -2y \\end{bmatrix}',
    description: 'Hyperbolic contours with saddle point at origin. Gradient points toward increasing x-ridges and away from y-valleys.',
    defaultPos: { x: 1.2, y: 0.8 },
    fn: (x, y) => x * x - y * y,
    grad: (x, y) => ({ dfdx: 2 * x, dfdy: -2 * y }),
    contourLevels: [-6, -4, -2, 0, 2, 4, 6],
  },
  {
    id: 'gaussian',
    name: 'Gaussian Hill',
    latexField: 'f(x, y) = 4 e^{-(x^2 + y^2)/3}',
    latexGradient: '\\nabla f(x, y) = -\\frac{8}{3}e^{-(x^2+y^2)/3} \\begin{bmatrix} x \\\\ y \\end{bmatrix}',
    description: 'Smooth bell-shaped peak. Gradient points straight uphill toward the summit at the origin (0, 0).',
    defaultPos: { x: 1.2, y: 1.0 },
    fn: (x, y) => 4 * Math.exp(-(x * x + y * y) / 3),
    grad: (x, y) => {
      const factor = -(8 / 3) * Math.exp(-(x * x + y * y) / 3);
      return { dfdx: factor * x, dfdy: factor * y };
    },
    contourLevels: [0.5, 1.2, 2.0, 2.8, 3.5],
  },
  {
    id: 'elliptical',
    name: 'Elliptical Ridge',
    latexField: 'f(x, y) = x^2 + 3y^2',
    latexGradient: '\\nabla f(x, y) = \\begin{bmatrix} 2x \\\\ 6y \\end{bmatrix}',
    description: 'Anisotropic surface. Contours are elongated ellipses; gradient is steeper along the y-axis than along the x-axis.',
    defaultPos: { x: 1.5, y: 0.8 },
    fn: (x, y) => x * x + 3 * y * y,
    grad: (x, y) => ({ dfdx: 2 * x, dfdy: 6 * y }),
    contourLevels: [1.0, 2.5, 5.0, 8.0, 12.0],
  },
];
