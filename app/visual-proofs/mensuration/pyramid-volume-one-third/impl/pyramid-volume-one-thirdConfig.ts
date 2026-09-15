// ─── Volume of a Pyramid — Configuration ──────────────────────────────────────

export type ProofState = 'inspect' | 'manipulate' | 'preserve' | 'connect' | 'conclude' | 'transfer';

export const HINTS = [
  { level: 1, title: 'Decompose', body: 'Connect the top of the prism to all vertices of the base to decompose it.' },
  { level: 2, title: 'Equal Volumes', body: 'The three pyramids share the same base area B and height h.' },
  { level: 3, title: 'Add Volumes', body: 'V_prism = 1/3 Bh + 1/3 Bh + 1/3 Bh = Bh.' },
  { level: 4, title: 'One Pyramid Volume', body: 'V_pyramid = (1/3) Bh.' },
];

export const PROOF_STATES: Record<ProofState, string> = {
  inspect: 'Inspect reference prism with base area B and height h.',
  manipulate: 'Drag and place the three pyramids into the prism container.',
  preserve: 'Preserve total volume conservation: V_prism = Bh.',
  connect: 'Relate 3 equal pyramids to 1 prism volume.',
  conclude: 'Conclude: V_pyramid = (1/3) Bh.',
  transfer: 'Test with different base areas and heights.',
};

export const LIMITS = {
  minB: 6,
  maxB: 48,
  defaultB: 24,
  minH: 2,
  maxH: 12,
  defaultH: 6,
};
