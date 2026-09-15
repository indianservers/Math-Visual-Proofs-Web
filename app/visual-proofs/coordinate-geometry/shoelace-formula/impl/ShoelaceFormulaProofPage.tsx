import { useReducer, useState } from 'react';
import {
  Compass, BookOpen, Bookmark, User, Settings,
  Sparkles, Trophy, RotateCcw
} from 'lucide-react';
import { computeShoelace } from './shoelace-formulaMath';
import { initShoelaceState, shoelaceReducer } from './shoelace-formulaReducer';
import './shoelace-formula.css';

export function ShoelaceFormulaProofPage() {
  const [state, dispatch] = useReducer(shoelaceReducer, undefined, initShoelaceState);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const { terms, downRightSum, upRightSum, signedDiff, twiceArea, signedArea, absoluteArea } = computeShoelace(state.points);

  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setDraggingId(id);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingId === null) return;
    const svg = e.currentTarget.getBoundingClientRect();
    let gx = Math.round((e.clientX - svg.left - 200) / 30);
    let gy = Math.round(-(e.clientY - svg.top - 200) / 30);
    gx = Math.max(-6, Math.min(6, gx));
    gy = Math.max(-4, Math.min(4, gy));
    dispatch({ type: 'MOVE_POINT', payload: { id: draggingId, x: gx, y: gy } });
  };

  const handlePointerUp = () => {
    setDraggingId(null);
  };

  // Convert math coords (x,y) to SVG screen coords (sx,sy)
  const toSvg = (x: number, y: number) => ({
    sx: 200 + x * 30,
    sy: 200 - y * 30,
  });

  const polyPointsSvg = state.points.map(p => {
    const pt = toSvg(p.x, p.y);
    return `${pt.sx},${pt.sy}`;
  }).join(' ');

  return (
    <div className="sfp-shell">
      <aside className="sfp-sidenav">
        <div className="sfp-logo">MV</div>
        <div className="sfp-navitem active"><Compass /><span>Explore</span></div>
        <div className="sfp-navitem"><BookOpen /><span>Proofs</span></div>
        <div className="sfp-navitem"><Bookmark /><span>Practice</span></div>
        <div className="sfp-navitem"><User /><span>Saved</span></div>
        <div style={{ marginTop: 'auto' }}><div className="sfp-navitem"><Settings /><span>Settings</span></div></div>
      </aside>

      <main className="sfp-main">
        <header className="sfp-header">
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6d28d9', marginBottom: '4px' }}>
              Visual Proofs / Geometry
            </div>
            <h1 className="sfp-title">Shoelace Formula</h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#4b5563' }}>
              Writing coordinates in a loop creates two diagonal product sums. Their signed difference equals twice the polygon area.
            </p>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#6d28d9', background: '#f3f0ff', padding: '6px 14px', borderRadius: '8px' }}>
            Intermediate · 12 min
          </span>
        </header>

        {/* Coordinate Plane & Shoelace Sums Panel */}
        <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '20px' }}>
          {/* Interactive Coordinate Canvas */}
          <div className="sfp-card" style={{ position: 'relative', height: '400px', overflow: 'hidden', padding: 0 }}>
            <svg
              viewBox="0 0 400 400"
              style={{ width: '100%', height: '100%', display: 'block', background: '#faf9ff' }}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              {/* Axes */}
              <line x1="20" y1="200" x2="380" y2="200" stroke="#9ca3af" strokeWidth="1.5" />
              <line x1="200" y1="20" x2="200" y2="380" stroke="#9ca3af" strokeWidth="1.5" />

              {/* Polygon */}
              <polygon points={polyPointsSvg} fill="#ede9fe" fillOpacity="0.6" stroke="#7c3aed" strokeWidth="2.5" />

              {/* Vertices */}
              {state.points.map(p => {
                const pt = toSvg(p.x, p.y);
                return (
                  <g key={p.id}>
                    <circle
                      cx={pt.sx}
                      cy={pt.sy}
                      r="8"
                      fill="#6d28d9"
                      stroke="#fff"
                      strokeWidth="2"
                      onPointerDown={e => handlePointerDown(p.id, e)}
                      style={{ cursor: 'grab' }}
                    />
                    <text x={pt.sx + 10} y={pt.sy - 10} fill="#1e1b4b" fontSize="12" fontWeight="800">
                      {p.name} ({p.x}, {p.y})
                    </text>
                  </g>
                );
              })}
            </svg>

            <button
              onClick={() => dispatch({ type: 'RESET' })}
              style={{ position: 'absolute', bottom: '12px', right: '12px', background: '#fff', border: '1px solid #d1d5db', borderRadius: '6px', padding: '6px 12px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          {/* Shoelace Table & Area Summary Card */}
          <div className="sfp-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', color: '#4c1d95', fontWeight: 700 }}>Shoelace Sums Table</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Down-right sum */}
              <div style={{ background: '#ecfdf5', padding: '10px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#047857' }}>Down-right (x_i * y_{'{i+1}'})</span>
                <div style={{ fontSize: '12px', marginTop: '4px', color: '#065f46', fontFamily: 'monospace' }}>
                  {terms.map((t, i) => <div key={i}>{t.name1}→{t.name2}: {t.dr}</div>)}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#047857', marginTop: '6px' }}>Σ = {downRightSum}</div>
              </div>

              {/* Up-right sum */}
              <div style={{ background: '#fef2f2', padding: '10px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#b91c1c' }}>Up-right (y_i * x_{'{i+1}'})</span>
                <div style={{ fontSize: '12px', marginTop: '4px', color: '#991b1b', fontFamily: 'monospace' }}>
                  {terms.map((t, i) => <div key={i}>{t.name1}→{t.name2}: {t.ur}</div>)}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#b91c1c', marginTop: '6px' }}>Σ = {upRightSum}</div>
              </div>
            </div>

            {/* Calculated Area Banner */}
            <div style={{ background: '#ede9fe', padding: '12px', borderRadius: '10px', border: '1px solid #ddd6fe', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#4c1d95' }}>Signed difference: {downRightSum} - {upRightSum} = {signedDiff}</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#6d28d9', marginTop: '2px' }}>
                2 × Area = {twiceArea} &nbsp;⇒&nbsp; Area = {signedArea} (signed) | {absoluteArea} (abs)
              </div>
            </div>
          </div>
        </div>

        {/* Footer Proof & Challenge */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
          <div className="sfp-card">
            <h4 style={{ margin: '0 0 6px', fontSize: '14px', color: '#4c1d95' }}>One-line proof</h4>
            <div style={{ fontSize: '12px', color: '#374151' }}>
              Area = ∑ (trapezoids) &nbsp;→&nbsp; ½ ∑ (x_i y_{'{i+1}'} - y_i x_{'{i+1}'}) &nbsp;→&nbsp; <strong>2 × Area = ∑ x_i y_{'{i+1}'} - ∑ y_i x_{'{i+1}'}</strong>
            </div>
          </div>

          <div className="sfp-card">
            <h4 style={{ margin: '0 0 6px', fontSize: '14px', color: '#4c1d95', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trophy size={16} /> Challenge
            </h4>
            <p style={{ margin: '0 0 6px', fontSize: '11px', color: '#4b5563' }}>Predict 2 × Area for current polygon:</p>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                value={state.predictInput}
                onChange={e => dispatch({ type: 'SET_PREDICT', payload: e.target.value })}
                placeholder={String(twiceArea)}
                style={{ flex: 1, padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '12px' }}
              />
              <button
                onClick={() => dispatch({ type: 'CHECK_PREDICT' })}
                style={{ background: '#6d28d9', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                Check
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Right Rail */}
      <aside className="sfp-rail">
        <h2 style={{ margin: 0, fontSize: '16px', color: '#09143d', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#6d28d9" /> Why it works
        </h2>

        <div className="sfp-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="sfp-step-num">1</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>List coordinates in order</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#4b5563' }}>List points in cyclic order and repeat the first point.</p>
        </div>

        <div className="sfp-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="sfp-step-num">2</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>Multiply diagonally</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#4b5563' }}>Multiply down-right and up-right in two direction sums.</p>
        </div>

        <div className="sfp-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="sfp-step-num">3</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>Subtract the sums</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#059669', fontWeight: 700 }}>
            The result equals 2 × the signed area.
          </p>
        </div>
      </aside>
    </div>
  );
}
