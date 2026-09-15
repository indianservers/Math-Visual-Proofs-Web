export interface DivCurlPreset {
  id: string;
  name: string;
  latexField: string;
  latexDiv: string;
  latexCurl: string;
  description: string;
  defaultProbe: { x: number; y: number };
  F: (x: number, y: number) => { P: number; Q: number };
  div: (x: number, y: number) => number;
  curl: (x: number, y: number) => number;
  behaviorType: 'source' | 'sink' | 'vortex' | 'shear' | 'uniform';
}

export const DIV_CURL_PRESETS: DivCurlPreset[] = [
  {
    id: 'source',
    name: 'Radial Source (Positive Div)',
    latexField: '\\vec{F}(x, y) = x\\hat{i} + y\\hat{j}',
    latexDiv: '\\nabla \\cdot \\vec{F} = \\frac{\\partial x}{\\partial x} + \\frac{\\partial y}{\\partial y} = 1 + 1 = 2',
    latexCurl: '(\\nabla \\times \\vec{F})_z = \\frac{\\partial y}{\\partial x} - \\frac{\\partial x}{\\partial y} = 0 - 0 = 0',
    description: 'Vectors point outward from the origin with increasing magnitude. Net fluid flux expands outward with zero rotation.',
    defaultProbe: { x: 0.8, y: 0.8 },
    F: (x, y) => ({ P: x, Q: y }),
    div: () => 2,
    curl: () => 0,
    behaviorType: 'source',
  },
  {
    id: 'sink',
    name: 'Radial Sink (Negative Div)',
    latexField: '\\vec{F}(x, y) = -x\\hat{i} - y\\hat{j}',
    latexDiv: '\\nabla \\cdot \\vec{F} = -1 - 1 = -2',
    latexCurl: '(\\nabla \\times \\vec{F})_z = 0 - 0 = 0',
    description: 'Vectors point inward toward the origin. Net fluid flows into the test region (drain) with negative divergence.',
    defaultProbe: { x: 0.8, y: 0.8 },
    F: (x, y) => ({ P: -x, Q: -y }),
    div: () => -2,
    curl: () => 0,
    behaviorType: 'sink',
  },
  {
    id: 'vortex',
    name: 'Pure Vortex (Positive Curl)',
    latexField: '\\vec{F}(x, y) = -y\\hat{i} + x\\hat{j}',
    latexDiv: '\\nabla \\cdot \\vec{F} = \\frac{\\partial(-y)}{\\partial x} + \\frac{\\partial x}{\\partial y} = 0 + 0 = 0',
    latexCurl: '(\\nabla \\times \\vec{F})_z = \\frac{\\partial x}{\\partial x} - \\frac{\\partial(-y)}{\\partial y} = 1 - (-1) = 2',
    description: 'Rigid-body counterclockwise rotation. A test paddle wheel spins counterclockwise, giving curl = 2 while divergence = 0.',
    defaultProbe: { x: 1.0, y: 0.0 },
    F: (x, y) => ({ P: -y, Q: x }),
    div: () => 0,
    curl: () => 2,
    behaviorType: 'vortex',
  },
  {
    id: 'shear',
    name: 'Shear Flow (Zero Div, Nonzero Curl)',
    latexField: '\\vec{F}(x, y) = y\\hat{i} + 0\\hat{j}',
    latexDiv: '\\nabla \\cdot \\vec{F} = 0 + 0 = 0',
    latexCurl: '(\\nabla \\times \\vec{F})_z = 0 - 1 = -1',
    description: 'Horizontal flow velocity increases with vertical position y. Top of paddle moves faster than bottom, causing clockwise spin.',
    defaultProbe: { x: 0.0, y: 1.0 },
    F: (x, y) => ({ P: y, Q: 0 }),
    div: () => 0,
    curl: () => -1,
    behaviorType: 'shear',
  },
  {
    id: 'uniform',
    name: 'Uniform Flow (Zero Div, Zero Curl)',
    latexField: '\\vec{F}(x, y) = 2\\hat{i} + 1\\hat{j}',
    latexDiv: '\\nabla \\cdot \\vec{F} = 0 + 0 = 0',
    latexCurl: '(\\nabla \\times \\vec{F})_z = 0 - 0 = 0',
    description: 'Constant magnitude and direction throughout space. Fluid enters and exits the region identically with zero spin.',
    defaultProbe: { x: 0.0, y: 0.0 },
    F: () => ({ P: 2, Q: 1 }),
    div: () => 0,
    curl: () => 0,
    behaviorType: 'uniform',
  },
];
