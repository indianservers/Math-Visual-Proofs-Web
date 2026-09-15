import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RotateCw, Sparkles, Play, Square } from 'lucide-react';
import { SHAPES_LIST } from '../../data/shapesData';
import { ShapeDefinition } from '../../types';
import {
  getRegularPolygonVertices,
  getRectangleVertices,
  getMirrorLines,
  pointsToSvgPath,
  checkRotationalMatch,
} from '../../utils/geometry';
import { sound } from '../../utils/sound';

interface Panel1Props {
  selectedShape: ShapeDefinition;
  onSelectShape: (shape: ShapeDefinition) => void;
  showGrid: boolean;
  showAxes: boolean;
  showCentre: boolean;
  snapEnabled: boolean;
  rotationAngle: number;
  setRotationAngle: (angle: number | ((prev: number) => number)) => void;
  matchedSteps: number[];
  setMatchedSteps: React.Dispatch<React.SetStateAction<number[]>>;
  isDropped: boolean;
  setIsDropped: (val: boolean) => void;
  customN: number;
  setCustomN: (n: number) => void;
}

/** Build a transient ShapeDefinition for any n-gon based on n */
function buildCustomShape(n: number): ShapeDefinition {
  const palette = [
    { color: '#6366f1', stroke: '#4f46e5', fill: 'rgba(99,102,241,0.22)', light: 'rgba(99,102,241,0.10)' },
    { color: '#ec4899', stroke: '#db2777', fill: 'rgba(236,72,153,0.22)', light: 'rgba(236,72,153,0.10)' },
    { color: '#10b981', stroke: '#059669', fill: 'rgba(16,185,129,0.22)', light: 'rgba(16,185,129,0.10)' },
    { color: '#f59e0b', stroke: '#d97706', fill: 'rgba(245,158,11,0.22)', light: 'rgba(245,158,11,0.10)' },
    { color: '#06b6d4', stroke: '#0891b2', fill: 'rgba(6,182,212,0.22)', light: 'rgba(6,182,212,0.10)' },
    { color: '#8b5cf6', stroke: '#7c3aed', fill: 'rgba(139,92,246,0.22)', light: 'rgba(139,92,246,0.10)' },
  ];
  const p = palette[(n - 3) % palette.length];
  return {
    id: 'custom',
    name: `${n}-gon`,
    displayName: `Regular ${n}-gon`,
    sides: n,
    isRegular: true,
    lineSymmetries: n,
    rotationalOrder: n,
    minAngleStep: 360 / n,
    color: p.color,
    strokeColor: p.stroke,
    fillColor: p.fill,
    lightFill: p.light,
    radius: 68,
    isCustom: true,
  };
}

export const Panel1DragRotateDiscover: React.FC<Panel1Props> = ({
  selectedShape,
  onSelectShape,
  showGrid,
  showAxes,
  showCentre,
  snapEnabled,
  rotationAngle,
  setRotationAngle,
  matchedSteps,
  setMatchedSteps,
  isDropped,
  setIsDropped,
  customN,
  setCustomN,
}) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [activeMirrorLineIdx, setActiveMirrorLineIdx] = useState<number | null>(null);
  const [isFolding, setIsFolding] = useState(false);
  const [isRotatingHandle, setIsRotatingHandle] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [nInputVal, setNInputVal] = useState<string>(String(customN));
  const spinFrameRef = useRef<number | null>(null);
  const rightCanvasRef = useRef<SVGSVGElement | null>(null);

  // Keep nInputVal in sync with external customN changes
  useEffect(() => { setNInputVal(String(customN)); }, [customN]);

  // ── Derived geometry ─────────────────────────────────────────────────────────
  const leftVertices = selectedShape.isRegular
    ? getRegularPolygonVertices(selectedShape.sides, 62, 110, 110)
    : getRectangleVertices(110, 68, 110, 110);
  const leftPath = pointsToSvgPath(leftVertices);
  const leftMirrorLines = getMirrorLines(
    selectedShape.sides, selectedShape.isRegular, 62, 110, 110, selectedShape.aspectRatio
  );

  const rightVertices = selectedShape.isRegular
    ? getRegularPolygonVertices(selectedShape.sides, 68, 140, 120)
    : getRectangleVertices(120, 75, 140, 120);
  const rightPath = pointsToSvgPath(rightVertices);
  const rightMirrorLines = getMirrorLines(
    selectedShape.sides, selectedShape.isRegular, 68, 140, 120, selectedShape.aspectRatio
  );

  // ── Angle computations ───────────────────────────────────────────────────────
  const n = selectedShape.sides;
  const interiorAngle = n >= 3 ? ((n - 2) * 180) / n : 0;
  const rotStep = 360 / (selectedShape.isRegular ? selectedShape.rotationalOrder : 2);

  // ── Rotational match detection ───────────────────────────────────────────────
  const matchResult = checkRotationalMatch(rotationAngle, selectedShape.rotationalOrder, snapEnabled ? 5 : 2);
  useEffect(() => {
    if (matchResult.isMatch && !matchedSteps.includes(matchResult.matchedStep)) {
      setMatchedSteps(prev => [...prev, matchResult.matchedStep]);
      sound.playMatch();
    }
  }, [matchResult, matchedSteps, setMatchedSteps]);

  // ── Pointer-drag rotation ────────────────────────────────────────────────────
  const handlePointerDownRotate = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsRotatingHandle(true);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMoveRotate = useCallback((e: React.PointerEvent) => {
    if (!isRotatingHandle || !rightCanvasRef.current) return;
    const rect = rightCanvasRef.current.getBoundingClientRect();
    const scaleX = 280 / rect.width;
    const scaleY = 240 / rect.height;
    const mouseSvgX = (e.clientX - rect.left) * scaleX;
    const mouseSvgY = (e.clientY - rect.top) * scaleY;
    const dx = mouseSvgX - 140;
    const dy = mouseSvgY - 120;
    let angleRad = Math.atan2(dy, dx);
    let angleDeg = (angleRad * 180) / Math.PI + 90;
    if (angleDeg < 0) angleDeg += 360;
    if (snapEnabled) {
      const stepAngle = 360 / selectedShape.rotationalOrder;
      const nearestStep = Math.round(angleDeg / stepAngle);
      const targetSnap = nearestStep * stepAngle;
      if (Math.abs(angleDeg - targetSnap) < 8) angleDeg = targetSnap % 360;
    }
    setRotationAngle(Math.round(angleDeg));
  }, [isRotatingHandle, snapEnabled, selectedShape.rotationalOrder, setRotationAngle]);

  const handlePointerUpRotate = (e: React.PointerEvent) => {
    if (isRotatingHandle) {
      setIsRotatingHandle(false);
      try { (e.target as Element).releasePointerCapture(e.pointerId); } catch { }
    }
  };

  // ── Step rotate button ───────────────────────────────────────────────────────
  const handleStepRotate = () => {
    sound.playClick();
    const step = 360 / selectedShape.rotationalOrder;
    setRotationAngle(prev => (Math.round(prev / step) * step + step) % 360);
  };

  // ── 360° spin animation ──────────────────────────────────────────────────────
  const handleSpin360 = () => {
    if (isSpinning) {
      // Stop spin
      if (spinFrameRef.current !== null) cancelAnimationFrame(spinFrameRef.current);
      setIsSpinning(false);
      return;
    }
    sound.playClick();
    setIsSpinning(true);
    const startAngle = rotationAngle;
    const startTime = performance.now();
    const duration = 2400; // ms for one full 360° rotation

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease in-out sine
      const eased = -(Math.cos(Math.PI * progress) - 1) / 2;
      const currentAngle = (startAngle + eased * 360) % 360;
      setRotationAngle(Math.round(currentAngle));
      if (progress < 1) {
        spinFrameRef.current = requestAnimationFrame(animate);
      } else {
        setRotationAngle(startAngle % 360);
        setIsSpinning(false);
      }
    };
    spinFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => { if (spinFrameRef.current !== null) cancelAnimationFrame(spinFrameRef.current); };
  }, []);

  // ── Mirror fold ──────────────────────────────────────────────────────────────
  const handleFoldMirror = (idx: number) => {
    sound.playSnap();
    setActiveMirrorLineIdx(idx);
    setIsFolding(true);
    setTimeout(() => setIsFolding(false), 1500);
  };

  // ── Drag & drop ──────────────────────────────────────────────────────────────
  const handleDragStartLeft = (e: React.DragEvent) => { e.dataTransfer.setData('text/plain', selectedShape.id); };
  const handleDropTarget = (e: React.DragEvent) => {
    e.preventDefault(); setIsDraggingOver(false); setIsDropped(true); sound.playSuccess();
  };

  // ── Palette select ───────────────────────────────────────────────────────────
  const handlePaletteSelect = (shape: ShapeDefinition) => {
    sound.playClick();
    onSelectShape(shape);
    setRotationAngle(0);
    setMatchedSteps([1]);
    setActiveMirrorLineIdx(null);
    setIsDropped(true);
    // Sync n-input to the preset shape
    if (shape.isRegular) setCustomN(shape.sides);
  };

  // ── N-input handler ──────────────────────────────────────────────────────────
  const handleNInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNInputVal(e.target.value);
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed) && parsed >= 3 && parsed <= 20) {
      setCustomN(parsed);
      const shape = buildCustomShape(parsed);
      onSelectShape(shape);
      setRotationAngle(0);
      setMatchedSteps([1]);
    }
  };

  const handleNInputBlur = () => {
    const parsed = parseInt(nInputVal, 10);
    if (isNaN(parsed) || parsed < 3) { setNInputVal('3'); setCustomN(3); onSelectShape(buildCustomShape(3)); }
    else if (parsed > 20) { setNInputVal('20'); setCustomN(20); onSelectShape(buildCustomShape(20)); }
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-indigo-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Panel Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            1
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Drag, Rotate, Discover
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Enter <strong className="text-indigo-700">n</strong> to generate any regular n-gon, then rotate and explore!
        </p>
      </div>

      {/* ── N-INPUT ROW ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 bg-indigo-50/60 border border-indigo-100 rounded-2xl px-4 py-3">
        {/* Label */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-extrabold text-indigo-700 font-mono">n =</span>
          <input
            id="n-sides-input"
            type="number"
            min={3}
            max={20}
            value={nInputVal}
            onChange={handleNInputChange}
            onBlur={handleNInputBlur}
            className="w-16 text-center text-base font-extrabold text-indigo-900 bg-white border-2 border-indigo-300 rounded-xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
            title="Number of sides (3 to 20)"
          />
          <span className="text-xs text-slate-500 font-medium">sides</span>
        </div>

        <div className="h-8 w-px bg-indigo-200 shrink-0" />

        {/* Angle info pills */}
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="flex items-center gap-1.5 bg-white border border-indigo-100 rounded-xl px-2.5 py-1 shadow-sm">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Interior∠</span>
            <span className="text-xs font-extrabold text-indigo-700 font-mono">{interiorAngle.toFixed(1)}°</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-emerald-100 rounded-xl px-2.5 py-1 shadow-sm">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Rot. Step</span>
            <span className="text-xs font-extrabold text-emerald-700 font-mono">{rotStep.toFixed(1)}°</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-violet-100 rounded-xl px-2.5 py-1 shadow-sm">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Sym. Lines</span>
            <span className="text-xs font-extrabold text-violet-700 font-mono">{selectedShape.lineSymmetries}</span>
          </div>
        </div>
      </div>

      {/* Main Workspace 3-part layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center py-2">
        {/* Left Shape Preview */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <div
            draggable
            onDragStart={handleDragStartLeft}
            className="w-48 h-48 sm:w-52 sm:h-52 rounded-2xl bg-indigo-50/40 border border-indigo-100/80 flex items-center justify-center relative cursor-grab active:cursor-grabbing hover:bg-indigo-50/70 transition-all hover:scale-105 shadow-inner group"
            title="Draggable source shape"
          >
            <svg className="w-full h-full" viewBox="0 0 220 220">
              {leftMirrorLines.map((line, idx) => (
                <line key={idx} x1={line.p1.x} y1={line.p1.y} x2={line.p2.x} y2={line.p2.y}
                  stroke="#818cf8" strokeWidth="1.25" strokeDasharray="4 3" className="opacity-75" />
              ))}
              <path d={leftPath} fill={selectedShape.fillColor} stroke={selectedShape.strokeColor}
                strokeWidth="2.2" className="transition-colors group-hover:filter group-hover:drop-shadow-md" />
              <circle cx="110" cy="110" r="3.5" fill="#4f46e5" />
            </svg>

            {/* Drag hint */}
            <div className="absolute bottom-4 right-6 pointer-events-none animate-bounce">
              <svg className="w-7 h-7 text-slate-900 drop-shadow-md" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="1.5">
                <path d="M7 11V7a2 2 0 0 1 4 0v4m0 0V5a2 2 0 0 1 4 0v6m0 0V6a2 2 0 0 1 4 0v8a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6v-3a2 2 0 0 1 4 0v2" />
              </svg>
            </div>

            {/* n-gon name badge */}
            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-indigo-100 text-[10px] font-bold text-indigo-700 shadow-sm">
              {selectedShape.displayName}
            </div>
          </div>
        </div>

        {/* Middle Arrow / Drop Zone */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center text-center px-1">
          <div className="relative w-full h-12 hidden lg:flex items-center justify-center">
            <svg className="w-32 h-12 text-indigo-500" viewBox="0 0 120 40" fill="none">
              <path d="M 10 35 Q 60 -10 110 30" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" fill="none" />
              <path d="M 105 18 L 115 32 L 98 32 Z" fill="currentColor" />
            </svg>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={handleDropTarget}
            className={`w-full py-4 px-3 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center ${
              isDraggingOver
                ? 'border-indigo-600 bg-indigo-50/80 scale-105 shadow-md'
                : 'border-indigo-200 bg-indigo-50/20'
            }`}
          >
            <div className="w-16 h-16 flex items-center justify-center opacity-60 mb-1">
              <svg className="w-14 h-14" viewBox="0 0 100 100">
                <polygon
                  points={
                    selectedShape.isRegular
                      ? (() => {
                          const pts: string[] = [];
                          for (let i = 0; i < selectedShape.sides; i++) {
                            const a = -90 + (360 / selectedShape.sides) * i;
                            const r = (a * Math.PI) / 180;
                            pts.push(`${50 + 38 * Math.cos(r)},${50 + 38 * Math.sin(r)}`);
                          }
                          return pts.join(' ');
                        })()
                      : '15,25 85,25 85,75 15,75'
                  }
                  fill="none" stroke="#818cf8" strokeWidth="1.75" strokeDasharray="3 3"
                />
              </svg>
            </div>
            <p className="text-[11px] font-semibold text-indigo-700 leading-tight">
              Drop shape here<br />
              <span className="text-[10px] text-slate-500 font-normal">to analyse symmetry</span>
            </p>
          </div>
        </div>

        {/* Right Active Analyser Canvas */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[280px] h-[240px] rounded-2xl bg-indigo-50/30 border border-indigo-100 shadow-sm overflow-hidden flex items-center justify-center select-none">
            <svg
              ref={rightCanvasRef}
              className="w-full h-full touch-none"
              viewBox="0 0 280 240"
              onPointerMove={handlePointerMoveRotate}
              onPointerUp={handlePointerUpRotate}
              onPointerCancel={handlePointerUpRotate}
            >
              {/* Grid */}
              {showGrid && (
                <g stroke="#e0e7ff" strokeWidth="1" opacity="0.8">
                  {[20, 60, 100, 140, 180, 220, 260].map(x => <line key={`gx-${x}`} x1={x} y1="0" x2={x} y2="240" />)}
                  {[20, 60, 100, 140, 180, 220].map(y => <line key={`gy-${y}`} x1="0" y1={y} x2="280" y2={y} />)}
                </g>
              )}

              {/* Axes */}
              {showAxes && (
                <g stroke="#818cf8" strokeWidth="1.25" strokeDasharray="3 2" opacity="0.6">
                  <line x1="140" y1="10" x2="140" y2="230" />
                  <line x1="20" y1="120" x2="260" y2="120" />
                </g>
              )}

              {/* Mirror lines */}
              {rightMirrorLines.map((line, idx) => (
                <g key={`ml-${idx}`} className="cursor-pointer group/line" onClick={() => handleFoldMirror(idx)}>
                  <line x1={line.p1.x} y1={line.p1.y} x2={line.p2.x} y2={line.p2.y}
                    stroke={activeMirrorLineIdx === idx ? '#4f46e5' : '#6366f1'}
                    strokeWidth={activeMirrorLineIdx === idx ? '2.5' : '1.5'}
                    strokeDasharray="4 3" className="transition-all" />
                  <line x1={line.p1.x} y1={line.p1.y} x2={line.p2.x} y2={line.p2.y}
                    stroke="transparent" strokeWidth="16" />
                </g>
              ))}

              {/* Ghost silhouette */}
              <path d={rightPath} fill="none" stroke="#c7d2fe" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />

              {/* Rotated polygon */}
              <g
                transform={`rotate(${rotationAngle} 140 120)`}
                style={{
                  transformOrigin: '140px 120px',
                  transition: isRotatingHandle || isSpinning ? 'none' : 'transform 0.25s ease-out'
                }}
              >
                <path d={rightPath} fill={selectedShape.fillColor} stroke={selectedShape.strokeColor}
                  strokeWidth="2.5" className="filter drop-shadow-sm" />
                {selectedShape.isRegular && (
                  <circle cx="140" cy={120 - 68} r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                )}
              </g>

              {/* Angle arc from top vertex showing rotation step */}
              {selectedShape.isRegular && (
                (() => {
                  const r = 28;
                  const startRad = -Math.PI / 2;
                  const endRad = startRad + (2 * Math.PI) / selectedShape.rotationalOrder;
                  const x1 = 140 + r * Math.cos(startRad);
                  const y1 = 120 + r * Math.sin(startRad);
                  const x2 = 140 + r * Math.cos(endRad);
                  const y2 = 120 + r * Math.sin(endRad);
                  const largeArc = endRad - startRad > Math.PI ? 1 : 0;
                  const midAngle = startRad + (endRad - startRad) / 2;
                  const tx = 140 + (r + 10) * Math.cos(midAngle);
                  const ty = 120 + (r + 10) * Math.sin(midAngle);
                  return (
                    <g opacity="0.75">
                      <path
                        d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
                        fill="none" stroke="#10b981" strokeWidth="1.8" strokeDasharray="3 2"
                      />
                      <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
                        fontSize="7" fontFamily="monospace" fontWeight="bold" fill="#059669">
                        {rotStep.toFixed(0)}°
                      </text>
                    </g>
                  );
                })()
              )}

              {/* Fold animation overlay */}
              {isFolding && activeMirrorLineIdx !== null && (
                <g className="animate-pulse">
                  <path d={rightPath} fill="rgba(99,102,241,0.45)" stroke="#4338ca" strokeWidth="2.5" />
                </g>
              )}

              {/* Center dot */}
              {showCentre && (
                <g>
                  <circle cx="140" cy="120" r="4.5" fill="#4338ca" />
                  <circle cx="140" cy="120" r="1.5" fill="#ffffff" />
                </g>
              )}

              {/* Rotation track */}
              <circle cx="140" cy="120" r="95" fill="none" stroke="#c7d2fe" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />

              {/* Draggable rotation handle */}
              {(() => {
                const handleRad = ((rotationAngle - 90) * Math.PI) / 180;
                const hx = 140 + 95 * Math.cos(handleRad);
                const hy = 120 + 95 * Math.sin(handleRad);
                return (
                  <g onPointerDown={handlePointerDownRotate} className="cursor-grab active:cursor-grabbing group/handle">
                    <circle cx={hx} cy={hy} r="22" fill="transparent" />
                    <circle cx={hx} cy={hy} r="9" fill="#6366f1" stroke="#ffffff" strokeWidth="2.5"
                      className="group-hover/handle:scale-125 transition-transform filter drop-shadow-md" />
                    <circle cx={hx} cy={hy} r="3" fill="#ffffff" />
                  </g>
                );
              })()}
            </svg>

            {/* Match badge */}
            {matchResult.isMatch && (
              <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[11px] font-extrabold shadow-md flex items-center gap-1 animate-bounce">
                <Sparkles className="w-3 h-3" />
                <span>Match ({rotationAngle}°)</span>
              </div>
            )}

            {/* Angle indicator */}
            <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-lg border border-indigo-100 text-[11px] font-mono font-bold text-slate-700 shadow-sm">
              θ = {rotationAngle}°
            </div>

            {/* Spin indicator */}
            {isSpinning && (
              <div className="absolute top-2 left-2 bg-indigo-600 text-white px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow">
                <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                360° spin
              </div>
            )}
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-2 mt-2.5 w-full max-w-[280px]">
            {/* Angle slider */}
            <input
              type="range" min="0" max="360"
              step={snapEnabled ? 360 / selectedShape.rotationalOrder : 1}
              value={rotationAngle}
              onChange={(e) => setRotationAngle(Number(e.target.value))}
              className="flex-1 accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            {/* Step rotate */}
            <button
              onClick={handleStepRotate}
              className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-indigo-200 shrink-0"
              title={`Rotate next ${rotStep.toFixed(0)}°`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>+{rotStep.toFixed(0)}°</span>
            </button>
            {/* 360° spin */}
            <button
              onClick={handleSpin360}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border shrink-0 ${
                isSpinning
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
              }`}
              title={isSpinning ? 'Stop spin' : 'Rotate 360°'}
            >
              {isSpinning
                ? <><Square className="w-3.5 h-3.5" /><span>Stop</span></>
                : <><Play className="w-3.5 h-3.5" /><span>360°</span></>
              }
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Shape Palette */}
      <div className="pt-3 border-t border-indigo-50/80">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Preset shapes</p>
        <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SHAPES_LIST.map((shape) => {
            const isSelected = selectedShape.id === shape.id && !selectedShape.isCustom;
            return (
              <button
                key={shape.id}
                onClick={() => handlePaletteSelect(shape)}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl min-w-[76px] sm:min-w-[84px] transition-all border ${
                  isSelected
                    ? 'bg-indigo-50/90 border-indigo-400 shadow-sm font-bold scale-105'
                    : 'bg-white hover:bg-slate-50 border-slate-200/70 hover:border-slate-300 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="w-8 h-8 flex items-center justify-center mb-1">
                  <svg className="w-7 h-7" viewBox="0 0 40 40">
                    {shape.isRegular ? (
                      <polygon
                        points={(() => {
                          const iconPts: string[] = [];
                          for (let i = 0; i < shape.sides; i++) {
                            const a = -90 + (360 / shape.sides) * i;
                            const rad = (a * Math.PI) / 180;
                            iconPts.push(`${20 + 14 * Math.cos(rad)},${20 + 14 * Math.sin(rad)}`);
                          }
                          return iconPts.join(' ');
                        })()}
                        fill={shape.fillColor}
                        stroke={shape.strokeColor}
                        strokeWidth="1.8"
                      />
                    ) : (
                      <rect x="6" y="12" width="28" height="16" rx="1"
                        fill={shape.fillColor} stroke={shape.strokeColor} strokeWidth="1.8" />
                    )}
                  </svg>
                </div>
                <span className={`text-[10px] leading-tight text-center ${isSelected ? 'text-indigo-900 font-bold' : 'text-slate-600'}`}>
                  {shape.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
