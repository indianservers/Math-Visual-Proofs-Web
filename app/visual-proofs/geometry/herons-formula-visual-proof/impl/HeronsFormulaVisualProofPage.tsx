import { useReducer, useState } from 'react';
import {
  Compass, BookOpen, Bookmark, User, Settings,
  Sparkles, Trophy, RotateCcw
} from 'lucide-react';
import { computeHeron } from './herons-formula-visual-proofMath';
import { initHeronsState, heronsReducer } from './herons-formula-visual-proofReducer';
import './herons-formula-visual-proof.css';

export function HeronsFormulaVisualProofPage() {
  const [state, dispatch] = useReducer(heronsReducer, undefined, initHeronsState);
  const [isDragging, setIsDragging] = useState(false);

  const { a, b, c, s, h, x, y, area } = computeHeron(state.ptA, state.ptB, state.ptC);

  const handlePointerDownA = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const svg = e.currentTarget.getBoundingClientRect();
    const nx = Math.max(50, Math.min(490, e.clientX - svg.left));
    const ny = Math.max(40, Math.min(260, e.clientY - svg.top));
    dispatch({ type: 'MOVE_VERTEX_A', payload: { x: nx, y: ny } });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="hfp-shell">
      <aside className="hfp-sidenav">
        <div className="hfp-logo">MV</div>
        <div className="hfp-navitem active"><Compass /><span>Explore</span></div>
        <div className="hfp-navitem"><BookOpen /><span>Proofs</span></div>
        <div className="hfp-navitem"><Bookmark /><span>Practice</span></div>
        <div className="hfp-navitem"><User /><span>Saved</span></div>
        <div style={{ marginTop: 'auto' }}><div className="hfp-navitem"><Settings /><span>Settings</span></div></div>
      </aside>

      <main className="hfp-main">
        <header className="hfp-header">
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6d28d9', marginBottom: '4px' }}>
              Visual Proofs / Geometry Proofs
            </div>
            <h1 className="hfp-title">Heron’s Formula</h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#4b5563' }}>
              Rearrange the triangle to see how its sides and altitude build the area, discovering Heron's formula.
            </p>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#6d28d9', background: '#f3f0ff', padding: '6px 14px', borderRadius: '8px' }}>
            Advanced · 12 min
          </span>
        </header>

        {/* Mission bar */}
        <div className="hfp-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#faf9ff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#6d28d9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <strong style={{ fontSize: '14px', color: '#4c1d95' }}>Mission: Define s → Use altitude → Build area → Arrive at formula</strong>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => dispatch({ type: 'TOGGLE_ALTITUDE' })} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              {state.showAltitude ? 'Hide Altitude' : 'Show Altitude'}
            </button>
            <button onClick={() => dispatch({ type: 'RESET' })} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>

        {/* Workspace Canvas & Measures Panel */}
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 200px', gap: '16px' }}>
          {/* Tools / View Panel */}
          <div className="hfp-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#6d28d9', textTransform: 'uppercase' }}>Tools</span>
            <div style={{ padding: '8px', background: '#ede9fe', borderRadius: '8px', color: '#4c1d95', fontSize: '12px', fontWeight: 700, textAlign: 'center' }}>
              Drag vertex A to move
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="hfp-card" style={{ position: 'relative', height: '360px', overflow: 'hidden', padding: 0 }}>
            <svg viewBox="0 0 540 360" style={{ width: '100%', height: '100%', display: 'block', background: '#faf9ff' }} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
              {/* Triangle Body */}
              <polygon
                points={`${state.ptA.x},${state.ptA.y} ${state.ptB.x},${state.ptB.y} ${state.ptC.x},${state.ptC.y}`}
                fill="#f3e8ff"
                fillOpacity="0.4"
                stroke="#7c3aed"
                strokeWidth="2.5"
              />

              {/* Altitude Line */}
              {state.showAltitude && (
                <line x1={state.ptA.x} y1={state.ptA.y} x2={state.ptA.x} y2={state.ptB.y} stroke="#2563eb" strokeWidth="2" strokeDasharray="4 4" />
              )}

              {/* Labels & Vertices */}
              <text x={state.ptA.x} y={state.ptA.y - 12} textAnchor="middle" fill="#4c1d95" fontSize="16" fontWeight="800">A</text>
              <text x={state.ptB.x - 14} y={state.ptB.y + 6} fill="#059669" fontSize="15" fontWeight="800">B</text>
              <text x={state.ptC.x + 8} y={state.ptC.y + 6} fill="#dc2626" fontSize="15" fontWeight="800">C</text>
              {state.showAltitude && <text x={state.ptA.x} y={state.ptB.y + 16} textAnchor="middle" fill="#2563eb" fontSize="14" fontWeight="800">D</text>}

              {/* Draggable Vertex A */}
              <circle cx={state.ptA.x} cy={state.ptA.y} r="10" fill="#7c3aed" stroke="#fff" strokeWidth="2.5" onPointerDown={handlePointerDownA} style={{ cursor: 'grab' }} />
              <circle cx={state.ptB.x} cy={state.ptB.y} r="6" fill="#059669" />
              <circle cx={state.ptC.x} cy={state.ptC.y} r="6" fill="#dc2626" />
            </svg>
          </div>

          {/* Measures & Semiperimeter card */}
          <div className="hfp-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#6d28d9', textTransform: 'uppercase' }}>Measures</span>
            <div style={{ fontSize: '12px', color: '#374151', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>• a = {a.toFixed(2)}</div>
              <div>• b = {b.toFixed(2)}</div>
              <div>• c = {c.toFixed(2)}</div>
              <div>• h = {h.toFixed(2)}</div>
              <div>• x = {x.toFixed(2)}</div>
              <div>• y = {y.toFixed(2)}</div>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #e8e6f8', margin: '4px 0' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#6d28d9' }}>Semiperimeter</span>
            <div style={{ fontSize: '12px', fontWeight: 600 }}>s = (a + b + c) / 2</div>
            <div style={{ background: '#ede9fe', padding: '6px 10px', borderRadius: '8px', textAlign: 'center', fontSize: '14px', fontWeight: 800, color: '#4c1d95' }}>
              s = {s.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Visual One-line Proof & Challenge */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
          <div className="hfp-card">
            <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: '#4c1d95' }}>Visual one-line proof</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', overflowX: 'auto' }}>
              <span>A = (1/2) a h</span>
              <strong style={{ color: '#6d28d9' }}>⇒</strong>
              <span>h² = x(a - x) = y(a - y)</span>
              <strong style={{ color: '#6d28d9' }}>⇒</strong>
              <span style={{ fontWeight: 800, color: '#059669', background: '#ecfdf5', padding: '6px 12px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                A = √(s(s - a)(s - b)(s - c))
              </span>
            </div>
          </div>

          <div className="hfp-card">
            <h4 style={{ margin: '0 0 6px', fontSize: '14px', color: '#4c1d95', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trophy size={16} /> Challenge
            </h4>
            <p style={{ margin: '0 0 6px', fontSize: '11px', color: '#4b5563' }}>Target Area (A): {area.toFixed(4)}</p>
            <button onClick={() => dispatch({ type: 'CHECK_CHALLENGE' })} style={{ width: '100%', background: '#6d28d9', color: '#fff', border: 'none', padding: '6px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
              Verify Area
            </button>
          </div>
        </div>
      </main>

      {/* Right Rail */}
      <aside className="hfp-rail">
        <h2 style={{ margin: 0, fontSize: '16px', color: '#09143d', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#6d28d9" /> Why it works
        </h2>

        <div className="hfp-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="hfp-step-num">1</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>Define semiperimeter</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#4b5563' }}>s = (a + b + c) / 2</p>
        </div>

        <div className="hfp-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="hfp-step-num">2</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>Connect sides to altitude</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#4b5563' }}>h² = c² - x² = b² - y²</p>
        </div>

        <div className="hfp-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="hfp-step-num">3</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>Area from two right triangles</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#059669', fontWeight: 700 }}>
            A = √(s(s - a)(s - b)(s - c))
          </p>
        </div>

        <div style={{ background: '#fcfbfe', border: '1px solid #e8e6f8', borderRadius: '12px', padding: '16px', marginTop: 'auto' }}>
          <button onClick={() => dispatch({ type: 'REVEAL_PREDICT' })} style={{ width: '100%', background: '#6d28d9', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            Reveal Proof Formula
          </button>
        </div>
      </aside>
    </div>
  );
}
