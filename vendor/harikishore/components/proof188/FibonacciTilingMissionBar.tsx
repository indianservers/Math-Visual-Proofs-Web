import React from 'react';
import { Target, Layers, Eye, Grid, Sparkles, Magnet } from 'lucide-react';

interface MissionBarProps {
  showSquareLabels: boolean;
  setShowSquareLabels: (val: boolean | ((prev: boolean) => boolean)) => void;
  showEdgeBrackets: boolean;
  setShowEdgeBrackets: (val: boolean | ((prev: boolean) => boolean)) => void;
  showBoundingRect: boolean;
  setShowBoundingRect: (val: boolean | ((prev: boolean) => boolean)) => void;
  showAreaFormula: boolean;
  setShowAreaFormula: (val: boolean | ((prev: boolean) => boolean)) => void;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const FibonacciTilingMissionBar: React.FC<MissionBarProps> = ({
  showSquareLabels,
  setShowSquareLabels,
  showEdgeBrackets,
  setShowEdgeBrackets,
  showBoundingRect,
  setShowBoundingRect,
  showAreaFormula,
  setShowAreaFormula,
  snapEnabled,
  setSnapEnabled,
}) => {
  const toggle = (setter: (fn: (prev: boolean) => boolean) => void) => {
    setter(prev => !prev);
  };

  return (
    <div className="bg-white rounded-2xl p-3.5 md:p-4 border border-emerald-100/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Left Mission Statement */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100 shadow-inner">
          <Target className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              Fibonacci Recurrence · Geometric Tiling
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
              <Sparkles className="w-3 h-3" /> F_n = F_(n-1) + F_(n-2)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Add Fibonacci squares where each new side uses the previous two: F_n = F_(n-1) + F_(n-2).
          </p>
        </div>
      </div>

      {/* Right Control Toggles */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
        <button
          onClick={() => toggle(setShowSquareLabels)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showSquareLabels
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Show Tile Fibonacci Numbers F_k"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>F_k Labels</span>
        </button>

        <button
          onClick={() => toggle(setShowEdgeBrackets)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showEdgeBrackets
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Show Adjacent Edge Sum Brackets"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Edge Brackets</span>
        </button>

        <button
          onClick={() => toggle(setShowBoundingRect)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showBoundingRect
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Show F_n × F_(n+1) Outer Rectangle"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Bounding Rect</span>
        </button>

        <button
          onClick={() => toggle(setShowAreaFormula)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showAreaFormula
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Show Square Area Sum Identity"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Area Identity</span>
        </button>

        <button
          onClick={() => toggle(setSnapEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            snapEnabled
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Toggle Tile Snapping"
        >
          <Magnet className="w-3.5 h-3.5" />
          <span>Snap</span>
        </button>
      </div>
    </div>
  );
};