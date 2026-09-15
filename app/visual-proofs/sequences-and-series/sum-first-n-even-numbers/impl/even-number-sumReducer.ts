// ─── Sum of First n Even Numbers — Reducer ───────────────────────────────────
import { DEFAULT_N, LIMITS, type ProofState } from './even-number-sumConfig';
import { clampN, getRowLayouts } from './even-number-sumMath';

export type ToolName = 'select' | 'row' | 'erase';

export interface RowState {
  i: number;
  x: number;
  y: number;
  docked: boolean;
  selected: boolean;
}

export interface EnsSnapshot {
  n: number;
  rows: RowState[];
  proofState: ProofState;
  snapEnabled: boolean;
  showHints: boolean;
  generalStepAccepted: boolean;
}

export interface EnsState {
  n: number;
  rows: RowState[];
  draggingId: number | null;
  tool: ToolName;
  snapEnabled: boolean;
  showHints: boolean;
  proofState: ProofState;
  visitedStates: Set<ProofState>;
  hintLevel: number;
  hintUsedMax: number;
  predictionAnswer: 'yes' | 'no' | 'notsure' | null;
  predictionChecked: boolean;
  misconceptionSelected: string | null;
  misconceptionChecked: boolean;
  misconceptionFeedback: string | null;
  generalStepAccepted: boolean;
  challengeN: string;
  challengeWidth: string;
  challengeHeight: string;
  challengeChecked: boolean;
  challengeResult: string | null;
  transferPassed: boolean;
  isPlaying: boolean;
  animationSpeed: number;
  history: EnsSnapshot[];
  historyIndex: number;
}

export type EnsAction =
  | { type: 'SET_N'; payload: number }
  | { type: 'RESET' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_TOOL'; payload: ToolName }
  | { type: 'TOGGLE_SNAP' }
  | { type: 'TOGGLE_HINTS' }
  | { type: 'SET_STATE'; payload: ProofState }
  | { type: 'SELECT_ROW'; payload: number | null }
  | { type: 'START_DRAG'; payload: { i: number; x: number; y: number } }
  | { type: 'DRAG_ROW'; payload: { x: number; y: number } }
  | { type: 'DOCK_ROW'; payload: { i: number; x: number; y: number } }
  | { type: 'REJECT_ROW'; payload: { i: number } }
  | { type: 'UNDOCK_ROW'; payload: number }
  | { type: 'KEYBOARD_MOVE'; payload: { i: number; dx: number; dy: number } }
  | { type: 'SET_HINT'; payload: number }
  | { type: 'SET_PREDICTION'; payload: 'yes' | 'no' | 'notsure' }
  | { type: 'CHECK_PREDICTION' }
  | { type: 'SET_MISCONCEPTION'; payload: string }
  | { type: 'CHECK_MISCONCEPTION' }
  | { type: 'ACCEPT_GENERAL' }
  | { type: 'SET_CHALLENGE_N'; payload: string }
  | { type: 'SET_CHALLENGE_WIDTH'; payload: string }
  | { type: 'SET_CHALLENGE_HEIGHT'; payload: string }
  | { type: 'CHECK_CHALLENGE' }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'SET_ANIMATION_SPEED'; payload: number }
  | { type: 'AUTO_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'TICK_ANIMATION' };

function homeRows(n: number): RowState[] {
  return getRowLayouts(n).map((r) => ({
    i: r.i,
    x: r.homeCentroid.x,
    y: r.homeCentroid.y,
    docked: false,
    selected: false,
  }));
}

function snapshotOf(state: EnsState): EnsSnapshot {
  return {
    n: state.n,
    rows: state.rows.map((r) => ({ ...r, selected: false })),
    proofState: state.proofState,
    snapEnabled: state.snapEnabled,
    showHints: state.showHints,
    generalStepAccepted: state.generalStepAccepted,
  };
}

function pushHistory(state: EnsState): EnsState {
  const prev = state.history.slice(0, state.historyIndex + 1);
  prev.push(snapshotOf(state));
  if (prev.length > LIMITS.maxHistory) prev.shift();
  return { ...state, history: prev, historyIndex: prev.length - 1 };
}

function applySnapshot(state: EnsState, snap: EnsSnapshot): EnsState {
  return {
    ...state,
    n: snap.n,
    rows: snap.rows.map((r) => ({ ...r })),
    proofState: snap.proofState,
    snapEnabled: snap.snapEnabled,
    showHints: snap.showHints,
    generalStepAccepted: snap.generalStepAccepted,
    draggingId: null,
    isPlaying: false,
  };
}

function visit(state: EnsState, st: ProofState): EnsState {
  const visitedStates = new Set(state.visitedStates);
  visitedStates.add(st);
  return { ...state, proofState: st, visitedStates };
}

function maybeAdvance(state: EnsState): EnsState {
  const docked = state.rows.filter((r) => r.docked).length;
  if (docked === 0) return state;
  let next = state;
  if (state.proofState === 'inspect') next = visit(next, 'manipulate');
  if (docked >= 1 && ['inspect', 'manipulate'].includes(next.proofState)) {
    next = visit(next, 'preserve');
  }
  if (docked === next.n) {
    next = visit(next, 'connect');
    if (next.generalStepAccepted) next = visit(next, 'conclude');
    if (next.transferPassed) next = visit(next, 'transfer');
  }
  return next;
}

export function initEnsState(): EnsState {
  const n = DEFAULT_N;
  const rows = homeRows(n);
  const base: EnsState = {
    n,
    rows,
    draggingId: null,
    tool: 'select',
    snapEnabled: true,
    showHints: false,
    proofState: 'inspect',
    visitedStates: new Set(['inspect']),
    hintLevel: 1,
    hintUsedMax: 1,
    predictionAnswer: null,
    predictionChecked: false,
    misconceptionSelected: null,
    misconceptionChecked: false,
    misconceptionFeedback: null,
    generalStepAccepted: false,
    challengeN: '6',
    challengeWidth: '',
    challengeHeight: '',
    challengeChecked: false,
    challengeResult: null,
    transferPassed: false,
    isPlaying: false,
    animationSpeed: 1,
    history: [],
    historyIndex: -1,
  };
  return { ...base, history: [snapshotOf(base)], historyIndex: 0 };
}

export function ensReducer(state: EnsState, action: EnsAction): EnsState {
  switch (action.type) {
    case 'SET_N': {
      const n = clampN(action.payload);
      if (n === state.n) return state;
      const next = pushHistory({
        ...state,
        n,
        rows: homeRows(n),
        draggingId: null,
        predictionChecked: false,
        predictionAnswer: null,
        generalStepAccepted: false,
        isPlaying: false,
      });
      return visit(next, 'inspect');
    }
    case 'RESET': {
      const next = pushHistory({
        ...state,
        rows: homeRows(state.n),
        draggingId: null,
        proofState: 'inspect',
        predictionAnswer: null,
        predictionChecked: false,
        misconceptionSelected: null,
        misconceptionChecked: false,
        misconceptionFeedback: null,
        generalStepAccepted: false,
        challengeChecked: false,
        challengeResult: null,
        transferPassed: false,
        isPlaying: false,
      });
      return { ...next, visitedStates: new Set(['inspect']) };
    }
    case 'UNDO': {
      if (state.historyIndex <= 0) return state;
      const idx = state.historyIndex - 1;
      return applySnapshot({ ...state, historyIndex: idx }, state.history[idx]);
    }
    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      const idx = state.historyIndex + 1;
      return applySnapshot({ ...state, historyIndex: idx }, state.history[idx]);
    }
    case 'SET_TOOL':
      return { ...state, tool: action.payload };
    case 'TOGGLE_SNAP':
      return { ...state, snapEnabled: !state.snapEnabled };
    case 'TOGGLE_HINTS':
      return { ...state, showHints: !state.showHints };
    case 'SET_STATE':
      return visit(state, action.payload);
    case 'SELECT_ROW':
      return {
        ...state,
        rows: state.rows.map((r) => ({ ...r, selected: r.i === action.payload })),
      };
    case 'START_DRAG': {
      if (state.tool === 'erase') {
        const row = state.rows.find((r) => r.i === action.payload.i);
        if (row?.docked) {
          const layouts = getRowLayouts(state.n);
          const home = layouts.find((l) => l.i === action.payload.i)!;
          return maybeAdvance(pushHistory({
            ...state,
            rows: state.rows.map((r) =>
              r.i === action.payload.i
                ? { ...r, docked: false, x: home.homeCentroid.x, y: home.homeCentroid.y }
                : r,
            ),
          }));
        }
        return state;
      }
      return {
        ...state,
        draggingId: action.payload.i,
        rows: state.rows.map((r) =>
          r.i === action.payload.i
            ? { ...r, x: action.payload.x, y: action.payload.y, selected: true, docked: false }
            : { ...r, selected: false },
        ),
      };
    }
    case 'DRAG_ROW': {
      if (state.draggingId === null) return state;
      const id = state.draggingId;
      return {
        ...state,
        rows: state.rows.map((r) => (r.i === id ? { ...r, x: action.payload.x, y: action.payload.y } : r)),
      };
    }
    case 'DOCK_ROW': {
      const layouts = getRowLayouts(state.n);
      const layout = layouts.find((l) => l.i === action.payload.i);
      if (!layout) return { ...state, draggingId: null };
      const next = maybeAdvance(pushHistory({
        ...state,
        draggingId: null,
        rows: state.rows.map((r) =>
          r.i === action.payload.i
            ? { ...r, docked: true, x: layout.dockCentroid.x, y: layout.dockCentroid.y, selected: false }
            : r,
        ),
        isPlaying: false,
      }));
      return next;
    }
    case 'REJECT_ROW': {
      const layouts = getRowLayouts(state.n);
      const home = layouts.find((l) => l.i === action.payload.i);
      if (!home) return { ...state, draggingId: null };
      return {
        ...state,
        draggingId: null,
        rows: state.rows.map((r) =>
          r.i === action.payload.i
            ? { ...r, docked: false, x: home.homeCentroid.x, y: home.homeCentroid.y }
            : r,
        ),
      };
    }
    case 'UNDOCK_ROW': {
      const layouts = getRowLayouts(state.n);
      const home = layouts.find((l) => l.i === action.payload);
      if (!home) return state;
      return pushHistory({
        ...state,
        rows: state.rows.map((r) =>
          r.i === action.payload
            ? { ...r, docked: false, x: home.homeCentroid.x, y: home.homeCentroid.y }
            : r,
        ),
      });
    }
    case 'KEYBOARD_MOVE': {
      return {
        ...state,
        rows: state.rows.map((r) =>
          r.i === action.payload.i
            ? { ...r, x: r.x + action.payload.dx, y: r.y + action.payload.dy, docked: false }
            : r,
        ),
      };
    }
    case 'SET_HINT': {
      const level = Math.max(1, Math.min(5, action.payload));
      return { ...state, hintLevel: level, hintUsedMax: Math.max(state.hintUsedMax, level) };
    }
    case 'SET_PREDICTION':
      return { ...state, predictionAnswer: action.payload, predictionChecked: false };
    case 'CHECK_PREDICTION':
      return { ...state, predictionChecked: true };
    case 'SET_MISCONCEPTION':
      return { ...state, misconceptionSelected: action.payload, misconceptionChecked: false, misconceptionFeedback: null };
    case 'CHECK_MISCONCEPTION': {
      const ok = state.misconceptionSelected === 'correct';
      const feedback = ok
        ? 'Yes. The invariant is a count: 2Tₙ = n(n+1), a rectangle of height n and width n+1 — not a square.'
        : 'That claim drops the extra column. Two triangles make n by (n+1), so the area is n(n+1), not n². Pick the matching statement.';
      let next: EnsState = {
        ...state,
        misconceptionChecked: true,
        misconceptionFeedback: feedback,
        generalStepAccepted: ok ? true : state.generalStepAccepted,
      };
      if (ok) next = maybeAdvance(next);
      return next;
    }
    case 'ACCEPT_GENERAL': {
      const next = { ...state, generalStepAccepted: true };
      return maybeAdvance(next);
    }
    case 'SET_CHALLENGE_N':
      return { ...state, challengeN: action.payload, challengeChecked: false };
    case 'SET_CHALLENGE_WIDTH':
      return { ...state, challengeWidth: action.payload, challengeChecked: false };
    case 'SET_CHALLENGE_HEIGHT':
      return { ...state, challengeHeight: action.payload, challengeChecked: false };
    case 'CHECK_CHALLENGE': {
      const n = Number(state.challengeN);
      const w = Number(state.challengeWidth);
      const h = Number(state.challengeHeight);
      if (!Number.isInteger(n) || n < 1) {
        return {
          ...state,
          challengeChecked: true,
          challengeResult: 'n must be a positive integer. The theorem is stated for n ≥ 1.',
          transferPassed: false,
        };
      }
      const ok = h === n && w === n + 1;
      const next: EnsState = {
        ...state,
        challengeChecked: true,
        challengeResult: ok
          ? `✔ Height n = ${n} and width n+1 = ${n + 1} give area ${n * (n + 1)}, matching 2+4+…+2·${n}.`
          : `That move changes the rectangle. For n = ${n} the sides must be ${n} by ${n + 1} (area ${n * (n + 1)}).`,
        transferPassed: ok,
      };
      return maybeAdvance(next);
    }
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };
    case 'SET_ANIMATION_SPEED':
      return { ...state, animationSpeed: action.payload };
    case 'PREV_STEP': {
      const lastDocked = [...state.rows].reverse().find((r) => r.docked);
      if (!lastDocked) return { ...state, isPlaying: false };
      const layouts = getRowLayouts(state.n);
      const home = layouts.find((l) => l.i === lastDocked.i)!;
      return pushHistory({
        ...state,
        isPlaying: false,
        draggingId: null,
        rows: state.rows.map((r) =>
          r.i === lastDocked.i
            ? { ...r, docked: false, x: home.homeCentroid.x, y: home.homeCentroid.y }
            : r,
        ),
      });
    }
    case 'AUTO_STEP':
    case 'TICK_ANIMATION': {
      const nextUndocked = state.rows.find((r) => !r.docked);
      if (!nextUndocked) {
        return { ...state, isPlaying: false };
      }
      const layouts = getRowLayouts(state.n);
      const layout = layouts.find((l) => l.i === nextUndocked.i)!;
      return maybeAdvance(pushHistory({
        ...state,
        draggingId: null,
        rows: state.rows.map((r) =>
          r.i === nextUndocked.i
            ? { ...r, docked: true, x: layout.dockCentroid.x, y: layout.dockCentroid.y }
            : r,
        ),
      }));
    }
    default:
      return state;
  }
}
