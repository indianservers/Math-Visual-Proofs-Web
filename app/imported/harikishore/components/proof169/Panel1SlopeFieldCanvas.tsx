import React, { useState, useRef, useCallback, useMemo } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  RefreshCw, 
  Layers, 
  Compass,
  CheckCircle2,
  TrendingUp,
  Activity
} from 'lucide-react';
import { ODE_PRESETS, ODEPreset } from '../../data/slopeFieldData';
import { 
  generateSlopeSegments, 
  traceSolutionCurve, 
  computeEulerSteps,
  mathToScreen,
  screenToMath,
  SlopeSegment 
} from '../../utils/slopeFieldMath';
import { MathView } from '../common/MathView';

interface Panel1Props {
  selectedODE: ODEPreset;
  onSelectODE: (ode: ODEPreset) => void;
  x0: number;
  y0: number;
  setInitialCondition: (x: number, y: number) => void;
  stepSizeH: number;
  setStepSizeH: (h: number) => void;
  showGrid: boolean;
  showArrows: boolean;
  showCurve: boolean;
  showEuler: boolean;
  snapEnabled: boolean;
  customEquation: string;
  setCustomEquation: (eq: string) => void;
  showXVariation: boolean;
  showYVariation: boolean;
  show3DPlane: boolean;
  animationProgress: number;
  setAnimationProgress: (progress: number) => void;
}

export const Panel1SlopeFieldCanvas: React.FC<Panel1Props> = ({
  selectedODE,
  onSelectODE,
  x0,
  y0,
  setInitialCondition,
  stepSizeH,
  setStepSizeH,
  showGrid,
  showArrows,
  showCurve,
  showEuler,
  snapEnabled,
  customEquation,
  setCustomEquation,
  showXVariation,
  showYVariation,
  show3DPlane,
  animationProgress,
  setAnimationProgress,
}) => {
  const [isDraggingP0, setIsDraggingP0] = useState(false);
  const canvasRef = useRef<SVGSVGElement | null>(null);

  const bounds = { minX: -3.5, maxX: 3.5, minY: -2.5, maxY: 2.5 };
  const svgWidth = 420;
  const svgHeight = 250;

  // Parse custom equation
  const parseCustomEquation = (eq: string): ((x: number, y: number) => number) => {
    try {
      // Simple parser for basic mathematical expressions
      // Supports: x, y, +, -, *, /, ^, sin, cos, tan, exp, log, sqrt
      const sanitized = eq
        .replace(/\^/g, '**')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/exp/g, 'Math.exp')
        .replace(/log/g, 'Math.log')
        .replace(/sqrt/g, 'Math.sqrt');
      
      const fn = new Function('x', 'y', `return ${sanitized};`) as (x: number, y: number) => number;
      return fn;
    } catch {
      return (x, y) => x - y; // fallback
    }
  };

  // Get the actual function to use
  const currentFn = useMemo(() => {
    if (selectedODE.isCustom && customEquation) {
      return parseCustomEquation(customEquation);
    }
    return selectedODE.fn;
  }, [selectedODE, customEquation]);

  // Compute slope field segments
  const slopeSegments = useMemo(() => {
    return generateSlopeSegments(currentFn, bounds, 0.45, 0.45, 12, svgWidth, svgHeight);
  }, [currentFn]);

  // Compute smooth continuous solution curve
  const solutionCurvePts = useMemo(() => {
    return traceSolutionCurve(currentFn, x0, y0, bounds, 0.03);
  }, [currentFn, x0, y0]);

  // Path string for solution curve
  const curvePath = useMemo(() => {
    if (solutionCurvePts.length === 0) return '';
    return solutionCurvePts
      .map((p, i) => {
        const s = mathToScreen(p.x, p.y, bounds, svgWidth, svgHeight);
        return `${i === 0 ? 'M' : 'L'} ${s.x.toFixed(1)},${s.y.toFixed(1)}`;
      })
      .join(' ');
  }, [solutionCurvePts]);

  // Compute discrete Euler steps
  const eulerPts = useMemo(() => {
    return computeEulerSteps(currentFn, x0, y0, 5, stepSizeH);
  }, [currentFn, x0, y0, stepSizeH]);

  const p0Screen = mathToScreen(x0, y0, bounds, svgWidth, svgHeight);
  const originScreen = mathToScreen(0, 0, bounds, svgWidth, svgHeight);
  const currentSlope = currentFn(x0, y0);
  const currentAngleDeg = (Math.atan(currentSlope) * 180) / Math.PI;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDraggingP0(true);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingP0 || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = svgWidth / rect.width;
    const scaleY = svgHeight / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const mathPt = screenToMath(mouseX, mouseY, bounds, svgWidth, svgHeight);
    let nx = Math.max(bounds.minX + 0.2, Math.min(bounds.maxX - 0.2, mathPt.x));
    let ny = Math.max(bounds.minY + 0.2, Math.min(bounds.maxY - 0.2, mathPt.y));

    if (snapEnabled) {
      nx = Math.round(nx * 4) / 4; // snap to 0.25
      ny = Math.round(ny * 4) / 4;
    } else {
      nx = Math.round(nx * 100) / 100;
      ny = Math.round(ny * 100) / 100;
    }

    setInitialCondition(nx, ny);
  }, [isDraggingP0, snapEnabled, setInitialCondition]);

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingP0) {
      setIsDraggingP0(false);
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-sky-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            1
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Slope Field & Solution Curve
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Drag initial point P₀ = (x₀, y₀). The slope field dictates the direction of the solution curve.
        </p>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center py-1">
        {/* Left Information Card */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-3">
          <div className="bg-sky-50/50 rounded-2xl p-4 border border-sky-100 shadow-inner w-full max-w-[220px] space-y-2.5">
            <div className="text-[10px] font-bold text-sky-800 uppercase tracking-wider text-center">
              Active Differential Equation
            </div>

            <div className="p-2 bg-white rounded-xl border border-sky-200 text-center">
              {selectedODE.isCustom ? (
                <input
                  type="text"
                  value={customEquation}
                  onChange={(e) => setCustomEquation(e.target.value)}
                  placeholder="e.g., x - y, sin(x), y^2"
                  className="w-full px-2 py-1 text-sm font-mono text-slate-900 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
                />
              ) : (
                <MathView math={selectedODE.latexODE} className="text-slate-900 font-semibold text-sm" />
              )}
            </div>

            {/* Instantaneous Slope at Initial Condition */}
            <div className="text-xs space-y-1 pt-1 border-t border-sky-100 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Initial Point P₀:</span>
                <span className="font-mono font-bold text-sky-800">({x0.toFixed(2)}, {y0.toFixed(2)})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Slope dy/dx:</span>
                <span className="font-mono font-bold text-indigo-700">{isFinite(currentSlope) ? currentSlope.toFixed(2) : '∞'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Direction Angle:</span>
                <span className="font-mono font-bold text-emerald-700">{currentAngleDeg.toFixed(1)}°</span>
              </div>
            </div>

            {/* Step Size Slider */}
            <div className="pt-2 border-t border-sky-100">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                <span>Euler Step h:</span>
                <span className="font-mono font-bold text-sky-700">{stepSizeH.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={stepSizeH}
                onChange={(e) => setStepSizeH(parseFloat(e.target.value))}
                className="w-full accent-sky-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Middle / Right Interactive Canvas */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[440px] h-[260px] rounded-2xl bg-slate-50/60 border border-sky-100 shadow-sm overflow-hidden flex items-center justify-center select-none">
            <svg
              ref={canvasRef}
              className="w-full h-full touch-none"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {/* 1. Coordinate Grid Lines */}
              {showGrid && (
                <g stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3">
                  {[-3, -2, -1, 1, 2, 3].map(gx => {
                    const s = mathToScreen(gx, 0, bounds, svgWidth, svgHeight);
                    return <line key={`gx-${gx}`} x1={s.x} y1="0" x2={s.x} y2={svgHeight} />;
                  })}
                  {[-2, -1, 1, 2].map(gy => {
                    const s = mathToScreen(0, gy, bounds, svgWidth, svgHeight);
                    return <line key={`gy-${gy}`} x1="0" y1={s.y} x2={svgWidth} y2={s.y} />;
                  })}
                </g>
              )}

              {/* 2. Main Axes (x, y) */}
              <g stroke="#94a3b8" strokeWidth="1.5">
                <line x1="0" y1={originScreen.y} x2={svgWidth} y2={originScreen.y} />
                <line x1={originScreen.x} y1="0" x2={originScreen.x} y2={svgHeight} />
              </g>

              {/* 3. Slope Field Segments */}
              {showArrows && (
                <g>
                  {slopeSegments.map((seg, idx) => {
                    const isPositive = seg.slope >= 0;
                    const stroke = isPositive ? '#6366f1' : '#0284c7';
                    return (
                      <line
                        key={`seg-${idx}`}
                        x1={seg.screenX1}
                        y1={seg.screenY1}
                        x2={seg.screenX2}
                        y2={seg.screenY2}
                        stroke={stroke}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity={0.65}
                      />
                    );
                  })}
                </g>
              )}

              {/* 4. Euler Tangent Step Polygon Preview */}
              {showEuler && eulerPts.length > 1 && (
                <g>
                  <polyline
                    points={eulerPts.map(p => {
                      const s = mathToScreen(p.x, p.y, bounds, svgWidth, svgHeight);
                      return `${s.x.toFixed(1)},${s.y.toFixed(1)}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />
                  {eulerPts.map((p, idx) => {
                    const s = mathToScreen(p.x, p.y, bounds, svgWidth, svgHeight);
                    return (
                      <circle
                        key={`e-${idx}`}
                        cx={s.x}
                        cy={s.y}
                        r="3.5"
                        fill="#f59e0b"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </g>
              )}

              {/* 5. Continuous Solution Curve */}
              {showCurve && curvePath && (
                <path
                  d={curvePath}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="filter drop-shadow-sm transition-all"
                />
              )}

              {/* 6. Draggable Initial Condition Point P0 */}
              <g
                onPointerDown={handlePointerDown}
                className="cursor-grab active:cursor-grabbing group/p0"
              >
                {/* Large touch area */}
                <circle cx={p0Screen.x} cy={p0Screen.y} r="22" fill="transparent" />
                {/* Visual Circle */}
                <circle
                  cx={p0Screen.x}
                  cy={p0Screen.y}
                  r="8"
                  fill="#0284c7"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="group-hover/p0:scale-125 transition-transform shadow-lg"
                />
                <circle cx={p0Screen.x} cy={p0Screen.y} r="3" fill="#ffffff" />
                <text
                  x={p0Screen.x + 10}
                  y={p0Screen.y - 6}
                  fill="#0369a1"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  P₀({x0.toFixed(1)}, {y0.toFixed(1)})
                </text>
              </g>

              {/* X-axis variation visualization */}
              {showXVariation && (
                <g opacity={0.6}>
                  {[-2, -1, 0, 1, 2].map((dx) => {
                    const testX = x0 + dx * 0.3;
                    const testY = y0;
                    const testSlope = currentFn(testX, testY);
                    const testScreen = mathToScreen(testX, testY, bounds, svgWidth, svgHeight);
                    const angle = Math.atan(testSlope);
                    const lineLength = 15;
                    const x2 = testScreen.x + lineLength * Math.cos(angle);
                    const y2 = testScreen.y - lineLength * Math.sin(angle);
                    return (
                      <g key={`xvar-${dx}`}>
                        <line
                          x1={testScreen.x - lineLength * Math.cos(angle)}
                          y1={testScreen.y + lineLength * Math.sin(angle)}
                          x2={x2}
                          y2={y2}
                          stroke="#f59e0b"
                          strokeWidth="2"
                          strokeDasharray="3 2"
                        />
                        <circle cx={testScreen.x} cy={testScreen.y} r="3" fill="#f59e0b" opacity={0.5} />
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Y-axis variation visualization */}
              {showYVariation && (
                <g opacity={0.6}>
                  {[-2, -1, 0, 1, 2].map((dy) => {
                    const testX = x0;
                    const testY = y0 + dy * 0.3;
                    const testSlope = currentFn(testX, testY);
                    const testScreen = mathToScreen(testX, testY, bounds, svgWidth, svgHeight);
                    const angle = Math.atan(testSlope);
                    const lineLength = 15;
                    const x2 = testScreen.x + lineLength * Math.cos(angle);
                    const y2 = testScreen.y - lineLength * Math.sin(angle);
                    return (
                      <g key={`yvar-${dy}`}>
                        <line
                          x1={testScreen.x - lineLength * Math.cos(angle)}
                          y1={testScreen.y + lineLength * Math.sin(angle)}
                          x2={x2}
                          y2={y2}
                          stroke="#10b981"
                          strokeWidth="2"
                          strokeDasharray="3 2"
                        />
                        <circle cx={testScreen.x} cy={testScreen.y} r="3" fill="#10b981" opacity={0.5} />
                      </g>
                    );
                  })}
                </g>
              )}

              {/* 3D plane movement animation */}
              {show3DPlane && (
                <g opacity={0.7}>
                  {/* Animated plane showing solution evolution */}
                  {solutionCurvePts.map((p, idx) => {
                    if (idx % 5 !== 0) return null;
                    const progress = idx / solutionCurvePts.length;
                    const animatedProgress = (progress + animationProgress) % 1;
                    const s = mathToScreen(p.x, p.y, bounds, svgWidth, svgHeight);
                    const offsetZ = animatedProgress * 20; // Simulated z-depth
                    const scale = 1 + animatedProgress * 0.3;
                    const opacity = 1 - animatedProgress * 0.7;
                    
                    return (
                      <g key={`plane-${idx}`} style={{ transform: `scale(${scale})`, transformOrigin: `${s.x}px ${s.y}px` }}>
                        <ellipse
                          cx={s.x}
                          cy={s.y - offsetZ}
                          rx={12}
                          ry={6}
                          fill="rgba(139, 92, 246, 0.3)"
                          stroke="#8b5cf6"
                          strokeWidth="1.5"
                          opacity={opacity}
                        />
                      </g>
                    );
                  })}
                </g>
              )}
            </svg>

            {/* Top Right Legend Tag */}
            <div className="absolute top-2 right-2 flex items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold text-sky-800 border border-sky-200 shadow-sm flex items-center gap-1">
                <Activity className="w-3 h-3 text-sky-600" />
                <span>Integral Curve y(x)</span>
              </span>
            </div>

            {/* Bottom Status */}
            <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-lg border border-sky-100 text-[10px] font-mono font-bold text-slate-700 shadow-sm">
              Unique Trajectory via Picard–Lindelöf
            </div>
          </div>
        </div>
      </div>

      {/* Bottom ODE Presets Bar */}
      <div className="pt-2.5 border-t border-sky-50/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">ODEs:</span>
          {ODE_PRESETS.map((preset) => {
            const isSelected = selectedODE.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectODE(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-600 shadow-sm scale-105'
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
