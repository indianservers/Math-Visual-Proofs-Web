// ─── Power of a Power Rule — Reducer ──────────────────────────────────────────
import type { ProofState } from './power-of-a-power-ruleConfig';
import { LIMITS } from './power-of-a-power-ruleConfig';

export interface PowerOfPowerState {
  base: number;
  m: number;
  n: number;
  isFlattened: boolean;
  viewMode: 'grid' | 'array';
  placedTilesCount: number;
  proofState: ProofState;
  hintLevel: number;
  predictInput: string;
  predictChecked: boolean;
  predictCorrect: boolean;
  challengeAnswer: string;
  challengeChecked: boolean;
  challengeCorrect: boolean;
}

export type PowerOfPowerAction =
  | { type: 'SET_PARAMS'; payload: { base?: number; m?: number; n?: number } }
  | { type: 'FLATTEN' }
  | { type: 'SET_VIEW_MODE'; payload: 'grid' | 'array' }
  | { type: 'PLACE_TILE' }
  | { type: 'RESET' }
  | { type: 'SET_PREDICT'; payload: string }
  | { type: 'CHECK_PREDICT' }
  | { type: 'SET_CHALLENGE'; payload: string }
  | { type: 'CHECK_CHALLENGE' };

export function initPowerOfPowerState(): PowerOfPowerState {
  return {
    base: LIMITS.defaultBase,
    m: LIMITS.defaultM,
    n: LIMITS.defaultN,
    isFlattened: false,
    viewMode: 'grid',
    placedTilesCount: LIMITS.defaultM * LIMITS.defaultN,
    proofState: 'inspect',
    hintLevel: 1,
    predictInput: '',
    predictChecked: false,
    predictCorrect: false,
    challengeAnswer: '',
    challengeChecked: false,
    challengeCorrect: false,
  };
}

export function powerOfPowerReducer(state: PowerOfPowerState, action: PowerOfPowerAction): PowerOfPowerState {
  switch (action.type) {
    case 'SET_PARAMS': {
      const base = action.payload.base ?? state.base;
      const m = action.payload.m ?? state.m;
      const n = action.payload.n ?? state.n;
      return {
        ...state,
        base, m, n,
        isFlattened: false,
        placedTilesCount: m * n,
        proofState: 'inspect',
      };
    }
    case 'FLATTEN':
      return { ...state, isFlattened: true, proofState: 'connect' };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'PLACE_TILE':
      return {
        ...state,
        placedTilesCount: Math.min(state.m * state.n, state.placedTilesCount + 1),
        proofState: 'manipulate',
      };
    case 'RESET':
      return initPowerOfPowerState();
    case 'SET_PREDICT':
      return { ...state, predictInput: action.payload, predictChecked: false };
    case 'CHECK_PREDICT': {
      // Predict asks: If a=5, m=2, n=4, what is (a^m)^n? (Answer: a^8 or 5^8 or 390625)
      const clean = state.predictInput.trim().toLowerCase();
      const isCorrect = clean === 'a^8' || clean === 'a8' || clean === '5^8' || clean === '390625' || clean === '8';
      return { ...state, predictChecked: true, predictCorrect: isCorrect, proofState: isCorrect ? 'conclude' : state.proofState };
    }
    case 'SET_CHALLENGE':
      return { ...state, challengeAnswer: action.payload, challengeChecked: false };
    case 'CHECK_CHALLENGE': {
      // Challenge asks: If a=2, m=4, n=3, what is (a^m)^n? Answer: 2^12 or 4096 or 12
      const clean = state.challengeAnswer.trim().toLowerCase();
      const isCorrect = clean === '4096' || clean === '2^12' || clean === '12' || clean === '212';
      return { ...state, challengeChecked: true, challengeCorrect: isCorrect, proofState: isCorrect ? 'transfer' : state.proofState };
    }
    default:
      return state;
  }
}
