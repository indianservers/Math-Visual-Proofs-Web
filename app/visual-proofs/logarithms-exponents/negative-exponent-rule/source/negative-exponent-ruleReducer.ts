// ─── Negative Exponent Rule — Reducer ──────────────────────────────────────────
import type { ProofState } from './negative-exponent-ruleConfig';
import { LIMITS } from './negative-exponent-ruleConfig';

export interface NegativeExponentState {
  base: number;
  exp: number;
  stepsMovedLeft: number;
  proofState: ProofState;
  hintLevel: number;
  predictInput: string;
  predictChecked: boolean;
  predictCorrect: boolean;
  challenge1: string;
  challenge2: string;
  challenge3: string;
  challenge4: string;
  challengeChecked: boolean;
  challengeCorrect: boolean;
}

export type NegativeExponentAction =
  | { type: 'SET_BASE'; payload: number }
  | { type: 'SET_EXP'; payload: number }
  | { type: 'STEP_LEFT' }
  | { type: 'RESET' }
  | { type: 'SET_PREDICT'; payload: string }
  | { type: 'CHECK_PREDICT' }
  | { type: 'SET_CHALLENGE'; payload: { field: 1 | 2 | 3 | 4; val: string } }
  | { type: 'CHECK_CHALLENGE' };

export function initNegativeExponentState(): NegativeExponentState {
  return {
    base: LIMITS.defaultBase,
    exp: LIMITS.defaultExp,
    stepsMovedLeft: 2,
    proofState: 'inspect',
    hintLevel: 1,
    predictInput: '',
    predictChecked: false,
    predictCorrect: false,
    challenge1: '',
    challenge2: '',
    challenge3: '',
    challenge4: '',
    challengeChecked: false,
    challengeCorrect: false,
  };
}

export function negativeExponentReducer(state: NegativeExponentState, action: NegativeExponentAction): NegativeExponentState {
  switch (action.type) {
    case 'SET_BASE':
      return { ...state, base: action.payload, proofState: 'inspect' };
    case 'SET_EXP':
      return { ...state, exp: action.payload, stepsMovedLeft: Math.abs(action.payload), proofState: 'manipulate' };
    case 'STEP_LEFT': {
      const nextExp = Math.max(LIMITS.minExp, state.exp - 1);
      return { ...state, exp: nextExp, stepsMovedLeft: state.stepsMovedLeft + 1, proofState: 'connect' };
    }
    case 'RESET':
      return initNegativeExponentState();
    case 'SET_PREDICT':
      return { ...state, predictInput: action.payload, predictChecked: false };
    case 'CHECK_PREDICT': {
      // Predict asks: What is 5^-3? (1/125 or 1/5^3)
      const clean = state.predictInput.trim().toLowerCase();
      const isCorrect = clean === '1/125' || clean === '1/5^3' || clean === '1/53';
      return { ...state, predictChecked: true, predictCorrect: isCorrect, proofState: isCorrect ? 'conclude' : state.proofState };
    }
    case 'SET_CHALLENGE': {
      const fieldName = `challenge${action.payload.field}` as const;
      return { ...state, [fieldName]: action.payload.val, challengeChecked: false };
    }
    case 'CHECK_CHALLENGE': {
      const isCorrect = state.challenge1.trim() !== '' && state.challenge2.trim() !== '';
      return { ...state, challengeChecked: true, challengeCorrect: isCorrect, proofState: isCorrect ? 'transfer' : state.proofState };
    }
    default:
      return state;
  }
}
