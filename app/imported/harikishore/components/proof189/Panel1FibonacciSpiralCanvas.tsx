import React, { useState } from 'react';
import { computeFibonacciSpiral } from '../../utils/fibonacciSpiralMath';
import { SPIRAL_PRESETS, SpiralPreset, GOLDEN_RATIO } from '../../data/fibonacciSpiralData';
import { Sparkles, ZoomIn, ZoomOut, RotateCcw, Compass } from 'lucide-react';

interface Panel1Props {
  n: number;
  setN: (n: number | ((prev: number) => number)) => void;
  selectedPreset: SpiralPreset;
  setSelectedPreset: (p: SpiralPreset) => void;
  showSpiralCurve: boolean;
  showTilingBoxes: boolean;
  showRatioTag: boolean;
  showArcCenters: boolean;
}

export const Panel1FibonacciSpiralCanvas: React.FC<Panel1Props> = ({
  n,
  setN,
  selectedPreset,
  setSelectedPreset,
  showSpiralCurve,
  showTilingBoxes,
  showRatioTag,
  showArcCenters,
}) => {
  const [hoveredArc, setHoveredArc] = useState<number | null>(null);
  const [zoom, setZoom] = useState<number>(1);

  const evalResult = computeFibonacciSpiral(n);
  const { tiling, arcs, currentRatio, currentError, fullSpiralPath } = evalResult;
  const { squares, viewBox } = tiling;

  const pad = 3.0;
  const vbX = viewBox.minX - pad;
  const vbW = viewBox.width + pad * 2;
  const vbH = viewBox.height + pad * 2;

  const toSvgY = (y: number, size: number) => -(y + size);
  const minSvgY = -(viewBox.minY + viewBox.height) - pad;
  const svgViewBox = `${vbX} ${minSvgY} ${vbW} ${vbH}`;

  return (
    <div className="bg-white rounded-3xl border border-amber-100/80 shadow-sm p-5 md:p-6 flex flex-col gap-4">
      {/* Header controls & Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-black text-xs">
            1
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-sans">
              Golden Spiral Arc Tracer
            </h2>
            <p className="text-xs text-slate-500 font-medium font-sans">
              {arcs.length} Connected Quarter Arcs · Outer Box {tiling.rectWidth} × {tiling.rectHeight}
            </p>
          </div>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {SPIRAL_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedPreset(preset);
                setN(preset.n);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                selectedPreset.id === preset.id && n === preset.n
                  ? 'bg-amber-600 text-white shadow-xs'
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
      <div className="bg-amber-50/50 rounded-2xl p-3 border border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
            Spiral Expansion (n):
          </span>
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white border border-amber-300 font-mono font-bold text-amber-700 text-sm shadow-xs">
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
            className="flex-1 h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
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
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-2xl overflow-hidden shadow-inner border border-slate-800 flex items-center justify-center min-h-[400px] p-2">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(#f59e0b 1px, transparent 1px), radial-gradient(#f59e0b 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        />

        {/* Floating Zoom Controls */}
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
          className="w-full h-full max-h-[480px] select-none transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoom})` }}
        >
          <defs>
            <linearGradient id="spiralGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <filter id="spiralShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="0.4" floodColor="#f59e0b" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Fibonacci Tiling Boxes */}
          {showTilingBoxes &&
            squares.map(sq => {
              const isHovered = hoveredArc === sq.index;
              const svgY = toSvgY(sq.y, sq.size);
              return (
                <g key={sq.index}>
                  <rect
                    x={sq.x}
                    y={svgY}
                    width={sq.size}
                    height={sq.size}
                    fill={sq.color}
                    fillOpacity={isHovered ? 0.35 : 0.18}
                    stroke="#ffffff"
                    strokeOpacity={0.4}
                    strokeWidth={0.08}
                    rx={0.15}
                    className="transition-all duration-200"
                  />
                  <text
                    x={sq.x + sq.size / 2}
                    y={svgY + sq.size / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#cbd5e1"
                    fontSize={Math.min(1.2, Math.max(0.35, sq.size * 0.24))}
                    fontWeight="bold"
                    opacity={0.7}
                  >
                    {sq.fibValue}
                  </text>
                </g>
              );
            })}

          {/* Arc Center Points & Radius Lines */}
          {showArcCenters &&
            arcs.map(arc => (
              <g key={`center-${arc.index}`} pointerEvents="none">
                <line
                  x1={arc.centerX}
                  y1={-arc.centerY}
                  x2={arc.startX}
                  y2={-arc.startY}
                  stroke="#fbbf24"
                  strokeWidth={0.06}
                  strokeDasharray="0.3 0.2"
                  opacity={0.6}
                />
                <circle
                  cx={arc.centerX}
                  cy={-arc.centerY}
                  r={0.18}
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth={0.06}
                />
              </g>
            ))}

          {/* Spiral Quarter Arcs */}
          {showSpiralCurve &&
            arcs.map(arc => {
              const isHovered = hoveredArc === arc.index;
              // Map math Y to SVG Y: invert Y coordinate in path
              const flippedPath = `M ${arc.startX} ${-arc.startY} A ${arc.radius} ${arc.radius} 0 0 1 ${arc.endX} ${-arc.endY}`;

              return (
                <path
                  key={`arc-${arc.index}`}
                  d={flippedPath}
                  fill="none"
                  stroke={isHovered ? '#ffffff' : 'url(#spiralGlow)'}
                  strokeWidth={isHovered ? 0.35 : 0.22}
                  strokeLinecap="round"
                  filter="url(#spiralShadow)"
                  onMouseEnter={() => setHoveredArc(arc.index)}
                  onMouseLeave={() => setHoveredArc(null)}
                  className="cursor-pointer transition-all duration-200"
                />
              );
            })}

          {/* Tracer glowing point on the tip of the latest arc */}
          {arcs.length > 0 && showSpiralCurve && (
            <g pointerEvents="none">
              <circle
                cx={arcs[arcs.length - 1].endX}
                cy={-arcs[arcs.length - 1].endY}
                r={0.35}
                fill="#ffffff"
                stroke="#f59e0b"
                strokeWidth={0.12}
                className="animate-pulse"
              />
              <circle
                cx={arcs[arcs.length - 1].endX}
                cy={-arcs[arcs.length - 1].endY}
                r={0.6}
                fill="none"
                stroke="#fbbf24"
                strokeWidth={0.06}
                opacity={0.8}
              />
            </g>
          )}
        </svg>

        {/* Hover inspection badge */}
        {hoveredArc && (
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md text-slate-100 px-3 py-2 rounded-xl text-xs border border-slate-700 shadow-lg flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-amber-400" />
            <div>
              <p className="font-bold">
                Arc #{hoveredArc}: Radius r = {arcs[hoveredArc - 1]?.radius}
              </p>
              <p className="text-[11px] text-slate-300">
                Quarter circle inside {arcs[hoveredArc - 1]?.radius} × {arcs[hoveredArc - 1]?.radius} box
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Golden Ratio Convergence Tag */}
      {showRatioTag && (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border border-amber-200 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Ratio Convergence to Golden Section (f)
              </div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">
                Current step {n}: F_{n+1} / F_n = {currentRatio.toFixed(4)} · Deviation from f: {currentError.toFixed(4)}
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-amber-200 font-mono text-xs font-bold text-amber-900 shadow-xs text-center">
            f = (1 + v5) / 2  {GOLDEN_RATIO.toFixed(6)}
          </div>
        </div>
      )}
    </div>
  );
};
