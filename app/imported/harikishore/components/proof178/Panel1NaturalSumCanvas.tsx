import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { NATURAL_SUM_PRESETS, NaturalSumPreset } from '../../data/naturalSumData';
import { computeNaturalSum, NaturalSumEvaluation } from '../../utils/naturalSumMath';
import { MathView } from '../common/MathView';

interface Panel1Props {
  selectedPreset: NaturalSumPreset;
  onSelectPreset: (p: NaturalSumPreset) => void;
  n: number;
  setN: (n: number) => void;
  interlockProgress: number;
  setInterlockProgress: (p: number | ((prev: number) => number)) => void;
  showStaircase1: boolean;
  showTwinStaircase: boolean;
  showDimensions: boolean;
  showFormulaTag: boolean;
}

export const Panel1NaturalSumCanvas: React.FC<Panel1Props> = ({
  selectedPreset,
  onSelectPreset,
  n,
  setN,
  interlockProgress,
  setInterlockProgress,
  showStaircase1,
  showTwinStaircase,
  showDimensions,
  showFormulaTag,
}) => {
  const [isGliding, setIsGliding] = useState(false);

  // Smooth animation for interlocking twin staircase
  useEffect(() => {
    let animFrame: number;
    if (isGliding) {
      const step = () => {
        setInterlockProgress(prev => {
          if (prev >= 1) {
            setIsGliding(false);
            return 1;
          }
          return Math.min(1, prev + 0.035);
        });
        animFrame = requestAnimationFrame(step);
      };
      animFrame = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animFrame);
  }, [isGliding, setInterlockProgress]);

  const dotSpacing = useMemo(() => {
    return n <= 4 ? 32 : n <= 6 ? 26 : 22;
  }, [n]);

  const svgWidth = 460;
  const svgHeight = 270;
  const originX = 40;
  const originY = 45;

  const evalResult: NaturalSumEvaluation = useMemo(() => {
    return computeNaturalSum(n, interlockProgress, dotSpacing, originX, originY);
  }, [n, interlockProgress, dotSpacing]);

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-blue-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            1
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Triangular Staircase & Rectangle Interlock
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Slide or animate the twin orange staircase to fit the blue staircase. Together they form an n × (n+1) rectangle.
        </p>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center py-1">
        {/* Left Information Card */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-2.5">
          <div className="bg-blue-50/40 rounded-2xl p-4 border border-blue-100 shadow-inner w-full max-w-[220px] space-y-3">
            <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider text-center">
              Staircase Parameter
            </div>

            {/* Slider 1: n terms */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>Terms count (n):</span>
                <span className="font-mono font-bold text-blue-800">{n}</span>
              </div>
              <input
                type="range"
                min="2"
                max="8"
                step="1"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value, 10))}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 2: Interlock progress */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>Interlock Glide:</span>
                <span className="font-mono font-bold text-amber-600">
                  {Math.round(interlockProgress * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={interlockProgress}
                onChange={(e) => setInterlockProgress(parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 pt-1">
              <button
                onClick={() => {
                  if (interlockProgress >= 1) setInterlockProgress(0);
                  setIsGliding(true);
                }}
                className="flex-1 py-1.5 px-2.5 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold rounded-xl shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-1"
              >
                {isGliding ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-white" />}
                <span>{interlockProgress >= 1 ? 'Replay' : 'Glide In'}</span>
              </button>
              <button
                onClick={() => {
                  setIsGliding(false);
                  setInterlockProgress(0);
                }}
                className="p-1.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200"
                title="Reset position"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Calculation Readout */}
            <div className="p-2 bg-white rounded-xl border border-blue-200 text-center space-y-1 shadow-sm">
              <div className="text-[10px] text-slate-500 font-medium">Staircase Dots:</div>
              <MathView
                math={`S = \\frac{${n}(${n + 1})}{2} = ${evalResult.triangleSum}`}
                className="text-blue-900 font-bold text-xs block"
              />
              <div className="text-[10px] text-amber-800 font-mono font-semibold">
                Rectangle = {evalResult.rectangleWidth} × {evalResult.rectangleHeight} = {evalResult.rectangleTotalDots}
              </div>
            </div>
          </div>
        </div>

        {/* Middle / Right Interactive Canvas */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[460px] h-[270px] rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/20 border border-blue-100 shadow-sm overflow-hidden flex flex-col items-center justify-between p-2 select-none">
            <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
              {/* Grid backdrop for rectangle bounding box when near interlocked */}
              {showDimensions && interlockProgress > 0.85 && (
                <rect
                  x={originX - 12}
                  y={originY - 12}
                  width={(evalResult.rectangleWidth - 1) * dotSpacing + 24}
                  height={(evalResult.rectangleHeight - 1) * dotSpacing + 24}
                  fill="rgba(59, 130, 246, 0.04)"
                  stroke="#93c5fd"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  rx="10"
                />
              )}

              {/* Staircase 1: Blue Dots */}
              {showStaircase1 &&
                evalResult.originalDots.map((dot) => (
                  <g key={dot.id} className="transition-all duration-200">
                    <circle
                      cx={dot.x}
                      cy={dot.y}
                      r={dotSpacing * 0.36}
                      fill="url(#blueDotGrad)"
                      stroke="#2563eb"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={dot.x - dotSpacing * 0.1}
                      cy={dot.y - dotSpacing * 0.1}
                      r={dotSpacing * 0.12}
                      fill="#ffffff"
                      opacity="0.6"
                    />
                  </g>
                ))}

              {/* Staircase 2: Orange Twin Dots */}
              {showTwinStaircase &&
                evalResult.duplicateDots.map((dot) => (
                  <g key={dot.id}>
                    <circle
                      cx={dot.x}
                      cy={dot.y}
                      r={dotSpacing * 0.36}
                      fill="url(#orangeDotGrad)"
                      stroke="#d97706"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={dot.x - dotSpacing * 0.1}
                      cy={dot.y - dotSpacing * 0.1}
                      r={dotSpacing * 0.12}
                      fill="#ffffff"
                      opacity="0.6"
                    />
                  </g>
                ))}

              {/* Dimension Brackets when near interlocked */}
              {showDimensions && interlockProgress > 0.85 && (
                <g className="animate-in fade-in">
                  {/* Top width dimension label: n + 1 */}
                  <text
                    x={originX + ((evalResult.rectangleWidth - 1) * dotSpacing) / 2}
                    y={originY - 18}
                    fill="#1e40af"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    Width = n + 1 ({evalResult.rectangleWidth})
                  </text>

                  {/* Left height dimension label: n */}
                  <text
                    x={originX - 22}
                    y={originY + ((evalResult.rectangleHeight - 1) * dotSpacing) / 2 + 4}
                    fill="#1e40af"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="end"
                    fontFamily="sans-serif"
                  >
                    Height = n ({evalResult.rectangleHeight})
                  </text>
                </g>
              )}

              {/* Linear Gradients */}
              <defs>
                <radialGradient id="blueDotGrad" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#2563eb" />
                </radialGradient>
                <radialGradient id="orangeDotGrad" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </radialGradient>
              </defs>
            </svg>

            {/* Top Right Tag */}
            {showFormulaTag && (
              <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-blue-50/95 border border-blue-200 text-blue-900 px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>2 × Triangle = n(n+1) Rectangle</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Presets Bar */}
      <div className="pt-2.5 border-t border-blue-50/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">Examples:</span>
          {NATURAL_SUM_PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  setN(preset.n);
                  setInterlockProgress(1.0);
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
