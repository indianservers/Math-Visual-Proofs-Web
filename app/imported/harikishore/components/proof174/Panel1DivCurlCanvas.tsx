import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { 
  RotateCcw, 
  Disc, 
  TrendingUp, 
  Maximize2 
} from 'lucide-react';
import { DIV_CURL_PRESETS, DivCurlPreset } from '../../data/divCurlData';
import { generateVectorGrid, evaluateProbe, mathToSvg, svgToMath, ProbeEvaluation, VectorArrow } from '../../utils/divCurlMath';
import { MathView } from '../common/MathView';

interface Panel1Props {
  selectedPreset: DivCurlPreset;
  onSelectPreset: (p: DivCurlPreset) => void;
  probePos: { x: number; y: number };
  setProbePos: (pos: { x: number; y: number }) => void;
  probeRadius: number;
  setProbeRadius: (r: number) => void;
  showFieldGrid: boolean;
  showProbe: boolean;
  showFlux: boolean;
  showPaddle: boolean;
  snapEnabled: boolean;
}

export const Panel1DivCurlCanvas: React.FC<Panel1Props> = ({
  selectedPreset,
  onSelectPreset,
  probePos,
  setProbePos,
  probeRadius,
  setProbeRadius,
  showFieldGrid,
  showProbe,
  showFlux,
  showPaddle,
  snapEnabled,
}) => {
  const [isDraggingProbe, setIsDraggingProbe] = useState(false);
  const [paddleAngle, setPaddleAngle] = useState(0);
  const canvasRef = useRef<SVGSVGElement | null>(null);

  const bounds = { minX: -2.8, maxX: 2.8, minY: -2.2, maxY: 2.2 };
  const svgWidth = 420;
  const svgHeight = 250;

  // Evaluate field grid
  const arrows = useMemo(() => {
    return generateVectorGrid(selectedPreset, { minX: -2.5, maxX: 2.5, minY: -2.0, maxY: 2.0 }, 0.5);
  }, [selectedPreset]);

  // Evaluate probe
  const probeEval: ProbeEvaluation = useMemo(() => {
    return evaluateProbe(selectedPreset, probePos.x, probePos.y, probeRadius, 16);
  }, [selectedPreset, probePos, probeRadius]);

  const pScreen = mathToSvg(probePos.x, probePos.y, bounds, svgWidth, svgHeight);
  const rScreen = probeRadius * (svgWidth / 5.6);
  const originScreen = mathToSvg(0, 0, bounds, svgWidth, svgHeight);

  // Animate paddle wheel spinning based on curl value
  useEffect(() => {
    let animId: number;
    const speed = probeEval.curlZ * 0.04;
    if (Math.abs(speed) > 1e-4) {
      const step = () => {
        setPaddleAngle((prev) => (prev + speed) % (2 * Math.PI));
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [probeEval.curlZ]);

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
    let nx = Math.max(bounds.minX + 0.4, Math.min(bounds.maxX - 0.4, mathPt.x));
    let ny = Math.max(bounds.minY + 0.4, Math.min(bounds.maxY - 0.4, mathPt.y));

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
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-pink-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            1
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Vector Field & Local Test Region
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Drag the circular test probe across the vector field. Watch the outward flux (divergence) and spinning paddle wheel (curl).
        </p>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center py-1">
        {/* Left Information Card */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-2.5">
          <div className="bg-pink-50/40 rounded-2xl p-4 border border-pink-100 shadow-inner w-full max-w-[220px] space-y-2.5">
            <div className="text-[10px] font-bold text-pink-800 uppercase tracking-wider text-center">
              Active Vector Field
            </div>

            <div className="p-2 bg-white rounded-xl border border-pink-200 text-center space-y-1">
              <MathView math={selectedPreset.latexField} className="text-slate-900 font-semibold text-xs block" />
            </div>

            {/* Numerical Readouts */}
            <div className="text-[10px] space-y-1 pt-1.5 border-t border-pink-200/80 font-mono text-slate-700">
              <div className="flex justify-between">
                <span>Probe Center:</span>
                <strong className="text-slate-900">({probePos.x.toFixed(1)}, {probePos.y.toFixed(1)})</strong>
              </div>
              <div className="flex justify-between">
                <span>Divergence ∇·F:</span>
                <strong className={probeEval.divergence > 0 ? 'text-cyan-700' : probeEval.divergence < 0 ? 'text-rose-700' : 'text-slate-700'}>
                  {probeEval.divergence > 0 ? `+${probeEval.divergence.toFixed(1)} (Source)` : probeEval.divergence < 0 ? `${probeEval.divergence.toFixed(1)} (Sink)` : '0.0 (Incomp)'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Curl (∇×F)z:</span>
                <strong className={probeEval.curlZ !== 0 ? 'text-amber-700' : 'text-slate-700'}>
                  {probeEval.curlZ > 0 ? `+${probeEval.curlZ.toFixed(1)} (CCW)` : probeEval.curlZ < 0 ? `${probeEval.curlZ.toFixed(1)} (CW)` : '0.0 (Irrot)'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Boundary Flux ∮:</span>
                <strong className="text-indigo-700">{probeEval.boundaryFlux.toFixed(2)}</strong>
              </div>
            </div>

            {/* Slider: Probe Radius */}
            <div className="space-y-0.5 pt-1.5 border-t border-pink-200/80">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>Probe Radius r:</span>
                <span className="font-mono font-bold text-pink-700">{probeRadius.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="1.0"
                step="0.05"
                value={probeRadius}
                onChange={(e) => setProbeRadius(parseFloat(e.target.value))}
                className="w-full accent-pink-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Middle / Right Interactive Canvas */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[440px] h-[260px] rounded-2xl bg-slate-50/60 border border-pink-100 shadow-sm overflow-hidden flex flex-col items-center justify-between p-2 select-none">
            <svg
              ref={canvasRef}
              className="w-full h-full touch-none"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {/* Axes */}
              <line x1="0" y1={originScreen.y} x2={svgWidth} y2={originScreen.y} stroke="#cbd5e1" strokeWidth="1.2" />
              <line x1={originScreen.x} y1="0" x2={originScreen.x} y2={svgHeight} stroke="#cbd5e1" strokeWidth="1.2" />

              {/* Vector Field Arrows Grid */}
              {showFieldGrid && arrows.map((arr, idx) => {
                const sPos = mathToSvg(arr.x, arr.y, bounds, svgWidth, svgHeight);
                const scale = 8;
                const endX = sPos.x + arr.vx * scale;
                const endY = sPos.y - arr.vy * scale; // Invert Y
                return (
                  <g key={`arr-${idx}`} opacity="0.45">
                    <line x1={sPos.x} y1={sPos.y} x2={endX} y2={endY} stroke="#db2777" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx={endX} cy={endY} r="1.8" fill="#db2777" />
                  </g>
                );
              })}

              {/* Test Region Disk (Shaded) */}
              {showProbe && (
                <g>
                  <circle
                    cx={pScreen.x}
                    cy={pScreen.y}
                    r={rScreen}
                    fill="rgba(236, 72, 153, 0.12)"
                    stroke="#ec4899"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  {/* Boundary Flux Arrows */}
                  {showFlux && probeEval.boundaryPoints.map((bp, i) => {
                    const bpScreen = mathToSvg(bp.x, bp.y, bounds, svgWidth, svgHeight);
                    const fluxScale = 10;
                    const fluxVal = bp.fx * bp.nx + bp.fy * bp.ny;
                    const fluxEndX = bpScreen.x + bp.nx * fluxVal * fluxScale;
                    const fluxEndY = bpScreen.y - bp.ny * fluxVal * fluxScale;
                    return (
                      <line
                        key={`flux-${i}`}
                        x1={bpScreen.x}
                        y1={bpScreen.y}
                        x2={fluxEndX}
                        y2={fluxEndY}
                        stroke={fluxVal >= 0 ? '#0284c7' : '#e11d48'}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    );
                  })}
                </g>
              )}

              {/* 4-Blade Spinning Paddle Wheel */}
              {showPaddle && (
                <g transform={`translate(${pScreen.x}, ${pScreen.y}) rotate(${(paddleAngle * 180) / Math.PI})`}>
                  <circle cx="0" cy="0" r="4" fill="#d97706" />
                  {[0, 90, 180, 270].map((deg) => (
                    <g key={`blade-${deg}`} transform={`rotate(${deg})`}>
                      <line x1="0" y1="0" x2={rScreen * 0.75} y2="0" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
                      <rect x={rScreen * 0.45} y="-3.5" width={rScreen * 0.3} height="7" fill="#f59e0b" rx="1.5" />
                    </g>
                  ))}
                </g>
              )}

              {/* Draggable Probe Handle */}
              <g
                onPointerDown={handlePointerDown}
                className="cursor-grab active:cursor-grabbing group/p"
              >
                <circle cx={pScreen.x} cy={pScreen.y} r="22" fill="transparent" />
                <circle
                  cx={pScreen.x}
                  cy={pScreen.y}
                  r="6.5"
                  fill="#db2777"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="group-hover/p:scale-125 transition-transform shadow-md"
                />
                <text
                  x={pScreen.x}
                  y={pScreen.y + rScreen + 14}
                  fill="#9d174d"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  R({probePos.x.toFixed(1)}, {probePos.y.toFixed(1)})
                </text>
              </g>
            </svg>

            {/* Top Right Tag */}
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-pink-50/95 border border-pink-200 text-pink-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
              <Disc className="w-3 h-3 text-pink-600" />
              <span>Div = Outward Flux Density | Curl = Micro-Spin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Presets Bar */}
      <div className="pt-2.5 border-t border-pink-50/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">Vector Fields:</span>
          {DIV_CURL_PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  setProbePos(preset.defaultProbe);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-pink-600 text-white border-pink-600 shadow-sm scale-105'
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
