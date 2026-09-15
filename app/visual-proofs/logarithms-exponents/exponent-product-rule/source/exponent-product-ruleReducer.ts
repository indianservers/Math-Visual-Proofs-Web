// ─── Exponent Product Rule — Reducer ──────────────────────────────────────────
import type { ProofState } from './exponent-product-ruleConfig';
import { LIMITS } from './exponent-product-ruleConfig';

export interface ExponentProductState {
  base: number;
  m: number;
  n: number;
  isJoined: boolean;
  isDragging: boolean;
  dragX: number;
  dragY: number;
  proofState: ProofState;
  hintLevel: number;
  predictionInput: string;
  predictionChecked: boolean;
  predictionCorrect: boolean;
  challengeAnswer: string;
  challengeChecked: boolean;
  challengeCorrect: boolean;
  showInverse: boolean;
}

export type ExponentProductAction =
  | { type: 'SET_BASE'; payload: number }
  | { type: 'SET_M'; payload: number }
  | { type: 'SET_N'; payload: number }
  | { type: 'TOGGLE_INVERSE' }
  | { type: 'START_DRAG'; payload: { x: number; y: number } }
  | { type: 'MOVE_DRAG'; payload: { x: number; y: number } }
  | { type: 'END_DRAG'; payload: { droppedInTarget: boolean } }
  | { type: 'JOIN_CHAINS' }
  | { type: 'RESET' }
  | { type: 'SET_HINT'; payload: number }
  | { type: 'SET_PREDICTION'; payload: string }
  | { type: 'CHECK_PREDICTION' }
  | { type: 'SET_CHALLENGE'; payload: string }
  | { type: 'CHECK_CHALLENGE' };

export function initExponentProductState(): ExponentProductState {
  return {
    base: LIMITS.defaultBase,
    m: LIMITS.defaultM,
    n: LIMITS.defaultN,
    isJoined: false,
    isDragging: false,
    dragX: 0,
    dragY: 0,
    proofState: 'inspect',
    hintLevel: 1,
    predictionInput: '',
    predictionChecked: false,
    predictionCorrect: false,
    challengeAnswer: '',
    challengeChecked: false,
    challengeCorrect: false,
    showInverse: true,
  };
}

export function exponentProductReducer(
  state: ExponentProductState,
  action: ExponentProductAction
): ExponentProductState {
  switch (action.type) {
    case 'SET_BASE':
      return { ...state, base: action.payload, isJoined: false, proofState: 'inspect' };
    case 'SET_M':
      return { ...state, m: action.payload, isJoined: false, proofState: 'inspect' };
    case 'SET_N':
      return { ...state, n: action.payload, isJoined: false, proofState: 'inspect' };
    case 'TOGGLE_INVERSE':
      return { ...state, showInverse: !state.showInverse };
    case 'START_DRAG':
      return {
        ...state,
        isDragging: true,
        dragX: action.payload.x,
        dragY: action.payload.y,
        proofState: 'manipulate',
      };
    case 'MOVE_DRAG':
      return {
        ...state,
        dragX: action.payload.x,
        dragY: action.payload.y,
      };
    case 'END_DRAG':
      if (action.payload.droppedInTarget) {
        return {
          ...state,
          isDragging: false,
          isJoined: true,
          proofState: 'connect',
        };
      }
      return {
        ...state,
        isDragging: false,
      };
    case 'JOIN_CHAINS':
      return {
        ...state,
        isJoined: true,
        proofState: 'connect',
      };
    case 'RESET':
      return initExponentProductState();
    case 'SET_HINT':
      return { ...state, hintLevel: action.payload };
    case 'SET_PREDICTION':
      return { ...state, predictionInput: action.payload, predictionChecked: false };
    case 'CHECK_PREDICTION': {
      // Prediction asks: If m=4 and n=3, what is the result exponent? (Answer: 7 or a^7 or 128 depending on format)
      const clean = state.predictionInput.trim().toLowerCase();
      const isCorrect = clean === '7' || clean === 'a^7' || clean === 'a7' || clean === '128' || clean === '2^7';
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
      // Challenge asks: Base a=5, m=-2, n=4. Compute a^m * a^n = 5^2 = 25.
      const clean = state.challengeAnswer.trim().toLowerCase();
      const isCorrect = clean === '25' || clean === '5^2' || clean === '52';
      return {
        ...state,
        challengeChecked: true,
        challengeCorrect: isCorrect,
        proofState: isCorrect ? 'transfer' : state.proofState,
      };
    }
    default:
      return state;
  }
}
