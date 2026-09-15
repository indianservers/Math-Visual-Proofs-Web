import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Sparkles, MoveRight, ArrowRight } from 'lucide-react';
import { TRIANGULAR_PRESETS, TriangularPreset } from '../../data/triangularData';
import { computeTriangular, TriangularDot } from '../../utils/triangularMath';
import { MathView } from '../common/MathView';

interface Panel1Props {
  selectedPreset: TriangularPreset;
  onSelectPreset: (p: TriangularPreset) => void;
  n: number;
  setN: (n: number | ((prev: number) => number)) => void;
  interlockProgress: number;
  setInterlockProgress: (p: number | ((prev: number) => number)) => void;
  showTriangle1: boolean;
  showDuplicateTriangle: boolean;
  showRectBoundary: boolean;
  showDotCounts: boolean;
}

export const Panel1TriangularCanvas: React.FC<Panel1Props> = ({
  selectedPreset,
  onSelectPreset,
  n,
  setN,
  interlockProgress,
  setInterlockProgress,
  showTriangle1,
  showDuplicateTriangle,
  showRectBoundary,
  showDotCounts,
}) => {
  const [isGliding, setIsGliding] = useState(false);

  const DOT_SPACING = Math.max(26, Math.min(42, Math.floor(340 / (n + 2))));
  const evaluation = computeTriangular(n, interlockProgress, DOT_SPACING, 50, 45);

  useEffect(() => {
    let animFrame: number;
    if (isGliding) {
      const step = () => {
        setInterlockProgress(prev => {
          if (typeof prev === 'number' && prev >= 1) {
            setIsGliding(false);
            return 1;
          }
          const next = typeof prev === 'number' ? prev + 0.035 : 1;
          return Math.min(1, next);
        });
        animFrame = requestAnimationFrame(step);
      };
      animFrame = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animFrame);
  }, [isGliding, setInterlockProgress]);

  const SVG_WIDTH = 580;
  const SVG_HEIGHT = 400;

  return (
    <div className="bg-white rounded-3xl p-5 md:p-7 border border-sky-100/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800 font-sans">
              Triangular Dot Builder
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200/60">
              T_{n} = {evaluation.tn} Dots
            </span>
          </div>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Slide or glide the duplicate triangle to interlock them into a {n} × {n + 1} rectangle!
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          {TRIANGULAR_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => {
                onSelectPreset(preset);
                setN(preset.n);
                setInterlockProgress(1);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                n === preset.n
                  ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-sky-50 hover:text-sky-600'
              }`}
            >
              n = {preset.n}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas Display */}
      <div className="relative w-full aspect-[4/3] max-w-[620px] mx-auto bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-4 shadow-inner flex items-center justify-center overflow-hidden border border-sky-900/40">
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-full drop-shadow-2xl select-none"
        >
          <defs>
            <radialGradient id="blueDotGlow" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="70%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </radialGradient>

            <radialGradient id="amberDotGlow" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>

            <filter id="dotShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Rectangle Boundary Guide */}
          {showRectBoundary && interlockProgress > 0.8 && (
            <rect
              x={40}
              y={35}
              width={(n + 1) * DOT_SPACING}
              height={n * DOT_SPACING}
              rx={12}
              fill="rgba(56, 189, 248, 0.05)"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="5,5"
            />
          )}

          {/* Row Connection Lines for Triangle 1 */}
          {showTriangle1 && evaluation.rows.map(r => (
            <line
              key={`rowline-${r.row}`}
              x1={50}
              y1={45 + (r.row - 1) * DOT_SPACING}
              x2={50 + (r.row - 1) * DOT_SPACING}
              y2={45 + (r.row - 1) * DOT_SPACING}
              stroke="rgba(56, 189, 248, 0.25)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}

          {/* Triangle 1 Original Dots (Sky Blue) */}
          {showTriangle1 && evaluation.originalDots.map(dot => (
            <g key={dot.id}>
              <circle
                cx={dot.x}
                cy={dot.y}
                r={DOT_SPACING * 0.32}
                fill="url(#blueDotGlow)"
                filter="url(#dotShadow)"
                stroke="#7dd3fc"
                strokeWidth="1.2"
              />
            </g>
          ))}

          {/* Triangle 2 Duplicate Inverted Dots (Amber) */}
          {showDuplicateTriangle && evaluation.duplicateDots.map(dot => (
            <g key={dot.id}>
              <circle
                cx={dot.x}
                cy={dot.y}
                r={DOT_SPACING * 0.32}
                fill="url(#amberDotGlow)"
                filter="url(#dotShadow)"
                stroke="#fde68a"
                strokeWidth="1.2"
              />
            </g>
          ))}

          {/* Dimension Arrows */}
          {showRectBoundary && interlockProgress > 0.9 && (
            <>
              {/* Width label n + 1 */}
              <text
                x={40 + ((n + 1) * DOT_SPACING) / 2}
                y={25}
                fill="#38bdf8"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
              >
                Width = n + 1 = {n + 1} dots
              </text>

              {/* Height label n */}
              <text
                x={25}
                y={35 + (n * DOT_SPACING) / 2}
                fill="#fde047"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                transform={`rotate(-90 25 ${35 + (n * DOT_SPACING) / 2})`}
              >
                Height = n = {n}
              </text>
            </>
          )}
        </svg>

        {/* Floating Status Badge */}
        {showDotCounts && (
          <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-sky-500/30 text-white text-xs font-sans shadow-xl space-y-1">
            <div className="text-[10px] text-sky-300 font-bold uppercase tracking-wider">
              Triangular Sum T_{n}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-sky-400">
                {evaluation.tn}
              </span>
              <span className="text-[11px] text-slate-300">dots in triangle</span>
            </div>
            {interlockProgress > 0.9 && (
              <div className="text-[10px] text-amber-300 font-semibold border-t border-slate-700/60 pt-1 mt-1">
                Rectangle: {n} × {n + 1} = {evaluation.rectDots} dots (2 × T_{n})
              </div>
            )}
          </div>
        )}

        {/* Closed-Form Gauss Formula Badge */}
        <div className="absolute bottom-4 right-4 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-sky-500/30 text-white text-xs shadow-xl space-y-0.5">
          <div className="text-[10px] text-sky-300 font-semibold uppercase">Closed Formula</div>
          <div className="text-xs font-mono font-bold text-amber-300">
            T_{n} = n(n + 1) / 2 = {evaluation.tn}
          </div>
        </div>
      </div>

      {/* Interactive Glide & Parameter Sliders */}
      <div className="bg-sky-50/50 rounded-2xl p-4 border border-sky-100 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Row count slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 font-sans">
              <span>Row Count (n):</span>
              <span className="text-sky-600 bg-white px-2.5 py-0.5 rounded-lg border border-sky-200 shadow-2xs">
                n = {n}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="1"
              value={n}
              onChange={e => setN(parseInt(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-semibold px-0.5">
              <span>1</span>
              <span>3</span>
              <span>5</span>
              <span>8</span>
            </div>
          </div>

          {/* Interlocking Glide Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 font-sans">
              <span>Duplicate Interlock:</span>
              <span className="text-amber-600 bg-white px-2.5 py-0.5 rounded-lg border border-amber-200 shadow-2xs">
                {Math.round(interlockProgress * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={interlockProgress}
              onChange={e => {
                setInterlockProgress(parseFloat(e.target.value));
                setIsGliding(false);
              }}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-semibold px-0.5">
              <span>Separated</span>
              <span>Interlocked (n × (n+1))</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-sky-100/80">
          <button
            onClick={() => {
              setInterlockProgress(0);
              setIsGliding(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-sky-200"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Glide & Interlock Twins</span>
          </button>

          <button
            onClick={() => {
              setN(4);
              setInterlockProgress(1);
              setIsGliding(false);
            }}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};