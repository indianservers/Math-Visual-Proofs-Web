export interface FourierWavePreset {
  id: string;
  name: string;
  latexTarget: string;
  latexSeries: string;
  decayRate: string;
  description: string;
  targetFn: (t: number, T: number) => number;
  harmonicCoeff: (n: number) => { a: number; b: number };
  maxHarmonics: number;
}

export const FOURIER_PRESETS: FourierWavePreset[] = [
  {
    id: 'square',
    name: 'Square Wave',
    latexTarget: 'f(t) = \\text{sgn}(\\sin(\\omega_0 t))',
    latexSeries: 'S_N(t) = \\frac{4}{\\pi} \\sum_{k=1}^N \\frac{\\sin((2k-1)\\omega_0 t)}{2k-1}',
    decayRate: 'O(1/n) - Slow (Gibbs ~8.95%)',
    description: 'Odd harmonics only with 1/n coefficient decay. Exhibits Gibbs phenomenon ringing overshoot at jump discontinuities.',
    targetFn: (t, T) => {
      const mod = ((t % T) + T) % T;
      return mod < T / 2 ? 1 : -1;
    },
    harmonicCoeff: (n) => {
      if (n % 2 === 0) return { a: 0, b: 0 };
      return { a: 0, b: 4 / (Math.PI * n) };
    },
    maxHarmonics: 25,
  },
  {
    id: 'sawtooth',
    name: 'Sawtooth Wave',
    latexTarget: 'f(t) = 2\\left(\\frac{t}{T} - \\lfloor\\frac{t}{T} + \\frac{1}{2}\\rfloor\\right)',
    latexSeries: 'S_N(t) = \\frac{2}{\\pi} \\sum_{n=1}^N \\frac{(-1)^{n+1}}{n} \\sin(n\\omega_0 t)',
    decayRate: 'O(1/n) - All Harmonics',
    description: 'Contains all integer harmonics (both odd and even). Discontinuities occur at period boundaries.',
    targetFn: (t, T) => {
      const norm = ((t % T) + T) % T;
      return (2 * norm) / T - 1;
    },
    harmonicCoeff: (n) => {
      return { a: 0, b: (2 / (Math.PI * n)) * (n % 2 === 1 ? 1 : -1) };
    },
    maxHarmonics: 25,
  },
  {
    id: 'triangle',
    name: 'Triangle Wave',
    latexTarget: 'f(t) = \\frac{2}{\\pi} \\arcsin(\\sin(\\omega_0 t))',
    latexSeries: 'S_N(t) = \\frac{8}{\\pi^2} \\sum_{k=1}^N \\frac{(-1)^{k-1}}{(2k-1)^2} \\sin((2k-1)\\omega_0 t)',
    decayRate: 'O(1/n²) - Rapid Convergence',
    description: 'Continuous everywhere with sharp corners. Fast 1/n² harmonic falloff ensures virtually no visible Gibbs overshoot.',
    targetFn: (t, T) => {
      const mod = ((t % T) + T) % T;
      if (mod < T / 4) return (4 * mod) / T;
      if (mod < (3 * T) / 4) return 2 - (4 * mod) / T;
      return (4 * mod) / T - 4;
    },
    harmonicCoeff: (n) => {
      if (n % 2 === 0) return { a: 0, b: 0 };
      const k = (n + 1) / 2;
      const sign = k % 2 === 1 ? 1 : -1;
      return { a: 0, b: (8 / (Math.PI * Math.PI * n * n)) * sign };
    },
    maxHarmonics: 25,
  },
  {
    id: 'rectified',
    name: 'Full-Wave Rectified Sine',
    latexTarget: 'f(t) = |\\sin(\\omega_0 t)|',
    latexSeries: 'S_N(t) = \\frac{2}{\\pi} - \\frac{4}{\\pi}\\sum_{k=1}^N \\frac{\\cos(2k\\omega_0 t)}{4k^2 - 1}',
    decayRate: 'O(1/n²) - Even Cosines',
    description: 'Standard AC-to-DC rectification signal. Consists of a DC offset (2/π) and even cosine harmonics.',
    targetFn: (t, T) => {
      return Math.abs(Math.sin((2 * Math.PI * t) / T));
    },
    harmonicCoeff: (n) => {
      if (n === 0) return { a: 2 / Math.PI, b: 0 };
      if (n % 2 !== 0) return { a: 0, b: 0 };
      const k = n / 2;
      return { a: -4 / (Math.PI * (4 * k * k - 1)), b: 0 };
    },
    maxHarmonics: 25,
  },
];
