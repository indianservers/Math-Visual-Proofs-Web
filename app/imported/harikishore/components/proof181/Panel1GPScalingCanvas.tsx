import React, { useState, useMemo } from 'react';
import { Sparkles, TrendingUp, TrendingDown, RotateCcw } from 'lucide-react';
import { GP_SCALING_PRESETS, GPScalingPreset } from '../../data/gpScalingData';
import { computeGPScaling, GPScalingEvaluation } from '../../utils/gpScalingMath';
import { MathView } from '../common/MathView';

interface Panel1Props {
  selectedPreset: GPScalingPreset;
  onSelectPreset: (p: GPScalingPreset) => void;
  a: number;
  setA: (a: number) => void;
  r: number;
  setR: (r: number) => void;
  n: number;
  setN: (n: number) => void;
  showTowers: boolean;
  showMultiplierArcs: boolean;
  showFormulas: boolean;
  showFormulaTag: boolean;
}

export const Panel1GPScalingCanvas: React.FC<Panel1Props> = ({
  selectedPreset,
  onSelectPreset,
  a,
  setA,
  r,
  setR,
  n,
  setN,
  showTowers,
  showMultiplierArcs,
  showFormulas,
  showFormulaTag,
}) => {
  const [activeTermIdx, setActiveTermIdx] = useState<number>(n);

  const evalResult: GPScalingEvaluation = useMemo(() => {
    return computeGPScaling(a, r, n);
  }, [a, r, n]);

  const svgWidth = 440;
  const svgHeight = 270;
  const groundY = 220;
  const maxBarHeightPx = 145;

  const barWidth = useMemo(() => {
    return Math.min(48, Math.floor(260 / n));
  }, [n]);

  const gap = 16;
  const startX = 55;

  // Maximum value for scaling bar heights
  const maxVal = Math.max(1, evalResult.maxVal);
  const pxPerUnit = maxBarHeightPx / maxVal;

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-emerald-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            1
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Repeated Scaling Towers & Multiplier Arcs
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Each tower is multiplied by ratio r to produce the next tower. Compare exponential growth (r &gt; 1) and decay (r &lt; 1).
        </p>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center py-1">
        {/* Left Information Card */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-2.5">
          <div className="bg-emerald-50/40 rounded-2xl p-4 border border-emerald-100 shadow-inner w-full max-w-[220px] space-y-2.5">
            <div className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider text-center flex items-center justify-center gap-1">
              {r >= 1 ? <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> : <TrendingDown className="w-3.5 h-3.5 text-cyan-600" />}
              <span>{r >= 1 ? 'Geometric Growth' : 'Geometric Decay'}</span>
            </div>

            {/* Slider 1: First term a */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>First term a:</span>
                <span className="font-mono font-bold text-emerald-700">{a}</span>
              </div>
              <input
                type="range"
                min="1"
                max="16"
                step="1"
                value={a}
                onChange={(e) => setA(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Selector: Common ratio r */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>Multiplier r:</span>
                <span className="font-mono font-bold text-indigo-700">
                  {r === 0.5 ? '1/2' : r === 1 / 3 ? '1/3' : `×${r}`}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 pt-0.5">
                {[2, 3, 0.5, 1 / 3].map((ratioVal) => (
                  <button
                    key={ratioVal}
                    onClick={() => setR(ratioVal)}
                    className={`py-1 text-[10px] font-bold rounded-lg border transition-all ${
                      Math.abs(r - ratioVal) < 0.01
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                    }`}
                  >
                    {ratioVal === 0.5 ? '0.5' : ratioVal === 1 / 3 ? '1/3' : ratioVal}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 3: Term count n */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>Terms count n:</span>
                <span className="font-mono font-bold text-slate-800">{n}</span>
              </div>
              <input
                type="range"
                min="2"
                max="5"
                step="1"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value, 10))}
                className="w-full accent-slate-700 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Readout Banner */}
            <div className="p-2 bg-white rounded-xl border border-emerald-200 text-center space-y-1 shadow-sm">
              <div className="text-[10px] text-slate-500 font-medium">Explicit Formula a_n:</div>
              <MathView
                math={`a_{${n}} = ${a} \\cdot (${r === 0.5 ? '\\frac{1}{2}' : r === 1 / 3 ? '\\frac{1}{3}' : r})^{${n - 1}} = ${evalResult.terms[n - 1]?.value}`}
                className="text-emerald-950 font-bold text-xs block"
              />
            </div>
          </div>
        </div>

        {/* Middle / Right Interactive Canvas */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[440px] h-[270px] rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/20 border border-emerald-100 shadow-sm overflow-hidden flex flex-col items-center justify-between p-2 select-none">
            <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
              {/* Ground line */}
              <line x1={startX - 15} y1={groundY} x2={startX + n * (barWidth + gap) + 5} y2={groundY} stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

              {/* Render Multiplier Arcs between towers */}
              {showMultiplierArcs &&
                evalResult.terms.map((term, idx) => {
                  if (idx === 0) return null;
                  const prevX = startX + (idx - 1) * (barWidth + gap) + barWidth / 2;
                  const currX = startX + idx * (barWidth + gap) + barWidth / 2;
                  const prevH = evalResult.terms[idx - 1].value * pxPerUnit;
                  const currH = term.value * pxPerUnit;
                  const topPeakY = groundY - Math.max(prevH, currH) - 22;
                  const midX = (prevX + currX) / 2;

                  return (
                    <g key={`arc-${idx}`} className="animate-in fade-in">
                      <path
                        d={`M ${prevX},${groundY - prevH - 5} Q ${midX},${topPeakY} ${currX},${groundY - currH - 5}`}
                        fill="none"
                        stroke="#059669"
                        strokeWidth="1.8"
                        strokeDasharray="3 2"
                      />
                      {/* Badge on the arc */}
                      <rect
                        x={midX - 14}
                        y={topPeakY - 9}
                        width="28"
                        height="15"
                        rx="4"
                        fill="#ecfdf5"
                        stroke="#10b981"
                        strokeWidth="1"
                      />
                      <text
                        x={midX}
                        y={topPeakY + 2}
                        fill="#065f46"
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {r === 0.5 ? '×½' : r === 1 / 3 ? '×⅓' : `×${r}`}
                      </text>
                    </g>
                  );
                })}

              {/* Render Bar Towers */}
              {showTowers &&
                evalResult.terms.map((term, idx) => {
                  const bx = startX + idx * (barWidth + gap);
                  const barH = Math.max(6, term.value * pxPerUnit);
                  const by = groundY - barH;

                  return (
                    <g key={`bar-${term.index}`}>
                      <rect
                        x={bx}
                        y={by}
                        width={barWidth}
                        height={barH}
                        rx="4"
                        fill="url(#gpBarGrad)"
                        stroke="#059669"
                        strokeWidth="1.5"
                      />

                      {/* Numeric Value Label */}
                      <text
                        x={bx + barWidth / 2}
                        y={by - 6}
                        fill="#065f46"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {term.value}
                      </text>

                      {/* Formula label below ground line */}
                      {showFormulas && (
                        <text
                          x={bx + barWidth / 2}
                          y={groundY + 16}
                          fill="#475569"
                          fontSize="9"
                          fontWeight="medium"
                          textAnchor="middle"
                        >
                          {term.algebraicFormula}
                        </text>
                      )}

                      {/* Index tag */}
                      <text
                        x={bx + barWidth / 2}
                        y={groundY + 29}
                        fill="#94a3b8"
                        fontSize="8"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        a_{term.index}
                      </text>
                    </g>
                  );
                })}

              {/* Gradient */}
              <defs>
                <linearGradient id="gpBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>

            {/* Top Right Tag */}
            {showFormulaTag && (
              <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-emerald-50/95 border border-emerald-200 text-emerald-900 px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>a_{n} = a · r^(n-1)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Presets Bar */}
      <div className="pt-2.5 border-t border-emerald-50/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">Scenarios:</span>
          {GP_SCALING_PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  setA(preset.a);
                  setR(preset.r);
                  setN(preset.n);
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
