// ─── Exterior Angle Sum of Polygon — Reducer ───────────────────────────────────
import type { ProofState, PolygonVertex } from './exterior-angle-sum-polygonConfig';
import { DEFAULT_HEXAGON_VERTICES } from './exterior-angle-sum-polygonConfig';

export interface ExteriorAngleSumState {
  vertices: PolygonVertex[];
  activeTool: 'move' | 'add' | 'delete' | 'detach' | 'reset';
  selectedVertexId: number | null;
  proofState: ProofState;
  hintLevel: number;
  predictAnswer: string;
  predictChecked: boolean;
  predictCorrect: boolean;
  challengePolygon: string;
  challengeChecked: boolean;
  challengeCorrect: boolean;
}

export type ExteriorAngleSumAction =
  | { type: 'MOVE_VERTEX'; payload: { id: number; x: number; y: number } }
  | { type: 'SET_TOOL'; payload: 'move' | 'add' | 'delete' | 'detach' | 'reset' }
  | { type: 'RESET' }
  | { type: 'SET_PREDICT'; payload: string }
  | { type: 'CHECK_PREDICT' }
  | { type: 'SET_CHALLENGE_POLYGON'; payload: string }
  | { type: 'CHECK_CHALLENGE' };

export function initExteriorAngleSumState(): ExteriorAngleSumState {
  return {
    vertices: DEFAULT_HEXAGON_VERTICES,
    activeTool: 'move',
    selectedVertexId: null,
    proofState: 'inspect',
    hintLevel: 1,
    predictAnswer: '360',
    predictChecked: false,
    predictCorrect: false,
    challengePolygon: 'Heptagon (7 sides)',
    challengeChecked: false,
    challengeCorrect: false,
  };
}

export function exteriorAngleSumReducer(state: ExteriorAngleSumState, action: ExteriorAngleSumAction): ExteriorAngleSumState {
  switch (action.type) {
    case 'MOVE_VERTEX':
      return {
        ...state,
        vertices: state.vertices.map(v => v.id === action.payload.id ? { ...v, x: action.payload.x, y: action.payload.y } : v),
        proofState: 'manipulate',
      };
    case 'SET_TOOL':
      return { ...state, activeTool: action.payload };
    case 'RESET':
      return initExteriorAngleSumState();
    case 'SET_PREDICT':
      return { ...state, predictAnswer: action.payload, predictChecked: false };
    case 'CHECK_PREDICT': {
      const clean = state.predictAnswer.trim();
      const isCorrect = clean === '360' || clean === '360°' || clean === '360 degrees';
      return { ...state, predictChecked: true, predictCorrect: isCorrect, proofState: isCorrect ? 'conclude' : state.proofState };
    }
    case 'SET_CHALLENGE_POLYGON':
      return { ...state, challengePolygon: action.payload, challengeChecked: false };
    case 'CHECK_CHALLENGE':
      return { ...state, challengeChecked: true, challengeCorrect: true, proofState: 'transfer' };
    default:
      return state;
  }
}
