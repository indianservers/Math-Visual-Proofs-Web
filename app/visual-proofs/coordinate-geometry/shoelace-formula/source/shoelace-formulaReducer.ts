// ─── Shoelace Formula — Reducer ───────────────────────────────────────────────
import type { ProofState, PolygonPoint } from './shoelace-formulaConfig';
import { DEFAULT_SHOELACE_POINTS } from './shoelace-formulaConfig';

export interface ShoelaceState {
  points: PolygonPoint[];
  snapGrid: boolean;
  proofState: ProofState;
  predictInput: string;
  predictChecked: boolean;
  predictCorrect: boolean;
  challengeInput: string;
  challengeChecked: boolean;
  challengeCorrect: boolean;
}

export type ShoelaceAction =
  | { type: 'MOVE_POINT'; payload: { id: string; x: number; y: number } }
  | { type: 'TOGGLE_SNAP' }
  | { type: 'RESET' }
  | { type: 'SET_PREDICT'; payload: string }
  | { type: 'CHECK_PREDICT' }
  | { type: 'SET_CHALLENGE'; payload: string }
  | { type: 'CHECK_CHALLENGE' };

export function initShoelaceState(): ShoelaceState {
  return {
    points: DEFAULT_SHOELACE_POINTS,
    snapGrid: true,
    proofState: 'inspect',
    predictInput: '',
    predictChecked: false,
    predictCorrect: false,
    challengeInput: '',
    challengeChecked: false,
    challengeCorrect: false,
  };
}

export function shoelaceReducer(state: ShoelaceState, action: ShoelaceAction): ShoelaceState {
  switch (action.type) {
    case 'MOVE_POINT':
      return {
        ...state,
        points: state.points.map(p => p.id === action.payload.id ? { ...p, x: action.payload.x, y: action.payload.y } : p),
        proofState: 'manipulate',
      };
    case 'TOGGLE_SNAP':
      return { ...state, snapGrid: !state.snapGrid };
    case 'RESET':
      return initShoelaceState();
    case 'SET_PREDICT':
      return { ...state, predictInput: action.payload, predictChecked: false };
    case 'CHECK_PREDICT': {
      const clean = state.predictInput.trim();
      const isCorrect = clean === '-73' || clean === '73';
      return { ...state, predictChecked: true, predictCorrect: isCorrect, proofState: isCorrect ? 'conclude' : state.proofState };
    }
    case 'SET_CHALLENGE':
      return { ...state, challengeInput: action.payload, challengeChecked: false };
    case 'CHECK_CHALLENGE':
      return { ...state, challengeChecked: true, challengeCorrect: true, proofState: 'transfer' };
    default:
      return state;
  }
}
