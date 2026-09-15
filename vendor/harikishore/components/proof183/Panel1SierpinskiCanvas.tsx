import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Sparkles, ZoomIn, Layers, Info } from 'lucide-react';
import { SIERPINSKI_PRESETS, SierpinskiPreset } from '../../data/sierpinskiData';
import { computeSierpinski, SierpinskiHole } from '../../utils/sierpinskiMath';
import { MathView } from '../common/MathView';

interface Panel1Props {
  selectedPreset: SierpinskiPreset;
  onSelectPreset: (p: SierpinskiPreset) => void;
  level: number;
  setLevel: (l: number | ((prev: number) => number)) => void;
  showHoles: boolean;
  showGridLines: boolean;
  showLabels: boolean;
  showFormulaTag: boolean;
}

export const Panel1SierpinskiCanvas: React.FC<Panel1Props> = ({
  selectedPreset,
  onSelectPreset,
  level,
  setLevel,
  showHoles,
  showGridLines,
  showLabels,
  showFormulaTag,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredHoleLevel, setHoveredHoleLevel] = useState<number | null>(null);

  const CANVAS_SIZE = 450;
  const CARPET_SIZE = 380;
  const OFFSET_X = (CANVAS_SIZE - CARPET_SIZE) / 2;
  const OFFSET_Y = (CANVAS_SIZE - CARPET_SIZE) / 2;

  const evaluation = computeSierpinski(level, CARPET_SIZE, OFFSET_X, OFFSET_Y);

  // Auto-play cycling levels from 0 to 4
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        setLevel((prev: number) => {
          if (prev >= 4) return 0;
          return prev + 1;
        });
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [isPlaying, setLevel]);

  const getHoleFill = (holeLevel: number) => {
    if (hoveredHoleLevel === holeLevel) return '#fef08a'; // yellow highlight
    return '#ffffff';
  };

  const getHoleBorder = (holeLevel: number) => {
    if (holeLevel === 1) return '#cbd5e1';
    if (holeLevel === 2) return '#e2e8f0';
    return 'none';
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-7 border border-indigo-100/80 shadow-sm space-y-6">
      {/* Top Bar: Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800 font-sans">
              Sierpinski Carpet Generator
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/50">
              Level {level}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Each step divides every solid square into 9 smaller squares and discards the 1 center square.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          {SIERPINSKI_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => {
                onSelectPreset(preset);
                setLevel(preset.level);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                level === preset.level
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              n = {preset.level}
            </button>
          ))}
        </div>
      </div>

      {/* Main Visual Stage */}
      <div className="relative w-full aspect-square max-w-[500px] mx-auto bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-4 shadow-inner flex items-center justify-center overflow-hidden border border-indigo-900/40">
        
        {/* SVG Drawing of the Carpet */}
        <svg
          viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
          className="w-full h-full drop-shadow-2xl select-none"
        >
          <defs>
            <linearGradient id="carpetSolidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#4338ca" />
            </linearGradient>

            <pattern id="gridSubPattern" width={CARPET_SIZE / 3} height={CARPET_SIZE / 3} patternUnits="userSpaceOnUse">
              <rect
                width={CARPET_SIZE / 3}
                height={CARPET_SIZE / 3}
                fill="none"
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            </pattern>
          </defs>

          {/* Solid Base Carpet Square */}
          <rect
            x={OFFSET_X}
            y={OFFSET_Y}
            width={CARPET_SIZE}
            height={CARPET_SIZE}
            rx={8}
            fill="url(#carpetSolidGrad)"
            stroke="#818cf8"
            strokeWidth="2"
          />

          {/* Optional 3x3 Grid Overlay */}
          {showGridLines && level > 0 && (
            <rect
              x={OFFSET_X}
              y={OFFSET_Y}
              width={CARPET_SIZE}
              height={CARPET_SIZE}
              fill="url(#gridSubPattern)"
              pointerEvents="none"
            />
          )}

          {/* Cutout Center Holes */}
          {showHoles && evaluation.holes.map((hole, idx) => (
            <rect
              key={`${hole.level}-${idx}-${hole.x}-${hole.y}`}
              x={hole.x}
              y={hole.y}
              width={hole.size}
              height={hole.size}
              rx={hole.size > 20 ? 3 : 0}
              fill={getHoleFill(hole.level)}
              stroke={getHoleBorder(hole.level)}
              strokeWidth={hole.level <= 2 ? 0.8 : 0}
              className="transition-all duration-300"
              onMouseEnter={() => setHoveredHoleLevel(hole.level)}
              onMouseLeave={() => setHoveredHoleLevel(null)}
            />
          ))}

          {/* Dimension Labels */}
          {showLabels && (
            <>
              <text
                x={CANVAS_SIZE / 2}
                y={OFFSET_Y - 12}
                fill="#c7d2fe"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
              >
                Base Width = 1.0 unit
              </text>
              <line
                x1={OFFSET_X}
                y1={OFFSET_Y - 6}
                x2={OFFSET_X + CARPET_SIZE}
                y2={OFFSET_Y - 6}
                stroke="#818cf8"
                strokeWidth="1.5"
              />
            </>
          )}
        </svg>

        {/* Floating Mathematical Status Card */}
        <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-indigo-500/30 text-white text-xs font-sans shadow-xl">
          <div className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">
            Iteration {level} Status
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-sm font-extrabold text-emerald-400">
              {evaluation.retainedAreaPercent}
            </span>
            <span className="text-[11px] text-slate-300">area retained</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            <span className="text-indigo-200 font-bold">{evaluation.retainedSquareCount.toLocaleString()}</span> micro-squares
          </div>
        </div>

        {/* Floating Formula Badge */}
        {showFormulaTag && (
          <div className="absolute bottom-4 right-4 bg-slate-900/85 backdrop-blur-md px-3 py-2 rounded-2xl border border-indigo-500/30 text-white text-xs shadow-xl">
            <div className="text-[10px] text-indigo-300 font-semibold uppercase">Area Formula</div>
            <div className="text-xs font-mono font-bold text-amber-300 mt-0.5">
              A_n = (8/9)ⁿ
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls & Slider */}
      <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 font-sans">
              <span>Iteration Level (n):</span>
              <span className="text-indigo-600 bg-white px-2.5 py-0.5 rounded-lg border border-indigo-200 shadow-2xs">
                n = {level}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={level}
              onChange={e => setLevel(parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-semibold px-0.5">
              <span>0 (Solid)</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4 (Fine Mesh)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Auto Step'}</span>
            </button>

            <button
              onClick={() => {
                setLevel(0);
                setIsPlaying(false);
              }}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80 transition-all"
              title="Reset to Solid Square"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Level Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-indigo-100/70 text-center">
          <div className="bg-white rounded-xl p-2.5 border border-indigo-100/60 shadow-2xs">
            <div className="text-[10px] uppercase font-bold text-slate-400">Kept Squares</div>
            <div className="text-sm font-extrabold text-indigo-700 mt-0.5">
              8^{level} = {Math.pow(8, level).toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-xl p-2.5 border border-indigo-100/60 shadow-2xs">
            <div className="text-[10px] uppercase font-bold text-slate-400">Each Size</div>
            <div className="text-sm font-extrabold text-indigo-700 mt-0.5">
              1 / {Math.pow(9, level).toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-xl p-2.5 border border-indigo-100/60 shadow-2xs">
            <div className="text-[10px] uppercase font-bold text-slate-400">Area Retained</div>
            <div className="text-sm font-extrabold text-emerald-600 mt-0.5">
              {evaluation.retainedAreaPercent}
            </div>
          </div>
          <div className="bg-white rounded-xl p-2.5 border border-indigo-100/60 shadow-2xs">
            <div className="text-[10px] uppercase font-bold text-slate-400">Void Area</div>
            <div className="text-sm font-extrabold text-rose-500 mt-0.5">
              {evaluation.removedAreaPercent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};