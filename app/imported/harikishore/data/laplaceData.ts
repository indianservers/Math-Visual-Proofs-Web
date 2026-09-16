export interface LaplacePreset {
  id: string;
  name: string;
  latexTime: string;
  latexLaplace: string;
  latexROC: string;
  description: string;
  defaultA: number;
  omega0?: number;
  timeFn: (t: number, a: number, omega0?: number) => number;
  poles: (a: number, omega0?: number) => { real: number; imag: number }[];
}

export const LAPLACE_PRESETS: LaplacePreset[] = [
  {
    id: 'exp_decay',
    name: 'Exponential Decay',
    latexTime: 'f(t) = e^{-at} u(t)',
    latexLaplace: 'F(s) = \\frac{1}{s + a}',
    latexROC: '\\text{Re}(s) > -a',
    description: 'Fundamental first-order decay system. Faster time-domain decay pushes the pole s = -a further left into the stable s-plane.',
    defaultA: 1.5,
    timeFn: (t, a) => (t < 0 ? 0 : Math.exp(-a * t)),
    poles: (a) => [{ real: -a, imag: 0 }],
  },
  {
    id: 'damped_oscillation',
    name: 'Damped Oscillation',
    latexTime: 'f(t) = e^{-at}\\cos(\\omega_0 t) u(t)',
    latexLaplace: 'F(s) = \\frac{s + a}{(s + a)^2 + \\omega_0^2}',
    latexROC: '\\text{Re}(s) > -a',
    description: 'Underdamped second-order system. Real part -a dictates decay envelope while imaginary part ±ω₀ dictates oscillation frequency.',
    defaultA: 1.0,
    omega0: 3.0,
    timeFn: (t, a, omega0 = 3.0) => (t < 0 ? 0 : Math.exp(-a * t) * Math.cos(omega0 * t)),
    poles: (a, omega0 = 3.0) => [
      { real: -a, imag: omega0 },
      { real: -a, imag: -omega0 },
    ],
  },
  {
    id: 'unit_step',
    name: 'Unit Step (Integrator)',
    latexTime: 'f(t) = u(t)',
    latexLaplace: 'F(s) = \\frac{1}{s}',
    latexROC: '\\text{Re}(s) > 0',
    description: 'Marginally stable pure integrator. The pole sits exactly on the imaginary boundary at s = 0 with zero time decay.',
    defaultA: 0.0,
    timeFn: (t) => (t < 0 ? 0 : 1.0),
    poles: () => [{ real: 0, imag: 0 }],
  },
  {
    id: 'double_pole',
    name: 'Critically Damped Ramp',
    latexTime: 'f(t) = t e^{-at} u(t)',
    latexLaplace: 'F(s) = \\frac{1}{(s + a)^2}',
    latexROC: '\\text{Re}(s) > -a',
    description: 'Critically damped response. A repeated 2nd-order pole at s = -a produces initial rise before smooth exponential extinction.',
    defaultA: 2.0,
    timeFn: (t, a) => (t < 0 ? 0 : t * Math.exp(-a * t)),
    poles: (a) => [
      { real: -a, imag: 0 },
      { real: -a, imag: 0 },
    ],
  },
];
