import React, { useMemo } from 'react';
import { 
  Layers, 
  Grid, 
  Maximize2 
} from 'lucide-react';
import { TRAPEZOID_PRESETS, TrapezoidPreset } from '../../data/trapezoidData';
import { computeTrapezoidalApproximation, sampleCurvePoints, TrapezoidCalculation } from '../../utils/trapezoidMath';
import { MathView } from '../common/MathView';

interface Panel1Props {
  selectedPreset: TrapezoidPreset;
  onSelectPreset: (p: TrapezoidPreset) => void;
  subintervalN: number;
  setSubintervalN: (n: number) => void;
  showCurve: boolean;
  showTrapezoids: boolean;
  showNodes: boolean;
  showSecants: boolean;
  snapEnabled: boolean;
}

export const Panel1TrapezoidCanvas: React.FC<Panel1Props> = ({
  selectedPreset,
  onSelectPreset,
  subintervalN,
  setSubintervalN,
  showCurve,
  showTrapezoids,
  showNodes,
  showSecants,
}) => {
  const calc: TrapezoidCalculation = useMemo(() => {
    return computeTrapezoidalApproximation(selectedPreset, subintervalN);
  }, [selectedPreset, subintervalN]);

  const curvePts = useMemo(() => {
    return sampleCurvePoints(selectedPreset, 80);
  }, [selectedPreset]);

  // Canvas bounds
  const svgWidth = 420;
  const svgHeight = 250;
  const padL = 35;
  const padR = 20;
  const padT = 25;
  const padB = 40;
  const plotW = svgWidth - padL - padR;
  const plotH = svgHeight - padT - padB;

  const yMax = Math.max(1.2, ...calc.nodes.map(n => n.y), ...curvePts.map(p => p.y)) * 1.15;
  const xMin = selectedPreset.a;
  const xMax = selectedPreset.b;
  const xRange = Math.max(0.1, xMax - xMin);

  const mathToX = (x: number) => padL + ((x - xMin) / xRange) * plotW;
  const mathToY = (y: number) => padT + plotH - (Math.max(0, y) / yMax) * plotH;

  const curvePath = curvePts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${mathToX(p.x).toFixed(1)},${mathToY(p.y).toFixed(1)}`)
    .join(' ');

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-amber-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            1
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Trapezoid Strips & Composite Rule T_n
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Adjust subinterval count n. Notice how interior vertical boundaries share two adjacent trapezoids (counted ×2).
        </p>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center py-1">
        {/* Left Information Card */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-2.5">
          <div className="bg-amber-50/40 rounded-2xl p-4 border border-amber-100 shadow-inner w-full max-w-[220px] space-y-2.5">
            <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider text-center">
              Active Function & Interval
            </div>

            <div className="p-2 bg-white rounded-xl border border-amber-200 text-center space-y-1">
              <MathView math={selectedPreset.latexFn} className="text-slate-900 font-semibold text-xs block" />
              <div className="text-[10px] font-mono text-slate-500">[{selectedPreset.a.toFixed(1)}, {selectedPreset.b.toFixed(2)}]</div>
            </div>

            {/* Slider: Subintervals n */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>Subintervals n:</span>
                <span className="font-mono font-bold text-amber-800">{calc.n}</span>
              </div>
              <input
                type="range"
                min="1"
                max="16"
                step="1"
                value={subintervalN}
                onChange={(e) => setSubintervalN(parseInt(e.target.value, 10))}
                className="w-full accent-amber-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Step h = (b-a)/n:</span>
                <strong className="text-amber-900">{calc.h.toFixed(3)}</strong>
              </div>
            </div>

            {/* Numerical Readouts */}
            <div className="text-[10px] space-y-1 pt-1.5 border-t border-amber-200/80 font-mono text-slate-700">
              <div className="flex justify-between">
                <span>Approx T_n:</span>
                <strong className="text-amber-800">{calc.approxAreaTn.toFixed(4)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Exact Integral I:</span>
                <strong className="text-slate-900">{calc.exactIntegral.toFixed(4)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Abs Error |T_n - I|:</span>
                <strong className={Math.abs(calc.error) < 0.05 ? 'text-emerald-700' : 'text-rose-700'}>
                  {Math.abs(calc.error).toFixed(4)} ({calc.percentError.toFixed(2)}%)
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Middle / Right Interactive Canvas */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[440px] h-[260px] rounded-2xl bg-slate-50/60 border border-amber-100 shadow-sm overflow-hidden flex flex-col items-center justify-between p-2 select-none">
            <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
              {/* X and Y Axes */}
              <line x1={padL} y1={padT + plotH} x2={svgWidth - padR} y2={padT + plotH} stroke="#94a3b8" strokeWidth="1.5" />
              <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#94a3b8" strokeWidth="1.5" />

              {/* Shaded Trapezoids */}
              {showTrapezoids && calc.strips.map((s, idx) => {
                const xL = mathToX(s.xLeft);
                const xR = mathToX(s.xRight);
                const yL = mathToY(s.yLeft);
                const yR = mathToY(s.yRight);
                const yBase = padT + plotH;

                const polyPath = `M ${xL},${yBase} L ${xL},${yL} L ${xR},${yR} L ${xR},${yBase} Z`;
                const fillColor = idx % 2 === 0 ? 'rgba(245, 158, 11, 0.22)' : 'rgba(217, 119, 6, 0.14)';

                return (
                  <g key={`strip-${idx}`}>
                    <path d={polyPath} fill={fillColor} stroke="#f59e0b" strokeWidth="1.2" />
                    {/* Secant chord */}
                    {showSecants && (
                      <line x1={xL} y1={yL} x2={xR} y2={yR} stroke="#d97706" strokeWidth="2" strokeDasharray="3 2" />
                    )}
                  </g>
                );
              })}

              {/* Continuous Function Curve */}
              {showCurve && (
                <path d={curvePath} fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
              )}

              {/* Nodes & Multiplier Badges */}
              {showNodes && calc.nodes.map((n, idx) => {
                const nx = mathToX(n.x);
                const ny = mathToY(n.y);
                const isEnd = !n.isInterior;

                return (
                  <g key={`node-${idx}`}>
                    {/* Vertical guideline */}
                    <line x1={nx} y1={padT + plotH} x2={nx} y2={ny} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
                    <circle cx={nx} cy={ny} r={isEnd ? 4.5 : 3.5} fill={isEnd ? '#d97706' : '#2563eb'} stroke="#ffffff" strokeWidth="1.5" />
                    
                    {/* Multiplier tag badge */}
                    <rect
                      x={nx - 10}
                      y={padT + plotH + 4}
                      width="20"
                      height="14"
                      fill={isEnd ? '#fef3c7' : '#dbeafe'}
                      stroke={isEnd ? '#d97706' : '#2563eb'}
                      strokeWidth="1"
                      rx="3"
                    />
                    <text
                      x={nx}
                      y={padT + plotH + 14}
                      fill={isEnd ? '#b45309' : '#1d4ed8'}
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {isEnd ? '×1' : '×2'}
                    </text>
                  </g>
                );
              })}

              {/* Step width h dimension bar */}
              {calc.strips.length > 0 && (
                <g>
                  const firstL = mathToX(calc.strips[0].xLeft);
                  const firstR = mathToX(calc.strips[0].xRight);
                  <line x1={mathToX(calc.strips[0].xLeft)} y1={padT + plotH + 24} x2={mathToX(calc.strips[0].xRight)} y2={padT + plotH + 24} stroke="#b45309" strokeWidth="1.5" />
                  <text x={(mathToX(calc.strips[0].xLeft) + mathToX(calc.strips[0].xRight)) / 2} y={padT + plotH + 34} fill="#b45309" fontSize="8" fontWeight="bold" textAnchor="middle">
                    h = {calc.h.toFixed(2)}
                  </text>
                </g>
              )}
            </svg>

            {/* Top Right Tag */}
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-50/95 border border-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
              <Layers className="w-3 h-3 text-amber-600" />
              <span>Interior Nodes Counted ×2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Presets Bar */}
      <div className="pt-2.5 border-t border-amber-50/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">Curves:</span>
          {TRAPEZOID_PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  setSubintervalN(preset.defaultN);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm scale-105'
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
