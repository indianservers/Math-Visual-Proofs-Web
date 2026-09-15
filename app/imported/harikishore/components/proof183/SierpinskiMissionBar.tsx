import React from 'react';
import { Target, Layers, Eye, Grid, Sparkles, Magnet } from 'lucide-react';

interface MissionBarProps {
  showHoles: boolean;
  setShowHoles: (val: boolean | ((prev: boolean) => boolean)) => void;
  showGridLines: boolean;
  setShowGridLines: (val: boolean | ((prev: boolean) => boolean)) => void;
  showLabels: boolean;
  setShowLabels: (val: boolean | ((prev: boolean) => boolean)) => void;
  showFormulaTag: boolean;
  setShowFormulaTag: (val: boolean | ((prev: boolean) => boolean)) => void;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const SierpinskiMissionBar: React.FC<MissionBarProps> = ({
  showHoles,
  setShowHoles,
  showGridLines,
  setShowGridLines,
  showLabels,
  setShowLabels,
  showFormulaTag,
  setShowFormulaTag,
  snapEnabled,
  setSnapEnabled,
}) => {
  const toggle = (setter: (fn: (prev: boolean) => boolean) => void) => {
    setter(prev => !prev);
  };

  return (
    <div className="bg-white rounded-2xl p-3.5 md:p-4 border border-indigo-100/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Left Mission Statement */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100 shadow-inner">
          <Target className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60">
              Fractal Geometry · Geometric Series
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              <Sparkles className="w-3 h-3" /> Area = (8/9)ⁿ → 0
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Punch out the center square of every 3×3 grid: retain 8 of 9 parts at each scale.
          </p>
        </div>
      </div>

      {/* Right Control Toggles */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
        <button
          onClick={() => toggle(setShowHoles)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showHoles
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Toggle Center Cutouts"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Cutout Holes</span>
        </button>

        <button
          onClick={() => toggle(setShowGridLines)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showGridLines
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Toggle 3×3 Subgrid Lines"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Grid Lines</span>
        </button>

        <button
          onClick={() => toggle(setShowLabels)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showLabels
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Toggle Dimension Labels"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Area Labels</span>
        </button>

        <button
          onClick={() => toggle(setShowFormulaTag)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showFormulaTag
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Toggle Mathematical Formula Badge"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Formula</span>
        </button>

        <button
          onClick={() => toggle(setSnapEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            snapEnabled
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Toggle Level Snapping"
        >
          <Magnet className="w-3.5 h-3.5" />
          <span>Snap</span>
        </button>
      </div>
    </div>
  );
};