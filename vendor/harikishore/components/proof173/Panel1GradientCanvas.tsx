import React, { useState, useRef, useCallback, useMemo } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  RefreshCw, 
  TrendingUp, 
  Compass,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { GRADIENT_PRESETS, GradientFieldPreset } from '../../data/gradientData';
import { evaluateGradientAt, mathToSvg, svgToMath, GradientEvaluation } from '../../utils/gradientMath';
import { MathView } from '../common/MathView';

interface Panel1Props {
  selectedPreset: GradientFieldPreset;
  onSelectPreset: (p: GradientFieldPreset) => void;
  probePos: { x: number; y: number };
  setProbePos: (pos: { x: number; y: number }) => void;
  testAngleDeg: number;
  setTestAngleDeg: (deg: number) => void;
  showContours: boolean;
  showGradient: boolean;
  showTangent: boolean;
  showDirectionalProbe: boolean;
  snapEnabled: boolean;
}

export const Panel1GradientCanvas: React.FC<Panel1Props> = ({
  selectedPreset,
  onSelectPreset,
  probePos,
  setProbePos,
  testAngleDeg,
  setTestAngleDeg,
  showContours,
  showGradient,
  showTangent,
  showDirectionalProbe,
  snapEnabled,
}) => {
  const [isDraggingProbe, setIsDraggingProbe] = useState(false);
  const canvasRef = useRef<SVGSVGElement | null>(null);

  const bounds = { minX: -2.8, maxX: 2.8, minY: -2.2, maxY: 2.2 };
  const svgWidth = 420;
  const svgHeight = 250;

  const testAngleRad = (testAngleDeg * Math.PI) / 180;
  const evalResult: GradientEvaluation = useMemo(() => {
    return evaluateGradientAt(selectedPreset.fn, selectedPreset.grad, probePos.x, probePos.y, testAngleRad);
  }, [selectedPreset, probePos, testAngleRad]);

  const pScreen = mathToSvg(probePos.x, probePos.y, bounds, svgWidth, svgHeight);
  const originScreen = mathToSvg(0, 0, bounds, svgWidth, svgHeight);

  // Gradient vector tip on screen (scaled for visibility)
  const gradArrowScale = 14;
  const gradTipScreen = {
    x: pScreen.x + evalResult.dfdx * gradArrowScale,
    y: pScreen.y - evalResult.dfdy * gradArrowScale, // Invert Y
  };

  // Tangent line on screen
  const tangentLen = 38;
  const tanP1 = {
    x: pScreen.x + evalResult.tangentVector.x * tangentLen,
    y: pScreen.y - evalResult.tangentVector.y * tangentLen,
  };
  const tanP2 = {
    x: pScreen.x - evalResult.tangentVector.x * tangentLen,
    y: pScreen.y + evalResult.tangentVector.y * tangentLen,
  };

  // Directional unit vector tip on screen
  const uLen = 28;
  const uTipScreen = {
    x: pScreen.x + Math.cos(testAngleRad) * uLen,
    y: pScreen.y - Math.sin(testAngleRad) * uLen,
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDraggingProbe(true);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingProbe || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = svgWidth / rect.width;
    const scaleY = svgHeight / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const mathPt = svgToMath(mouseX, mouseY, bounds, svgWidth, svgHeight);
    let nx = Math.max(bounds.minX + 0.2, Math.min(bounds.maxX - 0.2, mathPt.x));
    let ny = Math.max(bounds.minY + 0.2, Math.min(bounds.maxY - 0.2, mathPt.y));

    if (snapEnabled) {
      nx = Math.round(nx * 4) / 4;
      ny = Math.round(ny * 4) / 4;
    } else {
      nx = Math.round(nx * 100) / 100;
      ny = Math.round(ny * 100) / 100;
    }

    setProbePos({ x: nx, y: ny });
  }, [isDraggingProbe, snapEnabled, setProbePos]);

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingProbe) {
      setIsDraggingProbe(false);
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-emerald-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            1
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Contour Map & Gradient Vector ∇f
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Drag probe point (x, y) across level curves. Notice ∇f always points perpendicular to the contour line.
        </p>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center py-1">
        {/* Left Information Card */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-2.5">
          <div className="bg-emerald-50/40 rounded-2xl p-4 border border-emerald-100 shadow-inner w-full max-w-[220px] space-y-2.5">
            <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider text-center">
              Active Scalar Surface
            </div>

            <div className="p-2 bg-white rounded-xl border border-emerald-200 text-center space-y-1">
              <MathView math={selectedPreset.latexField} className="text-slate-900 font-semibold text-xs block" />
              <MathView math={selectedPreset.latexGradient} className="text-emerald-800 font-semibold text-[11px] block" />
            </div>

            {/* Numerical Instantaneous Readouts */}
            <div className="text-[10px] space-y-1 pt-1.5 border-t border-emerald-200/80 font-mono text-slate-700">
              <div className="flex justify-between">
                <span>Point (x, y):</span>
                <strong className="text-slate-900">({probePos.x.toFixed(2)}, {probePos.y.toFixed(2)})</strong>
              </div>
              <div className="flex justify-between">
                <span>Height z = f:</span>
                <strong className="text-indigo-700">{evalResult.z.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Gradient ∇f:</span>
                <strong className="text-emerald-700">[{evalResult.dfdx.toFixed(2)}, {evalResult.dfdy.toFixed(2)}]</strong>
              </div>
              <div className="flex justify-between">
                <span>Magnitude ||∇f||:</span>
                <strong className="text-emerald-800">{evalResult.magnitude.toFixed(2)}</strong>
              </div>
            </div>

            {/* Slider: Directional Probe Angle theta */}
            {showDirectionalProbe && (
              <div className="space-y-0.5 pt-1.5 border-t border-emerald-200/80">
                <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                  <span>Probe Angle θ_u:</span>
                  <span className="font-mono font-bold text-amber-700">{testAngleDeg}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="5"
                  value={testAngleDeg}
                  onChange={(e) => setTestAngleDeg(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono font-bold pt-0.5">
                  <span className="text-slate-500">D_u f = ∇f · u:</span>
                  <span className="text-amber-800">{evalResult.directionalDerivative.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Middle / Right Interactive Canvas */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[440px] h-[260px] rounded-2xl bg-slate-50/60 border border-emerald-100 shadow-sm overflow-hidden flex flex-col items-center justify-between p-2 select-none">
            <svg
              ref={canvasRef}
              className="w-full h-full touch-none"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {/* Coordinate Grid & Axes */}
              <g stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3">
                <line x1="0" y1={originScreen.y} x2={svgWidth} y2={originScreen.y} stroke="#94a3b8" strokeDasharray="none" strokeWidth="1.5" />
                <line x1={originScreen.x} y1="0" x2={originScreen.x} y2={svgHeight} stroke="#94a3b8" strokeDasharray="none" strokeWidth="1.5" />
              </g>

              {/* Contour Level Curves (Simulated / Analytic) */}
              {showContours && (
                <g stroke="#10b981" strokeWidth="1.3" opacity="0.45" fill="none">
                  {selectedPreset.id === 'paraboloid' && [0.6, 1.1, 1.6, 2.1, 2.6].map((r, i) => (
                    <circle key={`c-${i}`} cx={originScreen.x} cy={originScreen.y} r={r * (svgWidth / 5.6)} />
                  ))}
                  {selectedPreset.id === 'gaussian' && [0.7, 1.2, 1.7, 2.2].map((r, i) => (
                    <circle key={`g-${i}`} cx={originScreen.x} cy={originScreen.y} r={r * (svgWidth / 5.6)} />
                  ))}
                  {selectedPreset.id === 'elliptical' && [0.6, 1.1, 1.6, 2.1].map((r, i) => (
                    <ellipse key={`e-${i}`} cx={originScreen.x} cy={originScreen.y} rx={r * (svgWidth / 5.6)} ry={(r / Math.sqrt(3)) * (svgWidth / 5.6)} />
                  ))}
                  {selectedPreset.id === 'saddle' && [-2, -1, 1, 2].map((k, i) => (
                    <path
                      key={`s-${i}`}
                      d={`M ${originScreen.x - 70} ${originScreen.y - 70 * (k > 0 ? 1 : -1)} Q ${originScreen.x} ${originScreen.y + 20 * k} ${originScreen.x + 70} ${originScreen.y - 70 * (k > 0 ? 1 : -1)}`}
                    />
                  ))}
                </g>
              )}

              {/* Tangent Line to Contour (Perpendicular to Gradient) */}
              {showTangent && (
                <g>
                  <line
                    x1={tanP1.x}
                    y1={tanP1.y}
                    x2={tanP2.x}
                    y2={tanP2.y}
                    stroke="#6366f1"
                    strokeWidth="1.8"
                    strokeDasharray="4 3"
                  />
                  {/* 90-degree right angle marker */}
                  <rect
                    x={pScreen.x}
                    y={pScreen.y - 7}
                    width="7"
                    height="7"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="1.2"
                    transform={`rotate(${evalResult.angleDeg + 90}, ${pScreen.x}, ${pScreen.y})`}
                  />
                </g>
              )}

              {/* Gradient Vector Arrow (Bold Emerald) */}
              {showGradient && evalResult.magnitude > 0.05 && (
                <g>
                  <line
                    x1={pScreen.x}
                    y1={pScreen.y}
                    x2={gradTipScreen.x}
                    y2={gradTipScreen.y}
                    stroke="#059669"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx={gradTipScreen.x} cy={gradTipScreen.y} r="4.5" fill="#059669" />
                  <text
                    x={gradTipScreen.x + 8}
                    y={gradTipScreen.y - 4}
                    fill="#047857"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    ∇f
                  </text>
                </g>
              )}

              {/* Directional Test Vector (Amber) */}
              {showDirectionalProbe && (
                <g>
                  <line
                    x1={pScreen.x}
                    y1={pScreen.y}
                    x2={uTipScreen.x}
                    y2={uTipScreen.y}
                    stroke="#d97706"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <circle cx={uTipScreen.x} cy={uTipScreen.y} r="3.5" fill="#d97706" />
                  <text x={uTipScreen.x + 6} y={uTipScreen.y + 4} fill="#b45309" fontSize="10" fontWeight="bold">
                    û
                  </text>
                </g>
              )}

              {/* Draggable Probe Point P */}
              <g
                onPointerDown={handlePointerDown}
                className="cursor-grab active:cursor-grabbing group/p"
              >
                <circle cx={pScreen.x} cy={pScreen.y} r="22" fill="transparent" />
                <circle
                  cx={pScreen.x}
                  cy={pScreen.y}
                  r="7.5"
                  fill="#059669"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="group-hover/p:scale-125 transition-transform shadow-md"
                />
                <circle cx={pScreen.x} cy={pScreen.y} r="2.5" fill="#ffffff" />
                <text
                  x={pScreen.x + 10}
                  y={pScreen.y + 14}
                  fill="#065f46"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  P({probePos.x.toFixed(1)}, {probePos.y.toFixed(1)})
                </text>
              </g>
            </svg>

            {/* Top Right Tag */}
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-emerald-50/95 border border-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span>∇f ⟂ Level Curve (90° Invariant)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Presets Bar */}
      <div className="pt-2.5 border-t border-emerald-50/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">Surfaces:</span>
          {GRADIENT_PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  setProbePos(preset.defaultPos);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
