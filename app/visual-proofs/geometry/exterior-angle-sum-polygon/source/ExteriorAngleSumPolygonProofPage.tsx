import { useReducer, useState } from 'react';
import {
  Compass, BookOpen, Bookmark, User, Settings,
  Sparkles, Trophy, HelpCircle, Move, Plus, Trash2, Scissors, RotateCcw
} from 'lucide-react';
import { initExteriorAngleSumState, exteriorAngleSumReducer } from './exterior-angle-sum-polygonReducer';
import './exterior-angle-sum-polygon.css';

export function ExteriorAngleSumPolygonProofPage() {
  const [state, dispatch] = useReducer(exteriorAngleSumReducer, undefined, initExteriorAngleSumState);
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const handlePointerDown = (id: number, e: React.PointerEvent) => {
    e.stopPropagation();
    setDraggingId(id);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingId === null) return;
    const svg = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - svg.left;
    const y = e.clientY - svg.top;
    dispatch({ type: 'MOVE_VERTEX', payload: { id: draggingId, x, y } });
  };

  const handlePointerUp = () => {
    setDraggingId(null);
  };

  const angles = state.vertices.map(v => v.exteriorAngleDeg);

  return (
    <div className="eas-shell">
      <aside className="eas-sidenav">
        <div className="eas-logo">MV</div>
        <div className="eas-navitem active"><Compass /><span>Explore</span></div>
        <div className="eas-navitem"><BookOpen /><span>Proofs</span></div>
        <div className="eas-navitem"><Bookmark /><span>Practice</span></div>
        <div className="eas-navitem"><User /><span>Saved</span></div>
        <div style={{ marginTop: 'auto' }}><div className="eas-navitem"><Settings /><span>Settings</span></div></div>
      </aside>

      <main className="eas-main">
        <header className="eas-header">
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6d28d9', marginBottom: '4px' }}>
              Visual Proofs / Geometry Proofs
            </div>
            <h1 className="eas-title">Exterior Angle Sum of a Polygon: 360 degrees</h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#4b5563' }}>
              As a walker turns once around any polygon, the total direction change is exactly one full turn.
            </p>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#6d28d9', background: '#f3f0ff', padding: '6px 14px', borderRadius: '8px' }}>
            Intermediate · 8 min
          </span>
        </header>

        {/* Mission Strip */}
        <div className="eas-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#faf9ff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#6d28d9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <strong style={{ fontSize: '14px', color: '#4c1d95', display: 'block' }}>Your mission</strong>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Use turning angles to show that the exterior angles of any polygon sum to 360°.</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: 600, color: '#059669' }}>
            <span>✔ Use turning angles</span>
            <span>✔ Independent of side lengths</span>
            <span>✔ Prove sum is 360°</span>
          </div>
        </div>

        {/* Workspace Canvas with Sidebar Tools */}
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '20px' }}>
          {/* Tools Panel */}
          <div className="eas-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#6d28d9', textTransform: 'uppercase' }}>Tools</span>
            <button
              onClick={() => dispatch({ type: 'SET_TOOL', payload: 'move' })}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', border: state.activeTool === 'move' ? '2px solid #6d28d9' : '1px solid #d1d5db', background: state.activeTool === 'move' ? '#ede9fe' : '#fff', color: '#4c1d95', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
            >
              <Move size={16} /> Move
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_TOOL', payload: 'add' })}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', border: state.activeTool === 'add' ? '2px solid #6d28d9' : '1px solid #d1d5db', background: state.activeTool === 'add' ? '#ede9fe' : '#fff', color: '#4c1d95', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
            >
              <Plus size={16} /> Add vertex
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_TOOL', payload: 'delete' })}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', border: state.activeTool === 'delete' ? '2px solid #6d28d9' : '1px solid #d1d5db', background: state.activeTool === 'delete' ? '#ede9fe' : '#fff', color: '#4c1d95', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
            >
              <Trash2 size={16} /> Delete vertex
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_TOOL', payload: 'detach' })}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', border: state.activeTool === 'detach' ? '2px solid #6d28d9' : '1px solid #d1d5db', background: state.activeTool === 'detach' ? '#ede9fe' : '#fff', color: '#4c1d95', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
            >
              <Scissors size={16} /> Detach arc
            </button>
            <button
              onClick={() => dispatch({ type: 'RESET' })}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#f9fafb', color: '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '13px', marginTop: 'auto' }}
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>

          {/* Interactive SVG Canvas */}
          <div className="eas-card" style={{ position: 'relative', height: '400px', overflow: 'hidden', padding: 0 }}>
            <svg
              viewBox="0 0 540 400"
              style={{ width: '100%', height: '100%', display: 'block', background: '#faf9ff' }}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              {/* Polygon Path */}
              <polygon
                points={state.vertices.map(v => `${v.x},${v.y}`).join(' ')}
                fill="#f3e8ff"
                fillOpacity="0.4"
                stroke="#7c3aed"
                strokeWidth="2.5"
              />

              {/* Center 360° indicator */}
              <circle cx="270" cy="220" r="30" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="270" y="225" textAnchor="middle" fill="#6d28d9" fontSize="13" fontWeight="800">360°</text>

              {/* Vertices & Angle Labels */}
              {state.vertices.map((v) => (
                <g key={v.id}>
                  <circle
                    cx={v.x}
                    cy={v.y}
                    r="8"
                    fill={v.color}
                    stroke="#fff"
                    strokeWidth="2"
                    onPointerDown={e => handlePointerDown(v.id, e)}
                    style={{ cursor: 'grab' }}
                  />
                  <text x={v.x + 12} y={v.y - 12} fill="#1e1b4b" fontSize="13" fontWeight="800">
                    {v.exteriorAngleDeg}°
                  </text>
                </g>
              ))}
            </svg>

            {/* Sum Indicator */}
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: '#fff', padding: '8px 16px', borderRadius: '10px', border: '1px solid #e8e6f8', fontSize: '13px', fontWeight: 700, color: '#4c1d95' }}>
              Exterior angle sum: {angles.join('° + ')}° = <span style={{ color: '#059669', fontSize: '15px' }}>360°</span>
            </div>
          </div>
        </div>

        {/* Footer Visual Proof & Challenge */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
          <div className="eas-card">
            <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: '#4c1d95' }}>One-line visual proof</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#374151' }}>
              <span>At each vertex, turn by the exterior angle.</span>
              <strong style={{ color: '#6d28d9' }}>→</strong>
              <span>These turns join head-to-tail to make one full turn.</span>
              <strong style={{ color: '#6d28d9' }}>→</strong>
              <span style={{ fontWeight: 800, color: '#059669', background: '#ecfdf5', padding: '6px 12px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                Sum = 360°
              </span>
            </div>
          </div>

          <div className="eas-card">
            <h4 style={{ margin: '0 0 6px', fontSize: '14px', color: '#4c1d95', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trophy size={16} /> Challenge
            </h4>
            <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#4b5563' }}>Try a different polygon:</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={state.challengePolygon}
                onChange={e => dispatch({ type: 'SET_CHALLENGE_POLYGON', payload: e.target.value })}
                style={{ flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '12px' }}
              >
                <option>Triangle (3 sides)</option>
                <option>Quadrilateral (4 sides)</option>
                <option>Pentagon (5 sides)</option>
                <option>Heptagon (7 sides)</option>
              </select>
              <button
                onClick={() => dispatch({ type: 'CHECK_CHALLENGE' })}
                style={{ background: '#6d28d9', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                Try it!
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Right Rail */}
      <aside className="eas-rail">
        <h2 style={{ margin: 0, fontSize: '16px', color: '#09143d', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#6d28d9" /> Why it works
        </h2>

        <div className="eas-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="eas-step-num">1</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>You walk around the polygon.</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#4b5563' }}>At each vertex, you turn by an exterior angle.</p>
        </div>

        <div className="eas-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="eas-step-num">2</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>Your total turning is one full turn.</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#4b5563' }}>A full circuit brings you back facing the exact same way.</p>
        </div>

        <div className="eas-why-card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="eas-step-num">3</div>
            <strong style={{ fontSize: '13px', color: '#1e1b4b' }}>One full turn equals 360°.</strong>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#059669', fontWeight: 700 }}>Therefore the exterior angles sum to 360°.</p>
        </div>

        <div style={{ background: '#fcfbfe', border: '1px solid #e8e6f8', borderRadius: '12px', padding: '16px', marginTop: 'auto' }}>
          <h4 style={{ margin: '0 0 6px', fontSize: '13px', color: '#4c1d95', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HelpCircle size={14} /> Prediction
          </h4>
          <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#4b5563' }}>What will be the sum of exterior angles for any n-gon?</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={state.predictAnswer}
              onChange={e => dispatch({ type: 'SET_PREDICT', payload: e.target.value })}
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
              {state.predictCorrect ? '✔ Correct! The sum is always 360°.' : '✘ Try 360.'}
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
