// ─── Divisibility by 3 — Proof Page ──────────────────────────────────────────
import React, {
  useReducer, useRef, useEffect, useState, useMemo, useCallback,
} from 'react';
import {
  Brain, Bookmark, Lightbulb, PenLine, Settings, Crosshair, Sparkles,
  HelpCircle, Undo2, Redo2, Play, Pause, RotateCcw, Trophy, Eye,
  Check,
} from 'lucide-react';

import { HINTS, PROOF_STATES, PLACE_VALUE_COLUMNS } from './divisibility-by-3Config';
import {
  digitSum, digitsToNumber,
  generateSnapTargets, getColumnLayouts, getRemainderLaneLayouts,
  VIEW_W, VIEW_H, BALL_R, HIT_R, LIMITS as MLIMITS,
} from './divisibility-by-3Math';
import { div3Reducer, initDiv3State } from './divisibility-by-3Reducer';
import type { CounterState } from './divisibility-by-3Reducer';
import { checkCompletion, getRejectionMessage } from './divisibility-by-3Completion';
import './divisibility-by-3.css';

// ── Constants ─────────────────────────────────────────────────────────────────
const SNAP_R = MLIMITS.snapThreshold;

const EXAMPLES = [
  { digits: [1, 2], label: '12' },
  { digits: [4, 7, 2, 1], label: '4721' },
  { digits: [1, 2, 3], label: '123' },
  { digits: [9, 9], label: '99' },
  { digits: [7, 2, 1], label: '721' },
];

// Superscript digits for rendering 10^k labels inside counter circles
const SUPERSCRIPTS = ['⁰', '¹', '²', '³', '⁴', '⁵'];

// Human-readable place-value labels
const PLACE_LABELS: Record<number, string> = {
  0: '1',
  1: '10',
  2: '100',
  3: '1000',
};

// ── Column fill colour map ─────────────────────────────────────────────────────
const COL_COLORS: Record<string, string> = {
  thousands: PLACE_VALUE_COLUMNS[0].color,
  hundreds:  PLACE_VALUE_COLUMNS[1].color,
  tens:      PLACE_VALUE_COLUMNS[2].color,
  ones:      PLACE_VALUE_COLUMNS[3].color,
};

// ── Why 10^k ≡ 1 (mod 3)? Explain via the key fact 10 = 9 + 1
const WHY_10_EQUIV_1 = [
  { power: 0, val: '1',    explanation: '1 = 3×0 + 1',      rem: 1 },
  { power: 1, val: '10',   explanation: '10 = 3×3 + 1',     rem: 1 },
  { power: 2, val: '100',  explanation: '100 = 3×33 + 1',   rem: 1 },
  { power: 3, val: '1000', explanation: '1000 = 3×333 + 1', rem: 1 },
];

// ── Main Component ────────────────────────────────────────────────────────────
export function DivisibilityBy3ProofPage() {
  const [state, dispatch] = useReducer(div3Reducer, undefined, initDiv3State);
  const svgRef = useRef<SVGSVGElement>(null);
  const draggingIdRef = useRef<number | null>(null);
  const grabOffsetRef = useRef({ x: 0, y: 0 });
  const [rejectionMsg, setRejectionMsg] = useState<string | null>(null);
  const rejTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Derived display data ──────────────────────────────────────────────────
  const colLayouts  = useMemo(() => getColumnLayouts(), []);
  const remLayouts  = useMemo(() => getRemainderLaneLayouts(), []);
  const snapTargets = useMemo(() => generateSnapTargets(state.digits), [state.digits]);
  const completion  = useMemo(() => checkCompletion(state), [state]);

  const numVal     = useMemo(() => digitsToNumber(state.digits), [state.digits]);
  const ds         = useMemo(() => digitSum(state.digits), [state.digits]);
  const dsMod      = useMemo(() => ds % 3, [ds]);
  const nMod       = useMemo(() => numVal % 3, [numVal]);
  const isDivisible = nMod === 0;

  // ── Auto-play timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!state.isPlaying) return;
    const ms = 600 / state.animationSpeed;
    const t = setInterval(() => dispatch({ type: 'TICK_ANIMATION' }), ms);
    return () => clearInterval(t);
  }, [state.isPlaying, state.animationSpeed]);

  // ── Rejection toast ───────────────────────────────────────────────────────
  const showRejection = useCallback((msg: string) => {
    setRejectionMsg(msg);
    if (rejTimerRef.current) clearTimeout(rejTimerRef.current);
    rejTimerRef.current = setTimeout(() => setRejectionMsg(null), 4000);
  }, []);

  // ── Client → SVG coordinate conversion ───────────────────────────────────
  const clientToSvg = useCallback((cx: number, cy: number): { x: number; y: number } => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: ((cx - rect.left)  / rect.width)  * VIEW_W,
      y: ((cy - rect.top)   / rect.height) * VIEW_H,
    };
  }, []);

  // ── Snap logic ────────────────────────────────────────────────────────────
  const findSnap = useCallback(
    (svgX: number, svgY: number) => {
      let best = null, bestD = Infinity;
      for (const t of snapTargets) {
        const d = Math.hypot(svgX - t.x, svgY - t.y);
        if (d < bestD) { bestD = d; best = t; }
      }
      return bestD <= SNAP_R ? best : null;
    },
    [snapTargets],
  );

  // ── Pointer down ──────────────────────────────────────────────────────────
  const onPointerDown = useCallback(
    (e: React.PointerEvent, counterId: number) => {
      e.stopPropagation();
      const counter = state.counters.find(c => c.id === counterId);
      if (!counter) return;
      svgRef.current?.setPointerCapture(e.pointerId);
      draggingIdRef.current = counterId;
      dispatch({ type: 'SELECT_COUNTER', payload: counterId });
      const { x, y } = clientToSvg(e.clientX, e.clientY);
      grabOffsetRef.current = { x: x - counter.x, y: y - counter.y };
    },
    [state.counters, clientToSvg],
  );

  // ── Pointer move ──────────────────────────────────────────────────────────
  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const id = draggingIdRef.current;
      if (id === null) return;
      const { x: sx, y: sy } = clientToSvg(e.clientX, e.clientY);
      const nx = Math.max(BALL_R, Math.min(VIEW_W - BALL_R, sx - grabOffsetRef.current.x));
      const ny = Math.max(BALL_R, Math.min(VIEW_H - BALL_R, sy - grabOffsetRef.current.y));
      const snap = findSnap(nx, ny);
      dispatch({
        type: 'DRAG_COUNTER',
        payload: snap ? { id, x: snap.x, y: snap.y } : { id, x: nx, y: ny },
      });
    },
    [clientToSvg, findSnap],
  );

  // ── Pointer up — dock or reject ────────────────────────────────────────────
  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      const id = draggingIdRef.current;
      draggingIdRef.current = null;
      if (id === null) return;
      svgRef.current?.releasePointerCapture(e.pointerId);
      const counter = state.counters.find(c => c.id === id);
      if (!counter) return;

      const { x: sx, y: sy } = clientToSvg(e.clientX, e.clientY);
      const nx = Math.max(BALL_R, Math.min(VIEW_W - BALL_R, sx - grabOffsetRef.current.x));
      const ny = Math.max(BALL_R, Math.min(VIEW_H - BALL_R, sy - grabOffsetRef.current.y));
      const snap = findSnap(nx, ny);

      if (!snap) {
        dispatch({ type: 'REJECT_COUNTER', payload: { id } });
        return;
      }

      const toLane = snap.lane;

      // Mathematical rejection: place-value weights can only go to rem1
      if (toLane === 'rem0' || toLane === 'rem2') {
        const msg = getRejectionMessage(counter.power, toLane);
        showRejection(msg);
        dispatch({ type: 'REJECT_COUNTER', payload: { id } });
        return;
      }

      // Occupancy check
      const occupied = state.counters.some(
        c => c.id !== id && Math.hypot(c.x - snap.x, c.y - snap.y) < BALL_R,
      );
      if (occupied) {
        showRejection('That slot is already occupied. Try another position.');
        dispatch({ type: 'REJECT_COUNTER', payload: { id } });
        return;
      }

      dispatch({ type: 'DOCK_COUNTER', payload: { id, lane: toLane, x: snap.x, y: snap.y } });
    },
    [state.counters, clientToSvg, findSnap, showRejection],
  );

  // ── Keyboard handling ─────────────────────────────────────────────────────
  const onSvgKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const sel = state.counters.find(c => c.selected);
      if (!sel) return;
      const STEP = e.shiftKey ? 30 : 8;
      let dx = 0, dy = 0;
      if (e.key === 'ArrowLeft')  { dx = -STEP; e.preventDefault(); }
      if (e.key === 'ArrowRight') { dx =  STEP; e.preventDefault(); }
      if (e.key === 'ArrowUp')    { dy = -STEP; e.preventDefault(); }
      if (e.key === 'ArrowDown')  { dy =  STEP; e.preventDefault(); }
      if (e.key === 'Escape') { dispatch({ type: 'SELECT_COUNTER', payload: null }); return; }
      if (dx !== 0 || dy !== 0) dispatch({ type: 'KEYBOARD_MOVE', payload: { id: sel.id, dx, dy } });
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const snap = findSnap(sel.x, sel.y);
        if (snap) dispatch({ type: 'DOCK_COUNTER', payload: { id: sel.id, lane: snap.lane, x: snap.x, y: snap.y } });
      }
    },
    [state.counters, findSnap],
  );

  // ── Counter colour ────────────────────────────────────────────────────────
  const counterFill = useCallback((c: CounterState): string => {
    if (c.lane === 'rem1') return '#3ecf8e';
    if (c.lane === 'rem0') return '#6a38ff';
    if (c.lane === 'rem2') return '#f76b72';
    return COL_COLORS[c.lane] ?? '#7c5cfc';
  }, []);

  // ── Ghost preview ─────────────────────────────────────────────────────────
  const draggingCounter = draggingIdRef.current !== null
    ? state.counters.find(c => c.id === draggingIdRef.current) ?? null
    : null;
  const ghostSnap = draggingCounter ? findSnap(draggingCounter.x, draggingCounter.y) : null;

  // ── Load example ──────────────────────────────────────────────────────────
  const loadExample = (digits: number[]) => dispatch({ type: 'SET_DIGITS', payload: digits });

  // ── Step label for counter: show 10^k inside the ball ─────────────────────
  // If in remainder lane, show "≡1" to emphasise the collapsed value
  const counterLabel = (c: CounterState) => {
    if (c.lane.startsWith('rem')) return '≡1';
    return `10${SUPERSCRIPTS[c.power] ?? c.power}`;
  };

  // ── Digit shown on the right of palette ("×d") ───────────────────────────
  // But label it more clearly as the digit coefficient
  const digitCoeff = (c: CounterState) => state.digits[c.digitIdx] ?? '';

  // ── Live worked example for "Why it works" panel ──────────────────────────
  const workedSteps = useMemo(() => {
    const n = state.digits.length;
    return state.digits.map((d, i) => {
      const power = n - 1 - i;
      const placeVal = PLACE_LABELS[power] ?? `10^${power}`;
      const contribution = d * Math.pow(10, power);
      return { d, power, placeVal, contribution };
    });
  }, [state.digits]);

  return (
    <div className="d3-shell">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="brand">
          <div className="logo-mark" aria-hidden="true">
            <svg viewBox="0 0 64 64" width="48" height="48">
              <path d="M32 5C40 22 42 24 59 32C42 40 40 42 32 59C24 42 22 40 5 32C22 24 24 22 32 5Z"
                fill="none" stroke="currentColor" strokeWidth="4"/>
              <circle cx="32" cy="32" r="6" fill="currentColor"/>
              <path d="M32 8v48M8 32h48M17 17l30 30M47 17 17 47"
                stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <b>MATHS<br/>UNIVERSE</b>
        </div>
        <nav>
          {[
            { Icon: Brain,     label: 'Explore',  active: true  },
            { Icon: Lightbulb, label: 'Proofs',   active: false },
            { Icon: PenLine,   label: 'Practice', active: false },
            { Icon: Bookmark,  label: 'Saved',    active: false },
          ].map(({ Icon, label, active }) => (
            <button key={label} className={`nav-item${active ? ' active' : ''}`} aria-label={label}>
              <Icon size={26}/><span>{label}</span>
            </button>
          ))}
        </nav>
        <button className="nav-item settings" aria-label="Settings">
          <Settings size={24}/><span>Settings</span>
        </button>
      </aside>

      {/* ── Main ── */}
      <main className="d3-main">

        {/* Header */}
        <header className="d3-header">
          <div>
            <div className="d3-crumb">Visual Proofs <span>/</span> Number Theory</div>
            <h1 className="d3-title">Divisibility by 3</h1>
            <p className="d3-subtitle">
              Because 10 ≡ 1 (mod 3), every place-value weight collapses to 1 — so a number's
              remainder mod 3 equals its digit sum's remainder.
            </p>
          </div>
          <div className="d3-badges">
            <div className="d3-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>
                <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
              </svg>
              Beginner
            </div>
            <div className="d3-badge">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
              8 min
            </div>
          </div>
        </header>

        {/* Mission strip */}
        <div className="d3-mission" role="status">
          <div className="d3-mission-icon" aria-hidden="true"><Crosshair size={26}/></div>
          <span>
            <b>Drag each place-value block (10⁰, 10¹, 10², 10³) to its remainder lane.</b>{' '}
            Discover that every power of 10 leaves remainder <b>1</b> when divided by 3 — then see why the digit sum tells you everything.
          </span>
          <div className="d3-trythis">
            <strong>Try:</strong>
            {EXAMPLES.map(ex => (
              <button key={ex.label} className="d3-example-btn"
                style={{ borderColor: '#7c5cfc', color: '#7c5cfc' }}
                onClick={() => loadExample(ex.digits)}
                aria-label={`Load ${ex.label}`}>
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* Proof-state wizard */}
        <nav className="d3-wizard" aria-label="Proof steps">
          {PROOF_STATES.map((st, i) => {
            const visited = state.visitedStates.has(st);
            const active  = state.proofState === st;
            const done    = visited && !active;
            return (
              <React.Fragment key={st}>
                <button
                  className={`d3-wizard-btn${active ? ' active' : ''}${done ? ' completed' : ''}`}
                  onClick={() => dispatch({ type: 'SET_STATE', payload: st })}
                  aria-selected={active} role="tab">
                  {i + 1}. {st.charAt(0).toUpperCase() + st.slice(1)}
                </button>
                {i < 5 && <span className="d3-wizard-sep" aria-hidden="true">/</span>}
              </React.Fragment>
            );
          })}
          <div className="d3-wizard-tools">
            <button className="d3-tool-btn" onClick={() => dispatch({ type: 'UNDO' })}
              disabled={state.historyIndex <= 0} aria-label="Undo"><Undo2 size={14}/></button>
            <button className="d3-tool-btn" onClick={() => dispatch({ type: 'REDO' })}
              disabled={state.historyIndex >= state.history.length - 1} aria-label="Redo"><Redo2 size={14}/></button>
          </div>
        </nav>

        {/* Body */}
        <div className="d3-body">

          {/* ── LEFT COLUMN ── */}
          <div className="d3-left-col">
            <section className="d3-lab" aria-label="Interactive workspace">

              <div className="d3-lab-header">
                <h2>Interactive Workspace</h2>
                <label className="d3-show-rem-toggle" htmlFor="d3-rem-toggle">
                  <Eye size={15}/> Show remainder lanes
                  <span className="d3-toggle-switch">
                    <input id="d3-rem-toggle" type="checkbox"
                      checked={state.showRemainders}
                      onChange={() => dispatch({ type: 'TOGGLE_REMAINDERS' })}/>
                    <span className="d3-toggle-slider"/>
                  </span>
                </label>
              </div>

              {/* SVG Canvas */}
              <div className="d3-canvas-wrap">
                <svg ref={svgRef}
                  viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                  onPointerMove={onPointerMove} onPointerUp={onPointerUp}
                  onKeyDown={onSvgKeyDown} tabIndex={0}
                  style={{ outline: 'none' }} role="application"
                  aria-label="Place-value workspace — drag each 10^k block to its remainder lane">
                  <title>Divisibility by 3 — Place-Value Workspace</title>

                  {/* ── PALETTE CARD ─────────────────────────────────── */}
                  <g>
                    <rect x="10" y="10" width="144" height="308" rx="14"
                      fill="#fff" stroke="#dedcf0" strokeWidth="1"/>
                    {/* Step label */}
                    <rect x="14" y="16" width="30" height="18" rx="5" fill="#6a38ff"/>
                    <text x="29" y="28" fill="#fff" fontSize="9" fontWeight="800" textAnchor="middle">STEP</text>
                    <text x="62" y="30" fill="#09143d" fontSize="11.5" fontWeight="700">1  Pick a number</text>
                    <text x="18" y="50" fill="#5360a6" fontSize="9.5">Each block = one place value.</text>
                    <text x="18" y="64" fill="#5360a6" fontSize="9.5">Drag it to find its remainder.</text>

                    {/* Control buttons — pushed to bottom of taller card */}
                    {[
                      { label: 'Clear',   y: 262, action: () => dispatch({ type: 'RESET' }) },
                      { label: 'Random',  y: 284, action: () => {
                        const len = Math.floor(Math.random() * 3) + 2;
                        const digs = Array.from({ length: len }, () => Math.floor(Math.random() * 9) + 1);
                        dispatch({ type: 'SET_DIGITS', payload: digs });
                      }},
                      { label: 'Example', y: 306, action: () => dispatch({ type: 'SET_DIGITS', payload: [4, 7, 2, 1] }) },
                    ].map(({ label, y, action }) => (
                      <g key={label} onClick={action} style={{ cursor: 'pointer' }}>
                        <rect x="14" y={y - 12} width="116" height="18" rx="6"
                          fill="#f8f7ff" stroke="#dddcf0" strokeWidth="1"/>
                        <text x="72" y={y} fill="#2d2b7a" fontSize="10.5" textAnchor="middle" fontWeight="600">
                          {label}
                        </text>
                      </g>
                    ))}
                  </g>

                  {/* ── PLACE-VALUE COLUMN CARDS ──────────────────────── */}
                  {colLayouts.map((cl) => {
                    const col = cl.col;
                    const digitForCol = state.digits[state.digits.length - 1 - col.power];
                    const hasDigit = digitForCol !== undefined && digitForCol > 0;

                    return (
                      <g key={col.name}>
                        {/* Card background */}
                        <rect x={cl.cardX} y={cl.cardY} width={cl.cardW} height={cl.cardH}
                          rx="14" fill="#fff" stroke="#dedcf0" strokeWidth="1"/>
                        {/* Coloured header */}
                        <rect x={cl.cardX} y={cl.cardY} width={cl.cardW} height="60"
                          rx="14" fill={col.headerBg} stroke={col.strokeColor} strokeWidth="1"/>
                        <rect x={cl.cardX} y={cl.cardY + 46} width={cl.cardW} height="14" fill={col.headerBg}/>
                        {/* Column title */}
                        <text x={cl.centerX} y={cl.cardY + 19} fill={col.strokeColor}
                          fontSize="12" fontWeight="700" textAnchor="middle">
                          {col.label.split('\n')[0]}
                        </text>
                        {/* Place value: "= 10³" */}
                        <text x={cl.centerX} y={cl.cardY + 35} fill={col.strokeColor}
                          fontSize="11" textAnchor="middle">
                          = 10{SUPERSCRIPTS[col.power] ?? col.power}
                        </text>
                        {/* Digit coefficient — shown only when active */}
                        {hasDigit && (
                          <text x={cl.centerX} y={cl.cardY + 52} fill={col.strokeColor}
                            fontSize="9.5" textAnchor="middle" opacity="0.75">
                            digit = {digitForCol}
                          </text>
                        )}
                        {/* Slot outlines */}
                        {snapTargets
                          .filter(t => t.lane === col.name)
                          .slice(0, 9)
                          .map((t) => (
                            <circle key={t.id} cx={t.x} cy={t.y} r={BALL_R}
                              fill="none" stroke={col.strokeColor} strokeWidth="1"
                              strokeDasharray="4 3" opacity="0.35"/>
                          ))
                        }
                      </g>
                    );
                  })}

                  {/* ── STEP 2: COLLAPSE TO REMAINDERS ─────────────────── */}
                  {state.showRemainders && (
                    <g>
                      {/* Section background — starts just below columns */}
                      <rect x="158" y="326" width="736" height="198" rx="14"
                        fill="#faf8ff" stroke="#e2e0f4" strokeWidth="1"/>

                      {/* Step label */}
                      <rect x="165" y="334" width="30" height="18" rx="5" fill="#6a38ff"/>
                      <text x="180" y="346" fill="#fff" fontSize="9" fontWeight="800" textAnchor="middle">STEP</text>
                      <text x="204" y="348" fill="#09143d" fontSize="11.5" fontWeight="700">2  Drag each block to its remainder lane (mod 3)</text>
                      <text x="204" y="363" fill="#5360a6" fontSize="9.5">
                        All powers of 10 leave remainder 1 — discover it yourself!
                      </text>

                      {/* Remainder lanes */}
                      {remLayouts.map((rl) => {
                        const countHere = state.counters.filter(c => c.lane === rl.name).length;
                        return (
                          <g key={rl.name}>
                            <rect x={rl.cardX} y={rl.cardY} width={rl.cardW} height={rl.cardH}
                              rx="12" fill={rl.bgColor} stroke={rl.borderColor}
                              strokeWidth={rl.name === 'rem1' ? 2.5 : 1.5}/>
                            {/* Label */}
                            <text x={rl.centerX} y={rl.cardY + 20} fill={rl.color}
                              fontSize="12" fontWeight="700" textAnchor="middle">
                              {rl.label}
                            </text>
                            {/* Big remainder number */}
                            <circle cx={rl.centerX} cy={rl.cardY + 58} r="24"
                              fill={rl.bgColor} stroke={rl.borderColor} strokeWidth="2"/>
                            <text x={rl.centerX} y={rl.cardY + 65} fill={rl.color}
                              fontSize="22" fontWeight="800" textAnchor="middle">
                              {rl.value}
                            </text>
                            {/* "Correct" badge on rem1 */}
                            {rl.name === 'rem1' && (
                              <text x={rl.centerX} y={rl.cardY + 92} fill="#059c51"
                                fontSize="9.5" fontWeight="700" textAnchor="middle">
                                ← ALL 10^k land here
                              </text>
                            )}
                            {/* Counter count */}
                            {countHere > 0 && (
                              <text x={rl.centerX} y={rl.cardY + 110} fill={rl.color}
                                fontSize="10" fontWeight="600" textAnchor="middle">
                                {countHere} block{countHere > 1 ? 's' : ''}
                              </text>
                            )}
                            {/* Snap target outlines */}
                            {snapTargets.filter(t => t.lane === rl.name).map(t => (
                              <circle key={t.id} cx={t.x} cy={t.y} r={BALL_R}
                                fill="none" stroke={rl.borderColor} strokeWidth="1"
                                strokeDasharray="3 2" opacity="0.5"/>
                            ))}
                          </g>
                        );
                      })}

                      {/* Powers of 10 mod 3 — arithmetic proof */}
                      <g>
                        <rect x="738" y="330" width="152" height="190" rx="10"
                          fill="#f4f1ff" stroke="#c5b8ff" strokeWidth="1.5"/>
                        <text x="814" y="349" fill="#3a1bff" fontSize="10" fontWeight="700" textAnchor="middle">
                          Why all land in Remainder 1
                        </text>
                        {WHY_10_EQUIV_1.map((row, i) => (
                          <g key={row.power}>
                            <text x="745" y={368 + i * 30} fill={PLACE_VALUE_COLUMNS[row.power].color}
                              fontSize="10" fontWeight="700">
                              {row.val}
                            </text>
                            <text x="745" y={380 + i * 30} fill="#5360a6" fontSize="8.5">
                              = {row.explanation}
                            </text>
                            <circle cx="876" cy={373 + i * 30} r="9" fill="#3ecf8e"/>
                            <text x="876" y={377 + i * 30} fill="#fff" fontSize="8" fontWeight="800" textAnchor="middle">
                              r1
                            </text>
                          </g>
                        ))}
                        <rect x="742" y="496" width="144" height="20" rx="5" fill="#e8e4ff"/>
                        <text x="814" y="509" fill="#3a1bff" fontSize="8.5" fontWeight="700" textAnchor="middle">
                          10=9+1≡1 → 10^k≡1^k=1 (mod 3)
                        </text>
                      </g>
                    </g>
                  )}

                  {/* ── GHOST PREVIEW ──────────────────────────────────── */}
                  {ghostSnap && draggingCounter && (
                    <circle cx={ghostSnap.x} cy={ghostSnap.y} r={BALL_R}
                      fill={counterFill(draggingCounter)} opacity="0.28"
                      stroke="#fff" strokeWidth="1.5"/>
                  )}

                  {/* ── COUNTERS (place-value blocks) ──────────────────── */}
                  {state.counters.map(c => {
                    const isDragging = draggingIdRef.current === c.id;
                    const fill = counterFill(c);
                    const lbl  = counterLabel(c);
                    const isInRem = c.lane.startsWith('rem');
                    // Larger radius when in remainder lane so label fits
                    const r = isInRem ? BALL_R + 2 : BALL_R;

                    return (
                      <g key={c.id}
                        onPointerDown={e => onPointerDown(e, c.id)}
                        style={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
                        aria-label={`Place-value block 10^${c.power} (digit ${state.digits[c.digitIdx]}), in ${c.lane}`}
                        role="img">
                        {/* Hit area */}
                        <circle cx={c.x} cy={c.y} r={HIT_R} fill="transparent"/>
                        {/* Shadow */}
                        <circle cx={c.x} cy={c.y + 2} r={r} fill="rgba(0,0,0,0.10)"/>
                        {/* Ball */}
                        <circle cx={c.x} cy={c.y} r={r}
                          fill={fill}
                          stroke={c.selected ? '#fff' : 'rgba(255,255,255,0.7)'}
                          strokeWidth={c.selected ? 3 : 1.5}
                          style={{ filter: c.selected ? `drop-shadow(0 0 6px ${fill})` : undefined }}/>

                        {/* Label: "10²" before collapse, "≡1" after */}
                        {isInRem ? (
                          <>
                            <text x={c.x} y={c.y + 3} fill="#fff"
                              fontSize="9" fontWeight="800" textAnchor="middle"
                              style={{ pointerEvents: 'none', userSelect: 'none' }}>
                              ≡ 1
                            </text>
                            <text x={c.x} y={c.y + 12} fill="rgba(255,255,255,0.75)"
                              fontSize="7" textAnchor="middle"
                              style={{ pointerEvents: 'none', userSelect: 'none' }}>
                              mod 3
                            </text>
                          </>
                        ) : (
                          <text x={c.x} y={c.y + 4} fill="#fff"
                            fontSize="10" fontWeight="800" textAnchor="middle"
                            style={{ pointerEvents: 'none', userSelect: 'none' }}>
                            {lbl}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* ── DIGIT COEFFICIENT LABELS (×d) in palette ─────── */}
                  {state.counters.map(c => (
                    c.lane === 'palette' ? (
                      <g key={`coeff-${c.id}`} style={{ pointerEvents: 'none' }}>
                        {/* digit × placeValue label */}
                        <text x={c.x + BALL_R + 4} y={c.y - 4}
                          fill="#2d2b7a" fontSize="8.5" fontWeight="700"
                          style={{ userSelect: 'none' }}>
                          d={digitCoeff(c)}
                        </text>
                        <text x={c.x + BALL_R + 4} y={c.y + 7}
                          fill="#5360a6" fontSize="7.5"
                          style={{ userSelect: 'none' }}>
                          ×{PLACE_LABELS[c.power] ?? `10^${c.power}`}
                        </text>
                      </g>
                    ) : null
                  ))}
                </svg>
              </div>

              {/* Playback controls */}
              <div className="d3-playback">
                <button className="d3-pb-btn" onClick={() => dispatch({ type: 'RESET' })} aria-label="Reset">
                  <RotateCcw size={14}/> Reset
                </button>
                <button className={`d3-pb-btn${state.isPlaying ? ' active' : ''}`}
                  onClick={() => dispatch({ type: 'TOGGLE_PLAY' })}
                  aria-label={state.isPlaying ? 'Pause' : 'Play auto-animation'}>
                  {state.isPlaying ? <><Pause size={14}/> Pause</> : <><Play size={14}/> Auto-play</>}
                </button>
                <button className="d3-pb-btn"
                  onClick={() => dispatch({ type: 'AUTO_STEP' })}
                  disabled={state.counters.every(c => c.lane.startsWith('rem'))}
                  aria-label="Step forward">
                  Step →
                </button>
                <select className="d3-speed-select" value={state.animationSpeed}
                  onChange={e => dispatch({ type: 'SET_ANIMATION_SPEED', payload: Number(e.target.value) })}
                  aria-label="Animation speed">
                  <option value={0.5}>0.5×</option>
                  <option value={1.0}>1×</option>
                  <option value={1.5}>1.5×</option>
                </select>
                <div className="d3-quick-btns">
                  {EXAMPLES.map(ex => (
                    <button key={ex.label} className="d3-quick-btn"
                      onClick={() => loadExample(ex.digits)}>{ex.label}</button>
                  ))}
                </div>
              </div>
            </section>

            {/* ── ONE-LINE PROOF STRIP ── */}
            <section className="d3-proof-strip" aria-label="One-line proof">
              <h3>
                <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="#2c1bff" strokeWidth="2">
                  <circle cx="10" cy="10" r="8"/><path d="M10 6v4l3 3"/>
                </svg>
                Formal proof (one line)
              </h3>
              <div className="d3-proof-flow">
                <div className="d3-proof-cell">
                  N = ∑ d<sub>i</sub> · 10<sup>i</sup>
                  <small>Expand in base 10</small>
                </div>
                <span className="d3-proof-arrow">≡</span>
                <div className="d3-proof-cell">
                  ∑ d<sub>i</sub> · <span style={{ color: '#059c51', fontWeight: 800 }}>1</span>
                  <small>10<sup>i</sup> ≡ <b>1</b> (mod 3) for all i</small>
                </div>
                <span className="d3-proof-arrow">≡</span>
                <div className="d3-proof-cell" style={{ borderColor: '#3ecf8e', background: '#f0fdf6' }}>
                  ∑ d<sub>i</sub>  (= digit sum)
                  <small>Digit sum has same remainder</small>
                </div>
                <span className="d3-proof-arrow" style={{ fontSize: '14px' }}>(mod 3)</span>
                <div className="d3-proof-mod">
                  <b>Key step:</b> 10 = 9 + 1 ≡ 1 (mod 3), so 10<sup>k</sup> ≡ 1<sup>k</sup> = 1.
                  Replace every 10<sup>i</sup> with 1 → the sum is just the digit sum.
                </div>
              </div>
            </section>

            {/* ── WORKED EXAMPLE STRIP ── */}
            <section className="d3-proof-strip" aria-label="Live worked example">
              <h3>
                <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="#2c1bff" strokeWidth="2">
                  <rect x="3" y="3" width="14" height="14" rx="2"/><path d="M7 10h6M10 7v6"/>
                </svg>
                Live worked example — N = {numVal}
              </h3>
              <div className="d3-worked-example">
                {/* Step 1: expanded form */}
                <div>
                  {numVal} ={' '}
                  {workedSteps.map((s, i) => (
                    <React.Fragment key={i}>
                      <span style={{ color: COL_COLORS[
                        ['ones','tens','hundreds','thousands'][Math.min(s.power,3)]
                      ] ?? '#222', fontWeight: 700 }}>
                        {s.d}
                      </span>
                      ×10<sup>{s.power}</sup>
                      {i < workedSteps.length - 1 && ' + '}
                    </React.Fragment>
                  ))}
                </div>
                {/* Step 2: replace 10^k with 1 */}
                <div style={{ color: '#5360a6', fontSize: '13px' }}>
                  ≡{' '}
                  {workedSteps.map((s, i) => (
                    <React.Fragment key={i}>
                      <span style={{ fontWeight: 700 }}>{s.d}</span>
                      ×<span style={{ color: '#059c51', fontWeight: 800 }}>1</span>
                      {i < workedSteps.length - 1 && ' + '}
                    </React.Fragment>
                  ))}
                  <span style={{ color: '#5360a6' }}>  (since each 10^k ≡ 1 mod 3)</span>
                </div>
                {/* Step 3: simplify */}
                <div>
                  = {workedSteps.map(s => s.d).join(' + ')} = {ds}{' '}
                  <span style={{ fontSize: '13px', color: '#5360a6' }}>(digit sum)</span>
                </div>
                {/* Step 4: mod result */}
                <div className="d3-worked-result">
                  {ds} ÷ 3 = {Math.floor(ds / 3)} remainder{' '}
                  <span style={{
                    color: dsMod === 0 ? '#059c51' : '#c73838',
                    fontWeight: 800, fontSize: '16px',
                  }}>{dsMod}</span>
                  {' '}&nbsp;→ {numVal} ≡ {nMod} (mod 3){' '}
                  {isDivisible
                    ? <span style={{ color: '#059c51', fontWeight: 700 }}>✔ divisible by 3</span>
                    : <span style={{ color: '#c73838', fontWeight: 700 }}>✘ not divisible by 3</span>
                  }
                </div>
              </div>
            </section>

            {/* ── CHALLENGE STRIP ── */}
            <section className="d3-challenge-strip" aria-label="Transfer challenge">
              <div className="d3-challenge-icon" aria-hidden="true">🧮</div>
              <div className="d3-challenge-text">
                <strong>Challenge:</strong> Enter any number — we'll check divisibility by 3
                using the digit-sum rule, and verify it matches the actual remainder.
                <br/>
                <small>Try a large number like 99999 or 123456 to see the rule in action.</small>
              </div>
              <div className="d3-challenge-input-group">
                <label htmlFor="d3-challenge-input">Enter a number</label>
                <input id="d3-challenge-input" className="d3-challenge-input"
                  type="number" min="1" placeholder="e.g. 99999"
                  value={state.challengeInput}
                  onChange={e => dispatch({ type: 'SET_CHALLENGE_INPUT', payload: e.target.value })}
                  aria-describedby="d3-challenge-result"/>
              </div>
              <button className="d3-check-btn"
                disabled={!state.challengeInput}
                onClick={() => dispatch({ type: 'CHECK_CHALLENGE' })}>
                Check
              </button>
              {state.challengeChecked && state.challengeResult && (
                <div id="d3-challenge-result"
                  className={`d3-challenge-result ${state.challengeResult.startsWith('✔') ? 'ok' : 'fail'}`}
                  role="status" aria-live="polite">
                  {state.challengeResult}
                </div>
              )}
            </section>
          </div>

          {/* ── RIGHT RAIL ── */}
          <aside className="d3-rail" aria-label="Reasoning panel">

            {/* Why it works */}
            <section className="d3-why">
              <h2><Sparkles size={18}/> Why it works</h2>

              {/* Reason 1 */}
              <div className="d3-reason">
                <span className="d3-reason-num">1</span>
                <strong>The key fact: 10 ≡ 1 (mod 3)</strong>
                <span style={{ fontSize: '12px' }}>
                  10 = 9 + 1 = 3×3 + 1, so when you divide 10 by 3 the remainder is 1.
                </span>
                <div className="d3-powers-row" style={{ marginTop: '8px' }}>
                  {WHY_10_EQUIV_1.map((row) => (
                    <div key={row.power} className="d3-power-chip">
                      <div className="d3-power-square"
                        style={{ background: PLACE_VALUE_COLUMNS[Math.min(row.power, 3)].color }}>
                        {row.val.length <= 3 ? row.val : `10${SUPERSCRIPTS[row.power]}`}
                      </div>
                      <span className="d3-power-arrow">mod 3</span>
                      <span style={{ color: '#059c51', fontWeight: 800 }}>= 1</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reason 2 */}
              <div className="d3-reason">
                <span className="d3-reason-num">2</span>
                <strong>So every 10^k ≡ 1^k = 1 (mod 3)</strong>
                <span style={{ fontSize: '12px' }}>
                  Because 10 ≡ 1, multiplying by 10 again still gives 1.
                  100 = 10×10 ≡ 1×1 = 1. This works for any power.
                </span>
                <div style={{ background: '#f4f1ff', borderRadius: '7px', padding: '6px 8px', marginTop: '7px', fontSize: '11.5px', color: '#3a1bff', fontFamily: 'Georgia, serif' }}>
                  10¹ ≡ 1,&nbsp; 10² ≡ 1,&nbsp; 10³ ≡ 1,&nbsp; … (mod 3)
                </div>
              </div>

              {/* Reason 3 — the live calculation */}
              <div className="d3-reason">
                <span className="d3-reason-num">3</span>
                <strong>Replace each place value by 1</strong>
                <span style={{ fontSize: '12px' }}>
                  N = {workedSteps.map((s,i) =>
                    `${s.d}×10^${s.power}${i < workedSteps.length-1 ? ' + ' : ''}`
                  ).join('')}
                </span>
                <div style={{ marginTop: '5px', fontSize: '12px', color: '#059c51', fontWeight: 700, fontFamily: 'Georgia, serif' }}>
                  ≡ {workedSteps.map(s => s.d).join(' + ')} = {ds} ≡ {dsMod} (mod 3)
                </div>
              </div>

              {/* Reason 4 */}
              <div className="d3-reason">
                <span className="d3-reason-num">4</span>
                <strong>The rule</strong>
                <span style={{ fontSize: '12px' }}>
                  3 divides N &nbsp;⟺&nbsp; 3 divides the digit sum.
                </span>
                <div style={{
                  marginTop: '6px', border: `2px solid ${isDivisible ? '#3ecf8e' : '#f76b72'}`,
                  borderRadius: '8px', padding: '5px 8px', background: isDivisible ? '#f0fdf6' : '#fff0f1',
                  fontSize: '12px', fontWeight: 700,
                  color: isDivisible ? '#059c51' : '#c73838',
                }}>
                  {numVal}: digit sum {ds} ≡ {dsMod} (mod 3) →{' '}
                  {isDivisible ? '✔ divisible by 3' : '✘ not divisible by 3'}
                </div>
              </div>
            </section>

            {/* Hint coach */}
            <div className="d3-hint-card" role="region" aria-label="Hint system">
              <div className="d3-hint-header">
                <h3><HelpCircle size={14}/> Hint {state.hintLevel}/5</h3>
                <div className="d3-hint-dots" role="tablist">
                  {[1,2,3,4,5].map(n => (
                    <button key={n}
                      className={`d3-hint-dot${state.hintLevel === n ? ' active' : ''}`}
                      onClick={() => dispatch({ type: 'SET_HINT', payload: n })}
                      role="tab" aria-selected={state.hintLevel === n}
                      aria-label={`Hint ${n}`}/>
                  ))}
                </div>
              </div>
              <div className="d3-hint-body">
                <strong>{HINTS[state.hintLevel].title}</strong>
                {HINTS[state.hintLevel].text}
              </div>
              <div className="d3-hint-footer">
                <button className="d3-hint-nav-btn"
                  disabled={state.hintLevel === 1}
                  onClick={() => dispatch({ type: 'SET_HINT', payload: state.hintLevel - 1 })}>
                  ← Prev
                </button>
                <button className="d3-hint-nav-btn"
                  disabled={state.hintLevel === 5}
                  onClick={() => dispatch({ type: 'SET_HINT', payload: state.hintLevel + 1 })}>
                  Next →
                </button>
              </div>
            </div>

            {/* Make a prediction */}
            <section className="d3-predict" aria-label="Prediction">
              <h3>Make a prediction</h3>
              <p>Is {numVal} divisible by 3? (Digit sum = {ds})</p>
              <div className="d3-pred-row">
                {(['yes', 'no', 'notsure'] as const).map(v => (
                  <button key={v}
                    className={`d3-pred-btn${state.predictionAnswer === v ? ' selected' : ''}`}
                    onClick={() => dispatch({ type: 'SET_PREDICTION', payload: v })}
                    aria-pressed={state.predictionAnswer === v}>
                    {v === 'notsure' ? 'Not sure' : v === 'yes' ? 'Yes ✔' : 'No ✘'}
                  </button>
                ))}
              </div>
              <button className="d3-reveal-btn"
                disabled={!state.predictionAnswer}
                onClick={() => dispatch({ type: 'CHECK_PREDICTION' })}>
                Reveal result
              </button>
              {state.predictionChecked && (
                <div className={`d3-reveal-result${isDivisible ? '' : ' not-div'}`}
                  role="status" aria-live="polite">
                  Digit sum = {ds} ≡ <b>{dsMod}</b> (mod 3)<br/>
                  So {numVal} ≡ {nMod} (mod 3)<br/>
                  {isDivisible
                    ? <><b>✔ Yes! {numVal} is divisible by 3.</b></>
                    : <><b>✘ No. {numVal} has remainder {nMod} when divided by 3.</b></>
                  }
                </div>
              )}
            </section>

            {/* Misconception checkpoint */}
            <section className="d3-misconception" aria-label="Misconception checkpoint">
              <h3><Brain size={14}/> Misconception Check</h3>
              <p>
                Why does the digit-sum rule work for 3 but <em>not</em> for 7?
              </p>
              {[
                {
                  key: 'sum_wrong',
                  text: 'The digit sum always gives the exact value of the number.',
                },
                {
                  key: 'correct',
                  text: '10 ≡ 1 (mod 3), so every place weight collapses to 1. For 7, 10 ≢ 1 (mod 7), so the rule fails.',
                },
                {
                  key: 'same_as_9',
                  text: 'The digit sum rule works for all prime numbers including 7.',
                },
              ].map(opt => (
                <button key={opt.key}
                  className={`d3-mc-option${state.misconceptionSelected === opt.key ? ' selected' : ''}`}
                  onClick={() => dispatch({ type: 'SET_MISCONCEPTION', payload: opt.key })}
                  aria-pressed={state.misconceptionSelected === opt.key}>
                  <span className="d3-radio"/>
                  <span>{opt.text}</span>
                </button>
              ))}
              <button className="d3-validate-btn"
                disabled={!state.misconceptionSelected}
                onClick={() => dispatch({ type: 'CHECK_MISCONCEPTION' })}>
                Validate
              </button>
              {state.misconceptionChecked && state.misconceptionFeedback && (
                <div className={`d3-mc-feedback${state.misconceptionSelected === 'correct' ? ' correct' : ' incorrect'}`}
                  role="status" aria-live="polite">
                  {state.misconceptionFeedback}
                </div>
              )}
            </section>

            {/* Conclusion */}
            <section className="d3-conclusion" aria-label="Conclusion">
              <h3>Conclusion</h3>
              <p>
                <b>Theorem:</b> For any integer N,<br/>
                3 | N &nbsp;⟺&nbsp; 3 | (sum of digits of N)<br/>
                <span style={{ fontSize: '11px', color: '#1a5c32' }}>
                  Proof: N ≡ Σdᵢ·10^i ≡ Σdᵢ·1 = Σdᵢ (mod 3)
                  because 10^i ≡ 1 for all i ≥ 0.
                </span>
              </p>
              {state.predictionChecked && (
                <div className="d3-proved-badge" role="status">
                  <Check size={18} color="#059c51"/> You proved it!
                </div>
              )}
            </section>

            {/* Completion banner */}
            {completion.isComplete && (
              <section className="d3-completion" role="status" aria-live="polite">
                <h2><Trophy size={20}/> Proof Complete!</h2>
                <p>
                  You showed that every 10^k ≡ 1 (mod 3) — so every digit contributes
                  exactly its own value to the remainder. The digit sum test is a direct
                  consequence of this single key fact.
                </p>
              </section>
            )}
          </aside>
        </div>
      </main>

      {/* Rejection toast */}
      {rejectionMsg && (
        <div className="d3-rejection-toast" role="alert" aria-live="assertive">
          {rejectionMsg}
        </div>
      )}
    </div>
  );
}
