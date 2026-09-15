import { useReducer, useState } from 'react';
import {
  Compass, BookOpen, Bookmark, User, Settings,
  Sparkles, Trophy, HelpCircle, Eye
} from 'lucide-react';
import { LIMITS } from './exponent-quotient-ruleConfig';
import { calculateQuotientGeometry, computeQuotient, VIEW_W, VIEW_H } from './exponent-quotient-ruleMath';
import { initExponentQuotientState, exponentQuotientReducer } from './exponent-quotient-ruleReducer';
import './exponent-quotient-rule.css';

export function ExponentQuotientRuleProofPage() {
  const [state, dispatch] = useReducer(exponentQuotientReducer, undefined, initExponentQuotientState);

  // Custom inputs for "Try your own"
  const [customBase, setCustomBase] = useState(state.base);
  const [customM, setCustomM] = useState(state.m);
  const [customN, setCustomN] = useState(state.n);

  const { remainingExp } = computeQuotient(state.base, state.m, state.n);
  const geometry = calculateQuotientGeometry(state.base, state.m, state.n, state.cancelledCount);

  const maxPossible = Math.min(state.m, state.n);

  return (
    <div className="eqr-shell">
      {/* ── Left Navigation Sidebar ── */}
      <aside className="eqr-sidenav">
        <div className="eqr-logo">MV</div>
        <div className="eqr-navitem active">
          <Compass />
          <span>Explore</span>
        </div>
        <div className="eqr-navitem">
          <BookOpen />
          <span>Theorems</span>
        </div>
        <div className="eqr-navitem">
          <HelpCircle />
          <span>Proofs</span>
        </div>
        <div className="eqr-navitem">
          <Bookmark />
          <span>Practice</span>
        </div>
        <div className="eqr-navitem">
          <User />
          <span>Saved</span>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <div className="eqr-navitem">
            <Settings />
            <span>Settings</span>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="eqr-main">
        {/* Header */}
        <header className="eqr-header">
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6d28d9', marginBottom: '4px' }}>
              Visual Proofs / Exponents
            </div>
            <h1 className="eqr-title">
              Exponent Quotient Rule
            </h1>
            <div className="eqr-formula-hero">
              a<sup>m</sup> / a<sup>n</sup> = a<sup>m-n</sup>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ background: '#ede9fe', padding: '8px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#6d28d9" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#4c1d95' }}>Mission</span>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Make sense of exponents through visual reasoning.</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#6d28d9', background: '#f3f0ff', padding: '6px 14px', borderRadius: '8px' }}>
              Intermediate · 12 min
            </span>
          </div>
        </header>

        {/* Interactive Exponent Scale Header Card */}
        <div className="eqr-exponent-scale-panel">
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '14px', color: '#4c1d95', fontWeight: 700 }}>
              Interactive exponent scale
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
              Drag the base slider to see the pattern.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#374151' }}>Base a = {state.base}</span>
              <input
                type="range"
                min={LIMITS.minBase}
                max={LIMITS.maxBase}
                value={state.base}
                onChange={e => {
                  const val = Number(e.target.value);
                  dispatch({ type: 'SET_BASE', payload: val });
                  setCustomBase(val);
                }}
                style={{ width: '160px', accentColor: '#7c3aed' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#6d28d9' }}>Inverse reflection</span>
            <span style={{ fontSize: '11px', color: '#6b7280' }}>The graphs of y = a<sup>x</sup> and y = log<sub>a</sub> x are reflections in y = x.</span>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_INVERSE' })}
              style={{ background: '#ede9fe', color: '#6d28d9', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Eye size={14} /> {state.showInverseGraph ? 'Hide both' : 'Show both'}
            </button>
          </div>
        </div>

        {/* Workspace Card */}
        <div className="eqr-workspace">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#6d28d9' }}>a<sup>m</sup> (numerator)</span>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                  {state.base}<sup>{state.m}</sup> = {Array(state.m).fill(state.base).join(' × ')}
                </div>
              </div>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#9ca3af' }}>÷</span>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#dc2626' }}>a<sup>n</sup> (denominator)</span>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                  {state.base}<sup>{state.n}</sup> = {Array(state.n).fill(state.base).join(' × ')}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => dispatch({ type: 'CANCEL_NEXT_PAIR' })}
                disabled={state.cancelledCount >= maxPossible}
                style={{ background: state.cancelledCount >= maxPossible ? '#e5e7eb' : '#6d28d9', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
              >
                Cancel 1 Pair
              </button>
              <button
                onClick={() => dispatch({ type: 'CANCEL_ALL' })}
                disabled={state.cancelledCount >= maxPossible}
                style={{ background: state.cancelledCount >= maxPossible ? '#e5e7eb' : '#4f46e5', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
              >
                Cancel All ({maxPossible})
              </button>
              <button
                onClick={() => dispatch({ type: 'RESET' })}
                style={{ background: '#f3f4f6', border: '1px solid #d1d5db', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* SVG Cancellation Visualizer */}
          <div className="eqr-canvas-container">
            <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} style={{ width: '100%', height: '100%', display: 'block' }}>
              {/* Top Row: Numerator factors */}
              {geometry.numFactors.map(factor => (
                <g key={factor.id} onClick={() => dispatch({ type: 'CANCEL_NEXT_PAIR' })} style={{ cursor: 'pointer' }}>
                  <circle
                    cx={factor.x}
                    cy={factor.y}
                    r="20"
                    fill={factor.isCancelled ? '#fecdd3' : '#8b5cf6'}
                    stroke={factor.isCancelled ? '#f43f5e' : '#6d28d9'}
                    strokeWidth="2"
                  />
                  <text x={factor.x} y={factor.y + 5} textAnchor="middle" fill={factor.isCancelled ? '#9f1239' : '#fff'} fontSize="15" fontWeight="800">
                    {factor.label}
                  </text>
                  {factor.isCancelled && (
                    <line x1={factor.x - 14} y1={factor.y - 14} x2={factor.x + 14} y2={factor.y + 14} stroke="#e11d48" strokeWidth="3" />
                  )}
                </g>
              ))}

              {/* Bottom Row: Denominator factors */}
              {geometry.denFactors.map(factor => (
                <g key={factor.id} onClick={() => dispatch({ type: 'CANCEL_NEXT_PAIR' })} style={{ cursor: 'pointer' }}>
                  <circle
                    cx={factor.x}
                    cy={factor.y}
                    r="20"
                    fill={factor.isCancelled ? '#fecdd3' : '#f43f5e'}
                    stroke={factor.isCancelled ? '#e11d48' : '#be123c'}
                    strokeWidth="2"
                  />
                  <text x={factor.x} y={factor.y + 5} textAnchor="middle" fill="#fff" fontSize="15" fontWeight="800">
                    {factor.label}
                  </text>
                  {factor.isCancelled && (
                    <line x1={factor.x - 14} y1={factor.y - 14} x2={factor.x + 14} y2={factor.y + 14} stroke="#9f1239" strokeWidth="3" />
                  )}
                </g>
              ))}

              {/* Connecting curve for cancelled pairs */}
              {Array.from({ length: state.cancelledCount }).map((_, i) => {
                const numF = geometry.numFactors[i];
                const denF = geometry.denFactors[i];
                if (!numF || !denF) return null;
                return (
                  <path
                    key={`conn-${i}`}
                    d={`M ${numF.x} ${numF.y + 20} Q ${numF.x + 15} 140 ${denF.x} ${denF.y - 20}`}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                  />
                );
              })}

              {/* Equals Arrow */}
              <text x="470" y="150" textAnchor="middle" fill="#9ca3af" fontSize="28" fontWeight="800">
                ⇒
              </text>

              {/* Result Box */}
              <rect x="500" y="60" width="160" height="180" rx="14" fill="#faf5ff" stroke="#ddd6fe" strokeWidth="1.5" />
              <text x="580" y="86" textAnchor="middle" fill="#6d28d9" fontSize="12" fontWeight="700">
                Result
              </text>
              <text x="580" y="110" textAnchor="middle" fill="#4c1d95" fontSize="16" fontWeight="800">
                {state.base}<sup>{state.m}-{state.n}</sup> = {state.base}<sup>{remainingExp}</sup>
              </text>

              {geometry.resultFactors.map(factor => (
                <g key={factor.id}>
                  <circle cx={factor.x} cy={factor.y} r="18" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="2" />
                  <text x={factor.x} y={factor.y + 5} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="800">
                    {factor.label}
                  </text>
                </g>
              ))}

              <text x="580" y="210" textAnchor="middle" fill="#6b7280" fontSize="12" fontWeight="600">
                {remainingExp} factors remain
              </text>
            </svg>
          </div>

          {/* Legend row */}
          <div style={{ display: 'flex', gap: '24px', fontSize: '12px', fontWeight: 600, color: '#4b5563' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#8b5cf6' }} />
              <span>Kept factor</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f43f5e' }} />
              <span>Cancelled (matched)</span>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Try your own + Exact challenge */}
        <div className="eqr-bottom-grid">
          {/* Try your own card */}
          <div className="eqr-card">
            <h3 style={{ margin: '0 0 12px', fontSize: '14px', color: '#4c1d95', fontWeight: 700 }}>
              Try your own
            </h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>Base a</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={customBase}
                  onChange={e => setCustomBase(Number(e.target.value))}
                  style={{ width: '50px', padding: '4px 6px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>m (top)</label>
                <input
                  type="number"
                  min={1}
                  max={7}
                  value={customM}
                  onChange={e => setCustomM(Number(e.target.value))}
                  style={{ width: '50px', padding: '4px 6px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>n (bottom)</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={customN}
                  onChange={e => setCustomN(Number(e.target.value))}
                  style={{ width: '50px', padding: '4px 6px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
                />
              </div>
              <button
                onClick={() => dispatch({ type: 'BUILD_CUSTOM', payload: { base: customBase, m: customM, n: customN } })}
                style={{ background: '#6d28d9', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', marginTop: '14px' }}
              >
                ⚡ Build
              </button>
            </div>
          </div>

          {/* Exact challenge card */}
          <div className="eqr-card">
            <h3 style={{ margin: '0 0 8px', fontSize: '14px', color: '#4c1d95', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trophy size={16} /> Exact challenge
            </h3>
            <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#4b5563' }}>
              Prove symbolically: a<sup>m</sup> / a<sup>n</sup> = a<sup>m-n</sup> for a ≠ 0.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={state.challengeAnswer}
                onChange={e => dispatch({ type: 'SET_CHALLENGE', payload: e.target.value })}
                placeholder="Enter rule (e.g. a^(m-n))"
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
                {state.challengeCorrect ? '✔ Correct! Great work.' : '✘ Try entering a^(m-n).'}
              </p>
            )}
          </div>
        </div>
      </main>

      {/* ── Right Rail Panel (Why it works) ── */}
      <aside className="eqr-rail">
        <h2 style={{ margin: 0, fontSize: '16px', color: '#09143d', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#6d28d9" /> Why it works
        </h2>

        <div className="eqr-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="eqr-step-num">1</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>Write as products</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#4b5563' }}>
            Expand both powers with the same base a.
          </p>
        </div>

        <div className="eqr-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="eqr-step-num">2</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>Cancel matches</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#4b5563' }}>
            Cancel one a at a time (since a/a = 1). What's left is m - n factors.
          </p>
        </div>

        <div className="eqr-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="eqr-step-num">3</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>What remains</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#059669', fontWeight: 700 }}>
            The remaining m - n factors combine to a<sup>m-n</sup>.
          </p>
        </div>

        {/* Prediction Card */}
        <div style={{ background: '#fcfbfe', border: '1px solid #e8e6f8', borderRadius: '12px', padding: '16px', marginTop: 'auto' }}>
          <h4 style={{ margin: '0 0 6px', fontSize: '13px', color: '#4c1d95' }}>Predict before revealing</h4>
          <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#4b5563' }}>
            What is 5<sup>7</sup> / 5<sup>3</sup> equal to?
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {['A 5^10', 'B 5^4', 'C 5^3', 'D 5^0'].map(opt => {
              const letter = opt[0];
              const isSel = state.predictionSelected === letter;
              return (
                <button
                  key={opt}
                  onClick={() => dispatch({ type: 'SELECT_PREDICTION', payload: letter })}
                  style={{
                    padding: '6px',
                    borderRadius: '6px',
                    border: isSel ? '2px solid #6d28d9' : '1px solid #d1d5db',
                    background: isSel ? '#ede9fe' : '#fff',
                    color: isSel ? '#6d28d9' : '#374151',
                    fontSize: '12px',
                    fontWeight: isSel ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => dispatch({ type: 'CHECK_PREDICTION' })}
            style={{ marginTop: '8px', width: '100%', background: '#6d28d9', color: '#fff', border: 'none', padding: '6px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
          >
            Check Prediction
          </button>
          {state.predictionChecked && (
            <p style={{ margin: '6px 0 0', fontSize: '12px', fontWeight: 600, color: state.predictionCorrect ? '#059669' : '#dc2626' }}>
              {state.predictionCorrect ? '✔ Correct! 5^(7-3) = 5^4.' : '✘ Incorrect. Subtract exponents: 7 - 3 = 4.'}
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
