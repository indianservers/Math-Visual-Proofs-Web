import React, { useState } from 'react';
import { 
  Move, 
  RotateCw, 
  FlipHorizontal, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  RefreshCw,
  Layers
} from 'lucide-react';
import { TILES_DATA, TILES_LIST, TileDefinition } from '../../data/tessellationsData';
import { 
  getHexagonPath, 
  getEquilateralTrianglePath, 
  getPentagonPath, 
  generateHexTessellation, 
  generateSquareTessellation,
  PlacedTile 
} from '../../utils/tessellationsMath';
import { sound } from '../../utils/sound';

interface Panel1Props {
  selectedTile: TileDefinition;
  onSelectTile: (tile: TileDefinition) => void;
  showGrid: boolean;
  showAngles: boolean;
  showGaps: boolean;
  snapEnabled: boolean;
  tileCount: number;
  setTileCount: (count: number | ((prev: number) => number)) => void;
  transformMode: 'translate' | 'rotate' | 'reflect';
  setTransformMode: (mode: 'translate' | 'rotate' | 'reflect') => void;
}

export const Panel1TessellationCanvas: React.FC<Panel1Props> = ({
  selectedTile,
  onSelectTile,
  showGrid,
  showAngles,
  showGaps,
  snapEnabled,
  tileCount,
  setTileCount,
  transformMode,
  setTransformMode,
}) => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [hoverAngle, setHoverAngle] = useState<number | null>(null);
  const [isSymmetryMode, setIsSymmetryMode] = useState(false);

  const handleSelectTile = (tile: TileDefinition) => {
    sound.playClick();
    onSelectTile(tile);
    setTileCount(3);
    setRotationAngle(0);
  };

  const handleAddTile = () => {
    sound.playSnap();
    setTileCount(prev => Math.min(prev + 1, 12));
  };

  const handleResetTiles = () => {
    sound.playClick();
    setTileCount(selectedTile.tilesAtVertex);
    setRotationAngle(0);
  };

  // Calculate polygon vertices for a regular polygon
  const getPolygonVertices = (cx: number, cy: number, radius: number, sides: number, rotation: number = 0) => {
    const vertices = [];
    for (let i = 0; i < sides; i++) {
      const angle = (2 * Math.PI * i) / sides + rotation - Math.PI / 2;
      vertices.push({
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      });
    }
    return vertices;
  };

  // Check if a line through center at given angle divides polygon symmetrically
  const isSymmetryLine = (angle: number, sides: number) => {
    if (sides % 2 === 0) {
      // Even-sided polygons have symmetry lines through vertices and edge midpoints
      const angleNormalized = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const vertexAngle = (2 * Math.PI) / sides;
      // Check if angle aligns with vertex or edge midpoint
      const isVertexAligned = Math.abs(angleNormalized % vertexAngle) < 0.1 || 
                            Math.abs(angleNormalized % vertexAngle - vertexAngle) < 0.1;
      const isEdgeAligned = Math.abs(angleNormalized % vertexAngle - vertexAngle / 2) < 0.1 ||
                           Math.abs(angleNormalized % vertexAngle - vertexAngle * 1.5) < 0.1;
      return isVertexAligned || isEdgeAligned;
    } else {
      // Odd-sided polygons only have symmetry lines through vertices
      const angleNormalized = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const vertexAngle = (2 * Math.PI) / sides;
      return Math.abs(angleNormalized % vertexAngle) < 0.1 || 
             Math.abs(angleNormalized % vertexAngle - vertexAngle) < 0.1;
    }
  };

  // Handle mouse move for symmetry line hover
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isSymmetryMode) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const centerX = 140;
    const centerY = 120;
    const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
    setHoverAngle(angle);
  };

  const handleMouseLeave = () => {
    setHoverAngle(null);
  };

  // Render tile geometry based on current selected shape
  const renderTessellationBoard = () => {
    const originX = 140;
    const originY = 120;

    if (selectedTile.id === 'hexagon') {
      const r = 38;
      const w = Math.sqrt(3) * r;
      const h = 1.5 * r;
      // 3 hexagons meeting around central vertex
      const hexCoords = [
        { cx: originX - w / 2, cy: originY - h / 3, rot: 0 },
        { cx: originX + w / 2, cy: originY - h / 3, rot: 0 },
        { cx: originX, cy: originY + (2 * h) / 3, rot: 0 },
        { cx: originX - w, cy: originY + (2 * h) / 3, rot: 0 },
        { cx: originX + w, cy: originY + (2 * h) / 3, rot: 0 },
        { cx: originX, cy: originY - (4 * h) / 3, rot: 0 },
      ];

      return hexCoords.slice(0, tileCount).map((hc, idx) => (
        <path
          key={idx}
          d={getHexagonPath(hc.cx, hc.cy, r)}
          fill={selectedTile.fillColor}
          stroke={selectedTile.strokeColor}
          strokeWidth="2"
          className="transition-all duration-300"
        />
      ));
    }

    if (selectedTile.id === 'square') {
      const s = 60;
      const sqCoords = [
        { cx: originX - s / 2, cy: originY - s / 2 },
        { cx: originX + s / 2, cy: originY - s / 2 },
        { cx: originX + s / 2, cy: originY + s / 2 },
        { cx: originX - s / 2, cy: originY + s / 2 },
        { cx: originX + 1.5 * s, cy: originY - s / 2 },
        { cx: originX - 1.5 * s, cy: originY - s / 2 },
      ];

      return sqCoords.slice(0, tileCount).map((sc, idx) => (
        <rect
          key={idx}
          x={sc.cx - s / 2}
          y={sc.cy - s / 2}
          width={s}
          height={s}
          fill={selectedTile.fillColor}
          stroke={selectedTile.strokeColor}
          strokeWidth="2"
          className="transition-all duration-300"
        />
      ));
    }

    if (selectedTile.id === 'triangle') {
      const s = 70;
      const triCoords = [
        { cx: originX, cy: originY - 20, rot: 0 },
        { cx: originX, cy: originY - 20, rot: 60 },
        { cx: originX, cy: originY - 20, rot: 120 },
        { cx: originX, cy: originY - 20, rot: 180 },
        { cx: originX, cy: originY - 20, rot: 240 },
        { cx: originX, cy: originY - 20, rot: 300 },
      ];

      return triCoords.slice(0, tileCount).map((tc, idx) => (
        <path
          key={idx}
          d={getEquilateralTrianglePath(tc.cx, tc.cy, s, tc.rot)}
          fill={selectedTile.fillColor}
          stroke={selectedTile.strokeColor}
          strokeWidth="1.8"
          className="transition-all duration-300"
        />
      ));
    }

    if (selectedTile.id === 'pentagon') {
      const r = 42;
      // 3 pentagons clustered around vertex
      const pentCoords = [
        { cx: originX - 32, cy: originY - 24, rot: -18 },
        { cx: originX + 32, cy: originY - 24, rot: 54 },
        { cx: originX, cy: originY + 44, rot: 126 },
      ];

      return pentCoords.slice(0, tileCount).map((pc, idx) => (
        <path
          key={idx}
          d={getPentagonPath(pc.cx, pc.cy, r, pc.rot)}
          fill={selectedTile.fillColor}
          stroke={selectedTile.strokeColor}
          strokeWidth="2"
          className="transition-all duration-300"
        />
      ));
    }

    // Default Octagon / Other
    return (
      <polygon
        points="140,40 185,40 217,72 217,117 185,149 140,149 108,117 108,72"
        fill={selectedTile.fillColor}
        stroke={selectedTile.strokeColor}
        strokeWidth="2"
      />
    );
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-emerald-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            1
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Repeat, Transform, Test
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Repeat tiles across the grid. Observe whether vertex angles sum to exactly 360°.
        </p>
      </div>

      {/* Main Interactive Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center py-2">
        {/* Left Source Tile & Transformation Modes */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-3">
          <div className="w-44 h-44 rounded-2xl bg-emerald-50/40 border border-emerald-100/80 flex flex-col items-center justify-center relative p-3 shadow-inner">
            <svg className="w-28 h-28" viewBox="0 0 100 100">
              <polygon
                points={
                  selectedTile.id === 'triangle'
                    ? '50,15 90,85 10,85'
                    : selectedTile.id === 'square'
                    ? '20,20 80,20 80,80 20,80'
                    : selectedTile.id === 'pentagon'
                    ? '50,15 88,43 73,85 27,85 12,43'
                    : selectedTile.id === 'hexagon'
                    ? '50,15 85,35 85,75 50,95 15,75 15,35'
                    : '50,15 78,24 88,50 78,76 50,85 22,76 12,50 22,24'
                }
                fill={selectedTile.fillColor}
                stroke={selectedTile.strokeColor}
                strokeWidth="2.5"
              />
            </svg>
            <div className="text-center mt-1">
              <span className="text-[11px] font-bold text-slate-800 block font-mono">
                θ = {selectedTile.interiorAngle}°
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Interior Angle</span>
            </div>
          </div>

          {/* Transformation Mode Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
            {(['translate', 'rotate', 'reflect'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  sound.playClick();
                  setTransformMode(mode);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all ${
                  transformMode === mode
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Symmetry Mode Toggle */}
          {selectedTile.isRegular && (
            <button
              onClick={() => {
                sound.playClick();
                setIsSymmetryMode(!isSymmetryMode);
                setHoverAngle(null);
              }}
              className={`w-full py-2 rounded-xl text-[10px] font-bold transition-all border ${
                isSymmetryMode
                  ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isSymmetryMode ? '🎯 Symmetry Mode ON' : '🎯 Test Line Symmetry'}
            </button>
          )}
        </div>

        {/* Middle / Right Tessellation Active Board */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[420px] h-[240px] rounded-2xl bg-emerald-50/20 border border-emerald-100 shadow-sm overflow-hidden flex items-center justify-center select-none">
            <svg 
              className="w-full h-full" 
              viewBox="0 0 280 240"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Background Grid */}
              {showGrid && (
                <g stroke="#e2e8f0" strokeWidth="1" opacity="0.6">
                  {[20, 60, 100, 140, 180, 220, 260].map(x => (
                    <line key={`gx-${x}`} x1={x} y1="0" x2={x} y2="240" />
                  ))}
                  {[20, 60, 100, 140, 180, 220].map(y => (
                    <line key={`gy-${y}`} x1="0" y1={y} x2={280} y2={y} />
                  ))}
                </g>
              )}

              {/* Placed Tessellated Tiles */}
              {renderTessellationBoard()}

              {/* Central Shared Vertex Node Marker */}
              <circle cx="140" cy="120" r="5" fill="#059669" stroke="#ffffff" strokeWidth="2" />

              {/* Gap Warning Wedge (e.g. for Pentagon 36 deg gap) */}
              {showGaps && selectedTile.gapOrOverlap > 0 && selectedTile.id === 'pentagon' && (
                <g>
                  <path
                    d="M 140 120 L 175 108 A 40 40 0 0 1 170 144 Z"
                    fill="rgba(239, 68, 68, 0.45)"
                    stroke="#dc2626"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                    className="animate-pulse"
                  />
                  <text x="180" y="128" fill="#dc2626" fontSize="10" fontWeight="bold">
                    36° Gap
                  </text>
                </g>
              )}

              {/* Perfect 360° Angle Ring for Valid Tessellations */}
              {showAngles && selectedTile.canTessellateRegularly && (
                <g>
                  <circle
                    cx="140"
                    cy="120"
                    r="24"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  <text x="140" y="90" textAnchor="middle" fill="#059669" fontSize="9" fontWeight="bold">
                    ∑ θ = 360°
                  </text>
                </g>
              )}

              {/* Symmetry Line Visualization */}
              {isSymmetryMode && hoverAngle !== null && selectedTile.isRegular && (
                <g>
                  {/* Calculate line endpoints */}
                  {(() => {
                    const centerX = 140;
                    const centerY = 120;
                    const lineLength = 180;
                    const x1 = centerX - lineLength * Math.cos(hoverAngle);
                    const y1 = centerY - lineLength * Math.sin(hoverAngle);
                    const x2 = centerX + lineLength * Math.cos(hoverAngle);
                    const y2 = centerY + lineLength * Math.sin(hoverAngle);
                    
                    const isSymmetric = isSymmetryLine(hoverAngle, selectedTile.sides);
                    const lineColor = isSymmetric ? '#22c55e' : '#ef4444'; // green if symmetric, red otherwise
                    
                    return (
                      <>
                        {/* Symmetry line */}
                        <line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={lineColor}
                          strokeWidth="3"
                          strokeDasharray="8 4"
                          opacity={0.8}
                        />
                        {/* Center point */}
                        <circle cx={centerX} cy={centerY} r="6" fill={lineColor} stroke="#ffffff" strokeWidth="2" />
                        {/* Status indicator */}
                        <text 
                          x={centerX + 10} 
                          y={centerY - 10} 
                          fill={lineColor} 
                          fontSize="11" 
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          {isSymmetric ? '✓ Symmetric' : '✗ Not Symmetric'}
                        </text>
                      </>
                    );
                  })()}
                </g>
              )}
            </svg>

            {/* Live Verdict Banner on Board */}
            <div className="absolute top-2 right-2">
              {selectedTile.canTessellateRegularly ? (
                <span className="px-2.5 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-bold shadow-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Perfect Tessellation (360°)</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-rose-500 text-white rounded-full text-[10px] font-bold shadow-md flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Cannot Tessellate ({selectedTile.gapOrOverlap}° Gap)</span>
                </span>
              )}
            </div>

            {/* Repetition Count Badge */}
            <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-lg border border-emerald-100 text-[10px] font-mono font-bold text-slate-700 shadow-sm">
              Tiles = {tileCount} | Angle Sum = {Math.min(tileCount * selectedTile.interiorAngle, 360)}°
            </div>
          </div>

          {/* Quick Repeat & Add Controls */}
          <div className="flex items-center gap-2 mt-2.5 w-full max-w-[420px]">
            <button
              onClick={handleAddTile}
              disabled={tileCount >= 8}
              className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 border border-emerald-200 disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Repeated Tile</span>
            </button>
            <button
              onClick={handleResetTiles}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold border border-slate-200 shadow-sm transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Tile Selector Palette */}
      <div className="pt-3 border-t border-emerald-50/80">
        <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
          {TILES_LIST.map((tile) => {
            const isSelected = selectedTile.id === tile.id;
            return (
              <button
                key={tile.id}
                onClick={() => handleSelectTile(tile)}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl min-w-[80px] sm:min-w-[90px] transition-all border ${
                  isSelected
                    ? 'bg-emerald-50/90 border-emerald-400 shadow-sm font-bold scale-105'
                    : 'bg-white hover:bg-slate-50 border-slate-200/70 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="w-7 h-7 flex items-center justify-center mb-1">
                  <svg className="w-6 h-6" viewBox="0 0 40 40">
                    <polygon
                      points={tile.previewPoints}
                      fill={tile.fillColor}
                      stroke={tile.strokeColor}
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <span className={`text-[10px] leading-tight text-center ${isSelected ? 'text-emerald-950 font-bold' : 'text-slate-600'}`}>
                  {tile.name}
                </span>
                <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                  {tile.interiorAngle}°
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
