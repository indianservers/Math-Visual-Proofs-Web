import React, { useState } from 'react';
import { computeFibonacciTiling, FIB_NUMBERS } from '../../utils/fibonacciTilingMath';
import { FIBONACCI_PRESETS, FibonacciPreset } from '../../data/fibonacciTilingData';
import { Sparkles, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface Panel1Props {
  n: number;
  setN: (n: number | ((prev: number) => number)) => void;
  selectedPreset: FibonacciPreset;
  setSelectedPreset: (p: FibonacciPreset) => void;
  showSquareLabels: boolean;
  showEdgeBrackets: boolean;
  showBoundingRect: boolean;
  showAreaFormula: boolean;
}

export const Panel1FibonacciTilingCanvas: React.FC<Panel1Props> = ({
  n,
  setN,
  selectedPreset,
  setSelectedPreset,
  showSquareLabels,
  showEdgeBrackets,
  showBoundingRect,
  showAreaFormula,
}) => {
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);
  const [zoom, setZoom] = useState<number>(1);

  const evalResult = computeFibonacciTiling(n);
  const { squares, viewBox, rectWidth, rectHeight, currentFn, currentFnPlus1, sumOfSquares, totalRectArea } = evalResult;

  const pad = 2.5;
  const vbX = viewBox.minX - pad;
  const vbW = viewBox.width + pad * 2;
  const vbH = viewBox.height + pad * 2;

  const toSvgY = (y: number, size: number) => -(y + size);
  const minSvgY = -(viewBox.minY + viewBox.height) - pad;
  const svgViewBox = `${vbX} ${minSvgY} ${vbW} ${vbH}`;

  return (
    <div className="bg-white rounded-3xl border border-emerald-100/80 shadow-sm p-5 md:p-6 flex flex-col gap-4">
      {/* Header controls & Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs">
            1
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-sans">
              Interactive Fibonacci Tiling Board
            </h2>
            <p className="text-xs text-slate-500 font-medium font-sans">
              Step {n} of 7: Bounding Box is {rectWidth} × {rectHeight} (Area = {totalRectArea})
            </p>
          </div>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {FIBONACCI_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedPreset(preset);
                setN(preset.n);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                selectedPreset.id === preset.id && n === preset.n
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title={preset.description}
            >
              n={preset.n} ({preset.name.split(':')[0]})
            </button>
          ))}
        </div>
      </div>

      {/* Main interactive slider */}
      <div className="bg-emerald-50/50 rounded-2xl p-3 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
            Add Squares (n):
          </span>
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white border border-emerald-300 font-mono font-bold text-emerald-700 text-sm shadow-xs">
            {n}
          </span>
        </div>

        <div className="flex-1 w-full max-w-md flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">1</span>
          <input
            type="range"
            min={1}
            max={7}
            step={1}
            value={n}
            onChange={e => setN(Number(e.target.value))}
            className="flex-1 h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <span className="text-xs font-semibold text-slate-500">7</span>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => setN(prev => Math.max(1, (prev as number) - 1))}
            disabled={n <= 1}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50"
          >
            -1
          </button>
          <button
            onClick={() => setN(prev => Math.min(7, (prev as number) + 1))}
            disabled={n >= 7}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50"
          >
            +1
          </button>
          <button
            onClick={() => {
              setN(1);
              setZoom(1);
            }}
            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            title="Reset Board"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-2xl overflow-hidden shadow-inner border border-slate-800 flex items-center justify-center min-h-[380px] p-2">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(#6ee7b7 1px, transparent 1px), radial-gradient(#6ee7b7 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px',
          }}
        />

        {/* Zoom controls floating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-800/80 backdrop-blur-md rounded-xl p-1 border border-slate-700 shadow-md z-10">
          <button
            onClick={() => setZoom(z => Math.max(0.6, z - 0.15))}
            className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono text-slate-300 px-1 font-semibold">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(z => Math.min(1.8, z + 0.15))}
            className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <svg
          viewBox={svgViewBox}
          className="w-full h-full max-h-[460px] select-none transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoom})` }}
        >
          <defs>
            <linearGradient id="boundingRectGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.35" />
            </linearGradient>
            <filter id="tileShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0.1" dy="0.2" stdDeviation="0.2" floodColor="#000000" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Bounding Rectangle Highlight */}
          {showBoundingRect && (
            <rect
              x={viewBox.minX}
              y={-(viewBox.minY + viewBox.height)}
              width={viewBox.width}
              height={viewBox.height}
              fill="url(#boundingRectGlow)"
              stroke="#34d399"
              strokeWidth={0.15}
              strokeDasharray="0.6 0.3"
              rx={0.3}
              className="transition-all duration-300"
            />
          )}

          {/* Render All Squares */}
          {squares.map(sq => {
            const isHovered = hoveredSquare === sq.index;
            const isLatest = sq.index === n;
            const svgY = toSvgY(sq.y, sq.size);

            return (
              <g
                key={sq.index}
                onMouseEnter={() => setHoveredSquare(sq.index)}
                onMouseLeave={() => setHoveredSquare(null)}
                className="cursor-pointer transition-all duration-200"
              >
                <rect
                  x={sq.x}
                  y={svgY}
                  width={sq.size}
                  height={sq.size}
                  fill={sq.color}
                  fillOpacity={isHovered ? 0.95 : isLatest ? 0.88 : 0.72}
                  stroke={isLatest ? '#ffffff' : '#0f172a'}
                  strokeWidth={isHovered ? 0.22 : isLatest ? 0.18 : 0.08}
                  rx={Math.min(0.25, sq.size * 0.06)}
                  filter="url(#tileShadow)"
                  className="transition-all duration-300"
                />

                {showSquareLabels && (
                  <g pointerEvents="none">
                    <text
                      x={sq.x + sq.size / 2}
                      y={svgY + sq.size / 2 - (sq.size > 2 ? 0.2 : 0)}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#ffffff"
                      fontSize={Math.min(1.4, Math.max(0.4, sq.size * 0.28))}
                      fontWeight="bold"
                      style={{
                        textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                        userSelect: 'none',
                      }}
                    >
                      F{sq.index} = {sq.fibValue}
                    </text>
                    {sq.size >= 3 && (
                      <text
                        x={sq.x + sq.size / 2}
                        y={svgY + sq.size / 2 + Math.min(1.1, sq.size * 0.22)}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#fef08a"
                        fontSize={Math.min(0.85, sq.size * 0.16)}
                        fontWeight="600"
                        style={{
                          textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                          userSelect: 'none',
                        }}
                      >
                        Area = {sq.fibValue}² = {sq.fibValue * sq.fibValue}
                      </text>
                    )}
                  </g>
                )}

                {showEdgeBrackets && isLatest && sq.index >= 3 && (
                  <g pointerEvents="none">
                    <rect
                      x={sq.x + 0.1}
                      y={svgY + 0.1}
                      width={sq.size - 0.2}
                      height={0.4}
                      fill="rgba(0,0,0,0.6)"
                      rx={0.2}
                    />
                    <text
                      x={sq.x + sq.size / 2}
                      y={svgY + 0.3}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#a7f3d0"
                      fontSize={Math.min(0.55, sq.size * 0.15)}
                      fontWeight="bold"
                    >
                      Side = {sq.fibValue} ({FIB_NUMBERS[sq.index - 2]} + {FIB_NUMBERS[sq.index - 3]})
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {showBoundingRect && (
            <g pointerEvents="none">
              <text
                x={viewBox.minX + viewBox.width / 2}
                y={-(viewBox.minY) + 0.9}
                textAnchor="middle"
                fill="#34d399"
                fontSize={Math.min(1.1, Math.max(0.5, viewBox.width * 0.07))}
                fontWeight="bold"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
              >
                Width = {rectWidth}
              </text>
              <text
                x={viewBox.minX - 0.6}
                y={-(viewBox.minY + viewBox.height / 2)}
                textAnchor="middle"
                fill="#38bdf8"
                fontSize={Math.min(1.1, Math.max(0.5, viewBox.height * 0.07))}
                fontWeight="bold"
                transform={`rotate(-90 ${viewBox.minX - 0.6} ${-(viewBox.minY + viewBox.height / 2)})`}
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
              >
                Height = {rectHeight}
              </text>
            </g>
          )}
        </svg>

        {hoveredSquare && (
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md text-slate-100 px-3 py-2 rounded-xl text-xs border border-slate-700 shadow-lg flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full inline-block"
              style={{ backgroundColor: squares[hoveredSquare - 1]?.color }}
            />
            <div>
              <p className="font-bold">
                Tile #{hoveredSquare}: Side F{hoveredSquare} = {squares[hoveredSquare - 1]?.fibValue}
              </p>
              <p className="text-[11px] text-slate-300">
                {squares[hoveredSquare - 1]?.adjacentFormula} · Area ={' '}
                {(squares[hoveredSquare - 1]?.fibValue ?? 1) ** 2}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Area Formula Banner */}
      {showAreaFormula && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Sum of Squared Fibonacci Numbers
              </div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">
                F1² + F2² + ... + F?² = F? × F??1
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-emerald-200 font-mono text-xs font-bold text-emerald-900 shadow-xs text-center">
            {evalResult.fibTerms.map(f => `${f}²`).join(' + ')} = {sumOfSquares} = {currentFn} × {currentFnPlus1}
          </div>
        </div>
      )}
    </div>
  );
};
