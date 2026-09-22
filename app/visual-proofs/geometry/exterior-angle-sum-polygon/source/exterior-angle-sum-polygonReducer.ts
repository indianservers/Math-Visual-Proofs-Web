// ─── Exterior Angle Sum of Polygon — Reducer ───────────────────────────────────
import type { ProofState, PolygonVertex } from './exterior-angle-sum-polygonConfig';
import { DEFAULT_HEXAGON_VERTICES } from './exterior-angle-sum-polygonConfig';
import {
  challengeSideCount,
  insertVertexAt,
  regularPolygon,
  withUpdatedAngles,
} from './exterior-angle-sum-polygonMath';

export interface ExteriorAngleSumState {
  vertices: PolygonVertex[];
  activeTool: 'move' | 'add' | 'delete' | 'detach' | 'reset';
  arcsDetached: boolean;
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
  | { type: 'ADD_VERTEX'; payload: { x: number; y: number } }
  | { type: 'DELETE_VERTEX'; payload: { id: number } }
  | { type: 'SET_TOOL'; payload: 'move' | 'add' | 'delete' | 'detach' | 'reset' }
  | { type: 'RESET' }
  | { type: 'SET_PREDICT'; payload: string }
  | { type: 'CHECK_PREDICT' }
  | { type: 'SET_CHALLENGE_POLYGON'; payload: string }
  | { type: 'CHECK_CHALLENGE' };

export function initExteriorAngleSumState(): ExteriorAngleSumState {
  return {
    vertices: withUpdatedAngles(DEFAULT_HEXAGON_VERTICES),
    activeTool: 'move',
    arcsDetached: false,
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
        vertices: withUpdatedAngles(
          state.vertices.map((vertex) =>
            vertex.id === action.payload.id
              ? { ...vertex, x: action.payload.x, y: action.payload.y }
              : vertex,
          ),
        ),
        selectedVertexId: action.payload.id,
        proofState: 'manipulate',
      };
    case 'ADD_VERTEX':
      return {
        ...state,
        vertices: insertVertexAt(state.vertices, action.payload.x, action.payload.y),
        proofState: 'manipulate',
      };
    case 'DELETE_VERTEX':
      if (state.vertices.length <= 3) return state;
      return {
        ...state,
        vertices: withUpdatedAngles(
          state.vertices.filter((vertex) => vertex.id !== action.payload.id),
        ),
        selectedVertexId: null,
        proofState: 'manipulate',
      };
    case 'SET_TOOL':
      if (action.payload === 'reset') {
        return initExteriorAngleSumState();
      }
      return {
        ...state,
        activeTool: action.payload,
        arcsDetached:
          action.payload === 'detach' ? !state.arcsDetached : state.arcsDetached,
      };
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
      return {
        ...state,
        vertices: regularPolygon(challengeSideCount(state.challengePolygon)),
        challengeChecked: true,
        challengeCorrect: true,
        proofState: 'transfer',
      };
    default:
      return state;
  }
}
