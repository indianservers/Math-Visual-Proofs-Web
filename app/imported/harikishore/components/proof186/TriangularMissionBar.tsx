import React from 'react';
import { Target, Layers, Eye, Grid, Sparkles, Magnet } from 'lucide-react';

interface MissionBarProps {
  showTriangle1: boolean;
  setShowTriangle1: (val: boolean | ((prev: boolean) => boolean)) => void;
  showDuplicateTriangle: boolean;
  setShowDuplicateTriangle: (val: boolean | ((prev: boolean) => boolean)) => void;
  showRectBoundary: boolean;
  setShowRectBoundary: (val: boolean | ((prev: boolean) => boolean)) => void;
  showDotCounts: boolean;
  setShowDotCounts: (val: boolean | ((prev: boolean) => boolean)) => void;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const TriangularMissionBar: React.FC<MissionBarProps> = ({
  showTriangle1,
  setShowTriangle1,
  showDuplicateTriangle,
  setShowDuplicateTriangle,
  showRectBoundary,
  setShowRectBoundary,
  showDotCounts,
  setShowDotCounts,
  snapEnabled,
  setSnapEnabled,
}) => {
  const toggle = (setter: (fn: (prev: boolean) => boolean) => void) => {
    setter(prev => !prev);
  };

  return (
    <div className="bg-white rounded-2xl p-3.5 md:p-4 border border-sky-100/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Left Mission Statement */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0 border border-sky-100 shadow-inner">
          <Target className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200/60">
              Figurate Numbers · Triangular Arrays
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              <Sparkles className="w-3 h-3" /> T_n = n(n + 1) / 2
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Arrange dots into triangular rows and duplicate them into an n × (n + 1) rectangle.
          </p>
        </div>
      </div>

      {/* Right Control Toggles */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
        <button
          onClick={() => toggle(setShowTriangle1)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showTriangle1
              ? 'bg-sky-50 border-sky-200 text-sky-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Toggle Original Triangle (Blue Dots)"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Triangle 1</span>
        </button>

        <button
          onClick={() => toggle(setShowDuplicateTriangle)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showDuplicateTriangle
              ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Toggle Inverted Duplicate Triangle (Amber Dots)"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Twin Copy</span>
        </button>

        <button
          onClick={() => toggle(setShowRectBoundary)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showRectBoundary
              ? 'bg-sky-50 border-sky-200 text-sky-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Toggle n × (n+1) Rectangle Outline"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Rectangle</span>
        </button>

        <button
          onClick={() => toggle(setShowDotCounts)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showDotCounts
              ? 'bg-sky-50 border-sky-200 text-sky-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Toggle Dot Count Labels"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Counts</span>
        </button>

        <button
          onClick={() => toggle(setSnapEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            snapEnabled
              ? 'bg-sky-50 border-sky-200 text-sky-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Toggle Snapping"
        >
          <Magnet className="w-3.5 h-3.5" />
          <span>Snap</span>
        </button>
      </div>
    </div>
  );
};