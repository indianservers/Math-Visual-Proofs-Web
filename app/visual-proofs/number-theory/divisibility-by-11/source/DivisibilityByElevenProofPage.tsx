import React, { useReducer, useRef, useEffect, useState, useMemo } from 'react';
import { 
  Brain, Bookmark, Lightbulb, PenLine, Settings, Crosshair, Sparkles, 
  ChevronRight, Play, Pause, RotateCcw, Trophy, HelpCircle, Undo2, Redo2 
} from 'lucide-react';
import { LIMITS, HINTS } from './divisibility-by-11Config';
import type { ProofState } from './divisibility-by-11Config';
import { generateDragTargets, getDigitColor, digitsToNumber } from './divisibility-by-11Math';
import { divisibilityBy11Reducer, initDiv11State } from './divisibility-by-11Reducer';
import { checkCompletion } from './divisibility-by-11Completion';
import './divisibility-by-11.css';

export function DivisibilityByElevenProofPage() {
  const [state, dispatch] = useReducer(divisibilityBy11Reducer, undefined, initDiv11State);
  const [selectedDigitId, setSelectedDigitId] = useState<number | null>(null);

  // SVG coordinate dimensions
  const W = 800;
  const H = 340;

  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Generate snap targets dynamically
  const snapTargets = useMemo(() => {
    return generateDragTargets(state.digits);
  }, [state.digits]);

  // Dynamic sums based on actual user dragging placement
  const sumA = useMemo(() => {
    return state.counters
      .filter(c => c.dockState === 'groupA')
      .reduce((acc, c) => acc + c.val, 0);
  }, [state.counters]);

  const sumB = useMemo(() => {
    return state.counters
      .filter(c => c.dockState === 'groupB')
      .reduce((acc, c) => acc + c.val, 0);
  }, [state.counters]);

  const currentDiff = sumA - sumB;
  const currentDiffMod11 = ((currentDiff % 11) + 11) % 11;
  const originalNum = digitsToNumber(state.digits);
  const originalNumMod11 = originalNum % 11;

  const completion = useMemo(() => {
    return checkCompletion(state);
  }, [state]);

  // Auto playback ticks
  useEffect(() => {
    let timer: any = null;
    if (state.isPlaying) {
      timer = setInterval(() => {
        dispatch({ type: 'TICK_ANIMATION' });
      }, 500 / state.animationSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state.isPlaying, state.animationSpeed]);

  // Pointer event handlers for drag-and-drop
  const handlePointerDown = (id: number, e: React.PointerEvent) => {
    e.stopPropagation();
    const counter = state.counters.find(c => c.id === id);
    if (!counter) return;

    if (svgRef.current) {
      svgRef.current.setPointerCapture(e.pointerId);
    }
    setDraggingId(id);
    setSelectedDigitId(id);

    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const svgX = ((e.clientX - rect.left) / rect.width) * W;
      const svgY = ((e.clientY - rect.top) / rect.height) * H;
      dragOffset.current = {
        x: svgX - counter.x,
        y: svgY - counter.y,
      };
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingId === null || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    const svgY = ((e.clientY - rect.top) / rect.height) * H;

    let nextX = svgX - dragOffset.current.x;
    let nextY = svgY - dragOffset.current.y;

    nextX = Math.max(15, Math.min(W - 15, nextX));
    nextY = Math.max(15, Math.min(H - 15, nextY));

    // Magnetic snap attraction bounds checking
    let bestSnap = null;
    let minDistance = Infinity;

    for (const target of snapTargets) {
      const dist = Math.sqrt((nextX - target.x) ** 2 + (nextY - target.y) ** 2);
      if (dist < minDistance) {
        minDistance = dist;
        bestSnap = target;
      }
    }

    if (bestSnap && minDistance <= LIMITS.snapThreshold) {
      nextX = bestSnap.x;
      nextY = bestSnap.y;
    }

    dispatch({ type: 'DRAG_COUNTER', payload: { id: draggingId, x: nextX, y: nextY } });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingId === null) return;
    const counter = state.counters.find(c => c.id === draggingId);
    if (svgRef.current) {
      svgRef.current.releasePointerCapture(e.pointerId);
    }
    setDraggingId(null);

    if (!counter) return;

    let closestTarget = null;
    let minDistance = Infinity;

    for (const target of snapTargets) {
      const dist = Math.sqrt((counter.x - target.x) ** 2 + (counter.y - target.y) ** 2);
      if (dist < minDistance) {
        minDistance = dist;
        closestTarget = target;
      }
    }

    if (closestTarget && minDistance <= LIMITS.snapThreshold) {
      const isA = closestTarget.type === 'groupA';
      const isB = closestTarget.type === 'groupB';
      const isSlot = closestTarget.type === 'slot';

      let valid = false;
      if (isSlot && closestTarget.slotIdx === counter.id) {
        valid = true;
      } else if (isA && counter.power % 2 === 0) {
        valid = true;
      } else if (isB && counter.power % 2 !== 0) {
        valid = true;
      }

      if (valid) {
        dispatch({
          type: 'DOCK_COUNTER',
          payload: {
            id: counter.id,
            dockState: closestTarget.type,
            x: closestTarget.x,
            y: closestTarget.y,
          },
        });
        return;
      }
    }

    // Reject and snap back to previous docked state position
    const originalSlot = snapTargets.find(
      t => t.type === counter.dockState && (t.type === 'slot' ? t.slotIdx === counter.id : true)
    );
    dispatch({
      type: 'DRAG_COUNTER',
      payload: {
        id: counter.id,
        x: originalSlot?.x ?? 50,
        y: originalSlot?.y ?? 80,
      },
    });
  };

  // Keyboard steps
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (selectedDigitId === null) return;

    let stepX = 0;
    let stepY = 0;
    const stepSize = e.shiftKey ? 30 : 10;

    if (e.key === 'ArrowLeft') stepX = -stepSize;
    else if (e.key === 'ArrowRight') stepX = stepSize;
    else if (e.key === 'ArrowUp') stepY = -stepSize;
    else if (e.key === 'ArrowDown') stepY = stepSize;
    else if (e.key === 'Escape') {
      setSelectedDigitId(null);
      return;
    } else {
      return;
    }

    e.preventDefault();
    const counter = state.counters.find(c => c.id === selectedDigitId);
    if (!counter) return;

    const newX = Math.max(15, Math.min(W - 15, counter.x + stepX));
    const newY = Math.max(15, Math.min(H - 15, counter.y + stepY));

    dispatch({ type: 'DRAG_COUNTER', payload: { id: selectedDigitId, x: newX, y: newY } });

    let closestTarget = null;
    let minDistance = Infinity;

    for (const target of snapTargets) {
      const dist = Math.sqrt((newX - target.x) ** 2 + (newY - target.y) ** 2);
      if (dist < minDistance) {
        minDistance = dist;
        closestTarget = target;
      }
    }

    if (closestTarget && minDistance <= LIMITS.snapThreshold) {
      let valid = false;
      if (closestTarget.type === 'slot' && closestTarget.slotIdx === counter.id) {
        valid = true;
      } else if (closestTarget.type === 'groupA' && counter.power % 2 === 0) {
        valid = true;
      } else if (closestTarget.type === 'groupB' && counter.power % 2 !== 0) {
        valid = true;
      }

      if (valid) {
        dispatch({
          type: 'DOCK_COUNTER',
          payload: {
            id: selectedDigitId,
            dockState: closestTarget.type,
            x: closestTarget.x,
            y: closestTarget.y,
          },
        });
      }
    }
  };

  const loadExample = (digits: number[]) => {
    dispatch({ type: 'SET_DIGITS', payload: digits });
  };

  return (
    <div className="div11-page-container">
      {/* Sidebar navigation */}
      <aside className="sidebar">
        <div className="brand">
          <div className="logo-mark" aria-hidden="true">
            <svg viewBox="0 0 64 64" style={{ width: '48px', height: '48px' }}>
              <path d="M32 5 C40 22 42 24 59 32 C42 40 40 42 32 59 C24 42 22 40 5 32 C22 24 24 22 32 5Z" fill="none" stroke="currentColor" strokeWidth="4" />
              <circle cx="32" cy="32" r="6" fill="currentColor" />
              <path d="M32 8v48M8 32h48M17 17l30 30M47 17 17 47" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <b>MATHS<br />UNIVERSE</b>
        </div>
        <nav>
          <button className="nav-item active" aria-label="Explore mode">
            <Brain size={28} />
            <span>Explore</span>
          </button>
          <button className="nav-item" aria-label="Visual Proofs library">
            <Lightbulb size={28} />
            <span>Proofs</span>
          </button>
          <button className="nav-item" aria-label="Practice challenges">
            <PenLine size={28} />
            <span>Practice</span>
          </button>
          <button className="nav-item" aria-label="Saved proofs">
            <Bookmark size={28} />
            <span>Saved</span>
          </button>
        </nav>
        <button className="nav-item settings" aria-label="Settings">
          <Settings size={26} />
          <span>Settings</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <section className="div11-content">
        {/* Header section */}
        <header className="topbar div11-top">
          <div>
            <div className="crumb">Visual Proofs <span>/</span> Number Theory</div>
            <h1>Divisibility by 11</h1>
            <p>
              Because powers of 10 alternate between 1 and -1 modulo 11, the alternating digit sum has the same remainder as the original number.
            </p>
          </div>
          <div className="actions">
            <button className="level-btn">Intermediate <ChevronRight size={18} /></button>
            <button className="time-btn" aria-label="Estimated time 10 minutes">
              <span className="formula" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                10 min
              </span>
            </button>
          </div>
        </header>

        {/* State Progression Tablist */}
        <div className="state-wizard-strip" role="tablist" aria-label="Proof steps">
          {(['inspect', 'manipulate', 'preserve', 'connect', 'conclude', 'transfer'] as ProofState[]).map((st, i) => (
            <React.Fragment key={st}>
              <button 
                role="tab"
                aria-selected={state.proofState === st}
                className={`wizard-step-btn ${state.proofState === st ? 'active' : ''} ${
                  i < ['inspect', 'manipulate', 'preserve', 'connect', 'conclude', 'transfer'].indexOf(state.proofState) ? 'completed' : ''
                }`}
                onClick={() => dispatch({ type: 'SET_STATE', payload: st })}
              >
                {i + 1}. {st.charAt(0).toUpperCase() + st.slice(1)}
              </button>
              {i < 5 && <span className="wizard-separator" aria-hidden="true">/</span>}
            </React.Fragment>
          ))}

          {/* Undo Redo buttons */}
          <div className="undo-redo-toolbar">
            <button 
              className="toolbar-btn" 
              onClick={() => dispatch({ type: 'UNDO' })} 
              disabled={state.historyIndex <= 0}
              aria-label="Undo"
            >
              <Undo2 size={16} />
            </button>
            <button 
              className="toolbar-btn" 
              onClick={() => dispatch({ type: 'REDO' })} 
              disabled={state.historyIndex >= state.history.length - 1}
              aria-label="Redo"
            >
              <Redo2 size={16} />
            </button>
          </div>
        </div>

        {/* Mission Strip */}
        <div className="vp2-mission">
          <div className="target" aria-hidden="true">
            <Crosshair size={36} />
          </div>
          <span>
            <b>Mission:</b> Place alternating digits into positive and negative columns and compare the difference.
          </span>
        </div>

        {/* Central Workspace layout */}
        <div className="div11-workspace">
          {/* Main Discrete Canvas */}
          <section className="div11-lab panel">
            {/* Unified Canvas Board */}
            <div style={{ position: 'relative', width: '100%', height: '350px', border: '1px solid #e0dff2', borderRadius: '15px', background: '#faf9ff', overflow: 'hidden' }}>
              <svg 
                ref={svgRef}
                width="100%" 
                height="100%" 
                viewBox={`0 0 ${W} ${H}`}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                style={{ outline: 'none' }}
              >
                {/* 1. Build a number section card (Left) */}
                <g>
                  <rect x="15" y="15" width="220" height="310" rx="16" fill="#fff" stroke="#dedcf0" strokeWidth="1" />
                  <text x="30" y="42" fill="#09143d" fontSize="15" fontWeight="bold">1 Build a number</text>
                  <text x="30" y="148" fill="#5360a6" fontSize="11">Your number (millions to ones)</text>
                  
                  {/* Slots backgrounds */}
                  {snapTargets.filter(t => t.type === 'slot').map((t, idx) => (
                    <g key={`slot-bg-${idx}`}>
                      <rect x={t.x - 21} y={t.y - 24} width="42" height="48" rx="8" fill="#f8f7ff" stroke={getDigitColor(state.digits.length - 1 - idx)} strokeWidth="2" />
                    </g>
                  ))}
                </g>

                {/* 2. Group sorting card (Center-Right) */}
                <g>
                  <rect x="250" y="15" width="535" height="310" rx="16" fill="#fff" stroke="#dedcf0" strokeWidth="1" />
                  <text x="265" y="42" fill="#09143d" fontSize="15" fontWeight="bold">2 Sort into alternating groups (from right)</text>

                  {/* Group A Box */}
                  <g>
                    <rect x="265" y="65" width="150" height="210" rx="14" fill="rgba(244,247,255,0.5)" stroke="#b3c9ff" strokeWidth="1.5" />
                    <text x="340" y="90" fill="#2e66ff" fontSize="14" fontWeight="bold" textAnchor="middle">Group A</text>
                    <text x="340" y="106" fill="#5360a6" fontSize="11" textAnchor="middle">(+ signs)</text>
                    
                    {/* Sum A label */}
                    <rect x="290" y="235" width="100" height="28" rx="6" fill="#fff" stroke="#c9d8ff" />
                    <text x="340" y="253" fill="#1c2a78" fontSize="12" fontWeight="bold" textAnchor="middle">Sum_A = {sumA}</text>

                    {/* Group A Target Slot outlines */}
                    {snapTargets.filter(t => t.type === 'groupA').map((t, idx) => (
                      <circle key={`target-a-${idx}`} cx={t.x} cy={t.y} r="18" fill="none" stroke="#b3c9ff" strokeWidth="1.5" strokeDasharray="3 3" />
                    ))}
                  </g>

                  {/* Group B Box */}
                  <g>
                    <rect x="430" y="65" width="150" height="210" rx="14" fill="rgba(244,253,248,0.5)" stroke="#b7efcd" strokeWidth="1.5" />
                    <text x="505" y="90" fill="#098e4c" fontSize="14" fontWeight="bold" textAnchor="middle">Group B</text>
                    <text x="505" y="106" fill="#5360a6" fontSize="11" textAnchor="middle">(- signs)</text>

                    {/* Sum B label */}
                    <rect x="455" y="235" width="100" height="28" rx="6" fill="#fff" stroke="#c5f2d5" />
                    <text x="505" y="253" fill="#1c2a78" fontSize="12" fontWeight="bold" textAnchor="middle">Sum_B = {sumB}</text>

                    {/* Group B Target Slot outlines */}
                    {snapTargets.filter(t => t.type === 'groupB').map((t, idx) => (
                      <circle key={`target-b-${idx}`} cx={t.x} cy={t.y} r="18" fill="none" stroke="#b7efcd" strokeWidth="1.5" strokeDasharray="3 3" />
                    ))}
                  </g>

                  {/* Alternating Sum Box */}
                  <g>
                    <rect x="595" y="65" width="175" height="210" rx="14" fill="rgba(247,246,255,0.4)" stroke="#7b50ff" strokeWidth="1.5" strokeDasharray="4 4" />
                    <text x="682" y="90" fill="#1c2a78" fontSize="14" fontWeight="bold" textAnchor="middle">Alternating sum</text>
                    <text x="682" y="106" fill="#666" fontSize="11" textAnchor="middle">Sum_A - Sum_B</text>
                    
                    {/* Math calculation */}
                    <text x="682" y="146" fill="#111" fontSize="26" fontWeight="bold" textAnchor="middle">{sumA} - {sumB}</text>
                    
                    <rect x="632" y="165" width="100" height="28" rx="6" fill="#fff" stroke="#7b50ff" />
                    <text x="682" y="184" fill="#000" fontSize="15" fontWeight="bold" textAnchor="middle">= {currentDiff}</text>

                    {/* Remainder match verification */}
                    <text x="682" y="224" fill="#5360a6" fontSize="11" textAnchor="middle">Same remainder mod 11</text>
                    <text x="682" y="244" fill="#059c51" fontSize="12" fontWeight="bold" textAnchor="middle">
                      {originalNumMod11} ≡ {currentDiffMod11} (mod 11)
                    </text>
                    {originalNumMod11 === currentDiffMod11 && (
                      <text x="682" y="262" fill="#059c51" fontSize="12" fontWeight="bold" textAnchor="middle">✔ Match!</text>
                    )}
                  </g>
                </g>

                {/* 3. Render draggable balls */}
                {state.counters.map(c => (
                  <g 
                    key={`ball-${c.id}`}
                    onPointerDown={(e) => handlePointerDown(c.id, e)}
                    style={{ outline: 'none' }}
                  >
                    <circle cx={c.x} cy={c.y + 2} r="18" fill="rgba(0,0,0,0.1)" />
                    <circle 
                      cx={c.x} 
                      cy={c.y} 
                      r="18" 
                      fill={c.color} 
                      stroke="#fff" 
                      strokeWidth="2.5" 
                      style={{ 
                        cursor: draggingId === c.id ? 'grabbing' : 'grab',
                        filter: selectedDigitId === c.id ? 'drop-shadow(0 0 6px #7b50ff)' : 'none'
                      }}
                    />
                    <text 
                      x={c.x} 
                      y={c.y + 5} 
                      fill="#fff" 
                      fontSize="14" 
                      fontWeight="bold" 
                      textAnchor="middle"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {c.val}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Examples and Playback row below the SVG */}
            <div className="playback-row-div11">
              <div className="examples-row" style={{ marginTop: '0' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Quick examples:</span>
                {[121, 572, 1331, 24640, 987654].map(num => (
                  <button key={num} onClick={() => loadExample(String(num).split('').map(Number))}>
                    {num}
                  </button>
                ))}
              </div>

              <div className="playback-controls-group">
                <button 
                  className="playback-btn" 
                  onClick={() => dispatch({ type: 'RESET' })}
                  aria-label="Reset counters"
                >
                  <RotateCcw size={16} />
                </button>
                <button 
                  className="playback-btn" 
                  onClick={() => dispatch({ type: 'TOGGLE_PLAY' })}
                  aria-label={state.isPlaying ? 'Pause auto-sorting' : 'Play auto-sorting'}
                >
                  {state.isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button 
                  className="playback-btn" 
                  onClick={() => dispatch({ type: 'AUTO_SORT_STEP' })}
                  disabled={!state.counters.some(c => c.dockState === 'slot')}
                  aria-label="Step forward"
                >
                  Step
                </button>
              </div>

              <select 
                className="playback-speed-select"
                value={state.animationSpeed}
                onChange={e => dispatch({ type: 'SET_ANIMATION_SPEED', payload: Number(e.target.value) })}
                aria-label="Animation speed"
              >
                <option value={0.5}>0.5x</option>
                <option value={1.0}>1.0x</option>
                <option value={1.5}>1.5x</option>
              </select>
            </div>

            {/* Modulo Table: Why powers of 10 alternate modulo 11 */}
            <section className="div11-card" style={{ width: '100%' }}>
              <h2><b>3</b> Why powers of 10 alternate modulo 11</h2>
              <div className="powers-table-container">
                <table className="powers-table">
                  <thead>
                    <tr>
                      <th>k</th>
                      <th>0</th>
                      <th>1</th>
                      <th>2</th>
                      <th>3</th>
                      <th>4</th>
                      <th>5</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>10^k mod 11</td>
                      <td className="mod-val">1</td>
                      <td className="mod-val">10</td>
                      <td className="mod-val">1</td>
                      <td className="mod-val">10</td>
                      <td className="mod-val">1</td>
                      <td className="mod-val">10</td>
                    </tr>
                    <tr>
                      <td>=</td>
                      <td className="alt-val">1</td>
                      <td className="alt-val neg">-1</td>
                      <td className="alt-val">1</td>
                      <td className="alt-val neg">-1</td>
                      <td className="alt-val">1</td>
                      <td className="alt-val neg">-1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: '13px', color: '#5360a6', margin: '8px 0 0' }}>
                Since 10 ≡ -1 (mod 11), powers alternate: <b>1, -1, 1, -1, ...</b>
              </p>
            </section>
          </section>

          {/* Right Rail */}
          <aside className="div11-rail">
            {/* Why it works */}
            <section className="why panel">
              <h2><Sparkles size={20} />Why it works</h2>
              
              <div className="div-reason" style={{ paddingLeft: '48px', position: 'relative', minHeight: 'auto', marginBottom: '8px' }}>
                <b style={{ position: 'absolute', left: '12px', top: '2px', width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg,#9b78ff,#4e1fe5)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '12px' }}>1</b>
                <span>Powers of 10 alternate: 10^k ≡ 1, -1, 1, -1, ... (mod 11)</span>
              </div>

              <div className="div-reason" style={{ paddingLeft: '48px', position: 'relative', minHeight: 'auto', marginBottom: '8px' }}>
                <b style={{ position: 'absolute', left: '12px', top: '2px', width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg,#9b78ff,#4e1fe5)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '12px' }}>2</b>
                <span>Weight digits by ± 1. Digits in A get +, in B get -.</span>
              </div>

              <div className="div-reason" style={{ paddingLeft: '48px', position: 'relative', minHeight: 'auto' }}>
                <b style={{ position: 'absolute', left: '12px', top: '2px', width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg,#9b78ff,#4e1fe5)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '12px' }}>3</b>
                <span>Remainders match. Alternating sum has the same remainder.</span>
              </div>
            </section>

            {/* Hint System */}
            <div className="coach-overlay-card">
              <div className="coach-header">
                <h3>
                  <HelpCircle size={16} />
                  Hint {state.hintLevel} of 5
                </h3>
                <div className="coach-step-indicators">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button 
                      key={n} 
                      className={`coach-dot ${state.hintLevel === n ? 'active' : ''}`}
                      onClick={() => dispatch({ type: 'SET_HINT', payload: n })}
                      aria-label={`Show hint level ${n}`}
                    />
                  ))}
                </div>
              </div>
              <div className="coach-body">
                <strong>{HINTS[state.hintLevel].title}</strong>
                <p style={{ margin: '4px 0 0' }}>{HINTS[state.hintLevel].text}</p>
              </div>
              <div className="coach-footer">
                <button 
                  className="coach-nav-btn" 
                  onClick={() => dispatch({ type: 'SET_HINT', payload: Math.max(1, state.hintLevel - 1) })}
                  disabled={state.hintLevel === 1}
                >
                  Previous
                </button>
                <button 
                  className="coach-nav-btn" 
                  onClick={() => dispatch({ type: 'SET_HINT', payload: Math.min(5, state.hintLevel + 1) })}
                  disabled={state.hintLevel === 5}
                >
                  Next Hint
                </button>
              </div>
            </div>

            {/* Prediction */}
            <section className="div-pred panel">
              <h2>Make a prediction</h2>
              <p>Will your number ({originalNum}) be divisible by 11?</p>
              <div className="pred-yes-no-row">
                <button 
                  className={`pred-btn ${state.predictionAnswer === 'yes' ? 'selected' : ''}`}
                  onClick={() => dispatch({ type: 'SET_PREDICTION', payload: 'yes' })}
                >
                  Yes
                </button>
                <button 
                  className={`pred-btn ${state.predictionAnswer === 'no' ? 'selected' : ''}`}
                  onClick={() => dispatch({ type: 'SET_PREDICTION', payload: 'no' })}
                >
                  No
                </button>
              </div>
              <button 
                className="playback-btn" 
                style={{ width: '100%' }}
                disabled={!state.predictionAnswer}
                onClick={() => dispatch({ type: 'CHECK_PREDICTION' })}
              >
                Reveal result
              </button>

              {state.predictionChecked && (
                <div className="reveal-divisibility-banner">
                  <p>{originalNum} ≡ {originalNumMod11} (mod 11)</p>
                  <span>
                    {originalNumMod11 === 0 ? (
                      <span style={{ color: '#099c52' }}>✔ Divisible by 11!</span>
                    ) : (
                      <span style={{ color: '#de5656' }}>☹ Not divisible by 11.</span>
                    )}
                  </span>
                </div>
              )}
            </section>

            {/* Misconception Checkpoint */}
            <section className="misconception-card">
              <h2 style={{ margin: '0', fontSize: '15px', color: '#f06b13', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Brain size={18} />
                Misconception Checkpoint
              </h2>
              <p style={{ margin: '6px 0 10px', fontSize: '13px', color: '#555' }}>
                Why do the signs alternate when grouping digits for modulo 11?
              </p>
              <div className="misconception-options">
                <button 
                  className={`misconception-option ${state.misconceptionSelected === 'always_positive' ? 'selected' : ''}`}
                  onClick={() => dispatch({ type: 'SET_MISCONCEPTION', payload: 'always_positive' })}
                >
                  <span className="radio-circle" />
                  <span>Signs should always be positive.</span>
                </button>
                <button 
                  className={`misconception-option ${state.misconceptionSelected === 'correct' ? 'selected' : ''}`}
                  onClick={() => dispatch({ type: 'SET_MISCONCEPTION', payload: 'correct' })}
                >
                  <span className="radio-circle" />
                  <span>10 ≡ -1 (mod 11), so powers alternate.</span>
                </button>
                <button 
                  className={`misconception-option ${state.misconceptionSelected === 'sum_digits' ? 'selected' : ''}`}
                  onClick={() => dispatch({ type: 'SET_MISCONCEPTION', payload: 'sum_digits' })}
                >
                  <span className="radio-circle" />
                  <span>Simply sum all digits as in mod 3/9.</span>
                </button>
              </div>
              <button 
                className="hint" 
                style={{ width: '100%', marginTop: '6px' }}
                onClick={() => dispatch({ type: 'CHECK_MISCONCEPTION' })}
              >
                Validate Answer
              </button>
              {state.misconceptionChecked && state.misconceptionFeedback && (
                <div className={`misconception-feedback-box ${state.misconceptionSelected === 'correct' ? 'correct' : 'incorrect'}`}>
                  {state.misconceptionFeedback}
                </div>
              )}
            </section>

            {/* Completion Hero Banner */}
            {completion.isComplete && (
              <div className="completion-banner-hero">
                <h2>
                  <Trophy size={24} />
                  Proof Complete!
                </h2>
                <p>
                  You completed the proof for divisibility by 11 by placing alternating digit columns and comparing modular remainders.
                </p>
              </div>
            )}
          </aside>
        </div>

        {/* Bottom Proof flow and Challenge */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 316px', gap: '18px', alignItems: 'start' }}>
          {/* One-line proof flow */}
          <section className="vp2-proof panel">
            <h2>One-line proof (visual)</h2>
            <div className="vp2-proof-flow">
              <div className="mini-proof-part" style={{ minWidth: '130px' }}>
                <div className="formula-box" style={{ fontSize: '18px' }}>N = Σ d_i 10^i</div>
                <span>Write the number</span>
              </div>
              <b>→</b>
              <div className="mini-proof-part" style={{ minWidth: '130px' }}>
                <div className="formula-box" style={{ fontSize: '18px' }}>10^i ≡ (-1)^i (mod 11)</div>
                <span>Replace powers</span>
              </div>
              <b>→</b>
              <div className="mini-proof-part" style={{ minWidth: '130px' }}>
                <div className="formula-box" style={{ fontSize: '18px' }}>N ≡ Σ d_i (-1)^i</div>
                <span>Distribute</span>
              </div>
              <b>→</b>
              <div className="mini-proof-part" style={{ minWidth: '130px' }}>
                <div className="formula-box" style={{ fontSize: '18px' }}>N ≡ Sum_A - Sum_B</div>
                <span>Group + and -</span>
              </div>
            </div>
          </section>

          {/* Your Challenge */}
          <section className="vp2-challenge panel" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h2><Trophy size={20} />Your challenge</h2>
            <p style={{ margin: '0', fontSize: '13px' }}>Try these numbers. Which are divisible by 11?</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {['121', '572', '1331', '10101', '24640', '987654'].map(num => (
                <button 
                  key={num} 
                  className={`playback-btn ${state.challengeChoice === num ? 'active' : ''}`}
                  onClick={() => dispatch({ type: 'SET_CHALLENGE', payload: num })}
                  style={{ fontSize: '11px', padding: '4px' }}
                >
                  {num}
                </button>
              ))}
            </div>
            <button 
              className="hint" 
              style={{ width: '100%', marginTop: '6px' }}
              disabled={!state.challengeChoice}
              onClick={() => dispatch({ type: 'CHECK_CHALLENGE' })}
            >
              Check Challenge
            </button>
            {state.challengeChecked && (
              <small style={{ color: state.challengeCorrect ? '#059c51' : '#de5656', fontWeight: 'bold', display: 'block', textAlign: 'center' }}>
                {state.challengeCorrect ? `Correct! ${state.challengeChoice} is divisible by 11.` : `Incorrect. ${state.challengeChoice} is not divisible.`}
              </small>
            )}
          </section>
        </div>
      </section>
    </div>
  );
}
