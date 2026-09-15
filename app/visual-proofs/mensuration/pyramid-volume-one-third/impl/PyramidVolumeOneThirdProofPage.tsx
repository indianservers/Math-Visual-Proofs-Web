import { useReducer } from 'react';
import {
  Compass, BookOpen, Bookmark, User, Settings,
  Sparkles, Layers
} from 'lucide-react';
import { computePyramidVolume } from './pyramid-volume-one-thirdMath';
import { initPyramidVolumeState, pyramidVolumeReducer } from './pyramid-volume-one-thirdReducer';
import './pyramid-volume-one-third.css';

export function PyramidVolumeOneThirdProofPage() {
  const [state, dispatch] = useReducer(pyramidVolumeReducer, undefined, initPyramidVolumeState);
  const { Vprism, Vpyramid } = computePyramidVolume(state.baseArea, state.height);

  return (
    <div className="pvo-shell">
      <aside className="pvo-sidenav">
        <div className="pvo-logo">MV</div>
        <div className="pvo-navitem active"><Compass /><span>Explore</span></div>
        <div className="pvo-navitem"><BookOpen /><span>Proofs</span></div>
        <div className="pvo-navitem"><Bookmark /><span>Practice</span></div>
        <div className="pvo-navitem"><User /><span>Saved</span></div>
        <div style={{ marginTop: 'auto' }}><div className="pvo-navitem"><Settings /><span>Settings</span></div></div>
      </aside>

      <main className="pvo-main">
        <header className="pvo-header">
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6d28d9', marginBottom: '4px' }}>
              Visual Proofs / Geometry / Volume
            </div>
            <h1 className="pvo-title">Volume of a Pyramid V = ⅓ Bh</h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#4b5563' }}>
              A prism with the same base area B and height h decomposes into three equal-volume pyramids.
            </p>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#6d28d9', background: '#f3f0ff', padding: '6px 14px', borderRadius: '8px' }}>
            Intermediate · 15 min
          </span>
        </header>

        {/* Controls Card */}
        <div className="pvo-card" style={{ display: 'flex', gap: '24px', alignItems: 'center', background: '#faf9ff' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#4c1d95', display: 'block', marginBottom: '4px' }}>Base (B)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Area = {state.baseArea} u²</span>
              <input type="range" min={6} max={48} step={6} value={state.baseArea} onChange={e => dispatch({ type: 'SET_BASE_AREA', payload: Number(e.target.value) })} style={{ accentColor: '#7c3aed' }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#4c1d95', display: 'block', marginBottom: '4px' }}>Height (h)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>h = {state.height} u</span>
              <input type="range" min={2} max={12} value={state.height} onChange={e => dispatch({ type: 'SET_HEIGHT', payload: Number(e.target.value) })} style={{ accentColor: '#7c3aed' }} />
            </div>
          </div>
          <button onClick={() => dispatch({ type: 'TOGGLE_UNROLL' })} style={{ background: '#ede9fe', color: '#6d28d9', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={16} /> {state.unrolled ? 'Roll Up Net' : 'Unroll Net View'}
          </button>
        </div>

        {/* 3D Visual Decomposition Workspace */}
        <div className="pvo-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', alignItems: 'center', background: '#fff', padding: '24px' }}>
          {/* Reference Prism */}
          <div style={{ textAlign: 'center', border: '1px solid #e8e6f8', padding: '16px', borderRadius: '12px', background: '#faf9ff' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb', display: 'block', marginBottom: '8px' }}>Prism (reference)</span>
            <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 120 120" style={{ width: '100px', height: '100px' }}>
                <polygon points="30,30 90,30 110,90 50,90" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
                <polygon points="30,30 50,90 10,90" fill="#bfdbfe" stroke="#2563eb" strokeWidth="1.5" />
                <text x="60" y="70" textAnchor="middle" fill="#1e40af" fontSize="14" fontWeight="800">B</text>
              </svg>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af', marginTop: '6px' }}>
              V<sub>prism</sub> = Bh = {Vprism} u³
            </div>
          </div>

          {/* Movable Pyramids */}
          <div style={{ textAlign: 'center', border: '1px dashed #a78bfa', padding: '16px', borderRadius: '12px', background: '#fff' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#6d28d9', display: 'block', marginBottom: '8px' }}>Drag Pyramid into Container</span>
            <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 120 120" style={{ width: '100px', height: '100px', cursor: 'pointer' }} onClick={() => dispatch({ type: 'DOCK_PYRAMID' })}>
                <polygon points="60,10 20,90 100,90" fill="#e9d5ff" stroke="#7c3aed" strokeWidth="2" />
                <line x1="60" y1="10" x2="60" y2="90" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="60" y="60" textAnchor="middle" fill="#5b21b6" fontSize="13" fontWeight="800">⅓</text>
              </svg>
            </div>
            <button onClick={() => dispatch({ type: 'DOCK_PYRAMID' })} style={{ background: '#6d28d9', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
              Dock Pyramid ({state.placedPyramidsCount}/3)
            </button>
          </div>

          {/* Three Equal Pyramids */}
          <div style={{ textAlign: 'center', border: '1px solid #e8e6f8', padding: '16px', borderRadius: '12px', background: '#faf9ff' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#059669', display: 'block', marginBottom: '8px' }}>Three equal pyramids</span>
            <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 120 120" style={{ width: '100px', height: '100px' }}>
                <polygon points="60,10 10,100 110,100" fill="#d1fae5" stroke="#059669" strokeWidth="1.5" />
                <line x1="60" y1="10" x2="35" y2="100" stroke="#059669" strokeWidth="1.5" />
                <line x1="60" y1="10" x2="85" y2="100" stroke="#059669" strokeWidth="1.5" />
                <text x="35" y="70" textAnchor="middle" fill="#065f46" fontSize="11" fontWeight="800">⅓</text>
                <text x="60" y="70" textAnchor="middle" fill="#065f46" fontSize="11" fontWeight="800">⅓</text>
                <text x="85" y="70" textAnchor="middle" fill="#065f46" fontSize="11" fontWeight="800">⅓</text>
              </svg>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#047857', marginTop: '6px' }}>
              Each pyramid: V = ⅓ Bh = {Vpyramid} u³
            </div>
          </div>
        </div>

        {/* Challenge Footer */}
        <div className="pvo-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: '0 0 4px', fontSize: '14px', color: '#4c1d95' }}>Challenge: Solve for volume</h4>
            <span style={{ fontSize: '12px', color: '#4b5563' }}>B = {state.baseArea} u², h = {state.height} u &nbsp;⇒&nbsp; V = ⅓ × {state.baseArea} × {state.height}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              value={state.challengeAnswer}
              onChange={e => dispatch({ type: 'SET_CHALLENGE', payload: e.target.value })}
              style={{ width: '80px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', textAlign: 'center', fontWeight: 700 }}
            />
            <span>u³</span>
            <button onClick={() => dispatch({ type: 'CHECK_CHALLENGE' })} style={{ background: '#6d28d9', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}>
              Check
            </button>
          </div>
        </div>
      </main>

      {/* Right Rail */}
      <aside className="pvo-rail">
        <h2 style={{ margin: 0, fontSize: '16px', color: '#09143d', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#6d28d9" /> Why it works
        </h2>

        <div className="pvo-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="pvo-step-num">1</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>Decompose</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#4b5563' }}>Connect prism top to all base vertices.</p>
        </div>

        <div className="pvo-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="pvo-step-num">2</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>Equal volumes</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#4b5563' }}>The three pyramids share base B and height h.</p>
        </div>

        <div className="pvo-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="pvo-step-num">3</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>Add volumes</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#059669', fontWeight: 700 }}>
            V<sub>prism</sub> = ⅓ Bh + ⅓ Bh + ⅓ Bh = Bh.
          </p>
        </div>
      </aside>
    </div>
  );
}
