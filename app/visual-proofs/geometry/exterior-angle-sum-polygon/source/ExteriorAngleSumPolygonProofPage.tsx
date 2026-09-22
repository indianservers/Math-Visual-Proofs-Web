import { useReducer, useRef, useState, type CSSProperties } from 'react';
import {
  Sparkles, Trophy, HelpCircle, Move, Plus, Trash2, Scissors, RotateCcw
} from 'lucide-react';
import { initExteriorAngleSumState, exteriorAngleSumReducer } from './exterior-angle-sum-polygonReducer';
import {
  clientPointToViewBox,
  incomingHeadingDeg,
  svgWedgePath,
} from './exterior-angle-sum-polygonMath';
import './exterior-angle-sum-polygon.css';

const VIEW_W = 540;
const VIEW_H = 400;

export function ExteriorAngleSumPolygonProofPage() {
  const [state, dispatch] = useReducer(exteriorAngleSumReducer, undefined, initExteriorAngleSumState);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const viewPoint = (event: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    return clientPointToViewBox(event.clientX, event.clientY, svg, VIEW_W, VIEW_H);
  };

  const handleVertexPointerDown = (id: number, event: React.PointerEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (state.activeTool === 'delete') {
      dispatch({ type: 'DELETE_VERTEX', payload: { id } });
      return;
    }
    if (state.activeTool === 'add') return;
    setDraggingId(id);
    svgRef.current?.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (draggingId === null) return;
    const { x, y } = viewPoint(event);
    dispatch({
      type: 'MOVE_VERTEX',
      payload: {
        id: draggingId,
        x: Math.max(16, Math.min(VIEW_W - 16, x)),
        y: Math.max(16, Math.min(VIEW_H - 16, y)),
      },
    });
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (svgRef.current?.hasPointerCapture(event.pointerId)) {
      svgRef.current.releasePointerCapture(event.pointerId);
    }
    setDraggingId(null);
  };

  const handleCanvasPointerDown = (event: React.PointerEvent) => {
    if (state.activeTool !== 'add') return;
    const { x, y } = viewPoint(event);
    dispatch({ type: 'ADD_VERTEX', payload: { x, y } });
  };

  const angles = state.vertices.map((vertex) => vertex.exteriorAngleDeg);
  const canvasCursor =
    state.activeTool === 'add'
      ? 'crosshair'
      : state.activeTool === 'delete'
        ? 'not-allowed'
        : draggingId === null
          ? 'default'
          : 'grabbing';

  return (
    <div className="eas-shell">
      <main className="eas-main">
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '20px' }}>
          <div className="eas-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#6d28d9', textTransform: 'uppercase' }}>Tools</span>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
              {state.activeTool === 'add'
                ? 'Click the canvas or an edge to insert a vertex.'
                : state.activeTool === 'delete'
                  ? 'Click a vertex to remove it (keep at least 3).'
                  : state.activeTool === 'detach'
                    ? 'Exterior-angle wedges are stacked around 360°.'
                    : 'Drag a vertex to reshape the polygon.'}
            </p>
            <button
              type="button"
              onClick={() => dispatch({ type: 'SET_TOOL', payload: 'move' })}
              style={toolStyle(state.activeTool === 'move')}
            >
              <Move size={16} /> Move
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: 'SET_TOOL', payload: 'add' })}
              style={toolStyle(state.activeTool === 'add')}
            >
              <Plus size={16} /> Add vertex
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: 'SET_TOOL', payload: 'delete' })}
              style={toolStyle(state.activeTool === 'delete')}
            >
              <Trash2 size={16} /> Delete vertex
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: 'SET_TOOL', payload: 'detach' })}
              style={toolStyle(state.arcsDetached)}
            >
              <Scissors size={16} /> {state.arcsDetached ? 'Reattach arcs' : 'Detach arc'}
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: 'RESET' })}
              style={{ ...toolStyle(false), marginTop: 'auto', background: '#f9fafb', color: '#374151', fontWeight: 600 }}
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>

          <div className="eas-card" style={{ position: 'relative', height: '400px', overflow: 'hidden', padding: 0 }}>
            <svg
              ref={svgRef}
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              preserveAspectRatio="xMidYMid meet"
              style={{ width: '100%', height: '100%', display: 'block', background: '#faf9ff', cursor: canvasCursor, touchAction: 'none' }}
              onPointerDown={handleCanvasPointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              <polygon
                points={state.vertices.map((vertex) => `${vertex.x},${vertex.y}`).join(' ')}
                fill="#f3e8ff"
                fillOpacity="0.4"
                stroke="#7c3aed"
                strokeWidth="2.5"
                pointerEvents={state.activeTool === 'add' ? 'auto' : 'none'}
              />

              {!state.arcsDetached &&
                state.vertices.map((vertex, index) => (
                  <path
                    key={`wedge-${vertex.id}`}
                    d={svgWedgePath(vertex.x, vertex.y, 28, incomingHeadingDeg(state.vertices, index), vertex.exteriorAngleDeg)}
                    fill={vertex.color}
                    fillOpacity="0.35"
                    stroke={vertex.color}
                    strokeWidth="1"
                    pointerEvents="none"
                  />
                ))}

              {state.arcsDetached &&
                state.vertices.map((vertex, index) => {
                  const start = state.vertices
                    .slice(0, index)
                    .reduce((sum, item) => sum + item.exteriorAngleDeg, 0);
                  return (
                    <path
                      key={`detached-${vertex.id}`}
                      d={svgWedgePath(270, 220, 78, -90 + start, vertex.exteriorAngleDeg)}
                      fill={vertex.color}
                      fillOpacity="0.5"
                      stroke={vertex.color}
                      strokeWidth="1.5"
                      pointerEvents="none"
                    />
                  );
                })}

              <circle cx="270" cy="220" r="30" fill="#fff" fillOpacity="0.85" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="270" y="225" textAnchor="middle" fill="#6d28d9" fontSize="13" fontWeight="800">360°</text>

              {state.vertices.map((vertex) => (
                <g key={vertex.id}>
                  <circle
                    cx={vertex.x}
                    cy={vertex.y}
                    r="18"
                    fill="transparent"
                    onPointerDown={(event) => handleVertexPointerDown(vertex.id, event)}
                    style={{
                      cursor:
                        state.activeTool === 'delete'
                          ? 'pointer'
                          : state.activeTool === 'add'
                            ? 'crosshair'
                            : 'grab',
                    }}
                  />
                  <circle
                    cx={vertex.x}
                    cy={vertex.y}
                    r="10"
                    fill={vertex.color}
                    stroke={state.selectedVertexId === vertex.id ? '#1e1b4b' : '#fff'}
                    strokeWidth="2.5"
                    pointerEvents="none"
                  />
                  <text x={vertex.x + 12} y={vertex.y - 12} fill="#1e1b4b" fontSize="13" fontWeight="800" pointerEvents="none">
                    {vertex.exteriorAngleDeg}°
                  </text>
                </g>
              ))}
            </svg>

            <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: '#fff', padding: '8px 16px', borderRadius: '10px', border: '1px solid #e8e6f8', fontSize: '13px', fontWeight: 700, color: '#4c1d95' }}>
              Exterior angle sum: {angles.join('° + ')}° = <span style={{ color: '#059669', fontSize: '15px' }}>360°</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
          <div className="eas-card">
            <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: '#4c1d95' }}>One-line visual proof</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#374151', flexWrap: 'wrap' }}>
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
                onChange={(event) => dispatch({ type: 'SET_CHALLENGE_POLYGON', payload: event.target.value })}
                style={{ flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '12px' }}
              >
                <option>Triangle (3 sides)</option>
                <option>Quadrilateral (4 sides)</option>
                <option>Pentagon (5 sides)</option>
                <option>Heptagon (7 sides)</option>
              </select>
              <button
                type="button"
                onClick={() => dispatch({ type: 'CHECK_CHALLENGE' })}
                style={{ background: '#6d28d9', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                Try it!
              </button>
            </div>
          </div>
        </div>
      </main>

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

        <div style={{ background: '#fcfbfe', border: '1px solid #e8e6f8', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ margin: '0 0 6px', fontSize: '13px', color: '#4c1d95', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HelpCircle size={14} /> Prediction
          </h4>
          <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#4b5563' }}>What will be the sum of exterior angles for any n-gon?</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={state.predictAnswer}
              onChange={(event) => dispatch({ type: 'SET_PREDICT', payload: event.target.value })}
              style={{ flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '12px' }}
            />
            <button
              type="button"
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

function toolStyle(active: boolean): CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '8px',
    border: active ? '2px solid #6d28d9' : '1px solid #d1d5db',
    background: active ? '#ede9fe' : '#fff',
    color: '#4c1d95',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '13px',
  };
}
