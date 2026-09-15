import React, { useMemo } from 'react';
import { 
  ArrowRight, 
  Layers, 
  Grid 
} from 'lucide-react';
import { AP_PRESETS, APPreset } from '../../data/apData';
import { computeAP, APEvaluation } from '../../utils/apMath';
import { MathView } from '../common/MathView';

interface Panel1Props {
  selectedPreset: APPreset;
  onSelectPreset: (p: APPreset) => void;
  a: number;
  setA: (a: number) => void;
  d: number;
  setD: (d: number) => void;
  n: number;
  setN: (n: number) => void;
  showNumberLine: boolean;
  showJumps: boolean;
  showTerms: boolean;
  showFormulas: boolean;
  snapEnabled: boolean;
}

export const Panel1APCanvas: React.FC<Panel1Props> = ({
  selectedPreset,
  onSelectPreset,
  a,
  setA,
  d,
  setD,
  n,
  setN,
  showNumberLine,
  showJumps,
  showTerms,
  showFormulas,
}) => {
  const evalResult: APEvaluation = useMemo(() => {
    return computeAP(a, d, n);
  }, [a, d, n]);

  const svgWidth = 420;
  const svgHeight = 250;
  const padL = 35;
  const padR = 35;
  const lineY = 175;
  const plotW = svgWidth - padL - padR;

  // Number line scale
  const minVal = Math.min(evalResult.minVal, 0) - 2;
  const maxVal = Math.max(evalResult.maxVal, 10) + 2;
  const valRange = Math.max(1, maxVal - minVal);

  const mathToX = (val: number) => padL + ((val - minVal) / valRange) * plotW;

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-blue-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            1
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Number Line Equal Steps & General Term
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Adjust starting value a, common difference d, and term count n. Watch each equal step jump d on the number line.
        </p>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center py-1">
        {/* Left Information Card */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-2.5">
          <div className="bg-blue-50/40 rounded-2xl p-4 border border-blue-100 shadow-inner w-full max-w-[220px] space-y-2.5">
            <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider text-center">
              AP Parameters
            </div>

            {/* Slider 1: First term a */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>First term a:</span>
                <span className="font-mono font-bold text-blue-800">{a}</span>
              </div>
              <input
                type="range"
                min="-4"
                max="10"
                step="1"
                value={a}
                onChange={(e) => setA(parseInt(e.target.value, 10))}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 2: Common difference d */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>Difference d:</span>
                <span className="font-mono font-bold text-indigo-800">{d > 0 ? `+${d}` : d}</span>
              </div>
              <input
                type="range"
                min="-4"
                max="6"
                step="1"
                value={d}
                onChange={(e) => setD(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 3: Term count n */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>Term count n:</span>
                <span className="font-mono font-bold text-slate-900">{n}</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value, 10))}
                className="w-full accent-slate-700 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Readout Banner */}
            <div className="p-2 bg-white rounded-xl border border-blue-200 text-center space-y-1">
              <div className="text-[10px] text-slate-500 font-medium">General Formula:</div>
              <MathView math={`a_{${n}} = ${a} + (${n}-1)(${d}) = ${evalResult.targetTermValue}`} className="text-blue-950 font-bold text-xs block" />
              <div className="text-[10px] text-indigo-700 font-mono font-bold">Sum S_{n} = {evalResult.sumSn}</div>
            </div>
          </div>
        </div>

        {/* Middle / Right Interactive Canvas */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[440px] h-[260px] rounded-2xl bg-slate-50/60 border border-blue-100 shadow-sm overflow-hidden flex flex-col items-center justify-between p-2 select-none">
            <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
              {/* Number Line Axis */}
              {showNumberLine && (
                <g>
                  <line x1={padL - 10} y1={lineY} x2={svgWidth - padR + 10} y2={lineY} stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                  {/* Axis arrowheads */}
                  <polygon points={`${svgWidth - padR + 12},${lineY} ${svgWidth - padR + 6},${lineY - 3} ${svgWidth - padR + 6},${lineY + 3}`} fill="#94a3b8" />
                  <polygon points={`${padL - 12},${lineY} ${padL - 6},${lineY - 3} ${padL - 6},${lineY + 3}`} fill="#94a3b8" />

                  {/* Integer ticks */}
                  {Array.from({ length: Math.floor(maxVal - minVal) + 1 }, (_, i) => minVal + i).map((tv) => {
                    const tx = mathToX(tv);
                    return (
                      <g key={`tick-${tv}`}>
                        <line x1={tx} y1={lineY - 4} x2={tx} y2={lineY + 4} stroke="#cbd5e1" strokeWidth="1" />
                        {tv % 2 === 0 && (
                          <text x={tx} y={lineY + 16} fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="middle">
                            {tv}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Jump Arcs */}
              {showJumps && evalResult.terms.map((t, idx) => {
                if (idx === 0) return null;
                const prev = evalResult.terms[idx - 1];
                const x1 = mathToX(prev.value);
                const x2 = mathToX(t.value);
                const mx = (x1 + x2) / 2;
                const arcHeight = Math.min(55, Math.abs(x2 - x1) * 0.45);
                const arcPath = `M ${x1},${lineY} Q ${mx},${lineY - arcHeight * 1.5} ${x2},${lineY}`;

                return (
                  <g key={`jump-${idx}`}>
                    <path d={arcPath} fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="3 2" />
                    {/* Jump label badge */}
                    <rect x={mx - 10} y={lineY - arcHeight * 0.9 - 7} width="20" height="13" fill="#e0e7ff" rx="3" stroke="#818cf8" strokeWidth="0.8" />
                    <text x={mx} y={lineY - arcHeight * 0.9 + 2} fill="#3730a3" fontSize="8" fontWeight="bold" textAnchor="middle">
                      {d > 0 ? `+${d}` : d}
                    </text>
                  </g>
                );
              })}

              {/* Term Dots and Badges */}
              {showTerms && evalResult.terms.map((t, idx) => {
                const sx = mathToX(t.value);
                const isTarget = idx === evalResult.terms.length - 1;

                return (
                  <g key={`term-${idx}`}>
                    <circle
                      cx={sx}
                      cy={lineY}
                      r={isTarget ? 6.5 : 5}
                      fill={isTarget ? '#2563eb' : '#3b82f6'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    {/* Value label */}
                    <text x={sx} y={lineY - 10} fill="#1e3a8a" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      a_{t.index}={t.value}
                    </text>

                    {/* Formula Tag */}
                    {showFormulas && (
                      <text x={sx} y={lineY + 30} fill="#475569" fontSize="8" fontWeight="medium" textAnchor="middle">
                        {t.algebraicFormula}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Top Right Tag */}
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-blue-50/95 border border-blue-200 text-blue-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
              <ArrowRight className="w-3 h-3 text-blue-600" />
              <span>(n - 1) Equal Jumps of Length d</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Presets Bar */}
      <div className="pt-2.5 border-t border-blue-50/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">Sequences:</span>
          {AP_PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  setA(preset.a);
                  setD(preset.d);
                  setN(preset.n);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105'
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
