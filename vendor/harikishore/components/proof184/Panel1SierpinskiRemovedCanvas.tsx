import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Layers, Info } from 'lucide-react';
import { SIERPINSKI_REMOVED_PRESETS, SierpinskiRemovedPreset } from '../../data/sierpinskiRemovedData';
import { computeSierpinskiRemoved, RemovedHole } from '../../utils/sierpinskiRemovedMath';
import { MathView } from '../common/MathView';

interface Panel1Props {
  selectedPreset: SierpinskiRemovedPreset;
  onSelectPreset: (p: SierpinskiRemovedPreset) => void;
  level: number;
  setLevel: (l: number | ((prev: number) => number)) => void;
  showNewHolesHighlight: boolean;
  showPreviousHoles: boolean;
  showFormulaTag: boolean;
  showCounts: boolean;
}

export const Panel1SierpinskiRemovedCanvas: React.FC<Panel1Props> = ({
  selectedPreset,
  onSelectPreset,
  level,
  setLevel,
  showNewHolesHighlight,
  showPreviousHoles,
  showFormulaTag,
  showCounts,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const CANVAS_SIZE = 450;
  const CARPET_SIZE = 380;
  const OFFSET_X = (CANVAS_SIZE - CARPET_SIZE) / 2;
  const OFFSET_Y = (CANVAS_SIZE - CARPET_SIZE) / 2;

  const evaluation = computeSierpinskiRemoved(level, CARPET_SIZE, OFFSET_X, OFFSET_Y);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        setLevel((prev: number) => {
          if (prev >= 4) return 1;
          return prev + 1;
        });
      }, 1800);
    }
    return () => clearInterval(timer);
  }, [isPlaying, setLevel]);

  return (
    <div className="bg-white rounded-3xl p-5 md:p-7 border border-violet-100/80 shadow-sm space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800 font-sans">
              Removed Square Visualizer
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-50 text-violet-700 border border-violet-200/60">
              Iteration Step {level}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Watch each surviving square sprout 1 new hole. Holes multiply by 8 at each successive step!
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          {SIERPINSKI_REMOVED_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => {
                onSelectPreset(preset);
                setLevel(preset.level);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                level === preset.level
                  ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-violet-50 hover:text-violet-600'
              }`}
            >
              Step {preset.level}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas Display */}
      <div className="relative w-full aspect-square max-w-[500px] mx-auto bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-4 shadow-inner flex items-center justify-center overflow-hidden border border-violet-900/40">
        <svg
          viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
          className="w-full h-full drop-shadow-2xl select-none"
        >
          <defs>
            <linearGradient id="carpetBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#6d28d9" />
              <stop offset="100%" stopColor="#5b21b6" />
            </linearGradient>

            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#f59e0b" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Solid Carpet Base */}
          <rect
            x={OFFSET_X}
            y={OFFSET_Y}
            width={CARPET_SIZE}
            height={CARPET_SIZE}
            rx={8}
            fill="url(#carpetBodyGrad)"
            stroke="#a78bfa"
            strokeWidth="2"
          />

          {/* Holes Display */}
          {evaluation.holes.map((hole, idx) => {
            if (!showPreviousHoles && !hole.isNew) return null;

            const isGold = hole.isNew && showNewHolesHighlight;
            const fill = isGold ? '#fef08a' : '#ffffff';
            const stroke = isGold ? '#f59e0b' : '#cbd5e1';
            const strokeWidth = hole.size > 20 ? (isGold ? 2 : 1) : (isGold ? 1 : 0.5);

            return (
              <rect
                key={`hole-${hole.level}-${idx}-${hole.x}-${hole.y}`}
                x={hole.x}
                y={hole.y}
                width={hole.size}
                height={hole.size}
                rx={hole.size > 20 ? 3 : 0}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                filter={isGold && hole.size > 10 ? 'url(#goldGlow)' : undefined}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        {/* Floating Cumulative Counter Card */}
        {showCounts && (
          <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-violet-500/30 text-white text-xs font-sans shadow-xl space-y-1">
            <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Step {level} New: +{evaluation.newHolesAtStepN.toLocaleString()}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-white">
                {evaluation.cumulativeHoles.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-300">total removed holes</span>
            </div>
          </div>
        )}

        {/* Floating Geometric Series Formula Badge */}
        {showFormulaTag && (
          <div className="absolute bottom-4 right-4 bg-slate-900/85 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-violet-500/30 text-white text-xs shadow-xl space-y-0.5">
            <div className="text-[10px] text-violet-300 font-semibold uppercase">Closed-Form Sum</div>
            <div className="text-xs font-mono font-bold text-amber-300">
              S_{level} = (8^{level} - 1) / 7 = {evaluation.cumulativeHoles}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls & Geometric Series Progression Bar */}
      <div className="bg-violet-50/50 rounded-2xl p-4 border border-violet-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 font-sans">
              <span>Step Level (n):</span>
              <span className="text-violet-600 bg-white px-2.5 py-0.5 rounded-lg border border-violet-200 shadow-2xs">
                n = {level}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              value={level}
              onChange={e => setLevel(parseInt(e.target.value))}
              className="w-full accent-violet-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-semibold px-0.5">
              <span>1 (1 Hole)</span>
              <span>2 (9 Holes)</span>
              <span>3 (73 Holes)</span>
              <span>4 (585 Holes)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-violet-600 hover:bg-violet-700 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Auto Step'}</span>
            </button>

            <button
              onClick={() => {
                setLevel(1);
                setIsPlaying(false);
              }}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80 transition-all"
              title="Reset to Step 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Geometric Progression Ledger Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-violet-100/70 text-center">
          {evaluation.steps.map((st, i) => (
            <div
              key={st.step}
              className={`rounded-xl p-2.5 border transition-all ${
                st.step === level
                  ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                  : 'bg-white text-slate-700 border-violet-100/70'
              }`}
            >
              <div className={`text-[10px] uppercase font-bold ${
                st.step === level ? 'text-violet-200' : 'text-slate-400'
              }`}>
                Step {st.step}: +8^{st.step - 1}
              </div>
              <div className="text-sm font-extrabold mt-0.5">
                +{st.newHolesCount} holes
              </div>
              <div className={`text-[10px] font-semibold mt-0.5 ${
                st.step === level ? 'text-amber-200' : 'text-violet-600'
              }`}>
                Total: {st.cumulativeHoles}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};