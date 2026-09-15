// ─── Divisibility by 9 — State Reducer ────────────────────────────────────────────
import { LIMITS, type LaneName } from './divisibility-by-9Config';
import {
  generateSnapTargets, isCompatible, VIEW_W, getRemainderLaneLayouts
} from './divisibility-by-9Math';

// ── Types ─────────────────────────────────────────────────────────────────────────────

export interface CounterState {
  id: number;
  /** Which place-value column this counter represents (0=ones … 5=hundredThousands) */
  power: number;
  /** Which digit this counter carries (the actual digit value) */
  digit: number;
  /** Current lane */
  lane: LaneName;
  /** Current SVG position */
  x: number;
  y: number;
  /** Is it being dragged right now? */
  isDragging: boolean;
}

export interface Div9State {
  digits: number[];            // MSB first, e.g. [2,2,5,3,7,4]
  counters: CounterState[];    // one counter per digit
  // tray state
  trayCounterIds: number[];    // counter IDs currently in the tray
  // token dragging (N and S blocks)
  nTokenLane: LaneName | null; // which rem lane holds N token
  sTokenLane: LaneName | null; // which rem lane holds S token
  nTokenX: number;
  nTokenY: number;
  sTokenX: number;
  sTokenY: number;
  isDraggingNToken: boolean;
  isDraggingSToken: boolean;
  // proof progress
  showTray: boolean;
  showRemainderLanes: boolean;
  proofState: import('./divisibility-by-9Config').ProofState;
  // hint / misconception
  hintLevel: number;
  misconceptionSelected: string | null;
  misconceptionChecked: boolean;
  misconceptionFeedback: string | null;
  // challenge
  challengeInput: string;
  challengeChecked: boolean;
  challengeResult: string | null;
  // animation
  isPlaying: boolean;
  animationStep: number;
  animationSpeed: number;
  // history
  past: Div9Snapshot[];
  future: Div9Snapshot[];
}

interface Div9Snapshot {
  digits: number[];
  counters: CounterState[];
  trayCounterIds: number[];
  nTokenLane: LaneName | null;
  sTokenLane: LaneName | null;
  nTokenX: number;
  nTokenY: number;
  sTokenX: number;
  sTokenY: number;
  showTray: boolean;
  showRemainderLanes: boolean;
  proofState: import('./divisibility-by-9Config').ProofState;
}

export type Div9Action =
  | { type: 'SET_DIGITS'; payload: number[] }
  | { type: 'RESET' }
  | { type: 'START_DRAG_COUNTER'; payload: { id: number; x: number; y: number } }
  | { type: 'MOVE_DRAG_COUNTER'; payload: { x: number; y: number } }
  | { type: 'END_DRAG_COUNTER'; payload: { x: number; y: number } }
  | { type: 'START_DRAG_N_TOKEN'; payload: { x: number; y: number } }
  | { type: 'MOVE_DRAG_N_TOKEN'; payload: { x: number; y: number } }
  | { type: 'END_DRAG_N_TOKEN'; payload: { x: number; y: number } }
  | { type: 'START_DRAG_S_TOKEN'; payload: { x: number; y: number } }
  | { type: 'MOVE_DRAG_S_TOKEN'; payload: { x: number; y: number } }
  | { type: 'END_DRAG_S_TOKEN'; payload: { x: number; y: number } }
  | { type: 'TICK_ANIMATION' }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_SPEED'; payload: number }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_HINT_LEVEL'; payload: number }
  | { type: 'SELECT_MISCONCEPTION'; payload: string }
  | { type: 'CHECK_MISCONCEPTION' }
  | { type: 'SET_CHALLENGE_INPUT'; payload: string }
  | { type: 'CHECK_CHALLENGE' };

// ── Initial state helpers ─────────────────────────────────────────────────────────────────

function buildCounters(digits: number[]): CounterState[] {
  const snapTargets = generateSnapTargets(digits);
  return digits.map((digit, i) => {
    const power = digits.length - 1 - i;
    // Find the first slot in this column
    const colNames: Record<number, LaneName> = {
      5: 'hundredThousands',
      4: 'tenThousands',
      3: 'thousands',
      2: 'hundreds',
      1: 'tens',
      0: 'ones',
    };
    const laneName = colNames[power] ?? 'ones';
    const target = snapTargets.find(t => t.lane === laneName && t.slotIdx === 0);
    return {
      id: i,
      power,
      digit,
      lane: laneName,
      x: target?.x ?? 200 + i * 40,
      y: target?.y ?? 80,
      isDragging: false,
    };
  });
}

const DEFAULT_DIGITS = [2, 2, 5, 3, 7, 4];

const TOKEN_HOME_N = { x: VIEW_W - 60, y: 310 };
const TOKEN_HOME_S = { x: VIEW_W - 60, y: 360 };

export function initDiv9State(): Div9State {
  const digits  = DEFAULT_DIGITS;
  const counters = buildCounters(digits);
  return {
    digits,
    counters,
    trayCounterIds: [],
    nTokenLane: null,
    sTokenLane: null,
    nTokenX: TOKEN_HOME_N.x,
    nTokenY: TOKEN_HOME_N.y,
    sTokenX: TOKEN_HOME_S.x,
    sTokenY: TOKEN_HOME_S.y,
    isDraggingNToken: false,
    isDraggingSToken: false,
    showTray: true,
    showRemainderLanes: true,
    proofState: 'inspect',
    hintLevel: 0,
    misconceptionSelected: null,
    misconceptionChecked: false,
    misconceptionFeedback: null,
    challengeInput: '',
    challengeChecked: false,
    challengeResult: null,
    isPlaying: false,
    animationStep: 0,
    animationSpeed: 1,
    past: [],
    future: [],
  };
}

// ── Snapshot helpers ────────────────────────────────────────────────────────────────────

function snapshot(s: Div9State): Div9Snapshot {
  return {
    digits: [...s.digits],
    counters: s.counters.map(c => ({ ...c })),
    trayCounterIds: [...s.trayCounterIds],
    nTokenLane: s.nTokenLane,
    sTokenLane: s.sTokenLane,
    nTokenX: s.nTokenX,
    nTokenY: s.nTokenY,
    sTokenX: s.sTokenX,
    sTokenY: s.sTokenY,
    showTray: s.showTray,
    showRemainderLanes: s.showRemainderLanes,
    proofState: s.proofState,
  };
}

function restore(s: Div9State, snap: Div9Snapshot): Div9State {
  return {
    ...s,
    ...snap,
    counters: snap.counters.map(c => ({ ...c, isDragging: false })),
  };
}

// ── Snap helpers ────────────────────────────────────────────────────────────────────────────────

function findSnap(
  snapTargets: ReturnType<typeof generateSnapTargets>,
  x: number,
  y: number,
  threshold: number,
) {
  let best: (typeof snapTargets)[number] | null = null;
  let bestDist = Infinity;
  for (const t of snapTargets) {
    const d = Math.hypot(t.x - x, t.y - y);
    if (d < threshold && d < bestDist) {
      bestDist = d;
      best = t;
    }
  }
  return best;
}

function findRemSnap(x: number, y: number, threshold: number, remLayouts: { name: LaneName; cardX: number; cardY: number; cardW: number; cardH: number }[]) {
  for (const rl of remLayouts) {
    if (
      x >= rl.cardX && x <= rl.cardX + rl.cardW &&
      y >= rl.cardY && y <= rl.cardY + rl.cardH
    ) {
      return rl.name;
    }
  }
  // also try euclidean
  let best: LaneName | null = null;
  let bestDist = Infinity;
  for (const rl of remLayouts) {
    const cx = rl.cardX + rl.cardW / 2;
    const cy = rl.cardY + rl.cardH / 2;
    const d = Math.hypot(cx - x, cy - y);
    if (d < threshold * 3 && d < bestDist) {
      bestDist = d;
      best = rl.name;
    }
  }
  return best;
}

// ── Reducer ───────────────────────────────────────────────────────────────────────────────────

export function div9Reducer(state: Div9State, action: Div9Action): Div9State {
  switch (action.type) {

    case 'SET_DIGITS': {
      const digits = action.payload.slice(0, LIMITS.maxDigits);
      const counters = buildCounters(digits);
      return {
        ...initDiv9State(),
        digits,
        counters,
      };
    }

    case 'RESET':
      return initDiv9State();

    // ── Counter dragging ───────────────────────────────────────────────────────────────────────────

    case 'START_DRAG_COUNTER': {
      const { id, x, y } = action.payload;
      return {
        ...state,
        counters: state.counters.map(c =>
          c.id === id ? { ...c, isDragging: true, x, y } : c,
        ),
        future: [],
        past: state.past.slice(-LIMITS.maxHistory),
      };
    }

    case 'MOVE_DRAG_COUNTER': {
      const { x, y } = action.payload;
      return {
        ...state,
        counters: state.counters.map(c =>
          c.isDragging ? { ...c, x, y } : c,
        ),
      };
    }

    case 'END_DRAG_COUNTER': {
      const dragging = state.counters.find(c => c.isDragging);
      if (!dragging) return { ...state, counters: state.counters.map(c => ({ ...c, isDragging: false })) };

      const snapTargets = generateSnapTargets(state.digits);
      const snap = findSnap(snapTargets, action.payload.x, action.payload.y, LIMITS.snapThreshold);

      // Check compatibility
      const compatible = snap && isCompatible(dragging.lane, snap.lane);

      if (!compatible || !snap) {
        // Return counter to its home position
        const homeTarget = snapTargets.find(t =>
          t.lane === dragging.lane && t.slotIdx === 0,
        );
        return {
          ...state,
          counters: state.counters.map(c =>
            c.isDragging
              ? { ...c, isDragging: false, x: homeTarget?.x ?? c.x, y: homeTarget?.y ?? c.y }
              : c,
          ),
        };
      }

      // Record history
      const newPast = [...state.past, snapshot(state)].slice(-LIMITS.maxHistory);

      const newLane = snap.lane;
      const inTray  = newLane === 'tray';
      const wasTray = dragging.lane === 'tray';

      const newTrayIds = inTray
        ? Array.from(new Set([...state.trayCounterIds, dragging.id]))
        : wasTray
        ? state.trayCounterIds.filter(id => id !== dragging.id)
        : state.trayCounterIds;

      // Advance proof state
      let proofState = state.proofState;
      if (inTray && state.proofState === 'inspect') proofState = 'manipulate';
      const willAllBeInTray = newTrayIds.length === state.digits.length;
      if (willAllBeInTray && proofState === 'manipulate') proofState = 'preserve';

      return {
        ...state,
        past: newPast,
        future: [],
        trayCounterIds: newTrayIds,
        proofState,
        counters: state.counters.map(c =>
          c.isDragging
            ? { ...c, isDragging: false, lane: newLane, x: snap.x, y: snap.y }
            : c,
        ),
      };
    }

    // ── N Token dragging ───────────────────────────────────────────────────────────────────────────

    case 'START_DRAG_N_TOKEN':
      return {
        ...state,
        isDraggingNToken: true,
        nTokenX: action.payload.x,
        nTokenY: action.payload.y,
        past: [...state.past, snapshot(state)].slice(-LIMITS.maxHistory),
        future: [],
      };

    case 'MOVE_DRAG_N_TOKEN':
      return {
        ...state,
        nTokenX: action.payload.x,
        nTokenY: action.payload.y,
      };

    case 'END_DRAG_N_TOKEN': {
      const remLayouts = getRemainderLaneLayouts();
      const snapped = findRemSnap(action.payload.x, action.payload.y, LIMITS.snapThreshold, remLayouts);
      const lane = snapped ?? state.nTokenLane;
      const rl = lane ? remLayouts.find((r: RemainderLaneLayout) => r.name === lane) : null;
      let proofState = state.proofState;
      if (lane && state.sTokenLane && proofState === 'connect') proofState = 'conclude';
      if (lane && !state.sTokenLane && proofState === 'preserve') proofState = 'connect';
      return {
        ...state,
        isDraggingNToken: false,
        nTokenLane: lane,
        nTokenX: rl ? rl.cardX + rl.cardW / 2 - 14 : state.nTokenX,
        nTokenY: rl ? rl.cardY + 70 : state.nTokenY,
        proofState,
      };
    }

    // ── S Token dragging ───────────────────────────────────────────────────────────────────────────

    case 'START_DRAG_S_TOKEN':
      return {
        ...state,
        isDraggingSToken: true,
        sTokenX: action.payload.x,
        sTokenY: action.payload.y,
        past: [...state.past, snapshot(state)].slice(-LIMITS.maxHistory),
        future: [],
      };

    case 'MOVE_DRAG_S_TOKEN':
      return {
        ...state,
        sTokenX: action.payload.x,
        sTokenY: action.payload.y,
      };

    case 'END_DRAG_S_TOKEN': {
      const remLayouts = getRemainderLaneLayouts();
      const snapped = findRemSnap(action.payload.x, action.payload.y, LIMITS.snapThreshold, remLayouts);
      const lane = snapped ?? state.sTokenLane;
      const rl = lane ? remLayouts.find((r: RemainderLaneLayout) => r.name === lane) : null;
      let proofState = state.proofState;
      if (lane && state.nTokenLane && proofState === 'connect') proofState = 'conclude';
      if (lane && !state.nTokenLane && proofState === 'preserve') proofState = 'connect';
      return {
        ...state,
        isDraggingSToken: false,
        sTokenLane: lane,
        sTokenX: rl ? rl.cardX + rl.cardW / 2 + 14 : state.sTokenX,
        sTokenY: rl ? rl.cardY + 70 : state.sTokenY,
        proofState,
      };
    }

    // ── Animation ─────────────────────────────────────────────────────────────────────────────────

    case 'TICK_ANIMATION': {
      if (!state.isPlaying) return state;
      const totalCounters = state.digits.length;
      const step = state.animationStep;
      if (step < totalCounters) {
        // Move counter at step into tray
        const counter = state.counters[step];
        if (!counter) return { ...state, animationStep: step + 1 };
        const snapTargets = generateSnapTargets(state.digits);
        const traySlot = snapTargets.find(t => t.lane === 'tray' && t.slotIdx === step);
        const newTrayIds = Array.from(new Set([...state.trayCounterIds, counter.id]));
        const willAllBeInTray = newTrayIds.length === totalCounters;
        let proofState = state.proofState;
        if (proofState === 'inspect') proofState = 'manipulate';
        if (willAllBeInTray && proofState === 'manipulate') proofState = 'preserve';
        return {
          ...state,
          animationStep: step + 1,
          trayCounterIds: newTrayIds,
          proofState,
          counters: state.counters.map(c =>
            c.id === counter.id
              ? { ...c, lane: 'tray', x: traySlot?.x ?? c.x, y: traySlot?.y ?? c.y }
              : c,
          ),
        };
      }
      return { ...state, isPlaying: false };
    }

    case 'SET_PLAYING':
      return {
        ...state,
        isPlaying: action.payload,
        animationStep: action.payload ? 0 : state.animationStep,
      };

    case 'SET_SPEED':
      return { ...state, animationSpeed: action.payload };

    // ── History ─────────────────────────────────────────────────────────────────────────────────────

    case 'UNDO': {
      const prev = state.past[state.past.length - 1];
      if (!prev) return state;
      return restore({
        ...state,
        past: state.past.slice(0, -1),
        future: [snapshot(state), ...state.future].slice(0, LIMITS.maxHistory),
      }, prev);
    }

    case 'REDO': {
      const next = state.future[0];
      if (!next) return state;
      return restore({
        ...state,
        past: [...state.past, snapshot(state)].slice(-LIMITS.maxHistory),
        future: state.future.slice(1),
      }, next);
    }

    // ── Hint ─────────────────────────────────────────────────────────────────────────────────────────

    case 'SET_HINT_LEVEL':
      return { ...state, hintLevel: action.payload };

    // ── Misconception ───────────────────────────────────────────────────────────────────────────────

    case 'SELECT_MISCONCEPTION':
      return { ...state, misconceptionSelected: action.payload, misconceptionChecked: false, misconceptionFeedback: null };

    case 'CHECK_MISCONCEPTION': {
      let feedback = '';
      if (state.misconceptionSelected === 'works_for_all') {
        feedback = '✘ Incorrect. The digit-sum rule does NOT work for every divisor. It works for 9 specifically because 10 ≡ 1 (mod 9). For 7: 10 ≡ 3 (mod 7), which is not 1, so no simple digit-sum rule applies.';
      } else if (state.misconceptionSelected === 'correct') {
        feedback = '✔ Correct! 10 ≡ 1 (mod 9) is the key. Every power of 10 therefore ≡ 1 (mod 9). So N = Σ dᵢ·10ⁱ ≡ Σ dᵢ·1 = digit sum (mod 9).';
      } else if (state.misconceptionSelected === 'digit_sum_equals') {
        feedback = '\u2718 Incorrect. The digit sum is not equal to the original number \u2014 it equals the number\'s REMAINDER mod 9 (in general). For example, 225374 and its digit sum 23 are different numbers, but they share the same remainder when divided by 9.';
      } else {
        feedback = 'Please select an option.';
      }
      return { ...state, misconceptionChecked: true, misconceptionFeedback: feedback };
    }

    // \u2500\u2500 Challenge \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

    case 'SET_CHALLENGE_INPUT':
      return { ...state, challengeInput: action.payload, challengeChecked: false, challengeResult: null };

    case 'CHECK_CHALLENGE': {
      const n = parseInt(state.challengeInput, 10);
      if (isNaN(n) || n < 100000 || n > 999999) {
        return { ...state, challengeChecked: true, challengeResult: '\u26a0\ufe0f Enter a 6-digit number.' };
      }
      const digits = String(n).split('').map(Number);
      const ds = digits.reduce((a, b) => a + b, 0);
      const nMod = n % 9;
      const sMod = ds % 9;
      const agree = nMod === sMod;
      const result = agree
        ? '\u2714 N mod 9 = ' + nMod + ', digit sum ' + ds + ' mod 9 = ' + sMod + '. They match! The rule holds.'
        : '\u2718 Something went wrong: N mod 9 = ' + nMod + ' but digit sum mod 9 = ' + sMod + '. (This should never happen.)';
      return { ...state, challengeChecked: true, challengeResult: result };
    }

    default:
      return state;
  }
}

// Fix: type for RemainderLaneLayout (local alias to avoid circular import)
interface RemainderLaneLayout {
  name: LaneName;
  cardX: number;
  cardY: number;
  cardW: number;
  cardH: number;
}
