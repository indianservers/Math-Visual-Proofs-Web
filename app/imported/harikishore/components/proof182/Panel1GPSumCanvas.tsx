import React, { useState, useMemo } from 'react';
import { Play, Pause, RotateCcw, Sparkles, X } from 'lucide-react';
import { GP_SUM_PRESETS, GPSumPreset } from '../../data/gpSumData';
import { computeGPSum, GPSumEvaluation } from '../../utils/gpSumMath';
import { MathView } from '../common/MathView';

interface Panel1Props {
  selectedPreset: GPSumPreset;
  onSelectPreset: (p: GPSumPreset) => void;
  a: number;
  setA: (a: number) => void;
  r: number;
  setR: (r: number) => void;
  n: number;
  setN: (n: number) => void;
  cancelProgress: number;
  setCancelProgress: (p: number | ((prev: number) => number)) => void;
  showSeriesS: boolean;
  showShiftedRS: boolean;
  showCancellation: boolean;
  showFormulaTag: boolean;
}

export const Panel1GPSumCanvas: React.FC<Panel1Props> = ({
  selectedPreset,
  onSelectPreset,
  a,
  setA,
  r,
  setR,
  n,
  setN,
  cancelProgress,
  setCancelProgress,
  showSeriesS,
  showShiftedRS,
  showCancellation,
  showFormulaTag,
}) => {
  const [isCanceling, setIsCanceling] = useState(false);

  // Smooth animation for cancellation
  React.useEffect(() => {
    let animFrame: number;
    if (isCanceling) {
      const step = () => {
        setCancelProgress(prev => {
          if (prev >= 1) {
            setIsCanceling(false);
            return 1;
          }
          return Math.min(1, prev + 0.04);
        });
        animFrame = requestAnimationFrame(step);
      };
      animFrame = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animFrame);
  }, [isCanceling, setCancelProgress]);

  const evalResult: GPSumEvaluation = useMemo(() => {
    return computeGPSum(a, r, n);
  }, [a, r, n]);

  const svgWidth = 450;
  const svgHeight = 270;
  const row1Y = 75; // Series S
  const row2Y = 165; // Series rS
  const barW = Math.min(48, Math.floor(320 / (n + 1)));
  const gap = 14;
  const startX = 65;

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-pink-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            1
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Shifted Series Alignment & Telescoping Cancellation
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Multiplying S by r shifts terms right by 1 position. Subtracting S - r·S cancels all intermediate terms.
        </p>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center py-1">
        {/* Left Information Card */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-2.5">
          <div className="bg-pink-50/40 rounded-2xl p-4 border border-pink-100 shadow-inner w-full max-w-[220px] space-y-2.5">
            <div className="text-[10px] font-bold text-pink-900 uppercase tracking-wider text-center">
              Series Parameters
            </div>

            {/* Slider 1: First term a */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>First term a:</span>
                <span className="font-mono font-bold text-pink-700">{a}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={a}
                onChange={(e) => setA(parseInt(e.target.value, 10))}
                className="w-full accent-pink-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Ratio r selector */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>Common ratio r:</span>
                <span className="font-mono font-bold text-amber-700">
                  {r === 0.5 ? '1/2' : `×${r}`}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 pt-0.5">
                {[2, 3, 0.5].map((val) => (
                  <button
                    key={val}
                    onClick={() => setR(val)}
                    className={`py-1 text-[10px] font-bold rounded-lg border transition-all ${
                      Math.abs(r - val) < 0.01
                        ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-pink-50'
                    }`}
                  >
                    {val === 0.5 ? '0.5' : val}
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

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 pt-1">
              <button
                onClick={() => {
                  if (cancelProgress >= 1) setCancelProgress(0);
                  setIsCanceling(true);
                }}
                className="flex-1 py-1.5 px-2.5 bg-pink-600 hover:bg-pink-700 text-white text-[11px] font-bold rounded-xl shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-1"
              >
                {isCanceling ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-white" />}
                <span>{cancelProgress >= 1 ? 'Replay' : 'Cancel Out'}</span>
              </button>
              <button
                onClick={() => {
                  setIsCanceling(false);
                  setCancelProgress(0);
                }}
                className="p-1.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200"
                title="Reset cancellation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Readout */}
            <div className="p-2 bg-white rounded-xl border border-pink-200 text-center space-y-1 shadow-sm">
              <div className="text-[10px] text-slate-500 font-medium">Finite GP Sum S_{n}:</div>
              <MathView
                math={`S_{${n}} = ${a} \\cdot \\frac{1 - ${r}^{${n}}}{1 - ${r}} = ${evalResult.sumSn}`}
                className="text-pink-950 font-bold text-xs block"
              />
            </div>
          </div>
        </div>

        {/* Middle / Right Interactive Canvas */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[450px] h-[270px] rounded-2xl bg-gradient-to-br from-slate-50 to-pink-50/20 border border-pink-100 shadow-sm overflow-hidden flex flex-col items-center justify-between p-2 select-none">
            <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
              {/* Row Labels */}
              <text x={startX - 18} y={row1Y + 22} fill="#be185d" fontSize="11" fontWeight="bold" textAnchor="end">
                S_n
              </text>
              <text x={startX - 18} y={row2Y + 22} fill="#d97706" fontSize="11" fontWeight="bold" textAnchor="end">
                r·S_n
              </text>

              {/* Subtraction Minus Sign */}
              <text x={startX - 18} y={(row1Y + row2Y) / 2 + 16} fill="#64748b" fontSize="14" fontWeight="bold" textAnchor="end">
                −
              </text>

              {/* Divider Line under both series */}
              <line x1={startX - 25} y1={row2Y + 48} x2={startX + (n + 1) * (barW + gap)} y2={row2Y + 48} stroke="#cbd5e1" strokeWidth="1.5" />

              {/* Survived Formula Result below line */}
              <g className="animate-in fade-in">
                <text x={startX} y={row2Y + 68} fill="#be185d" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  (1 − r) S_n =
                </text>
                <text x={startX + 95} y={row2Y + 68} fill="#059669" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  {evalResult.headTermVal}
                </text>
                <text x={startX + 120} y={row2Y + 68} fill="#64748b" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  −
                </text>
                <text x={startX + 138} y={row2Y + 68} fill="#e11d48" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  {evalResult.tailTermVal}
                </text>
              </g>

              {/* 1. Original Series S terms (Row 1) */}
              {showSeriesS &&
                evalResult.terms.map((term) => {
                  if (!term.inS) return null;
                  const bx = startX + term.power * (barW + gap);
                  const isCanceled = term.isCanceled && cancelProgress > 0.4;
                  const isHead = term.power === 0;

                  return (
                    <g key={`s-term-${term.power}`} className="transition-all duration-200">
                      <rect
                        x={bx}
                        y={row1Y}
                        width={barW}
                        height={36}
                        rx="6"
                        fill={isHead ? '#fce7f3' : '#fbcfe8'}
                        stroke={isHead ? '#db2777' : '#ec4899'}
                        strokeWidth={isHead ? 2 : 1.2}
                        opacity={isCanceled ? 0.35 : 1}
                      />
                      <text
                        x={bx + barW / 2}
                        y={row1Y + 22}
                        fill="#831843"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {term.algebraic}
                      </text>

                      {/* Cancel Slash when cancelProgress > 0.4 */}
                      {isCanceled && showCancellation && (
                        <line
                          x1={bx + 2}
                          y1={row1Y + 34}
                          x2={bx + barW - 2}
                          y2={row1Y + 2}
                          stroke="#ef4444"
                          strokeWidth="2.2"
                        />
                      )}
                    </g>
                  );
                })}

              {/* 2. Shifted Series r*S terms (Row 2) */}
              {showShiftedRS &&
                evalResult.terms.map((term) => {
                  if (!term.inRS) return null;
                  // Shifted by term.power position
                  const bx = startX + term.power * (barW + gap);
                  const isCanceled = term.isCanceled && cancelProgress > 0.4;
                  const isTail = term.power === n;

                  return (
                    <g key={`rs-term-${term.power}`} className="transition-all duration-200">
                      <rect
                        x={bx}
                        y={row2Y}
                        width={barW}
                        height={36}
                        rx="6"
                        fill={isTail ? '#fee2e2' : '#fef3c7'}
                        stroke={isTail ? '#dc2626' : '#f59e0b'}
                        strokeWidth={isTail ? 2 : 1.2}
                        opacity={isCanceled ? 0.35 : 1}
                      />
                      <text
                        x={bx + barW / 2}
                        y={row2Y + 22}
                        fill={isTail ? '#991b1b' : '#92400e'}
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {term.algebraic}
                      </text>

                      {/* Cancel Slash when cancelProgress > 0.4 */}
                      {isCanceled && showCancellation && (
                        <line
                          x1={bx + 2}
                          y1={row2Y + 34}
                          x2={bx + barW - 2}
                          y2={row2Y + 2}
                          stroke="#ef4444"
                          strokeWidth="2.2"
                        />
                      )}
                    </g>
                  );
                })}

              {/* Vertical connecting brackets for canceling pairs */}
              {showCancellation &&
                cancelProgress > 0.2 &&
                evalResult.terms.map((term) => {
                  if (!term.isCanceled) return null;
                  const bx = startX + term.power * (barW + gap) + barW / 2;
                  return (
                    <g key={`pair-link-${term.power}`} className="animate-in fade-in">
                      <line
                        x1={bx}
                        y1={row1Y + 38}
                        x2={bx}
                        y2={row2Y - 2}
                        stroke="#a855f7"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                      <circle cx={bx} cy={(row1Y + 36 + row2Y) / 2} r="6" fill="#f3e8ff" stroke="#9333ea" strokeWidth="1" />
                      <text
                        x={bx}
                        y={(row1Y + 36 + row2Y) / 2 + 3}
                        fill="#7e22ce"
                        fontSize="8"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        0
                      </text>
                    </g>
                  );
                })}
            </svg>

            {/* Top Right Tag */}
            {showFormulaTag && (
              <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-pink-50/95 border border-pink-200 text-pink-900 px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                <span>All Middle Terms Cancel to 0!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Presets Bar */}
      <div className="pt-2.5 border-t border-pink-50/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">Scenarios:</span>
          {GP_SUM_PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  setA(preset.a);
                  setR(preset.r);
                  setN(preset.n);
                  setCancelProgress(1.0);
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
