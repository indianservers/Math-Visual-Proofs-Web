// ─── Exponent Product Rule — Math Pure Helpers ─────────────────────────────────

export function calculatePower(base: number, exp: number): number {
  return Math.pow(base, exp);
}

export function computeProduct(base: number, m: number, n: number): {
  am: number;
  an: number;
  totalExp: number;
  product: number;
} {
  const am = Math.pow(base, m);
  const an = Math.pow(base, n);
  const totalExp = m + n;
  const product = Math.pow(base, totalExp);
  return { am, an, totalExp, product };
}

export const VIEW_W = 600;
export const VIEW_H = 340;

export interface ChainBall {
  id: string;
  chain: 'm' | 'n' | 'combined';
  index: number;
  x: number;
  y: number;
  label: string;
}

export function calculateChainGeometry(m: number, n: number): {
  mChainBalls: ChainBall[];
  nChainBalls: ChainBall[];
  combinedBalls: ChainBall[];
} {
  const ballR = 18;
  const gap = 12;

  // m-chain box around x: 40 to 260, y: 30 to 130
  const mStartX = 80;
  const mStartY = 70;

  const mChainBalls: ChainBall[] = Array.from({ length: m }, (_, i) => ({
    id: `m-${i}`,
    chain: 'm',
    index: i,
    x: mStartX + i * (ballR * 2 + gap),
    y: mStartY,
    label: 'a',
  }));

  // n-chain box around x: 300 to 520, y: 30 to 130
  const nStartX = 340;
  const nStartY = 70;

  const nChainBalls: ChainBall[] = Array.from({ length: n }, (_, i) => ({
    id: `n-${i}`,
    chain: 'n',
    index: i,
    x: nStartX + i * (ballR * 2 + gap),
    y: nStartY,
    label: 'a',
  }));

  // combined chain box around x: 100 to 500, y: 200 to 300
  const total = m + n;
  const combStartX = VIEW_W / 2 - (total * (ballR * 2 + gap) - gap) / 2 + ballR;
  const combStartY = 240;

  const combinedBalls: ChainBall[] = Array.from({ length: total }, (_, i) => ({
    id: `comb-${i}`,
    chain: 'combined',
    index: i,
    x: combStartX + i * (ballR * 2 + gap),
    y: combStartY,
    label: 'a',
  }));

  return { mChainBalls, nChainBalls, combinedBalls };
}
