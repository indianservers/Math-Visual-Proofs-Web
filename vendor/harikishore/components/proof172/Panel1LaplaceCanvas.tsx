import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  RefreshCw, 
  Activity, 
  Zap, 
  Layers,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { LAPLACE_PRESETS, LaplacePreset } from '../../data/laplaceData';
import { computeLaplaceMetrics, generateTimeDomainPoints } from '../../utils/laplaceMath';
import { MathView } from '../common/MathView';

interface Panel1Props {
  selectedPreset: LaplacePreset;
  onSelectPreset: (p: LaplacePreset) => void;
  decayRateA: number;
  setDecayRateA: (a: number) => void;
  showTimeCurve: boolean;
  showTau: boolean;
  showPoles: boolean;
  showROC: boolean;
  snapEnabled: boolean;
}

export const Panel1LaplaceCanvas: React.FC<Panel1Props> = ({
  selectedPreset,
  onSelectPreset,
  decayRateA,
  setDecayRateA,
  showTimeCurve,
  showTau,
  showPoles,
  showROC,
  snapEnabled,
}) => {
  const metrics = computeLaplaceMetrics(decayRateA);
  const poles = selectedPreset.poles(decayRateA, selectedPreset.omega0);

  // Time domain points
  const timePts = useMemo(() => {
    return generateTimeDomainPoints(selectedPreset, decayRateA, 4.5, 90);
  }, [selectedPreset, decayRateA]);

  // SVG dimensions
  const svgWidth = 420;
  const svgHeight = 260;

  // Time Plot Layout (Left Half)
  const tPlotX = 25;
  const tPlotY = 190;
  const tPlotW = 175;
  const tPlotH = 140;
  const tScale = tPlotW / 4.5;
  const yValScale = tPlotH / 1.1;

  const timePath = timePts
    .map((p, i) => {
      const sx = tPlotX + p.x * tScale;
      const sy = tPlotY - p.y * yValScale;
      return `${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)},${sy.toFixed(1)}`;
    })
    .join(' ');

  const tauSx = tPlotX + Math.min(4.5, metrics.timeConstantTau) * tScale;
  const tauSy = tPlotY - Math.exp(-1) * yValScale;

  // s-Plane Layout (Right Half)
  const sPlaneCx = 310;
  const sPlaneCy = 120;
  const sScale = 22; // pixels per unit in s-plane
  const rocBoundaryX = sPlaneCx - decayRateA * sScale;

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-cyan-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            1
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Time Decay & s-Plane Pole Mapping
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Drag decay rate a to see how faster time decay shifts the transfer function pole s = -a into the s-plane.
        </p>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center py-1">
        {/* Left Parameter Controls Card */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-2.5">
          <div className="bg-cyan-50/40 rounded-2xl p-4 border border-cyan-100 shadow-inner w-full max-w-[220px] space-y-2.5">
            <div className="text-[10px] font-bold text-cyan-800 uppercase tracking-wider text-center">
              Laplace Transform Pair
            </div>

            <div className="p-2 bg-white rounded-xl border border-cyan-200 text-center space-y-1">
              <MathView math={`f(t) = e^{-${decayRateA.toFixed(1)}t}`} className="text-slate-900 font-semibold text-xs block" />
              <div className="text-[10px] text-cyan-700 font-bold">⇅ Laplace</div>
              <MathView math={`F(s) = \\frac{1}{s + ${decayRateA.toFixed(1)}}`} className="text-cyan-900 font-semibold text-xs block" />
            </div>

            {/* Slider 1: Decay Rate a */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>Decay Rate a:</span>
                <span className="font-mono font-bold text-cyan-800">{decayRateA.toFixed(1)} s⁻¹</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="4.0"
                step="0.1"
                value={decayRateA}
                onChange={(e) => setDecayRateA(parseFloat(e.target.value))}
                className="w-full accent-cyan-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Numerical Instantaneous Readouts */}
            <div className="text-[10px] space-y-1 pt-1.5 border-t border-cyan-200/80 font-mono text-slate-700">
              <div className="flex justify-between">
                <span>Time Const τ:</span>
                <strong className="text-slate-900">{metrics.timeConstantTau.toFixed(2)} s</strong>
              </div>
              <div className="flex justify-between">
                <span>Half-life t_1/2:</span>
                <strong className="text-indigo-700">{metrics.halfLife.toFixed(2)} s</strong>
              </div>
              <div className="flex justify-between">
                <span>Pole Location:</span>
                <strong className="text-rose-700">s = -{decayRateA.toFixed(1)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Middle / Right Interactive Canvas */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[440px] h-[260px] rounded-2xl bg-slate-50/60 border border-cyan-100 shadow-sm overflow-hidden flex flex-col items-center justify-between p-2 select-none">
            <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
              {/* --- SECTION 1: TIME DOMAIN (LEFT) --- */}
              <g>
                <text x={tPlotX} y="32" fill="#0891b2" fontSize="11" fontWeight="bold">Time Domain f(t)</text>

                {/* Axes */}
                <line x1={tPlotX} y1={tPlotY} x2={tPlotX + tPlotW} y2={tPlotY} stroke="#94a3b8" strokeWidth="1.5" />
                <line x1={tPlotX} y1={tPlotY} x2={tPlotX} y2={tPlotY - tPlotH} stroke="#94a3b8" strokeWidth="1.5" />

                {/* Grid ticks */}
                <text x={tPlotX} y={tPlotY + 12} fill="#64748b" fontSize="8" fontWeight="bold">0</text>
                <text x={tPlotX + tPlotW} y={tPlotY + 12} fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="end">4.5s</text>
                <text x={tPlotX - 4} y={tPlotY - yValScale + 3} fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="end">1.0</text>

                {/* Time curve */}
                {showTimeCurve && (
                  <path d={timePath} fill="none" stroke="#0891b2" strokeWidth="2.5" strokeLinecap="round" />
                )}

                {/* Time constant marker tau */}
                {showTau && metrics.timeConstantTau <= 4.5 && (
                  <g>
                    <line x1={tauSx} y1={tPlotY} x2={tauSx} y2={tauSy} stroke="#6366f1" strokeWidth="1.5" strokeDasharray="2 2" />
                    <circle cx={tauSx} cy={tauSy} r="4" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
                    <text x={tauSx} y={tPlotY + 12} fill="#6366f1" fontSize="8" fontWeight="bold" textAnchor="middle">τ=1/a</text>
                  </g>
                )}
              </g>

              {/* Divider Arrow */}
              <g transform="translate(208, 115)">
                <circle cx="0" cy="0" r="14" fill="#ecfeff" stroke="#06b6d4" strokeWidth="1.5" />
                <text x="0" y="3" fill="#0891b2" fontSize="9" fontWeight="bold" textAnchor="middle">ℒ</text>
              </g>

              {/* --- SECTION 2: COMPLEX S-PLANE (RIGHT) --- */}
              <g>
                <text x={sPlaneCx - 40} y="32" fill="#0891b2" fontSize="11" fontWeight="bold">s-Domain Plane (σ, jω)</text>

                {/* Shaded Region of Convergence (ROC) */}
                {showROC && (
                  <rect
                    x={rocBoundaryX}
                    y="45"
                    width={svgWidth - rocBoundaryX - 10}
                    height="150"
                    fill="rgba(6, 182, 212, 0.12)"
                  />
                )}

                {/* Complex axes */}
                <line x1={sPlaneCx - 90} y1={sPlaneCy} x2={sPlaneCx + 55} y2={sPlaneCy} stroke="#94a3b8" strokeWidth="1.5" />
                <line x1={sPlaneCx} y1="45" x2={sPlaneCx} y2="195" stroke="#94a3b8" strokeWidth="1.5" />
                <text x={sPlaneCx + 50} y={sPlaneCy - 4} fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="end">σ (Real)</text>
                <text x={sPlaneCx + 4} y="55" fill="#64748b" fontSize="8" fontWeight="bold">jω (Imag)</text>

                {/* ROC boundary line */}
                {showROC && (
                  <line
                    x1={rocBoundaryX}
                    y1="45"
                    x2={rocBoundaryX}
                    y2="195"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Poles marked with bold X */}
                {showPoles && poles.map((p, idx) => {
                  const px = sPlaneCx + p.real * sScale;
                  const py = sPlaneCy - p.imag * sScale;
                  return (
                    <g key={`pole-${idx}`}>
                      <line x1={px - 5} y1={py - 5} x2={px + 5} y2={py + 5} stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1={px + 5} y1={py - 5} x2={px - 5} y2={py + 5} stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" />
                      <text x={px} y={py - 8} fill="#e11d48" fontSize="9" fontWeight="bold" textAnchor="middle">
                        s = -{decayRateA.toFixed(1)}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Bottom Status Banner */}
            <div className="absolute bottom-2 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-lg border border-cyan-100 text-[10px] font-mono font-bold text-slate-700 shadow-sm flex items-center gap-1">
              <span className="text-rose-600 font-bold">Stable System:</span>
              <span>All poles in Left-Half Plane (Re(s) &lt; 0)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Presets Bar */}
      <div className="pt-2.5 border-t border-cyan-50/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">Models:</span>
          {LAPLACE_PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  setDecayRateA(preset.defaultA);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm scale-105'
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
