import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  RefreshCw, 
  Activity, 
  Radio, 
  AlertTriangle,
  Zap,
  BarChart2
} from 'lucide-react';
import { FOURIER_PRESETS, FourierWavePreset } from '../../data/fourierData';
import { 
  evaluateFourierSeries, 
  computeHarmonicsList, 
  generateWaveformPoints 
} from '../../utils/fourierMath';
import { MathView } from '../common/MathView';

interface Panel1Props {
  selectedPreset: FourierWavePreset;
  onSelectPreset: (preset: FourierWavePreset) => void;
  numHarmonics: number;
  setNumHarmonics: (n: number) => void;
  showTarget: boolean;
  showFourier: boolean;
  showError: boolean;
  showSpectrum: boolean;
  snapEnabled: boolean;
}

export const Panel1FourierCanvas: React.FC<Panel1Props> = ({
  selectedPreset,
  onSelectPreset,
  numHarmonics,
  setNumHarmonics,
  showTarget,
  showFourier,
  showError,
  showSpectrum,
  snapEnabled,
}) => {
  const [probeTime, setProbeTime] = useState<number>(0.25);

  const tRange: [number, number] = [0, 2];
  const period = 1.0;
  const omega0 = (2 * Math.PI) / period;

  // Generate waveform plot points
  const { targetPts, fourierPts, errorPts, mse } = useMemo(() => {
    return generateWaveformPoints(selectedPreset, numHarmonics, tRange, 160, period);
  }, [selectedPreset, numHarmonics]);

  // Compute harmonic amplitudes
  const harmonicsList = useMemo(() => {
    return computeHarmonicsList(selectedPreset, 13, omega0);
  }, [selectedPreset]);

  // Current probe values
  const targetVal = selectedPreset.targetFn(probeTime, period);
  const fourierVal = evaluateFourierSeries(selectedPreset, numHarmonics, probeTime, omega0);
  const instantError = Math.abs(targetVal - fourierVal);

  // SVG viewport bounds
  const svgWidth = 420;
  const svgHeight = 260;
  const plotOriginX = 35;
  const plotOriginY = 100;
  const plotWidth = 360;
  const plotHeight = 110;

  const tScale = plotWidth / (tRange[1] - tRange[0]);
  const yScale = plotHeight / 2.8;

  // Target SVG path
  const targetPath = targetPts
    .map((p, i) => {
      const sx = plotOriginX + (p.x - tRange[0]) * tScale;
      const sy = plotOriginY - p.y * yScale;
      return `${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)},${sy.toFixed(1)}`;
    })
    .join(' ');

  // Fourier partial sum SVG path
  const fourierPath = fourierPts
    .map((p, i) => {
      const sx = plotOriginX + (p.x - tRange[0]) * tScale;
      const sy = plotOriginY - p.y * yScale;
      return `${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)},${sy.toFixed(1)}`;
    })
    .join(' ');

  const probeSx = plotOriginX + (probeTime - tRange[0]) * tScale;
  const probeSyTarget = plotOriginY - targetVal * yScale;
  const probeSyFourier = plotOriginY - fourierVal * yScale;

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-violet-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            1
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Harmonic Waveform Builder
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Select target waveform and adjust harmonic count N to observe wave synthesis and error convergence.
        </p>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center py-1">
        {/* Left Parameter Controls Card */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-2.5">
          <div className="bg-violet-50/40 rounded-2xl p-4 border border-violet-100 shadow-inner w-full max-w-[220px] space-y-2.5">
            <div className="text-[10px] font-bold text-violet-800 uppercase tracking-wider text-center">
              Active Synthesis Model
            </div>

            <div className="p-2 bg-white rounded-xl border border-violet-200 text-center">
              <MathView math={`N = ${numHarmonics} \\text{ Harmonics}`} className="text-slate-900 font-semibold text-xs" />
            </div>

            {/* Slider 1: Number of Harmonics N */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>Harmonics N:</span>
                <span className="font-mono font-bold text-violet-800">{numHarmonics}</span>
              </div>
              <input
                type="range"
                min="1"
                max={selectedPreset.maxHarmonics}
                step="1"
                value={numHarmonics}
                onChange={(e) => setNumHarmonics(parseInt(e.target.value, 10))}
                className="w-full accent-violet-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 2: Time Scrubber */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>Time Probe t₀:</span>
                <span className="font-mono font-bold text-indigo-700">{probeTime.toFixed(2)} s</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.0"
                step="0.02"
                value={probeTime}
                onChange={(e) => setProbeTime(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Numerical Instantaneous Readouts */}
            <div className="text-[10px] space-y-1 pt-1.5 border-t border-violet-200/80 font-mono text-slate-700">
              <div className="flex justify-between">
                <span>Target f(t₀):</span>
                <strong className="text-slate-900">{targetVal.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Fourier S_N(t₀):</span>
                <strong className="text-violet-700">{fourierVal.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Mean Sq Error (MSE):</span>
                <strong className="text-emerald-700">{mse.toFixed(4)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Middle / Right Interactive Canvas */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[440px] h-[270px] rounded-2xl bg-slate-50/60 border border-violet-100 shadow-sm overflow-hidden flex flex-col items-center justify-between p-2 select-none">
            <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
              {/* Coordinate Grid & Axes */}
              <g stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3">
                <line x1={plotOriginX} y1={plotOriginY} x2={plotOriginX + plotWidth} y2={plotOriginY} stroke="#94a3b8" strokeDasharray="none" strokeWidth="1.5" />
                <line x1={plotOriginX} y1="20" x2={plotOriginX} y2="180" stroke="#94a3b8" strokeDasharray="none" strokeWidth="1.5" />
                <line x1={plotOriginX + plotWidth / 2} y1="20" x2={plotOriginX + plotWidth / 2} y2="180" />
                <line x1={plotOriginX + plotWidth} y1="20" x2={plotOriginX + plotWidth} y2="180" />
              </g>

              {/* Time tick labels */}
              <text x={plotOriginX} y="195" fill="#64748b" fontSize="9" fontWeight="bold">0</text>
              <text x={plotOriginX + plotWidth / 2} y="195" fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle">1.0s (T)</text>
              <text x={plotOriginX + plotWidth} y="195" fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="end">2.0s (2T)</text>

              {/* Target Waveform (Dashed Slate) */}
              {showTarget && (
                <path
                  d={targetPath}
                  fill="none"
                  stroke="#475569"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  opacity={0.7}
                />
              )}

              {/* Synthesized Fourier Series Curve */}
              {showFourier && (
                <path
                  d={fourierPath}
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  className="filter drop-shadow-sm"
                />
              )}

              {/* Time Scrubber Line & Probe Dots */}
              <line
                x1={probeSx}
                y1="20"
                x2={probeSx}
                y2="180"
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle cx={probeSx} cy={probeSyTarget} r="4" fill="#475569" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx={probeSx} cy={probeSyFourier} r="5" fill="#7c3aed" stroke="#ffffff" strokeWidth="2" />

              {/* --- HARMONIC SPECTRUM BAR CHART (BOTTOM) --- */}
              {showSpectrum && (
                <g transform="translate(45, 205)">
                  <line x1="0" y1="45" x2="330" y2="45" stroke="#94a3b8" strokeWidth="1" />
                  {harmonicsList.map((h, idx) => {
                    const barW = 14;
                    const barX = idx * 24;
                    const maxAmp = 1.3;
                    const barH = Math.min(42, (h.amplitude / maxAmp) * 42);
                    const isIncluded = h.n <= numHarmonics;
                    return (
                      <g key={`h-${idx}`}>
                        <rect
                          x={barX}
                          y={45 - barH}
                          width={barW}
                          height={barH}
                          fill={isIncluded ? (h.isNonZero ? '#8b5cf6' : '#e2e8f0') : '#cbd5e1'}
                          rx="2"
                          opacity={isIncluded ? 1 : 0.4}
                        />
                        <text
                          x={barX + barW / 2}
                          y="55"
                          fill="#64748b"
                          fontSize="8"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {h.n}
                        </text>
                      </g>
                    );
                  })}
                  <text x="320" y="38" fill="#7c3aed" fontSize="9" fontWeight="bold" textAnchor="end">|cₙ| spectrum</text>
                </g>
              )}
            </svg>

            {/* Gibbs Phenomenon Detection Badge for Discontinuous Waves */}
            {selectedPreset.id === 'square' && numHarmonics >= 5 && (
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-50/95 border border-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span>Gibbs Ringing (~8.95% overshoot)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Presets Bar */}
      <div className="pt-2.5 border-t border-violet-50/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">Signals:</span>
          {FOURIER_PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-violet-600 text-white border-violet-600 shadow-sm scale-105'
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
