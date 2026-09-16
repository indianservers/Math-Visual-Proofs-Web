import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Plus, Layers } from 'lucide-react';
import { SQUARE_ODD_LAYER_PRESETS, SquareOddLayerPreset } from '../../data/squareOddLayersData';
import { computeSquareOddLayers, OddLayerTile } from '../../utils/squareOddLayersMath';
import { MathView } from '../common/MathView';

interface Panel1Props {
  selectedPreset: SquareOddLayerPreset;
  onSelectPreset: (p: SquareOddLayerPreset) => void;
  n: number;
  setN: (n: number | ((prev: number) => number)) => void;
  showLLayers: boolean;
  showCornerBlocks: boolean;
  showPrevSquareOutline: boolean;
  showTileCounts: boolean;
}

export const Panel1SquareOddLayersCanvas: React.FC<Panel1Props> = ({
  selectedPreset,
  onSelectPreset,
  n,
  setN,
  showLLayers,
  showCornerBlocks,
  showPrevSquareOutline,
  showTileCounts,
}) => {
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null);
  const [isGrowing, setIsGrowing] = useState(false);

  const TILE_SIZE = Math.max(34, Math.min(54, Math.floor(340 / (n + 1))));
  const SVG_SIZE = 450;
  const ORIGIN_X = (SVG_SIZE - n * TILE_SIZE) / 2;
  const ORIGIN_Y = (SVG_SIZE - n * TILE_SIZE) / 2;

  const evaluation = computeSquareOddLayers(n, TILE_SIZE, ORIGIN_X, ORIGIN_Y);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isGrowing) {
      timer = setInterval(() => {
        setN(prev => {
          if (typeof prev === 'number') {
            if (prev >= 6) return 1;
            return prev + 1;
          }
          return 1;
        });
      }, 1400);
    }
    return () => clearInterval(timer);
  }, [isGrowing, setN]);

  const activeLayerInfo = hoveredLayer 
    ? evaluation.layers.find(l => l.layer === hoveredLayer) 
    : evaluation.layers[evaluation.layers.length - 1];

  return (
    <div className="bg-white rounded-3xl p-5 md:p-7 border border-amber-100/80 shadow-sm space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800 font-sans">
              Square Numbers from Odd Layers
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
              {n} × {n} = {evaluation.totalArea} Tiles
            </span>
          </div>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Notice how adding an L-layer of {2 * n - 1} tiles expands ({n - 1})² into {n}².
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          {SQUARE_ODD_LAYER_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => {
                onSelectPreset(preset);
                setN(preset.n);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                n === preset.n
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-amber-50 hover:text-amber-700'
              }`}
            >
              {preset.n} × {preset.n}
            </button>
          ))}
        </div>
      </div>

      {/* Main Visual Stage */}
      <div className="relative w-full aspect-square max-w-[500px] mx-auto bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-4 shadow-inner flex items-center justify-center overflow-hidden border border-amber-900/40">
        <svg
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className="w-full h-full drop-shadow-2xl select-none"
        >
          <defs>
            <filter id="tileGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Previous Square Outline (n-1)^2 */}
          {showPrevSquareOutline && n > 1 && (
            <rect
              x={ORIGIN_X}
              y={ORIGIN_Y}
              width={(n - 1) * TILE_SIZE}
              height={(n - 1) * TILE_SIZE}
              rx={6}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeDasharray="6,4"
            />
          )}

          {/* All Square Tiles */}
          {evaluation.tiles.map(tile => {
            const isHovered = hoveredLayer === tile.layer;
            const isLatest = tile.layer === n;
            const fill = showLLayers ? tile.color : (isLatest ? '#f59e0b' : '#64748b');
            const opacity = hoveredLayer !== null && !isHovered ? 0.35 : 1.0;

            return (
              <g
                key={tile.id}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredLayer(tile.layer)}
                onMouseLeave={() => setHoveredLayer(null)}
                style={{ opacity }}
              >
                <rect
                  x={tile.x + 1.5}
                  y={tile.y + 1.5}
                  width={tile.size - 3}
                  height={tile.size - 3}
                  rx={5}
                  fill={fill}
                  stroke={isHovered ? '#ffffff' : (tile.isCorner && showCornerBlocks ? '#fbbf24' : 'rgba(255,255,255,0.2)')}
                  strokeWidth={isHovered ? 2.5 : 1}
                  filter="url(#tileGlow)"
                />

                {/* Corner block visual distinction */}
                {showCornerBlocks && tile.isCorner && (
                  <circle
                    cx={tile.x + tile.size / 2}
                    cy={tile.y + tile.size / 2}
                    r={tile.size * 0.18}
                    fill="#ffffff"
                    stroke="#d97706"
                    strokeWidth="1.5"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Active Layer Badge */}
        {activeLayerInfo && (
          <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-amber-500/30 text-white text-xs font-sans shadow-xl space-y-1">
            <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Layer {activeLayerInfo.layer} Gnomon</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-amber-400">
                +{activeLayerInfo.oddValue} tiles
              </span>
              <span className="text-[11px] text-slate-300">(odd number {activeLayerInfo.oddValue})</span>
            </div>
            <div className="text-[10px] text-slate-400">
              1 Corner + 2 Arms of {activeLayerInfo.armLength} = 1 + {2 * activeLayerInfo.armLength} = {activeLayerInfo.oddValue}
            </div>
          </div>
        )}

        {/* Algebraic Difference Formula Badge */}
        <div className="absolute bottom-4 right-4 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-amber-500/30 text-white text-xs shadow-xl space-y-0.5">
          <div className="text-[10px] text-amber-300 font-semibold uppercase">Square Growth Identity</div>
          <div className="text-xs font-mono font-bold text-amber-200">
            {n}² - {n - 1}² = {2 * n - 1}
          </div>
        </div>
      </div>

      {/* Interactive Controls & Layer Ribbon */}
      <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 font-sans">
              <span>Square Size (n × n):</span>
              <span className="text-amber-700 bg-white px-2.5 py-0.5 rounded-lg border border-amber-200 shadow-2xs">
                n = {n} ({n}² = {evaluation.totalArea})
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="1"
              value={n}
              onChange={e => setN(parseInt(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-semibold px-0.5">
              <span>1 × 1 (1)</span>
              <span>3 × 3 (9)</span>
              <span>5 × 5 (25)</span>
              <span>8 × 8 (64)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsGrowing(!isGrowing)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isGrowing
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              {isGrowing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isGrowing ? 'Pause' : 'Auto Grow'}</span>
            </button>

            <button
              onClick={() => {
                setN(3);
                setIsGrowing(false);
              }}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Concentric Odd Number Summary */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-amber-100/80">
          <span className="text-[11px] font-bold text-slate-500 mr-1">Odd Layers:</span>
          {evaluation.layers.map(l => (
            <span
              key={l.layer}
              onMouseEnter={() => setHoveredLayer(l.layer)}
              onMouseLeave={() => setHoveredLayer(null)}
              className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all border cursor-pointer hover:scale-105"
              style={{
                backgroundColor: l.color + '20',
                color: l.color,
                borderColor: l.color + '60',
              }}
            >
              +{l.oddValue}
            </span>
          ))}
          <span className="text-xs font-bold text-amber-900 ml-auto">
            = {evaluation.totalArea}
          </span>
        </div>
      </div>
    </div>
  );
};