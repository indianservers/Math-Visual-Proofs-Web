// ─── Heron's Formula — Reducer ───────────────────────────────────────────────
import type { ProofState, TrianglePoint } from './herons-formula-visual-proofConfig';

export interface HeronsState {
  ptA: TrianglePoint;
  ptB: TrianglePoint;
  ptC: TrianglePoint;
  showAltitude: boolean;
  proofState: ProofState;
  predictRevealed: boolean;
  challengeAnswer: string;
  challengeChecked: boolean;
  challengeCorrect: boolean;
}

export type HeronsAction =
  | { type: 'MOVE_VERTEX_A'; payload: TrianglePoint }
  | { type: 'TOGGLE_ALTITUDE' }
  | { type: 'RESET' }
  | { type: 'REVEAL_PREDICT' }
  | { type: 'SET_CHALLENGE'; payload: string }
  | { type: 'CHECK_CHALLENGE' };

export function initHeronsState(): HeronsState {
  return {
    ptA: { x: 270, y: 110 },
    ptB: { x: 120, y: 310 },
    ptC: { x: 420, y: 310 },
    showAltitude: true,
    proofState: 'inspect',
    predictRevealed: false,
    challengeAnswer: '',
    challengeChecked: false,
    challengeCorrect: false,
  };
}

export function heronsReducer(state: HeronsState, action: HeronsAction): HeronsState {
  switch (action.type) {
    case 'MOVE_VERTEX_A':
      return { ...state, ptA: action.payload, proofState: 'manipulate' };
    case 'TOGGLE_ALTITUDE':
      return { ...state, showAltitude: !state.showAltitude };
    case 'RESET':
      return initHeronsState();
    case 'REVEAL_PREDICT':
      return { ...state, predictRevealed: true, proofState: 'conclude' };
    case 'SET_CHALLENGE':
      return { ...state, challengeAnswer: action.payload, challengeChecked: false };
    case 'CHECK_CHALLENGE':
      return { ...state, challengeChecked: true, challengeCorrect: true, proofState: 'transfer' };
    default:
      return state;
  }
}
