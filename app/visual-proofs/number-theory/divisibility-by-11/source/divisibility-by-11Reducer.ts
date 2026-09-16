import { LIMITS } from './divisibility-by-11Config';
import type { ProofState } from './divisibility-by-11Config';
import { generateDragTargets, getDigitColor } from './divisibility-by-11Math';

export interface DigitCounterState {
  id: number;
  val: number;
  power: number;
  x: number;
  y: number;
  color: string;
  dockState: 'slot' | 'groupA' | 'groupB';
}

export interface StateSlice {
  digits: number[];
  proofState: ProofState;
  counters: DigitCounterState[];
}

export interface Div11StateModel {
  digits: number[];
  proofState: ProofState;
  counters: DigitCounterState[];
  hintLevel: number;

  predictionAnswer: 'yes' | 'no' | '';
  predictionChecked: boolean;

  challengeChoice: string;
  challengeChecked: boolean;
  challengeCorrect: boolean;

  misconceptionSelected: string;
  misconceptionChecked: boolean;
  misconceptionFeedback: string | null;

  isPlaying: boolean;
  animationSpeed: number;
  animationStep: number;

  history: StateSlice[];
  historyIndex: number;
}

export function getInitialCounters(digits: number[]): DigitCounterState[] {
  const targets = generateDragTargets(digits);
  const len = digits.length;
  return digits.map((d, i) => {
    const power = len - 1 - i;
    const initialTarget = targets.find(t => t.type === 'slot' && t.slotIdx === i) || { x: 50, y: 80 };
    return {
      id: i,
      val: d,
      power,
      x: initialTarget.x,
      y: initialTarget.y,
      color: getDigitColor(power),
      dockState: 'slot',
    };
  });
}

export const INITIAL_STATE: Div11StateModel = {
  digits: LIMITS.defaultDigits,
  proofState: 'inspect',
  counters: getInitialCounters(LIMITS.defaultDigits),
  hintLevel: 1,

  predictionAnswer: '',
  predictionChecked: false,

  challengeChoice: '',
  challengeChecked: false,
  challengeCorrect: false,

  misconceptionSelected: '',
  misconceptionChecked: false,
  misconceptionFeedback: null,

  isPlaying: false,
  animationSpeed: 1.0,
  animationStep: 0,

  history: [],
  historyIndex: 0,
};

export function initDiv11State(): Div11StateModel {
  const slice: StateSlice = {
    digits: LIMITS.defaultDigits,
    proofState: 'inspect',
    counters: getInitialCounters(LIMITS.defaultDigits),
  };
  return {
    ...INITIAL_STATE,
    history: [slice],
    historyIndex: 0,
  };
}

export type Action =
  | { type: 'SET_DIGITS'; payload: number[] }
  | { type: 'SET_STATE'; payload: ProofState }
  | { type: 'DRAG_COUNTER'; payload: { id: number; x: number; y: number } }
  | { type: 'DOCK_COUNTER'; payload: { id: number; dockState: 'slot' | 'groupA' | 'groupB'; x: number; y: number } }
  | { type: 'AUTO_SORT_STEP' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET' }
  | { type: 'SET_HINT'; payload: number }
  | { type: 'SET_PREDICTION'; payload: 'yes' | 'no' }
  | { type: 'CHECK_PREDICTION' }
  | { type: 'SET_CHALLENGE'; payload: string }
  | { type: 'CHECK_CHALLENGE' }
  | { type: 'SET_MISCONCEPTION'; payload: string }
  | { type: 'CHECK_MISCONCEPTION' }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'TICK_ANIMATION' }
  | { type: 'SET_ANIMATION_SPEED'; payload: number };

function pushHistory(history: StateSlice[], index: number, slice: StateSlice): { history: StateSlice[]; index: number } {
  const newHistory = history.slice(0, index + 1);
  newHistory.push(slice);
  return {
    history: newHistory,
    index: newHistory.length - 1,
  };
}

export function divisibilityBy11Reducer(state: Div11StateModel, action: Action): Div11StateModel {
  switch (action.type) {
    case 'SET_DIGITS': {
      const nextCounters = getInitialCounters(action.payload);
      const slice: StateSlice = {
        digits: action.payload,
        proofState: state.proofState,
        counters: nextCounters,
      };
      const { history, index } = pushHistory(state.history, state.historyIndex, slice);
      return {
        ...state,
        digits: action.payload,
        counters: nextCounters,
        history,
        historyIndex: index,
        animationStep: 0,
      };
    }
    case 'SET_STATE': {
      const slice: StateSlice = {
        digits: state.digits,
        proofState: action.payload,
        counters: state.counters,
      };
      const { history, index } = pushHistory(state.history, state.historyIndex, slice);
      return {
        ...state,
        proofState: action.payload,
        history,
        historyIndex: index,
      };
    }
    case 'DRAG_COUNTER': {
      return {
        ...state,
        counters: state.counters.map(c =>
          c.id === action.payload.id ? { ...c, x: action.payload.x, y: action.payload.y } : c
        ),
      };
    }
    case 'DOCK_COUNTER': {
      const nextCounters = state.counters.map(c =>
        c.id === action.payload.id
          ? {
              ...c,
              x: action.payload.x,
              y: action.payload.y,
              dockState: action.payload.dockState,
            }
          : c
      );
      const slice: StateSlice = {
        digits: state.digits,
        proofState: state.proofState,
        counters: nextCounters,
      };
      const { history, index } = pushHistory(state.history, state.historyIndex, slice);
      return {
        ...state,
        counters: nextCounters,
        history,
        historyIndex: index,
      };
    }
    case 'AUTO_SORT_STEP': {
      // Find first counter not sorted
      const targetIdx = state.counters.findIndex(c => c.dockState === 'slot');
      if (targetIdx === -1) return state;

      const counter = state.counters[targetIdx];
      const targets = generateDragTargets(state.digits);

      // Determine correct destination Group A or B
      const dockState: 'slot' | 'groupA' | 'groupB' = counter.power % 2 === 0 ? 'groupA' : 'groupB';
      const availableTargets = targets.filter(t => t.type === dockState);
      
      // Find occupied counts
      const occupiedCount = state.counters.filter(c => c.dockState === dockState).length;
      const targetPos = availableTargets[occupiedCount] || { x: 100, y: 150 };

      const nextCounters = state.counters.map((c, i) =>
        i === targetIdx
          ? {
              ...c,
              x: targetPos.x,
              y: targetPos.y,
              dockState,
            }
          : c
      );

      const slice: StateSlice = {
        digits: state.digits,
        proofState: state.proofState,
        counters: nextCounters,
      };
      const { history, index } = pushHistory(state.history, state.historyIndex, slice);

      return {
        ...state,
        counters: nextCounters,
        animationStep: state.animationStep + 1,
        history,
        historyIndex: index,
      };
    }
    case 'UNDO': {
      if (state.historyIndex <= 0) return state;
      const idx = state.historyIndex - 1;
      const slice = state.history[idx];
      return {
        ...state,
        digits: slice.digits,
        proofState: slice.proofState,
        counters: slice.counters,
        historyIndex: idx,
      };
    }
    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      const idx = state.historyIndex + 1;
      const slice = state.history[idx];
      return {
        ...state,
        digits: slice.digits,
        proofState: slice.proofState,
        counters: slice.counters,
        historyIndex: idx,
      };
    }
    case 'RESET': {
      const slice: StateSlice = {
        digits: state.digits,
        proofState: 'inspect',
        counters: getInitialCounters(state.digits),
      };
      return {
        ...state,
        proofState: 'inspect',
        counters: slice.counters,
        predictionAnswer: '',
        predictionChecked: false,
        challengeChoice: '',
        challengeChecked: false,
        challengeCorrect: false,
        misconceptionSelected: '',
        misconceptionChecked: false,
        misconceptionFeedback: null,
        isPlaying: false,
        animationStep: 0,
        history: [slice],
        historyIndex: 0,
      };
    }
    case 'SET_HINT': {
      return { ...state, hintLevel: action.payload };
    }
    case 'SET_PREDICTION': {
      return { ...state, predictionAnswer: action.payload, predictionChecked: false };
    }
    case 'CHECK_PREDICTION': {
      // 5728641 is not divisible by 11. Sum_A - Sum_B = 18 - 13 = 5. Not divisible.
      // So prediction answer is 'no'.
      return { ...state, predictionChecked: true };
    }
    case 'SET_CHALLENGE': {
      return { ...state, challengeChoice: action.payload, challengeChecked: false };
    }
    case 'CHECK_CHALLENGE': {
      // Correct choice is one that is divisible by 11.
      // 121 / 11 = 11 (Yes)
      // 572 / 11 = 52 (Yes)
      // 1331 / 11 = 121 (Yes)
      // 24640 / 11 = 2240 (Yes)
      // 10101 / 11 = 918.27 (No)
      const correctList = ['121', '572', '1331', '24640', '987654'];
      const isCorrect = correctList.includes(state.challengeChoice);
      return { ...state, challengeChecked: true, challengeCorrect: isCorrect };
    }
    case 'SET_MISCONCEPTION': {
      return { ...state, misconceptionSelected: action.payload, misconceptionChecked: false, misconceptionFeedback: null };
    }
    case 'CHECK_MISCONCEPTION': {
      let feedback = '';
      if (state.misconceptionSelected === 'always_positive') {
        feedback = 'Incorrect. Powers of 10 alternate signs because 10 ≡ -1 (mod 11), making 10^k alternate between 1 and -1.';
      } else if (state.misconceptionSelected === 'correct') {
        feedback = 'Correct! Alternating sum has the same remainder as the base-10 number because 10 ≡ -1 (mod 11).';
      } else if (state.misconceptionSelected === 'sum_digits') {
        feedback = 'Incorrect. That is the rule for 3 and 9, since 10 ≡ 1 (mod 3 or 9). For 11, it must alternate signs.';
      }
      return {
        ...state,
        misconceptionChecked: true,
        misconceptionFeedback: feedback || 'Please select an option.',
      };
    }
    case 'TOGGLE_PLAY': {
      return { ...state, isPlaying: !state.isPlaying };
    }
    case 'TICK_ANIMATION': {
      const trayIdx = state.counters.findIndex(c => c.dockState === 'slot');
      if (trayIdx === -1) {
        return { ...state, isPlaying: false };
      }
      return divisibilityBy11Reducer(state, { type: 'AUTO_SORT_STEP' });
    }
    case 'SET_ANIMATION_SPEED': {
      return { ...state, animationSpeed: action.payload };
    }
    default:
      return state;
  }
}
