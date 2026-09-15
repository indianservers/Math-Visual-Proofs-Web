// ─── Volume of a Pyramid — Reducer ────────────────────────────────────────────
import type { ProofState } from './pyramid-volume-one-thirdConfig';
import { LIMITS } from './pyramid-volume-one-thirdConfig';

export interface PyramidVolumeState {
  baseArea: number;
  height: number;
  unrolled: boolean;
  placedPyramidsCount: number;
  proofState: ProofState;
  predictSelected: string | null;
  predictChecked: boolean;
  predictCorrect: boolean;
  challengeAnswer: string;
  challengeChecked: boolean;
  challengeCorrect: boolean;
}

export type PyramidVolumeAction =
  | { type: 'SET_BASE_AREA'; payload: number }
  | { type: 'SET_HEIGHT'; payload: number }
  | { type: 'TOGGLE_UNROLL' }
  | { type: 'DOCK_PYRAMID' }
  | { type: 'RESET' }
  | { type: 'SELECT_PREDICT'; payload: string }
  | { type: 'CHECK_PREDICT' }
  | { type: 'SET_CHALLENGE'; payload: string }
  | { type: 'CHECK_CHALLENGE' };

export function initPyramidVolumeState(): PyramidVolumeState {
  return {
    baseArea: LIMITS.defaultB,
    height: LIMITS.defaultH,
    unrolled: false,
    placedPyramidsCount: 1,
    proofState: 'inspect',
    predictSelected: null,
    predictChecked: false,
    predictCorrect: false,
    challengeAnswer: '48',
    challengeChecked: false,
    challengeCorrect: false,
  };
}

export function pyramidVolumeReducer(state: PyramidVolumeState, action: PyramidVolumeAction): PyramidVolumeState {
  switch (action.type) {
    case 'SET_BASE_AREA':
      return { ...state, baseArea: action.payload, proofState: 'inspect' };
    case 'SET_HEIGHT':
      return { ...state, height: action.payload, proofState: 'inspect' };
    case 'TOGGLE_UNROLL':
      return { ...state, unrolled: !state.unrolled };
    case 'DOCK_PYRAMID':
      return { ...state, placedPyramidsCount: Math.min(3, state.placedPyramidsCount + 1), proofState: 'connect' };
    case 'RESET':
      return initPyramidVolumeState();
    case 'SELECT_PREDICT':
      return { ...state, predictSelected: action.payload, predictChecked: false };
    case 'CHECK_PREDICT': {
      const isCorrect = state.predictSelected === '1/3 Bh' || state.predictSelected === '1/3Bh';
      return { ...state, predictChecked: true, predictCorrect: isCorrect, proofState: isCorrect ? 'conclude' : state.proofState };
    }
    case 'SET_CHALLENGE':
      return { ...state, challengeAnswer: action.payload, challengeChecked: false };
    case 'CHECK_CHALLENGE': {
      const clean = state.challengeAnswer.trim();
      const isCorrect = clean === '48' || clean === '48 u³' || clean === '48u3';
      return { ...state, challengeChecked: true, challengeCorrect: isCorrect, proofState: isCorrect ? 'transfer' : state.proofState };
    }
    default:
      return state;
  }
}
