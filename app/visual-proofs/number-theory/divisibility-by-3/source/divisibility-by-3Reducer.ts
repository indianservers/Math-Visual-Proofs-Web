// ─── Divisibility by 3 — Reducer ─────────────────────────────────────────────
import { LIMITS } from './divisibility-by-3Config';
import type { ProofState, LaneName } from './divisibility-by-3Config';
import {
  generateSnapTargets,
  getCounterColor,
  correctRemainderLane,
  digitSum,
} from './divisibility-by-3Math';

// ── State Shapes ──────────────────────────────────────────────────────────────

export interface CounterState {
  id: number;
  /** Digit value this counter represents (always 1 — one unit) */
  val: 1;
  /** Which place-value power this counter started in (0-3) */
  power: number;
  /** Which digit index this counter belongs to (0 = most-significant shown) */
  digitIdx: number;
  /** Current lane the counter is in */
  lane: LaneName;
  /** SVG x coordinate */
  x: number;
  /** SVG y coordinate */
  y: number;
  /** Fill colour */
  color: string;
  /** Whether this counter is selected via keyboard */
  selected: boolean;
}

export interface HistorySlice {
  digits: number[];
  proofState: ProofState;
  counters: CounterState[];
}

export interface Div3State {
  digits: number[];
  proofState: ProofState;
  counters: CounterState[];
  hintLevel: number;
  showRemainders: boolean;

  predictionAnswer: 'yes' | 'no' | 'notsure' | '';
  predictionChecked: boolean;

  misconceptionSelected: string;
  misconceptionChecked: boolean;
  misconceptionFeedback: string | null;

  challengeInput: string;
  challengeChecked: boolean;
  challengeResult: string | null;

  isPlaying: boolean;
  animationSpeed: number;
  animationStep: number;

  visitedStates: Set<ProofState>;

  history: HistorySlice[];
  historyIndex: number;
}

// ── Counter Initialisation ────────────────────────────────────────────────────

/**
 * Build an initial set of counters from digits.
 * Each digit d at power k generates d individual "1-unit" counters.
 * They start in the palette lane, stacked in a 2-column grid.
 */
export function buildInitialCounters(digits: number[]): CounterState[] {
  const counters: CounterState[] = [];
  const targets = generateSnapTargets(digits);
  const palTargets = targets.filter(t => t.lane === 'palette');

  let id = 0;
  for (let digitIdx = 0; digitIdx < digits.length; digitIdx++) {
    const power = digits.length - 1 - digitIdx;
    // We create one counter per digit position (not d counters)
    // The counter represents "digit × place" as a whole block
    const palTarget = palTargets[digitIdx] ?? { x: 60, y: 80 + digitIdx * 36 };
    counters.push({
      id: id++,
      val: 1,
      power,
      digitIdx,
      lane: 'palette',
      x: palTarget.x,
      y: palTarget.y,
      color: getCounterColor('palette'),
      selected: false,
    });
  }
  return counters;
}

// ── Initial State ─────────────────────────────────────────────────────────────

function makeInitialState(digits: number[]): Div3State {
  const counters = buildInitialCounters(digits);
  const slice: HistorySlice = { digits, proofState: 'inspect', counters };
  return {
    digits,
    proofState: 'inspect',
    counters,
    hintLevel: 1,
    showRemainders: false,

    predictionAnswer: '',
    predictionChecked: false,

    misconceptionSelected: '',
    misconceptionChecked: false,
    misconceptionFeedback: null,

    challengeInput: '',
    challengeChecked: false,
    challengeResult: null,

    isPlaying: false,
    animationSpeed: 1.0,
    animationStep: 0,

    visitedStates: new Set(['inspect']),

    history: [slice],
    historyIndex: 0,
  };
}

export function initDiv3State(): Div3State {
  return makeInitialState(LIMITS.defaultDigits);
}

// ── Action Types ──────────────────────────────────────────────────────────────

export type Div3Action =
  | { type: 'SET_DIGITS'; payload: number[] }
  | { type: 'SET_STATE'; payload: ProofState }
  | { type: 'DRAG_COUNTER'; payload: { id: number; x: number; y: number } }
  | { type: 'DOCK_COUNTER'; payload: { id: number; lane: LaneName; x: number; y: number } }
  | { type: 'REJECT_COUNTER'; payload: { id: number } }
  | { type: 'AUTO_STEP' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET' }
  | { type: 'SET_HINT'; payload: number }
  | { type: 'TOGGLE_REMAINDERS' }
  | { type: 'SET_PREDICTION'; payload: 'yes' | 'no' | 'notsure' }
  | { type: 'CHECK_PREDICTION' }
  | { type: 'SET_MISCONCEPTION'; payload: string }
  | { type: 'CHECK_MISCONCEPTION' }
  | { type: 'SET_CHALLENGE_INPUT'; payload: string }
  | { type: 'CHECK_CHALLENGE' }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'TICK_ANIMATION' }
  | { type: 'SET_ANIMATION_SPEED'; payload: number }
  | { type: 'SELECT_COUNTER'; payload: number | null }
  | { type: 'KEYBOARD_MOVE'; payload: { id: number; dx: number; dy: number } };

// ── History Helpers ───────────────────────────────────────────────────────────

function pushHistory(
  history: HistorySlice[],
  index: number,
  slice: HistorySlice,
): { history: HistorySlice[]; index: number } {
  const next = history.slice(0, index + 1);
  next.push(slice);
  // Cap history at 50 entries to avoid unbounded growth
  const trimmed = next.slice(-50);
  return { history: trimmed, index: trimmed.length - 1 };
}

// ── Reducer ───────────────────────────────────────────────────────────────────

export function div3Reducer(state: Div3State, action: Div3Action): Div3State {
  switch (action.type) {

    case 'SET_DIGITS': {
      const digits = action.payload.slice(0, LIMITS.maxDigits);
      const counters = buildInitialCounters(digits);
      const slice: HistorySlice = { digits, proofState: state.proofState, counters };
      const { history, index } = pushHistory(state.history, state.historyIndex, slice);
      return {
        ...state,
        digits,
        counters,
        history,
        historyIndex: index,
        animationStep: 0,
        predictionChecked: false,
        predictionAnswer: '',
      };
    }

    case 'SET_STATE': {
      const next = action.payload;
      const slice: HistorySlice = { digits: state.digits, proofState: next, counters: state.counters };
      const { history, index } = pushHistory(state.history, state.historyIndex, slice);
      return {
        ...state,
        proofState: next,
        visitedStates: new Set([...state.visitedStates, next]),
        history,
        historyIndex: index,
      };
    }

    case 'DRAG_COUNTER': {
      // Only update x/y — no history entry (drag is transient)
      return {
        ...state,
        counters: state.counters.map(c =>
          c.id === action.payload.id
            ? { ...c, x: action.payload.x, y: action.payload.y }
            : c,
        ),
      };
    }

    case 'DOCK_COUNTER': {
      const { id, lane, x, y } = action.payload;
      const color = getCounterColor(lane);
      const nextCounters = state.counters.map(c =>
        c.id === id ? { ...c, lane, x, y, color } : c,
      );

      // Advance proof state if first dock into a column
      let nextProofState = state.proofState;
      const target = nextCounters.find(c => c.id === id);
      if (
        target &&
        ['thousands', 'hundreds', 'tens', 'ones'].includes(target.lane) &&
        state.proofState === 'inspect'
      ) {
        nextProofState = 'manipulate';
      }
      // Advance to 'connect' when a counter reaches a remainder lane
      if (
        target &&
        target.lane.startsWith('rem') &&
        (state.proofState === 'manipulate' || state.proofState === 'preserve')
      ) {
        nextProofState = 'connect';
      }

      const slice: HistorySlice = { digits: state.digits, proofState: nextProofState, counters: nextCounters };
      const { history, index } = pushHistory(state.history, state.historyIndex, slice);

      return {
        ...state,
        counters: nextCounters,
        proofState: nextProofState,
        visitedStates: new Set([...state.visitedStates, nextProofState]),
        history,
        historyIndex: index,
      };
    }

    case 'REJECT_COUNTER': {
      // Snap counter back to its original position (find palette slot)
      const counter = state.counters.find(c => c.id === action.payload.id);
      if (!counter) return state;

      const targets = generateSnapTargets(state.digits);
      const palTarget = targets.find(t => t.lane === 'palette' && t.slotIdx === counter.digitIdx);
      const origLane: LaneName = counter.lane;

      return {
        ...state,
        counters: state.counters.map(c =>
          c.id === action.payload.id
            ? {
                ...c,
                lane: origLane,
                x: palTarget?.x ?? c.x,
                y: palTarget?.y ?? c.y,
              }
            : c,
        ),
      };
    }

    case 'AUTO_STEP': {
      // Find the first counter not yet in a column — put it in its place-value column
      const firstInPalette = state.counters.find(c => c.lane === 'palette');
      if (firstInPalette) {
        // Move to the corresponding column
        const colName = (['ones', 'tens', 'hundreds', 'thousands'] as LaneName[])[firstInPalette.power] as LaneName;
        const targets = generateSnapTargets(state.digits);
        const colTargets = targets.filter(t => t.lane === colName);
        const occupiedCount = state.counters.filter(c => c.lane === colName).length;
        const tgt = colTargets[occupiedCount] ?? colTargets[0] ?? { x: 400, y: 120 };

        return div3Reducer(state, {
          type: 'DOCK_COUNTER',
          payload: { id: firstInPalette.id, lane: colName, x: tgt.x, y: tgt.y },
        });
      }

      // Otherwise, find first counter in a column not yet in a remainder lane
      const firstInCol = state.counters.find(
        c => ['thousands', 'hundreds', 'tens', 'ones'].includes(c.lane),
      );
      if (firstInCol) {
        const remLane = correctRemainderLane(firstInCol.power);
        const targets = generateSnapTargets(state.digits);
        const remTargets = targets.filter(t => t.lane === remLane);
        const occupiedCount = state.counters.filter(c => c.lane === remLane).length;
        const tgt = remTargets[occupiedCount] ?? remTargets[0] ?? { x: 350, y: 310 };

        return div3Reducer(state, {
          type: 'DOCK_COUNTER',
          payload: { id: firstInCol.id, lane: remLane, x: tgt.x, y: tgt.y },
        });
      }

      return { ...state, isPlaying: false };
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
      const counters = buildInitialCounters(state.digits);
      const slice: HistorySlice = { digits: state.digits, proofState: 'inspect', counters };
      return {
        ...state,
        proofState: 'inspect',
        counters,
        predictionAnswer: '',
        predictionChecked: false,
        misconceptionSelected: '',
        misconceptionChecked: false,
        misconceptionFeedback: null,
        challengeInput: '',
        challengeChecked: false,
        challengeResult: null,
        isPlaying: false,
        animationStep: 0,
        visitedStates: new Set(['inspect']),
        history: [slice],
        historyIndex: 0,
      };
    }

    case 'SET_HINT':
      return { ...state, hintLevel: Math.max(1, Math.min(5, action.payload)) };

    case 'TOGGLE_REMAINDERS':
      return { ...state, showRemainders: !state.showRemainders };

    case 'SET_PREDICTION':
      return { ...state, predictionAnswer: action.payload, predictionChecked: false };

    case 'CHECK_PREDICTION': {
      // Advance to conclude regardless of correctness — learner sees the result
      const nextPS: ProofState = 'conclude';
      return {
        ...state,
        predictionChecked: true,
        proofState: nextPS,
        visitedStates: new Set([...state.visitedStates, nextPS]),
      };
    }

    case 'SET_MISCONCEPTION':
      return { ...state, misconceptionSelected: action.payload, misconceptionChecked: false, misconceptionFeedback: null };

    case 'CHECK_MISCONCEPTION': {
      let feedback = '';
      if (state.misconceptionSelected === 'sum_wrong') {
        feedback = '✘ Incorrect. The digit sum does NOT equal the number — it only equals the number\'s REMAINDER mod 3. For example, 4721 has digit sum 14, not 4721. The rule works because 10 ≡ 1 (mod 3), which makes every place-value weight equal to 1 in mod-3 arithmetic.';
      } else if (state.misconceptionSelected === 'correct') {
        feedback = '✔ Correct! The whole argument rests on 10 ≡ 1 (mod 3). Since 10 ≡ 1, we have 10^k ≡ 1^k = 1 for every k. For 7: 10 ≡ 3 (mod 7), which is not 1, so the digit-sum rule does not extend to divisibility by 7.';
      } else if (state.misconceptionSelected === 'same_as_9') {
        feedback = '✘ Incorrect. The digit-sum rule does work for 9 (also because 10 ≡ 1 mod 9), but it fails for 7 (10 ≡ 3 mod 7, not 1) and many other primes. The rule is NOT universal to all primes — only those p where 10 ≡ 1 (mod p).';
      } else {
        feedback = 'Please select an option above.';
      }
      return { ...state, misconceptionChecked: true, misconceptionFeedback: feedback };
    }

    case 'SET_CHALLENGE_INPUT':
      return { ...state, challengeInput: action.payload, challengeChecked: false, challengeResult: null };

    case 'CHECK_CHALLENGE': {
      const n = parseInt(state.challengeInput, 10);
      if (isNaN(n) || n <= 0) {
        return { ...state, challengeChecked: true, challengeResult: 'Please enter a valid positive integer.' };
      }
      const digs = String(n).split('').map(Number);
      const ds = digitSum(digs);
      const nMod = n % 3;
      const dsMod = ds % 3;
      const divisible = nMod === 0;
      const result = divisible
        ? `✔ ${n} is divisible by 3. Digit sum = ${ds} ≡ ${dsMod} (mod 3).`
        : `✘ ${n} is not divisible by 3. Digit sum = ${ds} ≡ ${dsMod} (mod 3). Both remainders match: ${nMod} ≡ ${dsMod}.`;
      // Advance to transfer
      return {
        ...state,
        challengeChecked: true,
        challengeResult: result,
        proofState: 'transfer',
        visitedStates: new Set([...state.visitedStates, 'transfer' as ProofState]),
      };
    }

    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };

    case 'TICK_ANIMATION': {
      // Check if all counters are in remainder lanes already
      const allDone = state.counters.every(c => c.lane.startsWith('rem'));
      if (allDone) return { ...state, isPlaying: false };
      return div3Reducer({ ...state, animationStep: state.animationStep + 1 }, { type: 'AUTO_STEP' });
    }

    case 'SET_ANIMATION_SPEED':
      return { ...state, animationSpeed: action.payload };

    case 'SELECT_COUNTER':
      return {
        ...state,
        counters: state.counters.map(c => ({ ...c, selected: c.id === action.payload })),
      };

    case 'KEYBOARD_MOVE': {
      const { id, dx, dy } = action.payload;
      return {
        ...state,
        counters: state.counters.map(c =>
          c.id === id ? { ...c, x: c.x + dx, y: c.y + dy } : c,
        ),
      };
    }

    default:
      return state;
  }
}
