import { useReducer } from 'react';
import {
  Compass, BookOpen, Bookmark, User, Settings,
  Sparkles, Trophy, HelpCircle
} from 'lucide-react';
import { computeZeroExponent } from './zero-exponent-ruleMath';
import { initZeroExponentState, zeroExponentReducer } from './zero-exponent-ruleReducer';
import './zero-exponent-rule.css';

export function ZeroExponentRuleProofPage() {
  const [state, dispatch] = useReducer(zeroExponentReducer, undefined, initZeroExponentState);
  const { numValue } = computeZeroExponent(state.base, state.n);

  return (
    <div className="zer-shell">
      <aside className="zer-sidenav">
        <div className="zer-logo">MV</div>
        <div className="zer-navitem active"><Compass /><span>Explore</span></div>
        <div className="zer-navitem"><BookOpen /><span>Proofs</span></div>
        <div className="zer-navitem"><Bookmark /><span>Practice</span></div>
        <div className="zer-navitem"><User /><span>Saved</span></div>
        <div style={{ marginTop: 'auto' }}><div className="zer-navitem"><Settings /><span>Settings</span></div></div>
      </aside>

      <main className="zer-main">
        <header className="zer-header">
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6d28d9', marginBottom: '4px' }}>
              Visual Proofs / Exponent Rules
            </div>
            <h1 className="zer-title">Zero Exponent Rule: a<sup>0</sup> = 1</h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#4b5563' }}>
              <strong>Mission:</strong> Understand why any nonzero number to the zeroth power equals 1.
            </p>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#6d28d9', background: '#f3f0ff', padding: '6px 14px', borderRadius: '8px' }}>
            Intermediate · 10 min
          </span>
        </header>

        {/* Growth Scale Explorer */}
        <div className="zer-card">
          <h3 style={{ margin: '0 0 12px', fontSize: '15px', color: '#4c1d95', fontWeight: 700 }}>Growth Scale Explorer</h3>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div style={{ background: '#faf9ff', padding: '16px', borderRadius: '12px', border: '1px solid #f0edfd', minWidth: '200px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
                Base a: <strong>{state.base.toFixed(2)}</strong>
              </label>
              <input
                type="range"
                min={0.5}
                max={5}
                step={0.25}
                value={state.base}
                onChange={e => dispatch({ type: 'SET_BASE', payload: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#7c3aed' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                <span>0.5</span>
                <span>5</span>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '140px', background: '#faf9ff', borderRadius: '12px', border: '1px solid #f0edfd' }}>
              <svg viewBox="0 0 400 120" style={{ width: '100%', height: '100%' }}>
                <line x1="40" y1="60" x2="360" y2="60" stroke="#9ca3af" strokeWidth="1.5" />
                <line x1="200" y1="20" x2="200" y2="100" stroke="#9ca3af" strokeWidth="1.5" />

                {/* Point a^0 = 1 */}
                <circle cx="200" cy="40" r="10" fill="#2563eb" />
                <text x="200" y="44" fill="#fff" fontSize="11" fontWeight="800" textAnchor="middle">1</text>
                <rect x="170" y="10" width="60" height="22" rx="11" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
                <text x="200" y="25" fill="#1e40af" fontSize="12" fontWeight="800" textAnchor="middle">a⁰ = 1</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Visual Proof Section */}
        <div className="zer-card">
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', color: '#4c1d95', fontWeight: 700 }}>
            Visual Proof: Equal factor chains cancel
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center', background: '#faf9ff', padding: '24px', borderRadius: '12px', border: '1px solid #f0edfd' }}>
            <div style={{ border: '1.5px solid #a78bfa', borderRadius: '50%', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ede9fe', fontSize: '20px', fontWeight: 800, color: '#6d28d9' }}>
              a<sup>0</sup>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {/* Numerator a^n */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {Array.from({ length: state.n }).map((_, i) => (
                  <span key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', background: state.isCancelled ? '#fecdd3' : '#ddd6fe', color: state.isCancelled ? '#9f1239' : '#4c1d95', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', textDecoration: state.isCancelled ? 'line-through' : 'none' }}>
                    a
                  </span>
                ))}
              </div>

              <span style={{ fontSize: '20px', fontWeight: 800, color: '#9ca3af' }}>÷</span>

              {/* Denominator a^n */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {Array.from({ length: state.n }).map((_, i) => (
                  <span key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', background: state.isCancelled ? '#fecdd3' : '#fbcfe8', color: state.isCancelled ? '#9f1239' : '#9d174d', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', textDecoration: state.isCancelled ? 'line-through' : 'none' }}>
                    a
                  </span>
                ))}
              </div>

              <span style={{ fontSize: '20px', fontWeight: 800, color: '#9ca3af' }}>=</span>

              <div style={{ border: '1px dashed #a78bfa', padding: '10px 16px', borderRadius: '8px', background: '#fff', fontSize: '13px', fontWeight: 600, color: '#6d28d9' }}>
                {state.isCancelled ? '(empty product)' : 'aⁿ / aⁿ'}
              </div>

              <span style={{ fontSize: '20px', fontWeight: 800, color: '#9ca3af' }}>=</span>

              <div style={{ border: '2px solid #059669', padding: '10px 18px', borderRadius: '8px', background: '#ecfdf5', fontSize: '22px', fontWeight: 800, color: '#047857' }}>
                1
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '13px', color: '#4b5563' }}>
              Since a<sup>n</sup> = {numValue} and a ≠ 0, a<sup>n</sup> / a<sup>n</sup> = 1. Therefore, <strong>a<sup>0</sup> = 1</strong> for all a ≠ 0.
            </div>
            <button
              onClick={() => dispatch({ type: 'CANCEL_ALL' })}
              style={{ background: '#6d28d9', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
            >
              Cancel Factors
            </button>
          </div>
        </div>

        {/* Bottom Cards: Prediction & Challenge */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="zer-card">
            <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: '#4c1d95', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HelpCircle size={16} /> Make a prediction
            </h4>
            <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#4b5563' }}>Pick values and predict 7<sup>0</sup>:</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={state.predictInput}
                onChange={e => dispatch({ type: 'SET_PREDICT', payload: e.target.value })}
                style={{ width: '80px', padding: '6px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
              />
              <button
                onClick={() => dispatch({ type: 'CHECK_PREDICT' })}
                style={{ background: '#6d28d9', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
              >
                Check prediction
              </button>
            </div>
            {state.predictChecked && (
              <p style={{ margin: '6px 0 0', fontSize: '12px', fontWeight: 600, color: state.predictCorrect ? '#059669' : '#dc2626' }}>
                {state.predictCorrect ? '✔ Correct! 7⁰ = 1.' : '✘ Try 1. Any non-zero base to power 0 equals 1.'}
              </p>
            )}
          </div>

          <div className="zer-card">
            <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: '#4c1d95', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trophy size={16} /> Challenge (exact)
            </h4>
            <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#4b5563' }}>Compute (5⁰ × 3⁻²) / (2⁻¹ × 9⁰) = 18:</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={state.challengeAnswer}
                onChange={e => dispatch({ type: 'SET_CHALLENGE', payload: e.target.value })}
                placeholder="Enter value"
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
                {state.challengeCorrect ? '✔ Exactly right! Well done.' : '✘ Try 18.'}
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Right Rail */}
      <aside className="zer-rail">
        <h2 style={{ margin: 0, fontSize: '16px', color: '#09143d', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#6d28d9" /> Why it works
        </h2>

        <div className="zer-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="zer-step-num">1</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>Equal factors form</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#4b5563' }}>a<sup>n</sup> is n copies of a multiplied.</p>
        </div>

        <div className="zer-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="zer-step-num">2</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>Cancel pairs completely</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#4b5563' }}>In a<sup>n</sup> / a<sup>n</sup>, each a cancels completely.</p>
        </div>

        <div className="zer-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="zer-step-num">3</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>Empty product is 1</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#059669', fontWeight: 700 }}>
            a<sup>0</sup> = a<sup>n</sup> / a<sup>n</sup> = 1 (valid for any nonzero a).
          </p>
        </div>
      </aside>
    </div>
  );
}
