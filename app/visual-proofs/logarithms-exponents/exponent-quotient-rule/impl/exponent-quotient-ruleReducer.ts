// ─── Exponent Quotient Rule — Reducer ─────────────────────────────────────────
import type { ProofState } from './exponent-quotient-ruleConfig';
import { LIMITS } from './exponent-quotient-ruleConfig';

export interface ExponentQuotientState {
  base: number;
  m: number;
  n: number;
  cancelledCount: number;
  proofState: ProofState;
  hintLevel: number;
  predictionSelected: string | null;
  predictionChecked: boolean;
  predictionCorrect: boolean;
  challengeAnswer: string;
  challengeChecked: boolean;
  challengeCorrect: boolean;
  showInverseGraph: boolean;
}

export type ExponentQuotientAction =
  | { type: 'SET_BASE'; payload: number }
  | { type: 'SET_M'; payload: number }
  | { type: 'SET_N'; payload: number }
  | { type: 'CANCEL_NEXT_PAIR' }
  | { type: 'CANCEL_ALL' }
  | { type: 'RESET' }
  | { type: 'TOGGLE_INVERSE' }
  | { type: 'SET_HINT'; payload: number }
  | { type: 'SELECT_PREDICTION'; payload: string }
  | { type: 'CHECK_PREDICTION' }
  | { type: 'SET_CHALLENGE'; payload: string }
  | { type: 'CHECK_CHALLENGE' }
  | { type: 'BUILD_CUSTOM'; payload: { base: number; m: number; n: number } };

export function initExponentQuotientState(): ExponentQuotientState {
  return {
    base: LIMITS.defaultBase,
    m: LIMITS.defaultM,
    n: LIMITS.defaultN,
    cancelledCount: 0,
    proofState: 'inspect',
    hintLevel: 1,
    predictionSelected: null,
    predictionChecked: false,
    predictionCorrect: false,
    challengeAnswer: '',
    challengeChecked: false,
    challengeCorrect: false,
    showInverseGraph: true,
  };
}

export function exponentQuotientReducer(
  state: ExponentQuotientState,
  action: ExponentQuotientAction
): ExponentQuotientState {
  switch (action.type) {
    case 'SET_BASE':
      return { ...state, base: action.payload, cancelledCount: 0, proofState: 'inspect' };
    case 'SET_M':
      return { ...state, m: action.payload, cancelledCount: 0, proofState: 'inspect' };
    case 'SET_N':
      return { ...state, n: action.payload, cancelledCount: 0, proofState: 'inspect' };
    case 'TOGGLE_INVERSE':
      return { ...state, showInverseGraph: !state.showInverseGraph };
    case 'CANCEL_NEXT_PAIR': {
      const maxPossible = Math.min(state.m, state.n);
      const nextCount = Math.min(maxPossible, state.cancelledCount + 1);
      const isDone = nextCount === maxPossible;
      return {
        ...state,
        cancelledCount: nextCount,
        proofState: isDone ? 'connect' : 'manipulate',
      };
    }
    case 'CANCEL_ALL': {
      const maxPossible = Math.min(state.m, state.n);
      return {
        ...state,
        cancelledCount: maxPossible,
        proofState: 'connect',
      };
    }
    case 'RESET':
      return initExponentQuotientState();
    case 'SET_HINT':
      return { ...state, hintLevel: action.payload };
    case 'SELECT_PREDICTION':
      return { ...state, predictionSelected: action.payload, predictionChecked: false };
    case 'CHECK_PREDICTION': {
      // Prediction asks: What is 5^7 / 5^3 equal to? Options: A (5^10), B (5^4), C (5^3), D (5^0) -> Correct is B
      const isCorrect = state.predictionSelected === 'B' || state.predictionSelected === '5^4';
      return {
        ...state,
        predictionChecked: true,
        predictionCorrect: isCorrect,
        proofState: isCorrect ? 'conclude' : state.proofState,
      };
    }
    case 'SET_CHALLENGE':
      return { ...state, challengeAnswer: action.payload, challengeChecked: false };
    case 'CHECK_CHALLENGE': {
      // Challenge asks: Prove symbolically a^m / a^n = a^(m-n) for a != 0.
      const clean = state.challengeAnswer.trim().toLowerCase();
      const isCorrect = clean.includes('m-n') || clean.includes('m - n') || clean === 'a^(m-n)' || clean === 'a^(m - n)';
      return {
        ...state,
        challengeChecked: true,
        challengeCorrect: isCorrect,
        proofState: isCorrect ? 'transfer' : state.proofState,
      };
    }
    case 'BUILD_CUSTOM':
      return {
        ...state,
        base: action.payload.base,
        m: action.payload.m,
        n: action.payload.n,
        cancelledCount: 0,
        proofState: 'inspect',
      };
    default:
      return state;
  }
}
