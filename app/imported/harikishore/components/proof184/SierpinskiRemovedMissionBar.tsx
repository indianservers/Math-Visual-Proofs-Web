import React from 'react';
import { Target, Layers, Eye, Grid, Sparkles, Magnet } from 'lucide-react';

interface MissionBarProps {
  showNewHolesHighlight: boolean;
  setShowNewHolesHighlight: (val: boolean | ((prev: boolean) => boolean)) => void;
  showPreviousHoles: boolean;
  setShowPreviousHoles: (val: boolean | ((prev: boolean) => boolean)) => void;
  showFormulaTag: boolean;
  setShowFormulaTag: (val: boolean | ((prev: boolean) => boolean)) => void;
  showCounts: boolean;
  setShowCounts: (val: boolean | ((prev: boolean) => boolean)) => void;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const SierpinskiRemovedMissionBar: React.FC<MissionBarProps> = ({
  showNewHolesHighlight,
  setShowNewHolesHighlight,
  showPreviousHoles,
  setShowPreviousHoles,
  showFormulaTag,
  setShowFormulaTag,
  showCounts,
  setShowCounts,
  snapEnabled,
  setSnapEnabled,
}) => {
  const toggle = (setter: (fn: (prev: boolean) => boolean) => void) => {
    setter(prev => !prev);
  };

  return (
    <div className="bg-white rounded-2xl p-3.5 md:p-4 border border-violet-100/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Left Mission Statement */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 shrink-0 border border-violet-100 shadow-inner">
          <Target className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-200/60">
              Fractal Sum · Finite Geometric Series
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
              <Sparkles className="w-3 h-3" /> Sum = (8ⁿ - 1) / 7
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Count newly removed squares: 1, then 8, then 64... and sum them as a geometric progression.
          </p>
        </div>
      </div>

      {/* Right Control Toggles */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
        <button
          onClick={() => toggle(setShowNewHolesHighlight)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showNewHolesHighlight
              ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Highlight Newly Removed Holes in Gold"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Holes</span>
        </button>

        <button
          onClick={() => toggle(setShowPreviousHoles)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showPreviousHoles
              ? 'bg-violet-50 border-violet-200 text-violet-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Show Previous Iteration Holes"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Prior Holes</span>
        </button>

        <button
          onClick={() => toggle(setShowCounts)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showCounts
              ? 'bg-violet-50 border-violet-200 text-violet-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Show Mathematical Term Counts"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Counts</span>
        </button>

        <button
          onClick={() => toggle(setShowFormulaTag)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showFormulaTag
              ? 'bg-violet-50 border-violet-200 text-violet-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Toggle GP Sum Formula Badge"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Formula</span>
        </button>

        <button
          onClick={() => toggle(setSnapEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            snapEnabled
              ? 'bg-violet-50 border-violet-200 text-violet-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Toggle Step Snapping"
        >
          <Magnet className="w-3.5 h-3.5" />
          <span>Snap</span>
        </button>
      </div>
    </div>
  );
};