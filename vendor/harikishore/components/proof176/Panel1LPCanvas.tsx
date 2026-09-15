import React, { useMemo } from 'react';
import { 
  Layers, 
  Grid, 
  Maximize2 
} from 'lucide-react';
import { LP_PRESETS, LPPreset } from '../../data/lpData';
import { evaluateLPPreset, mathToSvg, LPEvaluation } from '../../utils/lpMath';
import { MathView } from '../common/MathView';

interface Panel1Props {
  selectedPreset: LPPreset;
  onSelectPreset: (p: LPPreset) => void;
  currentK: number;
  setCurrentK: (k: number) => void;
  showFeasibleRegion: boolean;
  showConstraints: boolean;
  showVertices: boolean;
  showObjectiveLine: boolean;
  snapEnabled: boolean;
}

export const Panel1LPCanvas: React.FC<Panel1Props> = ({
  selectedPreset,
  onSelectPreset,
  currentK,
  setCurrentK,
  showFeasibleRegion,
  showConstraints,
  showVertices,
  showObjectiveLine,
}) => {
  const evalResult: LPEvaluation = useMemo(() => {
    return evaluateLPPreset(selectedPreset, currentK);
  }, [selectedPreset, currentK]);

  const svgWidth = 420;
  const svgHeight = 250;
  const bounds = { minX: -0.5, maxX: 6.0, minY: -0.5, maxY: 5.5 };

  // Compute SVG polygon points for feasible region
  const polySvgPoints = selectedPreset.vertices
    .map((v) => {
      const sp = mathToSvg(v.x, v.y, bounds, svgWidth, svgHeight);
      return `${sp.x.toFixed(1)},${sp.y.toFixed(1)}`;
    })
    .join(' ');

  // Objective line coordinates
  const p1Screen = mathToSvg(evalResult.objectiveLinePoints.p1.x, evalResult.objectiveLinePoints.p1.y, bounds, svgWidth, svgHeight);
  const p2Screen = mathToSvg(evalResult.objectiveLinePoints.p2.x, evalResult.objectiveLinePoints.p2.y, bounds, svgWidth, svgHeight);

  // Extend line across canvas
  const dx = p2Screen.x - p1Screen.x;
  const dy = p2Screen.y - p1Screen.y;
  const extP1 = { x: p1Screen.x - dx * 2, y: p1Screen.y - dy * 2 };
  const extP2 = { x: p2Screen.x + dx * 2, y: p2Screen.y + dy * 2 };

  const originScreen = mathToSvg(0, 0, bounds, svgWidth, svgHeight);

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-violet-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            1
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Feasible Polygon & Sweeping Objective Line
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Slide the objective value Z = k. Notice that the maximum/minimum value inside the region touches an extreme corner vertex.
        </p>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center py-1">
        {/* Left Information Card */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-2.5">
          <div className="bg-violet-50/40 rounded-2xl p-4 border border-violet-100 shadow-inner w-full max-w-[220px] space-y-2.5">
            <div className="text-[10px] font-bold text-violet-800 uppercase tracking-wider text-center">
              Objective Function
            </div>

            <div className="p-2 bg-white rounded-xl border border-violet-200 text-center space-y-1">
              <MathView math={selectedPreset.latexObjective} className="text-slate-900 font-semibold text-xs block" />
            </div>

            {/* Slider: Objective value k */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>Objective Value Z = k:</span>
                <span className="font-mono font-bold text-violet-800">{currentK.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={selectedPreset.kMin}
                max={selectedPreset.kMax}
                step="0.5"
                value={currentK}
                onChange={(e) => setCurrentK(parseFloat(e.target.value))}
                className="w-full accent-violet-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Optimum Vertex Banner */}
            <div className="p-2 bg-violet-100/70 rounded-xl border border-violet-200 text-center space-y-0.5">
              <div className="text-[10px] text-violet-900 font-bold uppercase tracking-wider">
                {selectedPreset.type === 'max' ? 'Maximum Vertex' : 'Minimum Vertex'}
              </div>
              <div className="text-xs font-mono font-bold text-violet-950">
                V*({evalResult.optimumVertex.x}, {evalResult.optimumVertex.y}) ⇒ Z* = {evalResult.optimumVertex.zValue}
              </div>
            </div>
          </div>
        </div>

        {/* Middle / Right Interactive Canvas */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[440px] h-[260px] rounded-2xl bg-slate-50/60 border border-violet-100 shadow-sm overflow-hidden flex flex-col items-center justify-between p-2 select-none">
            <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
              {/* Grid & Axes */}
              <line x1={0} y1={originScreen.y} x2={svgWidth} y2={originScreen.y} stroke="#94a3b8" strokeWidth="1.5" />
              <line x1={originScreen.x} y1={0} x2={originScreen.x} y2={svgHeight} stroke="#94a3b8" strokeWidth="1.5" />
              <text x={svgWidth - 10} y={originScreen.y - 4} fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="end">X₁</text>
              <text x={originScreen.x + 6} y="14" fill="#64748b" fontSize="9" fontWeight="bold">X₂</text>

              {/* Shaded Feasible Polygon Region */}
              {showFeasibleRegion && (
                <polygon
                  points={polySvgPoints}
                  fill="rgba(139, 92, 246, 0.2)"
                  stroke="#8b5cf6"
                  strokeWidth="2.2"
                />
              )}

              {/* Sweeping Objective Line c1*x + c2*y = k */}
              {showObjectiveLine && (
                <g>
                  <line
                    x1={extP1.x}
                    y1={extP1.y}
                    x2={extP2.x}
                    y2={extP2.y}
                    stroke="#d97706"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                  />
                  <text
                    x={(p1Screen.x + p2Screen.x) / 2 + 10}
                    y={(p1Screen.y + p2Screen.y) / 2 - 8}
                    fill="#b45309"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    Z = {currentK.toFixed(1)}
                  </text>
                </g>
              )}

              {/* Corner Vertices */}
              {showVertices && evalResult.vertices.map((v, idx) => {
                const sp = mathToSvg(v.x, v.y, bounds, svgWidth, svgHeight);
                const isOpt = v.isOptimum;
                return (
                  <g key={`v-${idx}`}>
                    <circle
                      cx={sp.x}
                      cy={sp.y}
                      r={isOpt ? 7.5 : 5}
                      fill={isOpt ? '#7c3aed' : '#ffffff'}
                      stroke={isOpt ? '#4c1d95' : '#8b5cf6'}
                      strokeWidth={isOpt ? 2.5 : 2}
                    />
                    {isOpt && <circle cx={sp.x} cy={sp.y} r="2.5" fill="#ffffff" />}
                    <text
                      x={sp.x + (v.x === 0 ? 8 : -8)}
                      y={sp.y + (v.y === 0 ? -8 : 12)}
                      fill={isOpt ? '#4c1d95' : '#6b21a8'}
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor={v.x === 0 ? 'start' : 'end'}
                      fontFamily="monospace"
                    >
                      ({v.x},{v.y}) Z={v.zValue}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Top Right Tag */}
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-violet-50/95 border border-violet-200 text-violet-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
              <Maximize2 className="w-3 h-3 text-violet-600" />
              <span>Optimum Always at Corner Vertex</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Presets Bar */}
      <div className="pt-2.5 border-t border-violet-50/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">Problems:</span>
          {LP_PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  setCurrentK(preset.defaultK);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-violet-600 text-white border-violet-600 shadow-sm scale-105'
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
