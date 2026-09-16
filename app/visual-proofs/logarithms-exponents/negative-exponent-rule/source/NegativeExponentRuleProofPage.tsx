import { useReducer } from 'react';
import {
  Compass, BookOpen, Bookmark, User, Settings,
  Sparkles, Trophy, HelpCircle
} from 'lucide-react';
import { computeNegativeExponent } from './negative-exponent-ruleMath';
import { initNegativeExponentState, negativeExponentReducer } from './negative-exponent-ruleReducer';
import './negative-exponent-rule.css';

export function NegativeExponentRuleProofPage() {
  const [state, dispatch] = useReducer(negativeExponentReducer, undefined, initNegativeExponentState);
  const { absExp, denominatorVal } = computeNegativeExponent(state.base, state.exp);

  const exponents = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

  return (
    <div className="ner-shell">
      <aside className="ner-sidenav">
        <div className="ner-logo">MV</div>
        <div className="ner-navitem active"><Compass /><span>Explore</span></div>
        <div className="ner-navitem"><BookOpen /><span>Proofs</span></div>
        <div className="ner-navitem"><Bookmark /><span>Practice</span></div>
        <div className="ner-navitem"><User /><span>Saved</span></div>
        <div style={{ marginTop: 'auto' }}><div className="ner-navitem"><Settings /><span>Settings</span></div></div>
      </aside>

      <main className="ner-main">
        <header className="ner-header">
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6d28d9', marginBottom: '4px' }}>
              Visual Proofs / Exponents
            </div>
            <h1 className="ner-title">Negative Exponent Rule: a<sup>-n</sup> = 1 / a<sup>n</sup></h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#4b5563' }}>
              Moving left on the exponent table divides by the base each step. Crossing from a<sup>0</sup> to a<sup>-n</sup> places the factors in the denominator.
            </p>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#6d28d9', background: '#f3f0ff', padding: '6px 14px', borderRadius: '8px' }}>
            Intermediate · 12 min
          </span>
        </header>

        {/* Exponent Power Scale */}
        <div className="ner-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', color: '#4c1d95', fontWeight: 700 }}>EXPONENT POWER SCALE</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Base a = {state.base}</label>
              <input type="range" min={2} max={6} value={state.base} onChange={e => dispatch({ type: 'SET_BASE', payload: Number(e.target.value) })} style={{ accentColor: '#7c3aed' }} />
            </div>
          </div>

          {/* Exponent Table Scale Visual */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', overflowX: 'auto', padding: '16px 0' }}>
            {exponents.map(e => {
              const isSelected = state.exp === e;
              const isNeg = e < 0;
              const valStr = isNeg ? `1/${Math.pow(state.base, Math.abs(e))}` : `${Math.pow(state.base, e)}`;
              return (
                <div
                  key={e}
                  onClick={() => dispatch({ type: 'SET_EXP', payload: e })}
                  style={{
                    border: isSelected ? '2px solid #6d28d9' : '1px solid #e8e6f8',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    background: isSelected ? '#ede9fe' : (isNeg ? '#ccfbf1' : '#faf5ff'),
                    textAlign: 'center',
                    minWidth: '60px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>{e}</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#4c1d95' }}>
                    {state.base}<sup>{e}</sup>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: isNeg ? '#0d9488' : '#6d28d9', marginTop: '6px' }}>
                    {valStr}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '13px', color: '#4b5563', background: '#fcfbfe', padding: '10px', borderRadius: '8px', border: '1px solid #f0edfd' }}>
            You moved <strong>{absExp}</strong> steps left from {state.base}<sup>0</sup>. That divides by {state.base} {absExp} times: &nbsp;
            <strong>{state.base}<sup>{state.exp}</sup> = {Array.from({ length: absExp }).map(() => `1/${state.base}`).join(' × ')} = 1 / {state.base}<sup>{absExp}</sup> = 1/{denominatorVal}</strong>
          </div>
        </div>

        {/* Visual Proof Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <div className="ner-card">
            <h3 style={{ margin: '0 0 12px', fontSize: '14px', color: '#4c1d95', fontWeight: 700 }}>VISUAL PROOF</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', background: '#faf9ff', padding: '20px', borderRadius: '12px', border: '1px solid #f0edfd' }}>
              <div style={{ padding: '8px 14px', border: '1px dashed #a78bfa', borderRadius: '8px', background: '#fff', fontSize: '14px', fontWeight: 700 }}>
                Start at a<sup>0</sup> = 1
              </div>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#9ca3af' }}>→</span>
              <div style={{ padding: '8px 14px', border: '1px solid #0d9488', borderRadius: '8px', background: '#ccfbf1', fontSize: '14px', fontWeight: 700, color: '#0f766e' }}>
                ÷ a<sup>{absExp}</sup> &nbsp;⇒&nbsp; 1 / a<sup>{absExp}</sup>
              </div>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#9ca3af' }}>=</span>
              <div style={{ padding: '8px 16px', border: '2px solid #6d28d9', borderRadius: '8px', background: '#ede9fe', fontSize: '16px', fontWeight: 800, color: '#4c1d95' }}>
                a<sup>-{absExp}</sup>
              </div>
            </div>
          </div>

          <div className="ner-card">
            <h3 style={{ margin: '0 0 8px', fontSize: '14px', color: '#4c1d95', fontWeight: 700 }}>ANIMATE PROOF</h3>
            <button
              onClick={() => dispatch({ type: 'STEP_LEFT' })}
              style={{ width: '100%', background: '#6d28d9', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
            >
              Step Left (÷ {state.base})
            </button>
          </div>
        </div>

        {/* Challenge Section */}
        <div className="ner-card">
          <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: '#4c1d95', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Trophy size={16} /> CHALLENGE — Express without negative exponents:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#faf9ff', padding: '8px 12px', borderRadius: '8px' }}>
              <span>1) 2<sup>-4</sup> = </span>
              <input
                type="text"
                value={state.challenge1}
                onChange={e => dispatch({ type: 'SET_CHALLENGE', payload: { field: 1, val: e.target.value } })}
                placeholder="e.g. 1/16"
                style={{ width: '80px', padding: '4px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '12px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#faf9ff', padding: '8px 12px', borderRadius: '8px' }}>
              <span>2) a<sup>-5</sup> = </span>
              <input
                type="text"
                value={state.challenge2}
                onChange={e => dispatch({ type: 'SET_CHALLENGE', payload: { field: 2, val: e.target.value } })}
                placeholder="e.g. 1/a^5"
                style={{ width: '80px', padding: '4px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '12px' }}
              />
            </div>
          </div>
          <button
            onClick={() => dispatch({ type: 'CHECK_CHALLENGE' })}
            style={{ marginTop: '12px', background: '#6d28d9', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '6px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
          >
            Check All
          </button>
        </div>
      </main>

      {/* Right Rail */}
      <aside className="ner-rail">
        <h2 style={{ margin: 0, fontSize: '16px', color: '#09143d', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#6d28d9" /> WHY IT WORKS
        </h2>

        <div className="ner-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="ner-step-num">1</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>Each step left divides by a</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#4b5563' }}>a<sup>n</sup> → a<sup>n-1</sup> = a<sup>n</sup> / a</p>
        </div>

        <div className="ner-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="ner-step-num">2</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>After n steps left</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#4b5563' }}>a<sup>0</sup> → a<sup>-n</sup> = 1 / a<sup>n</sup></p>
        </div>

        <div className="ner-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="ner-step-num">3</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>Therefore</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#059669', fontWeight: 700 }}>a<sup>-n</sup> = 1 / a<sup>n</sup></p>
        </div>

        <div style={{ background: '#fcfbfe', border: '1px solid #e8e6f8', borderRadius: '12px', padding: '16px', marginTop: 'auto' }}>
          <h4 style={{ margin: '0 0 6px', fontSize: '13px', color: '#4c1d95', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HelpCircle size={14} /> PREDICT
          </h4>
          <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#4b5563' }}>What is 5<sup>-3</sup>?</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={state.predictInput}
              onChange={e => dispatch({ type: 'SET_PREDICT', payload: e.target.value })}
              placeholder="e.g. 1/125"
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
              {state.predictCorrect ? '✔ Correct! 5^-3 = 1/5^3 = 1/125.' : '✘ Try 1/125 or 1/5^3.'}
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
