// ─── Divisibility by 9 — Proof Page ──────────────────────────────────────────
import React, {
  useReducer, useRef, useEffect, useState, useMemo, useCallback,
} from 'react';
import {
  Brain, Bookmark, PenLine, Settings, Sparkles,
  Undo2, Redo2, Play, Pause, RotateCcw, Eye,
} from 'lucide-react';

import { HINTS, PROOF_STATES, PLACE_VALUE_COLUMNS } from './divisibility-by-9Config';
import {
  digitSum, digitsToNumber,
  generateSnapTargets, getColumnLayouts, getRemainderLaneLayouts,
  VIEW_W, VIEW_H, BALL_R, HIT_R, TRAY_CARD,
} from './divisibility-by-9Math';
import { div9Reducer, initDiv9State } from './divisibility-by-9Reducer';
import { checkCompletion } from './divisibility-by-9Completion';
import './divisibility-by-9.css';

// ── Constants ─────────────────────────────────────────────────────────────────

const EXAMPLES = [
  { digits: [2, 2, 5, 3, 7, 4], label: '225,374' },
  { digits: [9, 8, 7, 6, 5, 4], label: '987,654' },
  { digits: [1, 0, 8],          label: '108' },
  { digits: [1, 4, 4],          label: '144' },
  { digits: [1, 2, 3, 4, 5, 6], label: '123,456' },
];

// Superscripts for 10^k labels
const SUPERSCRIPTS = ['⁰', '¹', '²', '³', '⁴', '⁵'];

// Column colors (mapped from PLACE_VALUE_COLUMNS)
const COL_COLOR: Record<string, string> = {};
for (const c of PLACE_VALUE_COLUMNS) COL_COLOR[c.name as string] = c.color;

// Why 10^k ≡ 1 (mod 9) — displayed in right panel and SVG mini-panel
const WHY_EQUIV = [
  { power: 0, val: '1',       explanation: '1 = 9×0 + 1' },
  { power: 1, val: '10',      explanation: '10 = 9×1 + 1' },
  { power: 2, val: '100',     explanation: '100 = 9×11 + 1' },
  { power: 3, val: '1,000',   explanation: '1000 = 9×111 + 1' },
  { power: 4, val: '10,000',  explanation: '10000 = 9×1111 + 1' },
  { power: 5, val: '100,000', explanation: '100000 = 9×11111 + 1' },
];

// Proof state order for progress display
const PROOF_STATE_ORDER = ['inspect', 'manipulate', 'preserve', 'connect', 'conclude', 'transfer'] as const;

// ── Main Component ────────────────────────────────────────────────────────────
export function DivisibilityBy9ProofPage() {
  const [state, dispatch] = useReducer(div9Reducer, undefined, initDiv9State);
  const svgRef   = useRef<SVGSVGElement>(null);
  const [rejectionMsg, setRejectionMsg]       = useState<string | null>(null);
  const [showPredictResult, setShowPredictResult] = useState(false);
  const rejTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Derived display data ──────────────────────────────────────────────────
  const colLayouts  = useMemo(() => getColumnLayouts(), []);
  const remLayouts  = useMemo(() => getRemainderLaneLayouts(), []);
  const snapTargets = useMemo(() => generateSnapTargets(state.digits), [state.digits]);
  const completion  = useMemo(() => checkCompletion(state), [state]);

  const numVal      = useMemo(() => digitsToNumber(state.digits), [state.digits]);
  const ds          = useMemo(() => digitSum(state.digits),       [state.digits]);
  const nMod        = numVal % 9;
  const sMod        = ds    % 9;

  // number string formatted with commas
  const numStr = useMemo(() => numVal.toLocaleString(), [numVal]);

  // ── Auto-play timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!state.isPlaying) return;
    const ms = 700 / state.animationSpeed;
    const t = setInterval(() => dispatch({ type: 'TICK_ANIMATION' }), ms);
    return () => clearInterval(t);
  }, [state.isPlaying, state.animationSpeed]);

  // ── Rejection toast ───────────────────────────────────────────────────────
  const showRejection = useCallback((msg: string) => {
    setRejectionMsg(msg);
    if (rejTimerRef.current) clearTimeout(rejTimerRef.current);
    rejTimerRef.current = setTimeout(() => setRejectionMsg(null), 4500);
  }, []);

  // ── Client → SVG coordinate conversion ───────────────────────────────────
  const clientToSvg = useCallback((cx: number, cy: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: ((cx - rect.left) / rect.width)  * VIEW_W,
      y: ((cy - rect.top)  / rect.height) * VIEW_H,
    };
  }, []);

  // ── Counter pointer handlers ──────────────────────────────────────────────
  const handleCounterPointerDown = useCallback((e: React.PointerEvent<SVGCircleElement>, id: number) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const svgPos = clientToSvg(e.clientX, e.clientY);
    dispatch({ type: 'START_DRAG_COUNTER', payload: { id, x: svgPos.x, y: svgPos.y } });
  }, [clientToSvg]);

  const handleSvgPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const draggingCounter = state.counters.find(c => c.isDragging);
    if (draggingCounter) {
      const svgPos = clientToSvg(e.clientX, e.clientY);
      dispatch({ type: 'MOVE_DRAG_COUNTER', payload: { x: svgPos.x, y: svgPos.y } });
    }
    if (state.isDraggingNToken) {
      const svgPos = clientToSvg(e.clientX, e.clientY);
      dispatch({ type: 'MOVE_DRAG_N_TOKEN', payload: { x: svgPos.x, y: svgPos.y } });
    }
    if (state.isDraggingSToken) {
      const svgPos = clientToSvg(e.clientX, e.clientY);
      dispatch({ type: 'MOVE_DRAG_S_TOKEN', payload: { x: svgPos.x, y: svgPos.y } });
    }
  }, [state.counters, state.isDraggingNToken, state.isDraggingSToken, clientToSvg]);

  const handleSvgPointerUp = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const draggingCounter = state.counters.find(c => c.isDragging);
    const svgPos = clientToSvg(e.clientX, e.clientY);

    if (draggingCounter) {
      dispatch({ type: 'END_DRAG_COUNTER', payload: { x: svgPos.x, y: svgPos.y } });
    }
    if (state.isDraggingNToken) {
      // Check if dropping in correct rem lane
      const correct = `rem${nMod}`;
      const snapped = remLayouts.find(rl =>
        svgPos.x >= rl.cardX && svgPos.x <= rl.cardX + rl.cardW &&
        svgPos.y >= rl.cardY && svgPos.y <= rl.cardY + rl.cardH,
      );
      if (snapped && snapped.name !== correct) {
        showRejection(`❌ Wrong lane! ${numVal.toLocaleString()} ÷ 9 leaves remainder ${nMod}, not ${snapped.value}. Check: ${numVal.toLocaleString()} = 9×${Math.floor(numVal / 9).toLocaleString()} + ${nMod}. Try lane ${nMod}!`);
      }
      dispatch({ type: 'END_DRAG_N_TOKEN', payload: { x: svgPos.x, y: svgPos.y } });
    }
    if (state.isDraggingSToken) {
      const correct = `rem${sMod}`;
      const snapped = remLayouts.find(rl =>
        svgPos.x >= rl.cardX && svgPos.x <= rl.cardX + rl.cardW &&
        svgPos.y >= rl.cardY && svgPos.y <= rl.cardY + rl.cardH,
      );
      if (snapped && snapped.name !== correct) {
        showRejection(`❌ Wrong lane! Digit sum ${ds} ÷ 9 leaves remainder ${sMod}, not ${snapped.value}. So digit sum ${ds} = 9×${Math.floor(ds / 9)} + ${sMod}. Try lane ${sMod}!`);
      }
      dispatch({ type: 'END_DRAG_S_TOKEN', payload: { x: svgPos.x, y: svgPos.y } });
    }
  }, [state, clientToSvg, numVal, ds, nMod, sMod, remLayouts, showRejection]);

  // ── N / S Token pointer handlers ──────────────────────────────────────────
  const handleNTokenDown = useCallback((e: React.PointerEvent<SVGGElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const svgPos = clientToSvg(e.clientX, e.clientY);
    dispatch({ type: 'START_DRAG_N_TOKEN', payload: { x: svgPos.x, y: svgPos.y } });
  }, [clientToSvg]);

  const handleSTokenDown = useCallback((e: React.PointerEvent<SVGGElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const svgPos = clientToSvg(e.clientX, e.clientY);
    dispatch({ type: 'START_DRAG_S_TOKEN', payload: { x: svgPos.x, y: svgPos.y } });
  }, [clientToSvg]);

  // ── Digits input via number builder ──────────────────────────────────────
  const handleSetExample = useCallback((digits: number[]) => {
    dispatch({ type: 'SET_DIGITS', payload: digits });
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  const proofStateIdx = PROOF_STATE_ORDER.indexOf(state.proofState as typeof PROOF_STATE_ORDER[number]);
  const allInTray = state.trayCounterIds.length === state.digits.length;

  const currentHint = HINTS.find(h => h.level === state.hintLevel) ?? null;

  return (
    <div className="d9-shell">
      {/* ── Left nav ── */}
      <nav className="d9-sidenav" aria-label="Main navigation">
        <div className="d9-logo" aria-label="Maths Universe">𝕄</div>
        {[
          { icon: <Eye />, label: 'Explore',  href: '/visual-proofs/1' },
          { icon: <Brain />, label: 'Proofs', href: '#', active: true },
          { icon: <PenLine />, label: 'Practice', href: '#' },
          { icon: <Bookmark />, label: 'Saved',  href: '#' },
        ].map(item => (
          <a key={item.label} href={item.href} className={`d9-navitem${item.active ? ' active' : ''}`}>
            {item.icon}
            {item.label}
          </a>
        ))}
        <a href="#" className="d9-navitem d9-nav-settings">
          <Settings />
          Settings
        </a>
      </nav>

      {/* ── Main content ── */}
      <main className="d9-main">

        {/* Header */}
        <header className="d9-header">
          <div className="d9-header-left">
            <nav className="d9-crumb" aria-label="Breadcrumb">
              Visual Proofs <span>/</span> Number Theory
            </nav>
            <h1 className="d9-title">Divisibility by 9</h1>
            <p className="d9-subtitle">
              A number and its digit sum always leave the same remainder when divided by 9.
            </p>
          </div>
          <div className="d9-header-right">
            <div className="d9-badge">🎯 Beginner</div>
            <div className="d9-badge">⏱ 7 min</div>
            <div className="d9-badge"><Sparkles size={14} /> Interactive</div>
          </div>
        </header>

        {/* Mission strip */}
        <div className="d9-mission" role="note">
          <span className="d9-mission-badge">MISSION</span>
          <span>
            <b>Use the digit-sum tray and remainder lanes</b> to explore and prove the rule.
            Drag each place-value counter into the tray, then place{' '}
            <b>[N]</b> and <b>[S]</b> in the correct remainder lane to complete the proof.
          </span>
        </div>

        {/* Toolbar */}
        <div className="d9-toolbar" role="toolbar" aria-label="Proof controls">
          <button
            className="d9-tool-btn"
            onClick={() => dispatch({ type: 'UNDO' })}
            disabled={state.past.length === 0}
            aria-label="Undo last action"
          >
            <Undo2 /> Undo
          </button>
          <button
            className="d9-tool-btn"
            onClick={() => dispatch({ type: 'REDO' })}
            disabled={state.future.length === 0}
            aria-label="Redo"
          >
            <Redo2 /> Redo
          </button>
          <button
            className="d9-tool-btn"
            onClick={() => dispatch({ type: 'RESET' })}
            aria-label="Reset to start"
          >
            <RotateCcw /> Reset
          </button>

          <div className="d9-toolbar-sep" />

          <button
            className={`d9-tool-btn${state.isPlaying ? ' active' : ''}`}
            onClick={() => dispatch({ type: 'SET_PLAYING', payload: !state.isPlaying })}
            aria-label={state.isPlaying ? 'Pause animation' : 'Play animation'}
          >
            {state.isPlaying ? <Pause /> : <Play />} {state.isPlaying ? 'Pause' : 'Animate'}
          </button>
          <select
            className="d9-speed-select"
            value={state.animationSpeed}
            onChange={e => dispatch({ type: 'SET_SPEED', payload: Number(e.target.value) })}
            aria-label="Animation speed"
          >
            <option value={0.5}>0.5×</option>
            <option value={1}>1×</option>
            <option value={1.5}>1.5×</option>
          </select>

          <div className="d9-toolbar-sep" />

          {EXAMPLES.map(ex => (
            <button
              key={ex.label}
              className="d9-tool-btn"
              onClick={() => handleSetExample(ex.digits)}
              aria-label={`Load example ${ex.label}`}
            >
              {ex.label}
            </button>
          ))}
        </div>

        {/* ── SVG Canvas ── */}
        <div className="d9-canvas-wrap" role="region" aria-label="Interactive divisibility-by-9 workspace">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            role="img"
            aria-label={`Divisibility by 9 workspace. Current number: ${numStr}`}
            onPointerMove={handleSvgPointerMove}
            onPointerUp={handleSvgPointerUp}
          >
            <title>Divisibility by 9 interactive workspace</title>
            <desc>
              Drag counters from place-value columns into the digit-sum tray.
              Then drag [N] and [S] tokens into their correct remainder lanes.
            </desc>

            {/* ── Background ── */}
            <rect width={VIEW_W} height={VIEW_H} fill="#f8f7ff" />

            {/* ── Section header: "Place value" ── */}
            <text x={144} y={6} fill="#94a3b8" fontSize="10" fontWeight="600">
              Place value (drag counters here)
            </text>

            {/* ── Palette card ── */}
            <g>
              <rect x={8} y={8} width={128} height={290} rx={12}
                fill="#fff" stroke="#e2e0f4" strokeWidth="1" />
              <rect x={12} y={14} width={32} height={18} rx={5} fill="#6d28d9" />
              <text x={28} y={26} fill="#fff" fontSize={8.5} fontWeight="800" textAnchor="middle">STEP 1</text>
              <text x={72} y={28} fill="#09143d" fontSize={10.5} fontWeight="700" textAnchor="middle">
                Build a number
              </text>
              <text x={72} y={42} fill="#6b7280" fontSize={9} textAnchor="middle">
                Drag counters to place
              </text>
              <text x={72} y={53} fill="#6b7280" fontSize={9} textAnchor="middle">
                value columns.
              </text>

              {/* Counters label */}
              <text x={14} y={72} fill="#374151" fontSize={10} fontWeight="700">Counters</text>
              <circle cx={110} cy={68} r={8} fill="none" stroke="#94a3b8" strokeWidth="1.2" />
              <text x={110} y={72} fill="#94a3b8" fontSize={9} textAnchor="middle" fontWeight="700">?</text>

              {/* Control buttons */}
              {[
                { label: 'Clear',   y: 246, action: () => dispatch({ type: 'RESET' }) },
                { label: 'Random',  y: 268, action: () => {
                  const len  = Math.floor(Math.random() * 4) + 3;
                  const digs = [Math.floor(Math.random() * 8) + 1, ...Array.from({ length: len - 1 }, () => Math.floor(Math.random() * 10))];
                  dispatch({ type: 'SET_DIGITS', payload: digs });
                }},
                { label: 'Example', y: 290, action: () => dispatch({ type: 'SET_DIGITS', payload: [2, 2, 5, 3, 7, 4] }) },
              ].map(({ label, y, action }) => (
                <g key={label} onClick={action} style={{ cursor: 'pointer' }}>
                  <rect x={12} y={y - 12} width={104} height={19} rx={6}
                    fill="#f5f3ff" stroke="#e2e0f4" strokeWidth={1} />
                  <text x={64} y={y + 1} fill="#6d28d9" fontSize={10} textAnchor="middle" fontWeight="700">
                    {label}
                  </text>
                </g>
              ))}
            </g>

            {/* ── Place value column cards ── */}
            {colLayouts.map((cl) => {
              const col = cl.col;
              const digitForCol = state.digits[state.digits.length - 1 - col.power];
              const hasDigit = digitForCol !== undefined && digitForCol > 0;

              return (
                <g key={col.name as string}>
                  <rect x={cl.cardX} y={cl.cardY} width={cl.cardW} height={cl.cardH}
                    rx={12} fill="#fff" stroke="#e2e0f4" strokeWidth="1" />
                  {/* Coloured header */}
                  <rect x={cl.cardX} y={cl.cardY} width={cl.cardW} height={56}
                    rx={12} fill={col.headerBg} stroke={col.strokeColor} strokeWidth="1" />
                  <rect x={cl.cardX} y={cl.cardY + 42} width={cl.cardW} height={14} fill={col.headerBg} />
                  {/* Column label */}
                  <text x={cl.centerX} y={cl.cardY + 18} fill={col.strokeColor}
                    fontSize="11" fontWeight="800" textAnchor="middle">
                    {col.label.replace(' ', '\n').split('\n')[0]}
                  </text>
                  <text x={cl.centerX} y={cl.cardY + 31} fill={col.strokeColor}
                    fontSize="10" textAnchor="middle">
                    {[1, 10, 100, 1000, 10000, 100000][col.power]?.toLocaleString()}
                  </text>
                  {hasDigit && (
                    <text x={cl.centerX} y={cl.cardY + 48} fill={col.strokeColor}
                      fontSize="9" textAnchor="middle" opacity="0.7">
                      digit = {digitForCol}
                    </text>
                  )}
                  {/* Slot outlines */}
                  {snapTargets.filter(t => t.lane === col.name).map(t => (
                    <circle key={t.id} cx={t.x} cy={t.y} r={BALL_R}
                      fill="none" stroke={col.strokeColor} strokeWidth="1"
                      strokeDasharray="3 3" opacity="0.3" />
                  ))}
                </g>
              );
            })}

            {/* ── "Your number" display ── */}
            <g>
              <text x={144} y={303} fill="#374151" fontSize={11} fontWeight="700">
                Your number:
              </text>
              {/* Digit boxes */}
              {state.digits.map((d, i) => (
                <g key={i}>
                  <rect
                    x={237 + i * 32} y={289} width={28} height={18} rx={4}
                    fill={PLACE_VALUE_COLUMNS[Math.max(0, Math.min(5, state.digits.length - 1 - i))]?.headerBg ?? '#f3f4f6'}
                    stroke={PLACE_VALUE_COLUMNS[Math.max(0, Math.min(5, state.digits.length - 1 - i))]?.strokeColor ?? '#9ca3af'}
                    strokeWidth="1.2"
                  />
                  <text
                    x={237 + i * 32 + 14} y={302} fill="#1a1a3e"
                    fontSize="12" fontWeight="800" textAnchor="middle"
                  >
                    {d}
                  </text>
                </g>
              ))}
              <text x={237 + state.digits.length * 32 + 8} y={302}
                fill="#374151" fontSize={11} fontWeight="600">
                {numStr}
              </text>

              {/* Clear button */}
              <g onClick={() => dispatch({ type: 'RESET' })} style={{ cursor: 'pointer' }}>
                <rect x={VIEW_W - 80} y={289} width={58} height={18} rx={5}
                  fill="#f5f3ff" stroke="#c4b5fd" strokeWidth={1} />
                <text x={VIEW_W - 51} y={302} fill="#6d28d9" fontSize={9.5} textAnchor="middle" fontWeight="700">
                  ↺ Clear
                </text>
              </g>
            </g>

            {/* ── Digit-sum tray ── */}
            <g>
              <rect x={TRAY_CARD.x} y={TRAY_CARD.y} width={TRAY_CARD.w} height={TRAY_CARD.h}
                rx={12} fill="#ede9fe" stroke="#a78bfa" strokeWidth={2} />
              <text x={TRAY_CARD.x + 10} y={TRAY_CARD.y - 5}
                fill="#6d28d9" fontSize={10} fontWeight="700">
                Digit-sum tray (group counters to add)
              </text>
              {/* Tray slot outlines */}
              {snapTargets.filter(t => t.lane === 'tray').map(t => (
                <circle key={t.id} cx={t.x} cy={t.y} r={BALL_R}
                  fill="none" stroke="#a78bfa" strokeWidth="1"
                  strokeDasharray="3 2" opacity="0.5" />
              ))}

              {/* Digit sum equation on the right side of tray */}
              <text x={TRAY_CARD.x + TRAY_CARD.w + 12} y={TRAY_CARD.y + 16}
                fill="#374151" fontSize={11} fontWeight="700">
                Digit sum:
              </text>
              <text x={TRAY_CARD.x + TRAY_CARD.w + 12} y={TRAY_CARD.y + 34}
                fill="#1a1a3e" fontSize={10.5} fontWeight="600">
                {state.digits.join(' + ')} = {ds}
              </text>

              {/* mod 9 result */}
              {allInTray && (
                <>
                  <text x={TRAY_CARD.x + TRAY_CARD.w + 12} y={TRAY_CARD.y + 52}
                    fill="#1a1a3e" fontSize={10.5} fontWeight="600">
                    = {ds} (mod 9) =
                  </text>
                  <circle cx={TRAY_CARD.x + TRAY_CARD.w + 118} cy={TRAY_CARD.y + 47} r={14}
                    fill="#6d28d9" />
                  <text x={TRAY_CARD.x + TRAY_CARD.w + 118} y={TRAY_CARD.y + 52}
                    fill="#fff" fontSize={14} fontWeight="800" textAnchor="middle">
                    {sMod}
                  </text>
                </>
              )}
            </g>

            {/* ── "Because 10 ≡ 1 (mod 9)" box ── */}
            <g>
              <rect x={VIEW_W - 195} y={324} width={188} height={84} rx={10}
                fill="#fff" stroke="#c4b5fd" strokeWidth={1.5} />
              <text x={VIEW_W - 101} y={338} fill="#4c1d95" fontSize={10} fontWeight="700" textAnchor="middle">
                Because 10 ≡ 1 (mod 9)
              </text>
              <text x={VIEW_W - 101} y={337} fill="#6b7280" fontSize={9} textAnchor="middle">
                every power of 10 leaves
              </text>
              <text x={VIEW_W - 101} y={348} fill="#6b7280" fontSize={9} textAnchor="middle">
                remainder 1.
              </text>
              <rect x={VIEW_W - 185} y={356} width={172} height={28} rx={6}
                fill="#ede9fe" />
              <text x={VIEW_W - 101} y={368} fill="#4c1d95" fontSize={9} fontWeight="700" textAnchor="middle">
                N ≡ digit sum (mod 9)
              </text>
              <text x={VIEW_W - 101} y={379} fill="#4c1d95" fontSize={9} textAnchor="middle">
                always!
              </text>
            </g>

            {/* ── Remainder lanes section ── */}
            <g>
              <text x={144} y={396} fill="#374151" fontSize={10} fontWeight="700">
                Remainder lanes (mod 9)
              </text>
              <text x={144} y={408} fill="#94a3b8" fontSize={9}>
                Drop your number and your digit sum to compare remainders.
              </text>

              {remLayouts.map((rl) => {
                const nHere = state.nTokenLane === rl.name;
                const sHere = state.sTokenLane === rl.name;

                return (
                  <g key={rl.name as string}>
                    <rect
                      x={rl.cardX} y={rl.cardY}
                      width={rl.cardW} height={rl.cardH}
                      rx={10}
                      fill={nHere && sHere ? '#ecfdf5' : '#fff'}
                      stroke={nHere && sHere ? '#34d399' : '#e2e0f4'}
                      strokeWidth={nHere && sHere ? 2 : 1}
                    />
                    {/* Lane number */}
                    <text x={rl.centerX} y={rl.cardY + 22}
                      fill={nHere && sHere ? '#059669' : '#374151'}
                      fontSize="18" fontWeight="800" textAnchor="middle">
                      {rl.value}
                    </text>
                    {/* Match check mark */}
                    {nHere && sHere && (
                      <text x={rl.centerX} y={rl.cardY + 38}
                        fill="#059669" fontSize="14" textAnchor="middle">
                        ✓
                      </text>
                    )}
                    {/* Token indicators */}
                    {nHere && (
                      <rect x={rl.cardX + 4} y={rl.cardY + 45} width={rl.cardW - 8} height={16} rx={4}
                        fill="#ede9fe" stroke="#a78bfa" strokeWidth="1" />
                    )}
                    {nHere && (
                      <text x={rl.centerX} y={rl.cardY + 57}
                        fill="#6d28d9" fontSize="9" fontWeight="800" textAnchor="middle">
                        N
                      </text>
                    )}
                    {sHere && (
                      <rect x={rl.cardX + 4} y={rl.cardY + (nHere ? 63 : 45)} width={rl.cardW - 8} height={16} rx={4}
                        fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1" />
                    )}
                    {sHere && (
                      <text x={rl.centerX} y={rl.cardY + (nHere ? 75 : 57)}
                        fill="#047857" fontSize="9" fontWeight="800" textAnchor="middle">
                        S
                      </text>
                    )}
                  </g>
                );
              })}

              {/* N label (legend) */}
              <text x={144} y={VIEW_H - 6} fill="#6d28d9" fontSize={9} fontWeight="700">
                N = number
              </text>
              <text x={240} y={VIEW_H - 6} fill="#047857" fontSize={9} fontWeight="700">
                S = digit sum
              </text>
            </g>

            {/* ── Draggable N Token ── */}
            <g
              onPointerDown={handleNTokenDown}
              style={{ cursor: state.isDraggingNToken ? 'grabbing' : 'grab' }}
              className="d9-draggable"
              aria-label={`N token — represents your number ${numStr}. Drag to remainder lane ${nMod}`}
              role="button"
            >
              <circle cx={VIEW_W - 60} cy={state.nTokenY} r={22}
                fill={state.nTokenLane ? '#6d28d9' : '#ede9fe'}
                stroke="#a78bfa" strokeWidth={2}
                style={{ filter: state.isDraggingNToken ? 'drop-shadow(0 4px 8px rgba(109,40,217,0.5))' : 'none' }}
              />
              <circle cx={state.nTokenX} cy={state.nTokenY} r={22}
                fill={state.nTokenLane ? '#6d28d9' : '#ede9fe'}
                stroke="#a78bfa" strokeWidth={2}
                style={{ filter: state.isDraggingNToken ? 'drop-shadow(0 4px 8px rgba(109,40,217,0.5))' : 'none' }}
              />
              <text x={state.nTokenX} y={state.nTokenY + 5}
                fill={state.nTokenLane ? '#fff' : '#6d28d9'}
                fontSize="14" fontWeight="900" textAnchor="middle">
                N
              </text>
              {/* Underneath label */}
              {!state.isDraggingNToken && !state.nTokenLane && (
                <text x={VIEW_W - 60} y={344}
                  fill="#94a3b8" fontSize="8" textAnchor="middle">
                  {numStr}
                </text>
              )}
            </g>

            {/* ── Draggable S Token ── */}
            <g
              onPointerDown={handleSTokenDown}
              style={{ cursor: state.isDraggingSToken ? 'grabbing' : 'grab' }}
              className="d9-draggable"
              aria-label={`S token — represents digit sum ${ds}. Drag to remainder lane ${sMod}`}
              role="button"
            >
              <circle cx={state.sTokenX} cy={state.sTokenY} r={22}
                fill={state.sTokenLane ? '#059669' : '#d1fae5'}
                stroke="#6ee7b7" strokeWidth={2}
                style={{ filter: state.isDraggingSToken ? 'drop-shadow(0 4px 8px rgba(5,150,105,0.5))' : 'none' }}
              />
              <text x={state.sTokenX} y={state.sTokenY + 5}
                fill={state.sTokenLane ? '#fff' : '#047857'}
                fontSize="14" fontWeight="900" textAnchor="middle">
                S
              </text>
              {!state.isDraggingSToken && !state.sTokenLane && (
                <text x={VIEW_W - 60} y={394}
                  fill="#94a3b8" fontSize="8" textAnchor="middle">
                  Σ={ds}
                </text>
              )}
            </g>

            {/* ── Counter balls (draggable) ── */}
            {state.counters.map((counter) => {
              const col = PLACE_VALUE_COLUMNS.find(c => c.power === counter.power);
              const fill = col?.color ?? '#7c3aed';
              const inTray = state.trayCounterIds.includes(counter.id);

              return (
                <g key={counter.id}>
                  {/* Hit circle (larger, invisible) */}
                  <circle
                    cx={counter.x} cy={counter.y}
                    r={HIT_R}
                    fill="transparent"
                    className="d9-draggable"
                    style={{ cursor: counter.isDragging ? 'grabbing' : 'grab' }}
                    onPointerDown={e => handleCounterPointerDown(e, counter.id)}
                    aria-label={`Counter: digit ${counter.digit}, place value 10^${counter.power}`}
                    role="button"
                  />
                  {/* Visible ball */}
                  <circle
                    cx={counter.x} cy={counter.y}
                    r={BALL_R}
                    fill={fill}
                    stroke="#fff"
                    strokeWidth="2"
                    style={{
                      filter: counter.isDragging
                        ? 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))'
                        : inTray
                        ? 'drop-shadow(0 2px 6px rgba(109,40,217,0.3))'
                        : 'none',
                      transition: counter.isDragging ? 'none' : 'all 0.2s ease',
                    }}
                    pointerEvents="none"
                  />
                  {/* Digit label inside ball */}
                  <text
                    x={counter.x} y={counter.y + 4}
                    fill="#fff"
                    fontSize={inTray ? "11" : "10"}
                    fontWeight="800"
                    textAnchor="middle"
                    pointerEvents="none"
                  >
                    {inTray ? counter.digit : `10${SUPERSCRIPTS[counter.power] ?? ''}`}
                  </text>
                  {/* Tray indicator: "≡ 1 (mod 9)" */}
                  {inTray && (
                    <text
                      x={counter.x} y={counter.y + BALL_R + 10}
                      fill="#7c3aed"
                      fontSize="7.5"
                      fontWeight="600"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      ≡1
                    </text>
                  )}
                </g>
              );
            })}

            {/* ── Completion overlay (when proof done) ── */}
            {completion.isComplete && (
              <g>
                <rect x={144} y={308} width={650} height={80} rx={12}
                  fill="#ecfdf5" stroke="#34d399" strokeWidth={2}
                  style={{ filter: 'drop-shadow(0 4px 12px rgba(5,150,105,0.25))' }}
                />
                <text x={469} y={334} fill="#059669" fontSize={14} fontWeight="800" textAnchor="middle">
                  🎉 Proof complete!
                </text>
                <text x={469} y={352} fill="#047857" fontSize={11} textAnchor="middle">
                  {numStr} ≡ {nMod} (mod 9)  and  digit sum {ds} ≡ {sMod} (mod 9)
                </text>
                <text x={469} y={368} fill="#047857" fontSize={11} textAnchor="middle">
                  They match! Because 10^k ≡ 1 (mod 9), N and its digit sum always share the same remainder.
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* ── One-line visual proof footer ── */}
        <section className="d9-proof-strip" aria-label="One-line visual proof">
          <p className="d9-proof-title">One-line visual proof</p>
          <div className="d9-proof-equation">
            <span className="d9-token n-token">N</span>
            <span className="d9-token formula">= Σ d<sub>i</sub> × 10<sup>i</sup></span>
            <span className="d9-token arrow">→→</span>
            <span className="d9-token formula" title="Replace 10^i by 1 (mod 9)">
              Replace 10<sup>i</sup> by 1 (mod 9)
            </span>
            <span className="d9-token arrow">→</span>
            <span className="d9-token formula">Σ d<sub>i</sub> × 1</span>
            <span className="d9-token arrow">→</span>
            <span className="d9-token formula">Σ d<sub>i</sub></span>
            <span className="d9-token arrow">→</span>
            <span className="d9-token s-token">S</span>
            <span className="d9-token formula">∴</span>
            <span className="d9-token n-token">N</span>
            <span className="d9-token formula">≡</span>
            <span className="d9-token s-token">S</span>
            <span className="d9-token formula">(mod 9)</span>
          </div>
          <p className="d9-proof-footer">
            Same remainder ⟹ divisible by 9 ⟺ digit sum divisible by 9.
          </p>
        </section>

        {/* ── Challenge strip ── */}
        <section className="d9-challenge-strip" aria-label="Challenge">
          <div>
            <p className="d9-challenge-title">🏆 Exact challenge</p>
            <p className="d9-challenge-desc">
              Enter any 6-digit number. Verify that N and its digit sum
              share the same remainder mod 9.
            </p>
            <div className="d9-challenge-input-row">
              <input
                type="number"
                className="d9-challenge-input"
                placeholder="e.g. 123456"
                value={state.challengeInput}
                onChange={e => dispatch({ type: 'SET_CHALLENGE_INPUT', payload: e.target.value })}
                aria-label="Enter a 6-digit number to test"
                min={100000} max={999999}
              />
              <button
                className="d9-check-btn"
                onClick={() => dispatch({ type: 'CHECK_CHALLENGE' })}
                aria-label="Check my prediction"
              >
                Check answer
              </button>
            </div>
            {state.challengeChecked && state.challengeResult && (
              <div className={`d9-challenge-result ${
                state.challengeResult.startsWith('✔') ? 'pass' :
                state.challengeResult.startsWith('⚠') ? 'warn' : 'fail'
              }`} role="status">
                {state.challengeResult}
              </div>
            )}
          </div>

          {/* Misconception checkpoint */}
          <div className="d9-misconception" style={{ minWidth: 260 }}>
            <p className="d9-misconception-title">⚡ Misconception checkpoint</p>
            <p style={{ fontSize: 12, color: '#374151', margin: '0 0 8px', lineHeight: 1.5 }}>
              Why does the digit-sum rule work for 9?
            </p>
            {[
              { id: 'correct',        text: 'Because 10 ≡ 1 (mod 9), every place-value weight collapses to 1, so N and its digit sum have the same remainder.' },
              { id: 'works_for_all',  text: 'It works for every prime divisor because digit sums always equal the number.' },
              { id: 'digit_sum_equals', text: 'The digit sum equals the original number, so they always share every property.' },
            ].map(opt => (
              <label key={opt.id} className={`d9-option${state.misconceptionSelected === opt.id ? ' selected' : ''}`}>
                <input
                  type="radio"
                  name="misconception"
                  value={opt.id}
                  checked={state.misconceptionSelected === opt.id}
                  onChange={() => dispatch({ type: 'SELECT_MISCONCEPTION', payload: opt.id })}
                  aria-label={opt.text}
                />
                {opt.text}
              </label>
            ))}
            <button
              className="d9-misconception-check-btn"
              onClick={() => dispatch({ type: 'CHECK_MISCONCEPTION' })}
              disabled={!state.misconceptionSelected}
            >
              Check my answer
            </button>
            {state.misconceptionChecked && state.misconceptionFeedback && (
              <div className={`d9-misconception-feedback ${
                state.misconceptionSelected === 'correct' ? 'correct' : 'wrong'
              }`} role="status">
                {state.misconceptionFeedback}
              </div>
            )}
          </div>
        </section>

      </main>

      {/* ── Right Rail: Why it works ── */}
      <aside className="d9-rail" aria-label="Why it works — reasoning panel">
        <h2 className="d9-rail-title">
          <Sparkles size={18} /> Why it works
        </h2>

        {/* Step 1 */}
        <div className="d9-why-card">
          <div className="d9-why-header">
            <div className="d9-why-num">1</div>
            <p className="d9-why-text">
              <strong>10 ≡ 1 (mod 9)</strong>
            </p>
          </div>
          <div className="d9-why-stacks">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="d9-why-counter-circle"
                style={{ background: i < 9 ? '#6d28d9' : '#e11d48', width: 14, height: 14, fontSize: 7 }}>
              </div>
            ))}
          </div>
          <div className="d9-why-arrow">⟺ <span className="d9-why-equiv">≡ 1 (mod 9)</span></div>
          <div className="d9-why-formula">10 = 9×1 + 1<br />∴ 10 ≡ 1 (mod 9)</div>
        </div>

        {/* Step 2 */}
        <div className="d9-why-card">
          <div className="d9-why-header">
            <div className="d9-why-num">2</div>
            <p className="d9-why-text">
              Replace each place value by its digit.
            </p>
          </div>
          <div className="d9-why-stacks">
            {PLACE_VALUE_COLUMNS.slice().reverse().map((col) => (
              <div key={col.name as string} className="d9-why-stack-col">
                <div className="d9-why-counter-circle"
                  style={{ background: col.color, width: 20, height: 20, fontSize: 8, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
                  d
                </div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>↓</div>
                <div className="d9-why-counter-circle"
                  style={{ background: col.color, width: 20, height: 20, fontSize: 8, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
                  d
                </div>
              </div>
            ))}
          </div>
          <div className="d9-why-formula">10^k ≡ 1^k = 1 (mod 9)<br />for all k ≥ 0</div>
        </div>

        {/* Step 3 */}
        <div className="d9-why-card">
          <div className="d9-why-header">
            <div className="d9-why-num">3</div>
            <p className="d9-why-text">
              Remainder depends only on the digit sum.
            </p>
          </div>
          <div className="d9-why-formula">
            N ≡ (mod 9) S
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 22, background: '#ede9fe', borderRadius: 6, fontWeight: 800, fontSize: 11, color: '#6d28d9', border: '1.5px solid #a78bfa' }}>N</span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>≡ (mod 9)</span>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 22, background: '#d1fae5', borderRadius: 6, fontWeight: 800, fontSize: 11, color: '#047857', border: '1.5px solid #6ee7b7' }}>S</span>
          </div>
        </div>

        {/* Powers table */}
        <div className="d9-why-card">
          <div className="d9-why-header">
            <div className="d9-why-num">📋</div>
            <p className="d9-why-text"><strong>All powers of 10 leave remainder 1</strong></p>
          </div>
          {WHY_EQUIV.map(row => (
            <div key={row.power} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, padding: '3px 0', borderBottom: '1px solid #f1f0fa' }}>
              <span style={{ fontWeight: 700, color: PLACE_VALUE_COLUMNS[row.power]?.color ?? '#6d28d9' }}>
                {row.val}
              </span>
              <span style={{ color: '#94a3b8', fontSize: 10 }}>{row.explanation}</span>
              <span style={{ background: '#d1fae5', color: '#059669', padding: '1px 6px', borderRadius: 5, fontSize: 9.5, fontWeight: 700 }}>rem 1</span>
            </div>
          ))}
        </div>

        {/* Predict remainder card */}
        <div className="d9-predict-card">
          <p className="d9-predict-title">Predict the remainder (mod 9)</p>
          <p className="d9-predict-label">Number</p>
          <p className="d9-predict-number">{numStr}</p>
          <div className="d9-predict-row">
            <span className="d9-predict-arrow">→</span>
            <span className="d9-predict-question">
              {showPredictResult ? nMod : '?'}
            </span>
          </div>
          <button
            className="d9-reveal-btn"
            onClick={() => setShowPredictResult(v => !v)}
            aria-label={showPredictResult ? 'Hide remainder' : 'Reveal remainder'}
          >
            {showPredictResult ? 'Hide' : '▶ Show mini proof'}
          </button>
          {showPredictResult && (
            <div className="d9-reveal-result" role="status">
              Remainder is <strong>{nMod}</strong> for both.<br />
              {numStr} ≡ {nMod} (mod 9) &nbsp;|&nbsp; digit sum {ds} ≡ {sMod} (mod 9)
            </div>
          )}
        </div>

        {/* Proof-state progress */}
        <div className="d9-proof-steps" aria-label="Proof progress">
          {PROOF_STATE_ORDER.map((step, i) => {
            const isDone   = i < proofStateIdx;
            const isActive = step === state.proofState;
            return (
              <div key={step} className={`d9-proof-step${isActive ? ' active' : isDone ? ' done' : ''}`}>
                <div className="d9-step-dot" />
                <span>{PROOF_STATES[step]}</span>
              </div>
            );
          })}
        </div>

        {/* Hint card */}
        <div className="d9-hint-card" aria-live="polite">
          <p className="d9-hint-label">Hint system</p>
          {currentHint ? (
            <>
              <p className="d9-hint-title">{currentHint.level}. {currentHint.title}</p>
              <p className="d9-hint-body">{currentHint.body}</p>
            </>
          ) : (
            <p className="d9-hint-body" style={{ color: '#94a3b8' }}>
              Click a hint level to reveal guidance.
            </p>
          )}
          <div className="d9-hint-btns">
            {HINTS.map(h => (
              <button
                key={h.level}
                className="d9-hint-btn"
                onClick={() => dispatch({
                  type: 'SET_HINT_LEVEL',
                  payload: state.hintLevel === h.level ? 0 : h.level,
                })}
                aria-label={`Hint ${h.level}: ${h.title}`}
                aria-pressed={state.hintLevel === h.level}
              >
                {h.level}. {h.title}
              </button>
            ))}
          </div>
        </div>

        {/* Completion banner */}
        {completion.isComplete && (
          <div className="d9-completion-banner" role="alert" aria-live="assertive">
            🎉 Proof complete!
            <p>
              You demonstrated that {numStr} and its digit sum {ds} both leave
              remainder {nMod} when divided by 9.
              Because 10^k ≡ 1 (mod 9) for all k, every number shares its
              mod-9 remainder with its digit sum.
            </p>
          </div>
        )}
      </aside>

      {/* ── Rejection toast ── */}
      {rejectionMsg && (
        <div className="d9-rejection-toast" role="alert" aria-live="assertive">
          {rejectionMsg}
        </div>
      )}
    </div>
  );
}
