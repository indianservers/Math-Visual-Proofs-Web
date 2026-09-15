import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { ODD_SUM_PRESETS, OddSumPreset } from '../../data/oddSumData';
import { computeOddSum, OddSumEvaluation } from '../../utils/oddSumMath';
import { MathView } from '../common/MathView';

interface Panel1Props {
  selectedPreset: OddSumPreset;
  onSelectPreset: (p: OddSumPreset) => void;
  n: number;
  setN: (n: number | ((prev: number) => number)) => void;
  showSquareGrid: boolean;
  showLLayers: boolean;
  showOddLabels: boolean;
  showFormulaTag: boolean;
}

export const Panel1OddSumCanvas: React.FC<Panel1Props> = ({
  selectedPreset,
  onSelectPreset,
  n,
  setN,
  showSquareGrid,
  showLLayers,
  showOddLabels,
  showFormulaTag,
}) => {
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);

  // Step-by-step layer building animation
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isBuilding) {
      timer = setInterval(() => {
        setN(prev => {
          if (prev >= 6) {
            setIsBuilding(false);
            return 6;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isBuilding, setN]);

  const evalResult: OddSumEvaluation = useMemo(() => {
    return computeOddSum(n);
  }, [n]);

  const blockSize = useMemo(() => {
    return n <= 4 ? 36 : n <= 6 ? 28 : 24;
  }, [n]);

  const svgWidth = 440;
  const svgHeight = 270;
  const originX = 65;
  const originY = 35;

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-amber-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            1
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Square Built from Odd L-Shaped Layers (Gnomons)
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Each odd number wraps around the previous square as an L-shaped shell. Adding layer k adds 2k - 1 blocks.
        </p>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center py-1">
        {/* Left Information Card */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-2.5">
          <div className="bg-amber-50/40 rounded-2xl p-4 border border-amber-100 shadow-inner w-full max-w-[220px] space-y-3">
            <div className="text-[10px] font-bold text-amber-900 uppercase tracking-wider text-center">
              Square Size (n)
            </div>

            {/* Slider: n layers */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>Layers Count:</span>
                <span className="font-mono font-bold text-amber-700">{n}</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                step="1"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Auto Build Button */}
            <div className="flex items-center gap-1.5 pt-1">
              <button
                onClick={() => {
                  if (n >= 6) setN(1);
                  setIsBuilding(!isBuilding);
                }}
                className="flex-1 py-1.5 px-2.5 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold rounded-xl shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-1"
              >
                {isBuilding ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-white" />}
                <span>{n >= 6 ? 'Replay Build' : isBuilding ? 'Pause' : 'Auto Layer'}</span>
              </button>
              <button
                onClick={() => {
                  setIsBuilding(false);
                  setN(1);
                }}
                className="p-1.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200"
                title="Reset to 1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sum Readout */}
            <div className="p-2 bg-white rounded-xl border border-amber-200 text-center space-y-1 shadow-sm">
              <div className="text-[10px] text-slate-500 font-medium">Sum of First {n} Odds:</div>
              <MathView
                math={`1 + 3 + \\dots + ${2 * n - 1} = ${evalResult.totalSum}`}
                className="text-amber-950 font-bold text-xs block"
              />
              <div className="text-[10px] text-emerald-700 font-mono font-semibold">
                Square = {n}² = {evalResult.totalSum} blocks
              </div>
            </div>
          </div>
        </div>

        {/* Middle / Right Interactive Canvas */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[440px] h-[270px] rounded-2xl bg-gradient-to-br from-slate-50 to-amber-50/20 border border-amber-100 shadow-sm overflow-hidden flex flex-col items-center justify-between p-2 select-none">
            <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
              {/* Grid Background */}
              {showSquareGrid && (
                <rect
                  x={originX - 4}
                  y={originY - 4}
                  width={n * blockSize + 8}
                  height={n * blockSize + 8}
                  fill="rgba(245, 158, 11, 0.03)"
                  stroke="#fcd34d"
                  strokeWidth="1.5"
                  rx="8"
                />
              )}

              {/* Render Blocks */}
              {evalResult.blocks.map((b) => {
                const isHovered = hoveredLayer === b.layer;
                const isLayerActive = showLLayers;
                const bx = originX + b.col * blockSize;
                // Render with (0,0) at bottom-left or top-left (let's do top-left coordinate origin)
                const by = originY + b.row * blockSize;

                return (
                  <g
                    key={b.id}
                    onMouseEnter={() => setHoveredLayer(b.layer)}
                    onMouseLeave={() => setHoveredLayer(null)}
                    className="cursor-pointer transition-transform duration-150"
                  >
                    <rect
                      x={bx + 1.5}
                      y={by + 1.5}
                      width={blockSize - 3}
                      height={blockSize - 3}
                      rx="4"
                      fill={isLayerActive ? b.color : '#cbd5e1'}
                      stroke={isHovered ? '#000000' : 'rgba(255,255,255,0.7)'}
                      strokeWidth={isHovered ? 2 : 1}
                      opacity={hoveredLayer === null || isHovered ? 1 : 0.4}
                    />
                    {b.isCorner && (
                      <circle
                        cx={bx + blockSize / 2}
                        cy={by + blockSize / 2}
                        r={blockSize * 0.15}
                        fill="#ffffff"
                        opacity="0.8"
                      />
                    )}
                  </g>
                );
              })}

              {/* Count Tags for Each Layer */}
              {showOddLabels &&
                evalResult.layers.map((l) => {
                  const edge = l.layer - 1;
                  const tagX = originX + n * blockSize + 18;
                  const tagY = originY + edge * blockSize + blockSize / 2 + 4;
                  return (
                    <g key={`tag-${l.layer}`} className="animate-in fade-in">
                      <text
                        x={tagX}
                        y={tagY}
                        fill={l.color}
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        +{l.oddValue}
                      </text>
                    </g>
                  );
                })}

              {/* Top & Left Square Dimensions */}
              <text
                x={originX + (n * blockSize) / 2}
                y={originY - 12}
                fill="#78350f"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
              >
                Width = {n}
              </text>
              <text
                x={originX - 14}
                y={originY + (n * blockSize) / 2 + 4}
                fill="#78350f"
                fontSize="11"
                fontWeight="bold"
                textAnchor="end"
              >
                {n}
              </text>
            </svg>

            {/* Top Right Tag */}
            {showFormulaTag && (
              <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-amber-50/95 border border-amber-200 text-amber-900 px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>k-th Layer has (2k - 1) Blocks</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Presets Bar */}
      <div className="pt-2.5 border-t border-amber-50/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">Examples:</span>
          {ODD_SUM_PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  setN(preset.n);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm scale-105'
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
