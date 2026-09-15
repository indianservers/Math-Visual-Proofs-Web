import { useReducer } from 'react';
import {
  Compass, BookOpen, Bookmark, User, Settings,
  Sparkles, Trophy, HelpCircle
} from 'lucide-react';
import { computePowerOfPower } from './power-of-a-power-ruleMath';
import { initPowerOfPowerState, powerOfPowerReducer } from './power-of-a-power-ruleReducer';
import './power-of-a-power-rule.css';

export function PowerOfAPowerRuleProofPage() {
  const [state, dispatch] = useReducer(powerOfPowerReducer, undefined, initPowerOfPowerState);
  const { totalExponent, result } = computePowerOfPower(state.base, state.m, state.n);

  return (
    <div className="ppr-shell">
      <aside className="ppr-sidenav">
        <div className="ppr-logo">MV</div>
        <div className="ppr-navitem active"><Compass /><span>Explore</span></div>
        <div className="ppr-navitem"><BookOpen /><span>Proofs</span></div>
        <div className="ppr-navitem"><Bookmark /><span>Practice</span></div>
        <div className="ppr-navitem"><User /><span>Saved</span></div>
        <div style={{ marginTop: 'auto' }}><div className="ppr-navitem"><Settings /><span>Settings</span></div></div>
      </aside>

      <main className="ppr-main">
        <header className="ppr-header">
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6d28d9', marginBottom: '4px' }}>
              Visual Proofs / Exponents
            </div>
            <h1 className="ppr-title">Power of a Power</h1>
            <div className="ppr-formula-hero">(a<sup>m</sup>)<sup>n</sup> = a<sup>mn</sup></div>
            <p style={{ margin: 0, fontSize: '13px', color: '#4b5563' }}>
              A power raised to another power is a grid of factor groups. Flattening n groups of m factors gives mn repeated factors.
            </p>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#6d28d9', background: '#f3f0ff', padding: '6px 14px', borderRadius: '8px' }}>
            Intermediate · 12 min
          </span>
        </header>

        {/* Exponent & Log Scale card */}
        <div className="ppr-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#6d28d9', textTransform: 'uppercase' }}>EXPONENT & LOG SCALE</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Base a: {state.base}</label>
              <input type="range" min={2} max={5} value={state.base} onChange={e => dispatch({ type: 'SET_PARAMS', payload: { base: Number(e.target.value) } })} />
              <label style={{ fontSize: '13px', fontWeight: 600 }}>m: {state.m}</label>
              <input type="range" min={1} max={5} value={state.m} onChange={e => dispatch({ type: 'SET_PARAMS', payload: { m: Number(e.target.value) } })} />
              <label style={{ fontSize: '13px', fontWeight: 600 }}>n: {state.n}</label>
              <input type="range" min={1} max={5} value={state.n} onChange={e => dispatch({ type: 'SET_PARAMS', payload: { n: Number(e.target.value) } })} />
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '14px', fontWeight: 700, color: '#4c1d95' }}>
            ({state.base}<sup>{state.m}</sup>)<sup>{state.n}</sup> = {state.base}<sup>{totalExponent}</sup> = {result}
          </div>
        </div>

        {/* Main Visual Proof Grid Workspace */}
        <div className="ppr-workspace">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '15px', color: '#4c1d95', fontWeight: 700 }}>VISUAL PROOF</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'grid' })}
                style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #c4b5fd', background: state.viewMode === 'grid' ? '#ede9fe' : '#fff', color: '#6d28d9', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}
              >
                Grid view
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'array' })}
                style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #c4b5fd', background: state.viewMode === 'array' ? '#ede9fe' : '#fff', color: '#6d28d9', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}
              >
                Array view
              </button>
              <button
                onClick={() => dispatch({ type: 'FLATTEN' })}
                style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: '#6d28d9', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}
              >
                Flatten Grid
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', justifyContent: 'center', background: '#faf9ff', padding: '24px', borderRadius: '12px', border: '1px solid #f0edfd' }}>
            {/* (a^m) single group */}
            <div style={{ border: '1px dashed #a78bfa', padding: '16px', borderRadius: '10px', background: '#fff', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#6d28d9', marginBottom: '8px' }}>(a<sup>m</sup>)</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {Array.from({ length: state.m }).map((_, i) => (
                  <span key={i} style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#ede9fe', color: '#6d28d9', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                    {state.base}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '6px' }}>m = {state.m} factors</div>
            </div>

            <span style={{ fontSize: '20px', fontWeight: 800, color: '#9ca3af' }}>=</span>

            {/* (a^m)^n grid */}
            <div style={{ border: '1.5px solid #a78bfa', padding: '16px', borderRadius: '10px', background: '#fff', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#6d28d9', marginBottom: '8px' }}>(a<sup>m</sup>)<sup>n</sup></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {Array.from({ length: state.n }).map((_, r) => (
                  <div key={r} style={{ display: 'flex', gap: '6px' }}>
                    {Array.from({ length: state.m }).map((_, c) => (
                      <span key={c} style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#ddd6fe', color: '#4c1d95', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                        {state.base}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '6px' }}>n = {state.n} groups of m = {state.m}</div>
            </div>

            <span style={{ fontSize: '20px', fontWeight: 800, color: '#9ca3af' }}>=</span>

            {/* Flattened a^(mn) */}
            <div style={{ border: state.isFlattened ? '2px solid #059669' : '1px dashed #d1d5db', padding: '16px', borderRadius: '10px', background: state.isFlattened ? '#ecfdf5' : '#fff', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: state.isFlattened ? '#059669' : '#6b7280', marginBottom: '8px' }}>a<sup>mn</sup></div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '280px', justifyContent: 'center' }}>
                {Array.from({ length: totalExponent }).map((_, i) => (
                  <span key={i} style={{ width: '24px', height: '24px', borderRadius: '4px', background: state.isFlattened ? '#d1fae5' : '#f3f4f6', color: state.isFlattened ? '#065f46' : '#9ca3af', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                    {state.base}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: '11px', color: state.isFlattened ? '#059669' : '#9ca3af', marginTop: '6px', fontWeight: 700 }}>
                {totalExponent} total factors ({state.m} × {state.n})
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Footer */}
        <div className="ppr-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: '0 0 4px', fontSize: '14px', color: '#4c1d95', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trophy size={16} /> YOUR CHALLENGE
            </h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#4b5563' }}>
              If a = 2, m = 4, n = 3, what is (a<sup>m</sup>)<sup>n</sup>?
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={state.challengeAnswer}
              onChange={e => dispatch({ type: 'SET_CHALLENGE', payload: e.target.value })}
              placeholder="e.g. 4096 or 2^12"
              style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
            />
            <button
              onClick={() => dispatch({ type: 'CHECK_CHALLENGE' })}
              style={{ background: '#6d28d9', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
            >
              Check
            </button>
          </div>
        </div>
      </main>

      {/* Right Rail */}
      <aside className="ppr-rail">
        <h2 style={{ margin: 0, fontSize: '16px', color: '#09143d', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#6d28d9" /> WHY IT WORKS
        </h2>

        <div className="ppr-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="ppr-step-num">1</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>Group of groups</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#4b5563' }}>(a<sup>m</sup>)<sup>n</sup> means n groups of m factors.</p>
        </div>

        <div className="ppr-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="ppr-step-num">2</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>Make a grid</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#4b5563' }}>Arrange factors in an n × m grid.</p>
        </div>

        <div className="ppr-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="ppr-step-num">3</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>Flatten to one long row</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#059669', fontWeight: 700 }}>Reading across gives mn factors of a.</p>
        </div>

        <div style={{ background: '#fcfbfe', border: '1px solid #e8e6f8', borderRadius: '12px', padding: '16px', marginTop: 'auto' }}>
          <h4 style={{ margin: '0 0 6px', fontSize: '13px', color: '#4c1d95', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HelpCircle size={14} /> PREDICT
          </h4>
          <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#4b5563' }}>If a = 5, m = 2, n = 4, what is (a<sup>m</sup>)<sup>n</sup>?</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={state.predictInput}
              onChange={e => dispatch({ type: 'SET_PREDICT', payload: e.target.value })}
              placeholder="e.g. a^8"
              style={{ flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '12px' }}
            />
            <button
              onClick={() => dispatch({ type: 'CHECK_PREDICT' })}
              style={{ background: '#6d28d9', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              Check
            </button>
          </div>
          {state.predictChecked && (
            <p style={{ margin: '6px 0 0', fontSize: '12px', fontWeight: 600, color: state.predictCorrect ? '#059669' : '#dc2626' }}>
              {state.predictCorrect ? '✔ Correct! (5^2)^4 = 5^8.' : '✘ Try again. Multiply exponents 2 × 4 = 8.'}
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
