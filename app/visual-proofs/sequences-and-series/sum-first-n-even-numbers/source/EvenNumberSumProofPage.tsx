// ─── Sum of First n Even Numbers — Proof Page ────────────────────────────────
import React, {
  useReducer, useRef, useEffect, useState, useMemo, useCallback,
} from 'react';
import {
  Brain, Bookmark, Lightbulb, PenLine, Settings, Crosshair, Sparkles,
  HelpCircle, Undo2, Redo2, Play, Pause, RotateCcw, Trophy, MousePointer2,
  Rows3, Eraser, Check, MessageSquare, Headphones,
} from 'lucide-react';

import { HINTS, PROOF_STATES, MISCONCEPTION_OPTIONS, LIMITS } from './even-number-sumConfig';
import {
  VIEW_W, VIEW_H, DOT_R, HIT_R, evenSum, rectangleArea, triangular, evenTerm,
  getRowLayouts, getRectLayout, pxToSvg, minDistToRowTarget, type Point,
} from './even-number-sumMath';
import { ensReducer, initEnsState } from './even-number-sumReducer';
import { checkCompletion, getRejectionMessage, getOutOfBandMessage } from './even-number-sumCompletion';
import './even-number-sum.css';

export function EvenNumberSumProofPage() {
  const [state, dispatch] = useReducer(ensReducer, undefined, initEnsState);
  const svgRef = useRef<SVGSVGElement>(null);
  const grabOffsetRef = useRef({ x: 0, y: 0 });
  const draggingIdRef = useRef<number | null>(null);
  const [rejectionMsg, setRejectionMsg] = useState<string | null>(null);
  const [formulaRevealed, setFormulaRevealed] = useState(false);
  const [announce, setAnnounce] = useState('Inspect the even-number rows. Each row i has 2i dots.');
  const rejTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const layouts = useMemo(() => getRowLayouts(state.n), [state.n]);
  const rect = useMemo(() => getRectLayout(state.n), [state.n]);
  const completion = useMemo(() => checkCompletion(state), [state]);
  const sum = evenSum(state.n);
  const area = rectangleArea(state.n);
  const tN = triangular(state.n);

  const dockedCount = state.rows.filter((r) => r.docked).length;

  useEffect(() => {
    if (!state.isPlaying) return;
    const ms = 700 / state.animationSpeed;
    const t = setInterval(() => dispatch({ type: 'TICK_ANIMATION' }), ms);
    return () => clearInterval(t);
  }, [state.isPlaying, state.animationSpeed]);

  const showRejection = useCallback((msg: string) => {
    setRejectionMsg(msg);
    setAnnounce(msg);
    if (rejTimerRef.current) clearTimeout(rejTimerRef.current);
    rejTimerRef.current = setTimeout(() => setRejectionMsg(null), 4200);
  }, []);

  const clientToSvg = useCallback((cx: number, cy: number): Point => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const box = svgRef.current.getBoundingClientRect();
    return {
      x: ((cx - box.left) / box.width) * VIEW_W,
      y: ((cy - box.top) / box.height) * VIEW_H,
    };
  }, []);

  const findSnap = useCallback((svgX: number, svgY: number, rowI: number) => {
    const commit = pxToSvg(LIMITS.snapCommitPx, svgRef.current);
    const attract = pxToSvg(LIMITS.snapAttractPx, svgRef.current);
    const discover = pxToSvg(LIMITS.snapDiscoverPx, svgRef.current);
    let best: { i: number; x: number; y: number; d: number; band: 'commit' | 'attract' | 'discover' } | null = null;
    for (const lay of layouts) {
      const d = minDistToRowTarget(svgX, svgY, lay);
      let band: 'commit' | 'attract' | 'discover' | null = null;
      if (d <= commit) band = 'commit';
      else if (d <= attract) band = 'attract';
      else if (d <= discover) band = 'discover';
      if (!band) continue;
      if (!best || d < best.d) best = { i: lay.i, x: lay.dockCentroid.x, y: lay.dockCentroid.y, d, band };
    }
    if (!best) return null;
    if (!state.snapEnabled && best.i !== rowI) return null;
    return best;
  }, [layouts, state.snapEnabled]);

  const onPointerDown = useCallback((e: React.PointerEvent, rowI: number) => {
    e.stopPropagation();
    if (state.tool === 'erase') {
      dispatch({ type: 'START_DRAG', payload: { i: rowI, x: 0, y: 0 } });
      setAnnounce(`Erased row ${rowI}. It returns to the even-number triangle. Count is unchanged.`);
      return;
    }
    svgRef.current?.setPointerCapture(e.pointerId);
    draggingIdRef.current = rowI;
    const row = state.rows.find((r) => r.i === rowI);
    if (!row) return;
    const p = clientToSvg(e.clientX, e.clientY);
    grabOffsetRef.current = { x: p.x - row.x, y: p.y - row.y };
    dispatch({ type: 'START_DRAG', payload: { i: rowI, x: row.x, y: row.y } });
    setAnnounce(`Picked up row ${rowI} (${evenTerm(rowI)} dots). Dock with the matching series slot.`);
  }, [state.rows, clientToSvg]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const id = draggingIdRef.current;
    if (id === null) return;
    const p = clientToSvg(e.clientX, e.clientY);
    const nx = p.x - grabOffsetRef.current.x;
    const ny = p.y - grabOffsetRef.current.y;
    dispatch({ type: 'DRAG_ROW', payload: { x: nx, y: ny } });
  }, [clientToSvg]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    const id = draggingIdRef.current;
    draggingIdRef.current = null;
    if (id === null) return;
    svgRef.current?.releasePointerCapture(e.pointerId);
    const row = state.rows.find((r) => r.i === id);
    if (!row) return;
    const snap = findSnap(row.x, row.y, id);
    if (!snap || snap.band !== 'commit') {
      showRejection(snap ? getOutOfBandMessage() : 'Drop on the dashed target for that row. Compatible drop: dock with matching series.');
      dispatch({ type: 'REJECT_ROW', payload: { i: id } });
      return;
    }
    if (snap.i !== id) {
      showRejection(getRejectionMessage(id, snap.i, state.n));
      dispatch({ type: 'REJECT_ROW', payload: { i: id } });
      return;
    }
    const already = state.rows.find((r) => r.i === snap.i && r.docked && r.i !== id);
    if (already) {
      showRejection(getRejectionMessage(id, snap.i, state.n));
      dispatch({ type: 'REJECT_ROW', payload: { i: id } });
      return;
    }
    dispatch({ type: 'DOCK_ROW', payload: { i: id, x: snap.x, y: snap.y } });
    setAnnounce(`Row ${id} docked. Count unchanged: ${evenTerm(id)} dots still counted once. ${dockedCount + 1} of ${state.n} layers placed.`);
  }, [state.rows, state.n, findSnap, showRejection, dockedCount]);

  const onSvgKeyDown = useCallback((e: React.KeyboardEvent) => {
    const sel = state.rows.find((r) => r.selected);
    if (e.key === 'Escape') {
      if (draggingIdRef.current !== null) {
        dispatch({ type: 'REJECT_ROW', payload: { i: draggingIdRef.current } });
        draggingIdRef.current = null;
      } else if (sel) dispatch({ type: 'SELECT_ROW', payload: null });
      return;
    }
    if (!sel) return;
    const STEP = e.shiftKey ? 24 : 8;
    let dx = 0, dy = 0;
    if (e.key === 'ArrowLeft') { dx = -STEP; e.preventDefault(); }
    if (e.key === 'ArrowRight') { dx = STEP; e.preventDefault(); }
    if (e.key === 'ArrowUp') { dy = -STEP; e.preventDefault(); }
    if (e.key === 'ArrowDown') { dy = STEP; e.preventDefault(); }
    if (dx || dy) dispatch({ type: 'KEYBOARD_MOVE', payload: { i: sel.i, dx, dy } });
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const snap = findSnap(sel.x, sel.y, sel.i);
      if (snap?.band === 'commit' && snap.i === sel.i) {
        dispatch({ type: 'DOCK_ROW', payload: { i: sel.i, x: snap.x, y: snap.y } });
      } else {
        showRejection('Enter docks only in the commit band of the matching slot.');
      }
    }
  }, [state.rows, findSnap, showRejection]);

  const dragging = draggingIdRef.current !== null
    ? state.rows.find((r) => r.i === draggingIdRef.current)
    : state.rows.find((r) => r.i === state.draggingId);
  const ghost = dragging ? findSnap(dragging.x, dragging.y, dragging.i) : null;

  const checks = {
    rowDots: true,
    rowSum: true,
    pairs: dockedCount > 0,
    area: completion.allDocked,
  };

  const renderDots = (pts: Point[], color: string, keyPrefix: string, dashed = false) =>
    pts.map((p, k) => (
      <circle
        key={`${keyPrefix}-${k}`}
        cx={p.x} cy={p.y} r={DOT_R}
        fill={dashed ? 'none' : color}
        stroke={color}
        strokeWidth={dashed ? 1.5 : 0}
        strokeDasharray={dashed ? '3 2' : undefined}
        opacity={dashed ? 0.55 : 1}
      />
    ));

  return (
    <div className="ens-shell">
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
            { Icon: Brain, label: 'Explore', active: true },
            { Icon: Lightbulb, label: 'Proofs', active: false },
            { Icon: PenLine, label: 'Practice', active: false },
            { Icon: Bookmark, label: 'Saved', active: false },
          ].map(({ Icon, label, active }) => (
            <button key={label} className={`nav-item${active ? ' active' : ''}`} aria-label={label}>
              <Icon size={26}/><span>{label}</span>
            </button>
          ))}
        </nav>
        <button className="nav-item settings" aria-label="Settings">
          <Settings size={24}/><span>Settings</span>
        </button>
        <button className="nav-item ens-feedback" aria-label="Give Feedback">
          <MessageSquare size={22}/><span>Give Feedback</span>
        </button>
      </aside>

      <main className="ens-main">
        <header className="ens-header">
          <div>
            <div className="ens-crumb">Visual Proofs <span>/</span> Number Patterns</div>
            <h1 className="ens-title">Sum of First n Even Numbers</h1>
            <p className="ens-subtitle">Turn even-number rows into a rectangle.</p>
          </div>
          <div className="ens-badges">
            <div className="ens-badge">
              <Headphones size={16}/> Intermediate
            </div>
            <div className="ens-badge">10 min</div>
            <button type="button" className="ens-help-badge" aria-label="Help: combine two triangles into an n by n+1 rectangle">
              ?
            </button>
          </div>
        </header>

        <div className="ens-mission" role="status">
          <div className="ens-mission-icon" aria-hidden="true"><Crosshair size={22}/></div>
          <span>
            <b>Mission:</b> Pair the even-number rows to form a rectangle. Drag the floating row to its mirror position.
          </span>
          <div className="ens-legend" aria-hidden="true">
            <span><i className="ens-leg-dots"/> Rows</span>
            <span><i className="ens-leg-path"/> Mirror path</span>
            <span><i className="ens-leg-target"/> Target</span>
          </div>
        </div>

        <nav className="ens-wizard" aria-label="Proof steps">
          {PROOF_STATES.map((st, i) => {
            const active = state.proofState === st;
            const done = state.visitedStates.has(st) && !active;
            return (
              <React.Fragment key={st}>
                <button
                  className={`ens-wizard-btn${active ? ' active' : ''}${done ? ' completed' : ''}`}
                  onClick={() => dispatch({ type: 'SET_STATE', payload: st })}
                  aria-selected={active}
                  role="tab">
                  {i + 1}. {st.charAt(0).toUpperCase() + st.slice(1)}
                </button>
                {i < 5 && <span className="ens-wizard-sep">/</span>}
              </React.Fragment>
            );
          })}
          <div className="ens-wizard-tools">
            <button className="ens-tool-btn" onClick={() => dispatch({ type: 'UNDO' })}
              disabled={state.historyIndex <= 0} aria-label="Undo"><Undo2 size={14}/></button>
            <button className="ens-tool-btn" onClick={() => dispatch({ type: 'REDO' })}
              disabled={state.historyIndex >= state.history.length - 1} aria-label="Redo"><Redo2 size={14}/></button>
          </div>
        </nav>

        <div className="ens-body">
          <div className="ens-left">
            <section className="ens-lab" aria-label="Interactive workspace">
              <div className="ens-lab-head">
                <h2>Interactive Workspace</h2>
                <p className="ens-lab-note">Combine two triangular dot patterns into an n by n+1 rectangle. Each dot is counted once.</p>
              </div>
              <div className="ens-lab-grid">
                <div className="ens-controls">
                  <div className="ens-ctrl-card">
                    <span>Choose n</span>
                    <div className="ens-stepper">
                      <button type="button" aria-label="Decrease n"
                        onClick={() => dispatch({ type: 'SET_N', payload: state.n - 1 })}>−</button>
                      <div className="ens-n-read" aria-live="polite">{state.n}</div>
                      <button type="button" aria-label="Increase n"
                        onClick={() => dispatch({ type: 'SET_N', payload: state.n + 1 })}>+</button>
                    </div>
                  </div>
                  <div className="ens-ctrl-card">
                    <span>What stays true</span>
                    <ul className="ens-checks">
                      {[
                        { on: checks.rowDots, label: 'Row i has 2i dots' },
                        { on: checks.rowSum, label: 'Row i sums to 2i' },
                        { on: checks.pairs, label: 'Pairs make n(n + 1) dots' },
                        { on: checks.area, label: 'Area = n(n + 1)' },
                      ].map((c) => (
                        <li key={c.label}>
                          <span className={`ens-check${c.on ? ' on' : ''}`}>{c.on ? '✓' : ''}</span>
                          {c.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="ens-ctrl-card">
                    <label className="ens-toggle-row">
                      Show hints
                      <span className="ens-switch">
                        <input type="checkbox" checked={state.showHints}
                          onChange={() => dispatch({ type: 'TOGGLE_HINTS' })}/>
                        <span className="ens-slider"/>
                      </span>
                    </label>
                    <label className="ens-toggle-row">
                      Snap to grid
                      <span className="ens-switch">
                        <input type="checkbox" checked={state.snapEnabled}
                          onChange={() => dispatch({ type: 'TOGGLE_SNAP' })}/>
                        <span className="ens-slider"/>
                      </span>
                    </label>
                  </div>
                  <div className="ens-ctrl-card">
                    <span>Tools</span>
                    <div className="ens-tools">
                      {([
                        { id: 'select' as const, Icon: MousePointer2, label: 'Select' },
                        { id: 'row' as const, Icon: Rows3, label: 'Row' },
                        { id: 'erase' as const, Icon: Eraser, label: 'Erase' },
                      ]).map(({ id, Icon, label }) => (
                        <button key={id}
                          className={`ens-palette-btn${state.tool === id ? ' active' : ''}`}
                          onClick={() => dispatch({ type: 'SET_TOOL', payload: id })}>
                          <Icon size={16}/>{label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="ens-canvas-wrap">
                  <svg
                    ref={svgRef}
                    viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onKeyDown={onSvgKeyDown}
                    tabIndex={0}
                    role="application"
                    aria-label="Even-number rows. Drag each row to its mirror slot in the n by n+1 rectangle."
                    style={{ outline: 'none' }}
                  >
                    <title>Sum of first n even numbers</title>
                    <desc>
                      Left: even-number triangle with row i having 2i dots.
                      Right: n by n plus one rectangle built from two triangular patterns.
                      Each term is counted once.
                    </desc>

                    <text x="248" y="36" textAnchor="middle" fill="#2c1bff" fontSize="14" fontWeight="700">
                      Even-number rows
                    </text>
                    <text x={rect.x + rect.width / 2} y="36" textAnchor="middle" fill="#2c1bff" fontSize="14" fontWeight="700">
                      Paired rows make a rectangle
                    </text>

                    <rect x={rect.x} y={rect.y} width={rect.width} height={rect.height}
                      fill="#f4f1ff" stroke="#c5b8ff" strokeWidth="1.5" rx="6"/>

                    {Array.from({ length: rect.rows }, (_, r) =>
                      Array.from({ length: rect.cols }, (_, c) => (
                        <rect key={`g-${r}-${c}`}
                          x={rect.x + c * rect.cell} y={rect.y + r * rect.cell}
                          width={rect.cell} height={rect.cell}
                          fill="none" stroke="#ddd6fe" strokeWidth="0.6"/>
                      )),
                    )}

                    {layouts.map((lay) => {
                      const row = state.rows.find((r) => r.i === lay.i)!;
                      if (row.docked) return null;
                      return (
                        <rect key={`tgt-${lay.i}`}
                          x={Math.min(...[...lay.groupA, ...lay.groupB].map((p) => p.x)) - DOT_R - 4}
                          y={Math.min(...[...lay.groupA, ...lay.groupB].map((p) => p.y)) - DOT_R - 4}
                          width={Math.max(...[...lay.groupA, ...lay.groupB].map((p) => p.x))
                            - Math.min(...[...lay.groupA, ...lay.groupB].map((p) => p.x)) + (DOT_R + 4) * 2}
                          height={Math.max(...[...lay.groupA, ...lay.groupB].map((p) => p.y))
                            - Math.min(...[...lay.groupA, ...lay.groupB].map((p) => p.y)) + (DOT_R + 4) * 2}
                          fill="none" stroke={lay.color} strokeDasharray="5 4" strokeWidth="1.4" rx="6"
                          opacity={ghost?.i === lay.i ? 1 : 0.35}/>
                      );
                    })}

                    {layouts.map((lay) => {
                      const row = state.rows.find((r) => r.i === lay.i)!;
                      if (!row.docked) {
                        return <g key={`empty-${lay.i}`}>{renderDots([...lay.groupA, ...lay.groupB], lay.color, `ghost-${lay.i}`, true)}</g>;
                      }
                      const isDrag = dragging?.i === lay.i;
                      return (
                        <g key={`full-${lay.i}`}
                          className={`ens-row-handle${isDrag ? ' grabbing' : ''}`}
                          onPointerDown={(e) => onPointerDown(e, lay.i)}
                          role="img"
                          aria-label={`Docked row ${lay.i}: ${lay.evenValue} dots in the rectangle.`}>
                          <circle cx={row.x} cy={row.y} r={HIT_R} fill="transparent"/>
                          {renderDots([...lay.groupA, ...lay.groupB], lay.color, `dock-${lay.i}`)}
                        </g>
                      );
                    })}

                    {ghost && dragging && ghost.band !== 'discover' && (
                      <g opacity="0.35" pointerEvents="none">
                        {(() => {
                          const lay = layouts.find((l) => l.i === dragging.i)!;
                          return renderDots([...lay.groupA, ...lay.groupB], lay.color, 'preview');
                        })()}
                      </g>
                    )}

                    {layouts.map((lay) => {
                      const row = state.rows.find((r) => r.i === lay.i)!;
                      if (row.docked) return null;
                      const dx = row.x - lay.homeCentroid.x;
                      const dy = row.y - lay.homeCentroid.y;
                      const isDrag = dragging?.i === lay.i;
                      return (
                        <g key={`home-${lay.i}`}
                          className={`ens-row-handle${isDrag ? ' grabbing' : ''}`}
                          onPointerDown={(e) => onPointerDown(e, lay.i)}
                          role="img"
                          aria-label={`Row ${lay.i}: ${lay.evenValue} dots. Move the sequence to its mirror slot.`}>
                          <circle cx={row.x} cy={row.y} r={HIT_R} fill="transparent"/>
                          {lay.homeDots.map((p, k) => (
                            <circle key={k} cx={p.x + dx} cy={p.y + dy} r={DOT_R} fill={lay.color}
                              stroke={row.selected ? '#fff' : 'rgba(255,255,255,.7)'}
                              strokeWidth={row.selected ? 2.5 : 1}/>
                          ))}
                          <text x={row.x} y={lay.homeDots[0].y + dy + 22} textAnchor="middle"
                            fill="#5360a6" fontSize="10" style={{ pointerEvents: 'none' }}>
                            {lay.evenValue}
                          </text>
                        </g>
                      );
                    })}

                    <text x={rect.x + rect.width + 18} y={rect.y + rect.height / 2}
                      fill="#4f1ee8" fontSize="16" fontWeight="700" fontFamily="Georgia, serif">n</text>
                    <text x={rect.x + rect.width / 2} y={rect.y + rect.height + 22}
                      textAnchor="middle" fill="#4f1ee8" fontSize="16" fontWeight="700" fontFamily="Georgia, serif">n+1</text>
                  </svg>
                </div>
              </div>

              <div className="ens-playback">
                <button className="ens-pb-btn" onClick={() => dispatch({ type: 'RESET' })} aria-label="Reset">
                  <RotateCcw size={14}/> Reset
                </button>
                <button className={`ens-pb-btn${state.isPlaying ? ' active' : ''}`}
                  onClick={() => dispatch({ type: 'TOGGLE_PLAY' })}
                  aria-label={state.isPlaying ? 'Pause' : 'Play auto-animation'}>
                  {state.isPlaying ? <><Pause size={14}/> Pause</> : <><Play size={14}/> Play</>}
                </button>
                <button className="ens-pb-btn" onClick={() => dispatch({ type: 'AUTO_STEP' })}
                  disabled={completion.allDocked}
                  aria-label="Step forward — dock next unmatched row">Next</button>
                <select className="ens-speed-select" value={state.animationSpeed}
                  onChange={(e) => dispatch({ type: 'SET_ANIMATION_SPEED', payload: Number(e.target.value) })}
                  aria-label="Animation speed">
                  <option value={0.5}>0.5×</option>
                  <option value={1}>1×</option>
                  <option value={1.5}>1.5×</option>
                </select>
                <input className="ens-n-slider" type="range" min={1} max={10} value={state.n}
                  onChange={(e) => dispatch({ type: 'SET_N', payload: Number(e.target.value) })}
                  aria-label="Scrub n from 1 to 10"/>
              </div>
            </section>

            <section className="ens-proof-strip" aria-label="One-line visual proof">
              <h3>One-line visual proof</h3>
              <div className="ens-formula">
                <span>2 + 4 + ⋯ + 2n</span>
                <span>=</span>
                <span className="ens-under">
                  (1+2+⋯+n) + (1+2+⋯+n)
                  <small>two copies of Tₙ = n(n+1)/2</small>
                </span>
                <span>=</span>
                <span className="ens-area-box ens-under">
                  n(n+1)
                  <small>rectangle area</small>
                </span>
              </div>
              <p style={{ margin: '12px 0 0', fontSize: '13px', color: '#4a4e8c', lineHeight: 1.55 }}>
                Illustration for this n is the picture. The general step: every even row 2i splits into two
                triangular rows of i, counted once each, so the sum equals 2Tₙ = n(n+1) for every integer n ≥ 1.
              </p>
            </section>

            <section className="ens-challenge-strip" aria-label="Transfer challenge">
              <h3>Exact challenge</h3>
              <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#1a205c' }}>
                Prove that 2 + 4 + ⋯ + 2n = n(n+1) for any positive integer n.
                Test a new valid example: name the rectangle sides for a fresh n.
              </p>
              <div className="ens-challenge-grid">
                <div className="ens-challenge-fields">
                  <label className="ens-field">n
                    <input type="number" min={1} value={state.challengeN}
                      onChange={(e) => dispatch({ type: 'SET_CHALLENGE_N', payload: e.target.value })}/>
                  </label>
                  <label className="ens-field">height
                    <input type="number" min={1} placeholder="n" value={state.challengeHeight}
                      onChange={(e) => dispatch({ type: 'SET_CHALLENGE_HEIGHT', payload: e.target.value })}/>
                  </label>
                  <label className="ens-field">width
                    <input type="number" min={1} placeholder="n+1" value={state.challengeWidth}
                      onChange={(e) => dispatch({ type: 'SET_CHALLENGE_WIDTH', payload: e.target.value })}/>
                  </label>
                </div>
                <button className="ens-check-btn" onClick={() => dispatch({ type: 'CHECK_CHALLENGE' })}
                  aria-label="Check my understanding">
                  <Check size={16}/> Check my understanding
                </button>
              </div>
              {state.challengeChecked && state.challengeResult && (
                <div className={`ens-challenge-result ${state.transferPassed ? 'ok' : 'fail'}`} role="status">
                  {state.challengeResult}
                </div>
              )}
            </section>
          </div>

          <aside className="ens-rail" aria-label="Reasoning panel">
            <section className="ens-why">
              <h2><Sparkles size={16}/> Why it works</h2>
              <div className="ens-reason">
                <strong>1 · See even sums as doubled triangles</strong>
                Row i has {evenTerm(state.n > 0 ? 1 : 1)}… up to 2n = {evenTerm(state.n)} dots.
                That is two copies of 1, 2, …, n.
                <svg className="ens-mini" viewBox="0 0 120 40" aria-hidden="true">
                  {[1,2,3,4].map((r) =>
                    Array.from({ length: r }, (_, c) => (
                      <circle key={`${r}-${c}`} cx={12 + c * 9} cy={6 + r * 7} r="3" fill="#7c5cfc"/>
                    )),
                  )}
                </svg>
              </div>
              <div className="ens-reason">
                <strong>2 · Combine two triangular patterns</strong>
                Pair the top row with its mirror. Do this n times. Count is preserved: no extra dots.
              </div>
              <div className="ens-reason">
                <strong>3 · Build n(n+1) visually</strong>
                You get a rectangle of n rows and n+1 columns.
                Area {state.n}×{state.n + 1} = {area}, matching the live sum {sum}.
              </div>
              <div className="ens-pred-box">
                For n = {state.n}: Sum = {state.n} × {state.n + 1} = {area}
                {formulaRevealed ? ` · 2Tₙ = 2×${tN} = ${2 * tN}` : ''}
              </div>
              <button className="ens-reveal-btn"
                onClick={() => {
                  setFormulaRevealed(true);
                  dispatch({ type: 'ACCEPT_GENERAL' });
                  setAnnounce('Formula shown as a reading aid. Completion still needs the constructed rectangle, the misconception check, and the transfer challenge.');
                }}
                aria-label="Show the n(n+1) reading of the rectangle. This does not mark the proof complete.">
                Reveal proof
              </button>
            </section>

            {state.showHints && (
              <div className="ens-hint-card" role="region" aria-label="Hint system">
                <div className="ens-hint-header">
                  <h3><HelpCircle size={14}/> Hint {state.hintLevel}/5</h3>
                  <div className="ens-hint-dots" role="tablist">
                    {[1,2,3,4,5].map((n) => (
                      <button key={n} className={`ens-hint-dot${state.hintLevel === n ? ' active' : ''}`}
                        onClick={() => dispatch({ type: 'SET_HINT', payload: n })}
                        aria-label={`Hint ${n}`} role="tab" aria-selected={state.hintLevel === n}/>
                    ))}
                  </div>
                </div>
                <div className="ens-hint-body">
                  <strong>{HINTS[state.hintLevel - 1].title}</strong>
                  {' '}{HINTS[state.hintLevel - 1].text}
                </div>
                <div className="ens-hint-footer">
                  <button className="ens-hint-nav-btn" disabled={state.hintLevel === 1}
                    onClick={() => dispatch({ type: 'SET_HINT', payload: state.hintLevel - 1 })}>← Prev</button>
                  <button className="ens-hint-nav-btn" disabled={state.hintLevel === 5}
                    onClick={() => dispatch({ type: 'SET_HINT', payload: state.hintLevel + 1 })}>Next →</button>
                </div>
              </div>
            )}

            <section className="ens-predict" aria-label="Prediction">
              <h3>Make a prediction</h3>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#4a4e8c' }}>
                For n = {state.n}, is 2+4+⋯+{evenTerm(state.n)} equal to the rectangle area {area}?
              </p>
              <div className="ens-pred-row">
                {(['yes', 'no', 'notsure'] as const).map((v) => (
                  <button key={v}
                    className={`ens-pred-btn${state.predictionAnswer === v ? ' selected' : ''}`}
                    onClick={() => dispatch({ type: 'SET_PREDICTION', payload: v })}>
                    {v === 'notsure' ? 'Not sure' : v === 'yes' ? 'Yes' : 'No'}
                  </button>
                ))}
              </div>
              <button className="ens-reveal-btn" disabled={!state.predictionAnswer}
                onClick={() => dispatch({ type: 'CHECK_PREDICTION' })}
                aria-label="Show whether the live count matches n(n+1). Does not complete the proof.">
                Show the live count
              </button>
              {state.predictionChecked && (
                <p style={{ fontSize: '12.5px', margin: '10px 0 0', color: '#06723c', fontWeight: 600 }}>
                  Counted sum = {sum}. Rectangle = {state.n}×{state.n + 1} = {area}.
                  {sum === area ? ' They match because every dot is counted once.' : ''}
                </p>
              )}
            </section>

            <section className="ens-misconception" aria-label="Misconception checkpoint">
              <h3><Brain size={14}/> Misconception check</h3>
              <p>Before you conclude: why is the result n(n+1) and not n²?</p>
              {MISCONCEPTION_OPTIONS.map((opt) => (
                <button key={opt.key}
                  className={`ens-mc-option${state.misconceptionSelected === opt.key ? ' selected' : ''}`}
                  onClick={() => dispatch({ type: 'SET_MISCONCEPTION', payload: opt.key })}>
                  <span className="ens-radio"/>
                  <span>{opt.text}</span>
                </button>
              ))}
              <button className="ens-validate-btn" disabled={!state.misconceptionSelected}
                onClick={() => dispatch({ type: 'CHECK_MISCONCEPTION' })}>
                Validate
              </button>
              {state.misconceptionFeedback && (
                <div className={`ens-mc-feedback${state.misconceptionSelected === 'correct' ? ' correct' : ' incorrect'}`}
                  role="status">
                  {state.misconceptionFeedback}
                </div>
              )}
            </section>

            <section className="ens-conclusion" aria-label="Conclusion">
              <h3>Conclusion</h3>
              <p>
                <b>Theorem.</b> For every integer n ≥ 1,
                2 + 4 + ⋯ + 2n = n(n+1).
                Built from the invariant: each of the {sum} dots is counted once;
                rearrangement into two copies of Tₙ does not change the count;
                those copies fill an n by (n+1) rectangle of area {area}.
              </p>
            </section>

            {completion.isComplete && (
              <section className="ens-completion" role="status" aria-live="polite">
                <h2><Trophy size={18}/> You proved it</h2>
                <p>
                  You proved it by preserving the required relationship:
                  even rows as doubled triangles, assembled into n(n+1) area, then checked on a new n.
                </p>
              </section>
            )}
          </aside>
        </div>
      </main>

      <div className="ens-sr" role="status" aria-live="polite">{announce}</div>
      {rejectionMsg && (
        <div className="ens-toast" role="alert">{rejectionMsg}</div>
      )}
    </div>
  );
}
