import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { AP_SUM_PRESETS, APSumPreset } from '../../data/apSumData';
import { computeAPSum, APSumEvaluation } from '../../utils/apSumMath';
import { MathView } from '../common/MathView';

interface Panel1Props {
  selectedPreset: APSumPreset;
  onSelectPreset: (p: APSumPreset) => void;
  a: number;
  setA: (a: number) => void;
  d: number;
  setD: (d: number) => void;
  n: number;
  setN: (n: number) => void;
  stackProgress: number;
  setStackProgress: (p: number | ((prev: number) => number)) => void;
  showOriginalBars: boolean;
  showInvertedBars: boolean;
  showCeilingLine: boolean;
  showFormulaTag: boolean;
}

export const Panel1APSumCanvas: React.FC<Panel1Props> = ({
  selectedPreset,
  onSelectPreset,
  a,
  setA,
  d,
  setD,
  n,
  setN,
  stackProgress,
  setStackProgress,
  showOriginalBars,
  showInvertedBars,
  showCeilingLine,
  showFormulaTag,
}) => {
  const [isLowering, setIsLowering] = useState(false);

  // Smooth animation for lowering inverted twin bars
  useEffect(() => {
    let animFrame: number;
    if (isLowering) {
      const step = () => {
        setStackProgress(prev => {
          if (prev >= 1) {
            setIsLowering(false);
            return 1;
          }
          return Math.min(1, prev + 0.035);
        });
        animFrame = requestAnimationFrame(step);
      };
      animFrame = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animFrame);
  }, [isLowering, setStackProgress]);

  const evalResult: APSumEvaluation = useMemo(() => {
    return computeAPSum(a, d, n);
  }, [a, d, n]);

  const svgWidth = 440;
  const svgHeight = 270;
  const groundY = 225;
  const ceilingY = 55;
  const totalHeightPx = groundY - ceilingY;

  const barWidth = useMemo(() => {
    return Math.min(48, Math.floor(260 / n));
  }, [n]);

  const gap = 12;
  const startX = 65;

  // Scale: pairSumConst maps to totalHeightPx
  const pxPerUnit = totalHeightPx / Math.max(1, evalResult.pairSumConst);

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-purple-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            1
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Pairing First and Last Terms (Inverted Bar Stacking)
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Lower the inverted twin bars on top of the original towers. Every column reaches the uniform height a + l.
        </p>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center py-1">
        {/* Left Information Card */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-2.5">
          <div className="bg-purple-50/40 rounded-2xl p-4 border border-purple-100 shadow-inner w-full max-w-[220px] space-y-2.5">
            <div className="text-[10px] font-bold text-purple-900 uppercase tracking-wider text-center">
              AP Parameters
            </div>

            {/* Slider 1: First term a */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>First term a:</span>
                <span className="font-mono font-bold text-purple-700">{a}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={a}
                onChange={(e) => setA(parseInt(e.target.value, 10))}
                className="w-full accent-purple-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 2: Common difference d */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>Step d:</span>
                <span className="font-mono font-bold text-indigo-700">+{d}</span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                step="1"
                value={d}
                onChange={(e) => setD(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
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
                max="6"
                step="1"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value, 10))}
                className="w-full accent-slate-700 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 4: Stacking progress */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>Stack Twin:</span>
                <span className="font-mono font-bold text-amber-600">
                  {Math.round(stackProgress * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={stackProgress}
                onChange={(e) => setStackProgress(parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 pt-1">
              <button
                onClick={() => {
                  if (stackProgress >= 1) setStackProgress(0);
                  setIsLowering(true);
                }}
                className="flex-1 py-1.5 px-2.5 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold rounded-xl shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-1"
              >
                {isLowering ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-white" />}
                <span>{stackProgress >= 1 ? 'Replay' : 'Stack Twin'}</span>
              </button>
              <button
                onClick={() => {
                  setIsLowering(false);
                  setStackProgress(0);
                }}
                className="p-1.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200"
                title="Reset stack"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Readout */}
            <div className="p-2 bg-white rounded-xl border border-purple-200 text-center space-y-1 shadow-sm">
              <div className="text-[10px] text-slate-500 font-medium">AP Series Sum S_{n}:</div>
              <MathView
                math={`S_{${n}} = \\frac{${n}}{2}(${a} + ${evalResult.lastTermL}) = ${evalResult.totalSumSn}`}
                className="text-purple-950 font-bold text-xs block"
              />
              <div className="text-[10px] text-amber-700 font-mono font-semibold">
                Uniform Column Height = {evalResult.pairSumConst}
              </div>
            </div>
          </div>
        </div>

        {/* Middle / Right Interactive Canvas */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[440px] h-[270px] rounded-2xl bg-gradient-to-br from-slate-50 to-purple-50/20 border border-purple-100 shadow-sm overflow-hidden flex flex-col items-center justify-between p-2 select-none">
            <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
              {/* Ground line */}
              <line x1={startX - 15} y1={groundY} x2={startX + n * (barWidth + gap) + 5} y2={groundY} stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

              {/* Ceiling Line at uniform height a + l */}
              {showCeilingLine && (
                <g className="animate-in fade-in">
                  <line
                    x1={startX - 15}
                    y1={ceilingY}
                    x2={startX + n * (barWidth + gap) + 5}
                    y2={ceilingY}
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />
                  <text
                    x={startX + n * (barWidth + gap) + 12}
                    y={ceilingY + 4}
                    fill="#6d28d9"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    a + l = {evalResult.pairSumConst}
                  </text>
                </g>
              )}

              {/* Render Columns */}
              {evalResult.columns.map((col, idx) => {
                const cx = startX + idx * (barWidth + gap);
                const origHeight = col.originalVal * pxPerUnit;
                const origY = groundY - origHeight;

                const invertedHeight = col.invertedVal * pxPerUnit;
                // Inverted bar target Y is exactly on top of original bar
                const targetDockY = origY - invertedHeight;
                // Separated position floating above
                const separatedY = targetDockY - 50;
                const currentInvY = separatedY + (targetDockY - separatedY) * stackProgress;

                return (
                  <g key={`col-${col.index}`}>
                    {/* 1. Original Bar (bottom) */}
                    {showOriginalBars && (
                      <rect
                        x={cx}
                        y={origY}
                        width={barWidth}
                        height={origHeight}
                        rx="4"
                        fill="url(#origBarGrad)"
                        stroke="#6d28d9"
                        strokeWidth="1.5"
                      />
                    )}

                    {/* Original Value Label */}
                    {showOriginalBars && (
                      <text
                        x={cx + barWidth / 2}
                        y={origY + Math.min(origHeight / 2 + 4, origHeight - 4)}
                        fill="#ffffff"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {col.originalVal}
                      </text>
                    )}

                    {/* 2. Inverted Twin Bar (top) */}
                    {showInvertedBars && (
                      <rect
                        x={cx}
                        y={currentInvY}
                        width={barWidth}
                        height={invertedHeight}
                        rx="4"
                        fill="url(#invBarGrad)"
                        stroke="#d97706"
                        strokeWidth="1.5"
                        opacity={0.35 + stackProgress * 0.65}
                      />
                    )}

                    {/* Inverted Value Label */}
                    {showInvertedBars && (
                      <text
                        x={cx + barWidth / 2}
                        y={currentInvY + Math.min(invertedHeight / 2 + 4, invertedHeight - 4)}
                        fill="#ffffff"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {col.invertedVal}
                      </text>
                    )}

                    {/* Column index label under ground line */}
                    <text
                      x={cx + barWidth / 2}
                      y={groundY + 16}
                      fill="#64748b"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      Term {col.index}
                    </text>
                  </g>
                );
              })}

              {/* Gradients */}
              <defs>
                <linearGradient id="origBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#6d28d9" />
                </linearGradient>
                <linearGradient id="invBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
            </svg>

            {/* Top Right Tag */}
            {showFormulaTag && (
              <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-purple-50/95 border border-purple-200 text-purple-900 px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Pair Sum = {a} + {evalResult.lastTermL} = {evalResult.pairSumConst}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Presets Bar */}
      <div className="pt-2.5 border-t border-purple-50/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">Examples:</span>
          {AP_SUM_PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  setA(preset.a);
                  setD(preset.d);
                  setN(preset.n);
                  setStackProgress(1.0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm scale-105'
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
