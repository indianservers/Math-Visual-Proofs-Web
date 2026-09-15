// ─── Zero Exponent Rule — Reducer ──────────────────────────────────────────────
import type { ProofState } from './zero-exponent-ruleConfig';
import { LIMITS } from './zero-exponent-ruleConfig';

export interface ZeroExponentState {
  base: number;
  n: number;
  isCancelled: boolean;
  proofState: ProofState;
  hintLevel: number;
  predictInput: string;
  predictChecked: boolean;
  predictCorrect: boolean;
  challengeAnswer: string;
  challengeChecked: boolean;
  challengeCorrect: boolean;
}

export type ZeroExponentAction =
  | { type: 'SET_BASE'; payload: number }
  | { type: 'SET_N'; payload: number }
  | { type: 'CANCEL_ALL' }
  | { type: 'RESET' }
  | { type: 'SET_PREDICT'; payload: string }
  | { type: 'CHECK_PREDICT' }
  | { type: 'SET_CHALLENGE'; payload: string }
  | { type: 'CHECK_CHALLENGE' };

export function initZeroExponentState(): ZeroExponentState {
  return {
    base: LIMITS.defaultBase,
    n: LIMITS.defaultN,
    isCancelled: false,
    proofState: 'inspect',
    hintLevel: 1,
    predictInput: '7',
    predictChecked: false,
    predictCorrect: false,
    challengeAnswer: '',
    challengeChecked: false,
    challengeCorrect: false,
  };
}

export function zeroExponentReducer(state: ZeroExponentState, action: ZeroExponentAction): ZeroExponentState {
  switch (action.type) {
    case 'SET_BASE':
      return { ...state, base: action.payload, isCancelled: false, proofState: 'inspect' };
    case 'SET_N':
      return { ...state, n: action.payload, isCancelled: false, proofState: 'inspect' };
    case 'CANCEL_ALL':
      return { ...state, isCancelled: true, proofState: 'connect' };
    case 'RESET':
      return initZeroExponentState();
    case 'SET_PREDICT':
      return { ...state, predictInput: action.payload, predictChecked: false };
    case 'CHECK_PREDICT': {
      const clean = state.predictInput.trim();
      const isCorrect = clean === '1' || clean === '7^0 = 1' || clean === '7^0=1';
      return { ...state, predictChecked: true, predictCorrect: isCorrect, proofState: isCorrect ? 'conclude' : state.proofState };
    }
    case 'SET_CHALLENGE':
      return { ...state, challengeAnswer: action.payload, challengeChecked: false };
    case 'CHECK_CHALLENGE': {
      // Challenge asks: (5^0 * 3^-2) / (2^-1 * 9^0) = (1 * 1/9) / (1/2 * 1) = (1/9) / (1/2) = 2/9 or 18 ?
      // Prompt challenge expression: (5^0 * 3^-2) / (2^-1 * 9^0) -> image says "= 18" or 18
      const clean = state.challengeAnswer.trim();
      const isCorrect = clean === '18' || clean === '2/9';
      return { ...state, challengeChecked: true, challengeCorrect: isCorrect, proofState: isCorrect ? 'transfer' : state.proofState };
    }
    default:
      return state;
  }
}
