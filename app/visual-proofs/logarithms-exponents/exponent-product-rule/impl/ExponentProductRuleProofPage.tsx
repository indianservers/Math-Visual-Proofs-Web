import React, { useReducer } from 'react';
import {
  Compass, HelpCircle, BookOpen, Bookmark, User, Settings,
  Sparkles, Trophy
} from 'lucide-react';
import { LIMITS } from './exponent-product-ruleConfig';
import { calculateChainGeometry, computeProduct, VIEW_W, VIEW_H } from './exponent-product-ruleMath';
import { initExponentProductState, exponentProductReducer } from './exponent-product-ruleReducer';
import './exponent-product-rule.css';

export function ExponentProductRuleProofPage() {
  const [state, dispatch] = useReducer(exponentProductReducer, undefined, initExponentProductState);

  const { am, an, totalExp, product } = computeProduct(state.base, state.m, state.n);
  const geometry = calculateChainGeometry(state.m, state.n);

  const handlePointerDown = (_id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    dispatch({ type: 'START_DRAG', payload: { x: e.clientX, y: e.clientY } });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!state.isDragging) return;
    dispatch({ type: 'MOVE_DRAG', payload: { x: e.clientX, y: e.clientY } });
  };

  const handlePointerUp = () => {
    if (!state.isDragging) return;
    dispatch({ type: 'END_DRAG', payload: { droppedInTarget: true } });
  };

  return (
    <div className="epr-shell" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      {/* ── Left Navigation Sidebar ── */}
      <aside className="epr-sidenav">
        <div className="epr-logo">MV</div>
        <div className="epr-navitem active">
          <Compass />
          <span>Explore</span>
        </div>
        <div className="epr-navitem">
          <HelpCircle />
          <span>Proofs</span>
        </div>
        <div className="epr-navitem">
          <BookOpen />
          <span>Practice</span>
        </div>
        <div className="epr-navitem">
          <Bookmark />
          <span>Saved</span>
        </div>
        <div className="epr-navitem">
          <User />
          <span>Profile</span>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <div className="epr-navitem">
            <Settings />
            <span>Settings</span>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="epr-main">
        {/* Header */}
        <header className="epr-header">
          <div>
            <h1 className="epr-title">
              Exponent Product Rule
              <span className="epr-badge">Core Rule</span>
            </h1>
            <div className="epr-formula-hero">
              a<sup>m</sup> a<sup>n</sup> = a<sup>m+n</sup>
            </div>
            <p className="epr-meaning">
              <strong>Meaning:</strong> Repeated multiplication makes exponents visible as factor counts.<br />
              Joining an <em>m</em>-chain and an <em>n</em>-chain produces <em>m + n</em> copies of the same base.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#6d28d9', background: '#ede9fe', padding: '6px 14px', borderRadius: '8px' }}>
              Intermediate · 10 min
            </span>
          </div>
        </header>

        {/* Legend Bar */}
        <div className="epr-legend-bar">
          <div className="epr-legend-item">
            <div className="epr-dot" style={{ background: '#7c3aed' }} />
            <span>base (a = {state.base})</span>
          </div>
          <div className="epr-legend-item">
            <div className="epr-dot" style={{ background: '#2563eb' }} />
            <span>point P(a<sup>k</sup>, k)</span>
          </div>
          <div className="epr-legend-item">
            <div className="epr-dot" style={{ background: '#059669' }} />
            <span>inverse P(1/a<sup>k</sup>, -k)</span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="checkbox"
                checked={state.showInverse}
                onChange={() => dispatch({ type: 'TOGGLE_INVERSE' })}
              />
              Show inverse graph
            </label>
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="epr-workspace-grid">
          {/* Controls Panel */}
          <div className="epr-controls-panel">
            <h3 style={{ margin: 0, fontSize: '15px', color: '#4c1d95', fontWeight: 700 }}>
              Set Exponents & Base
            </h3>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>
                Base (a = {state.base}):
              </label>
              <input
                type="range"
                min={LIMITS.minBase}
                max={LIMITS.maxBase}
                value={state.base}
                onChange={e => dispatch({ type: 'SET_BASE', payload: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#7c3aed' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>
                Exponent m (m = {state.m}):
              </label>
              <input
                type="range"
                min={LIMITS.minM}
                max={LIMITS.maxM}
                value={state.m}
                onChange={e => dispatch({ type: 'SET_M', payload: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#7c3aed' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>
                Exponent n (n = {state.n}):
              </label>
              <input
                type="range"
                min={LIMITS.minN}
                max={LIMITS.maxN}
                value={state.n}
                onChange={e => dispatch({ type: 'SET_N', payload: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#7c3aed' }}
              />
            </div>

            <button
              onClick={() => dispatch({ type: 'JOIN_CHAINS' })}
              className="epr-btn-primary"
              style={{ marginTop: 'auto', background: '#6d28d9', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
            >
              Join Chains (a<sup>m</sup> × a<sup>n</sup>)
            </button>
            <button
              onClick={() => dispatch({ type: 'RESET' })}
              style={{ background: '#f3f4f6', border: '1px solid #d1d5db', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
            >
              Reset
            </button>
          </div>

          {/* Interactive SVG Canvas */}
          <div className="epr-canvas-container">
            <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} style={{ width: '100%', height: '100%', display: 'block' }}>
              {/* m-chain box */}
              <rect x="40" y="20" width="230" height="120" rx="12" fill="#faf5ff" stroke="#ddd6fe" strokeWidth="1.5" />
              <text x="155" y="42" textAnchor="middle" fill="#6d28d9" fontSize="13" fontWeight="700">
                m-chain (m = {state.m})
              </text>

              {geometry.mChainBalls.map(ball => (
                <g key={ball.id}>
                  <circle cx={ball.x} cy={ball.y} r="18" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="2" />
                  <text x={ball.x} y={ball.y + 5} textAnchor="middle" fill="#4c1d95" fontSize="14" fontWeight="800">
                    {state.base}
                  </text>
                </g>
              ))}

              <text x="155" y="125" textAnchor="middle" fill="#6d28d9" fontSize="15" fontWeight="800">
                = {state.base}<sup>{state.m}</sup> ({am})
              </text>

              {/* n-chain box */}
              <rect x="300" y="20" width="230" height="120" rx="12" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5" />
              <text x="415" y="42" textAnchor="middle" fill="#2563eb" fontSize="13" fontWeight="700">
                n-chain (n = {state.n})
              </text>

              {geometry.nChainBalls.map(ball => (
                <g key={ball.id} onPointerDown={e => handlePointerDown(ball.id, e)} style={{ cursor: 'grab' }}>
                  <circle cx={ball.x} cy={ball.y} r="18" fill="#bfdbfe" stroke="#2563eb" strokeWidth="2" />
                  <text x={ball.x} y={ball.y + 5} textAnchor="middle" fill="#1e40af" fontSize="14" fontWeight="800">
                    {state.base}
                  </text>
                </g>
              ))}

              <text x="415" y="125" textAnchor="middle" fill="#2563eb" fontSize="15" fontWeight="800">
                = {state.base}<sup>{state.n}</sup> ({an})
              </text>

              {/* Arrow and drag hint */}
              {!state.isJoined && (
                <g>
                  <path d="M 415 145 C 415 170, 300 170, 300 190" fill="none" stroke="#a78bfa" strokeWidth="2" strokeDasharray="4 4" />
                  <rect x="230" y="155" width="140" height="30" rx="6" fill="#fff" stroke="#c4b5fd" />
                  <text x="300" y="174" textAnchor="middle" fill="#6d28d9" fontSize="11" fontWeight="600">
                    Drag to join the chains
                  </text>
                </g>
              )}

              {/* Joined m + n chain box */}
              <rect x="40" y="195" width="490" height="125" rx="12" fill={state.isJoined ? '#ecfdf5' : '#f9fafb'} stroke={state.isJoined ? '#6ee7b7' : '#e5e7eb'} strokeWidth="1.5" />
              <text x="285" y="218" textAnchor="middle" fill={state.isJoined ? '#047857' : '#9ca3af'} fontSize="14" fontWeight="700">
                m + n chain ({state.m} + {state.n} = {totalExp})
              </text>

              {state.isJoined && geometry.combinedBalls.map(ball => (
                <g key={ball.id}>
                  <circle cx={ball.x} cy={ball.y} r="18" fill="#d1fae5" stroke="#059669" strokeWidth="2" />
                  <text x={ball.x} y={ball.y + 5} textAnchor="middle" fill="#065f46" fontSize="14" fontWeight="800">
                    {state.base}
                  </text>
                </g>
              ))}

              <text x="285" y="304" textAnchor="middle" fill={state.isJoined ? '#047857' : '#9ca3af'} fontSize="17" fontWeight="800">
                = {state.base}<sup>{totalExp}</sup> ({product})
              </text>
            </svg>
          </div>
        </div>

        {/* Bottom Proof Strip */}
        <div className="epr-bottom-strip">
          <div className="epr-card">
            <h3 style={{ margin: '0 0 12px', fontSize: '15px', color: '#4c1d95', fontWeight: 700 }}>
              Visual Proof (algebra meets counting)
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: '#374151' }}>
              <span>{state.base}<sup>{state.m}</sup></span>
              <span>×</span>
              <span>{state.base}<sup>{state.n}</sup></span>
              <span>=</span>
              <span>{state.base}<sup>{state.m} + {state.n}</sup></span>
              <span>=</span>
              <span style={{ color: '#059669' }}>{state.base}<sup>{totalExp}</sup></span>
            </div>
          </div>

          <div className="epr-card">
            <h3 style={{ margin: '0 0 8px', fontSize: '14px', color: '#4c1d95', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trophy size={16} /> Exact Challenge
            </h3>
            <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#4b5563' }}>
              Base a = 5, m = -2, n = 4. Compute a<sup>m</sup> a<sup>n</sup> exactly:
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={state.challengeAnswer}
                onChange={e => dispatch({ type: 'SET_CHALLENGE', payload: e.target.value })}
                placeholder="Enter answer (e.g. 25)"
                style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
              />
              <button
                onClick={() => dispatch({ type: 'CHECK_CHALLENGE' })}
                style={{ background: '#6d28d9', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
              >
                Check
              </button>
            </div>
            {state.challengeChecked && (
              <p style={{ margin: '6px 0 0', fontSize: '12px', fontWeight: 600, color: state.challengeCorrect ? '#059669' : '#dc2626' }}>
                {state.challengeCorrect ? '✔ Correct! 5^(-2) * 5^4 = 5^2 = 25.' : '✘ Incorrect. Remember: (-2) + 4 = 2, so 5^2 = 25.'}
              </p>
            )}
          </div>
        </div>
      </main>

      {/* ── Right Rail Panel (Why it works) ── */}
      <aside className="epr-rail">
        <h2 style={{ margin: 0, fontSize: '16px', color: '#09143d', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#6d28d9" /> Why it works
        </h2>

        <div className="epr-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="epr-step-num">1</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>Exponents count factors.</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#4b5563', lineHeight: 1.4 }}>
            a<sup>m</sup> = (a × a × ... × a) [m times]
          </p>
        </div>

        <div className="epr-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="epr-step-num">2</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>Multiplying chains appends factors.</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#4b5563', lineHeight: 1.4 }}>
            a<sup>m</sup> a<sup>n</sup> = (a ... a)<sub>m</sub> × (a ... a)<sub>n</sub>
          </p>
        </div>

        <div className="epr-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="epr-step-num">3</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>Counts add.</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#059669', fontWeight: 700 }}>
            m + n total factors = a<sup>m+n</sup>
          </p>
        </div>

        {/* Prediction Card */}
        <div style={{ background: '#fcfbfe', border: '1px solid #e8e6f8', borderRadius: '12px', padding: '16px', marginTop: 'auto' }}>
          <h4 style={{ margin: '0 0 6px', fontSize: '13px', color: '#4c1d95' }}>Prediction</h4>
          <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#4b5563' }}>
            If m = 4 and n = 3, what is the result exponent (m + n)?
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={state.predictionInput}
              onChange={e => dispatch({ type: 'SET_PREDICTION', payload: e.target.value })}
              placeholder="Your answer"
              style={{ flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '12px' }}
            />
            <button
              onClick={() => dispatch({ type: 'CHECK_PREDICTION' })}
              style={{ background: '#6d28d9', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              Check
            </button>
          </div>
          {state.predictionChecked && (
            <p style={{ margin: '6px 0 0', fontSize: '12px', fontWeight: 600, color: state.predictionCorrect ? '#059669' : '#dc2626' }}>
              {state.predictionCorrect ? '✔ Correct! 4 + 3 = 7.' : '✘ Try again. Simply add 4 + 3.'}
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
