import React from 'react';
import { Target, Compass, Eye, Grid, Sparkles, Magnet } from 'lucide-react';

interface MissionBarProps {
  showSpiralCurve: boolean;
  setShowSpiralCurve: (val: boolean | ((prev: boolean) => boolean)) => void;
  showTilingBoxes: boolean;
  setShowTilingBoxes: (val: boolean | ((prev: boolean) => boolean)) => void;
  showRatioTag: boolean;
  setShowRatioTag: (val: boolean | ((prev: boolean) => boolean)) => void;
  showArcCenters: boolean;
  setShowArcCenters: (val: boolean | ((prev: boolean) => boolean)) => void;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const FibonacciSpiralMissionBar: React.FC<MissionBarProps> = ({
  showSpiralCurve,
  setShowSpiralCurve,
  showTilingBoxes,
  setShowTilingBoxes,
  showRatioTag,
  setShowRatioTag,
  showArcCenters,
  setShowArcCenters,
  snapEnabled,
  setSnapEnabled,
}) => {
  const toggle = (setter: (fn: (prev: boolean) => boolean) => void) => {
    setter(prev => !prev);
  };

  return (
    <div className="bg-white rounded-2xl p-3.5 md:p-4 border border-amber-100/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Left Mission Statement */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 border border-amber-100 shadow-inner">
          <Target className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
              Golden Ratio · Spiral Approximation
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
              <Sparkles className="w-3 h-3" /> lim F_(n+1)/F_n = f  1.618
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Connect quarter-circle arcs inside each Fibonacci square to trace the logarithmic Golden Spiral.
          </p>
        </div>
      </div>

      {/* Right Control Toggles */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
        <button
          onClick={() => toggle(setShowSpiralCurve)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showSpiralCurve
              ? 'bg-amber-50 border-amber-200 text-amber-800 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Toggle Golden Spiral Curve"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Spiral Curve</span>
        </button>

        <button
          onClick={() => toggle(setShowTilingBoxes)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showTilingBoxes
              ? 'bg-amber-50 border-amber-200 text-amber-800 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Toggle Fibonacci Tiling Boxes"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Tiling Boxes</span>
        </button>

        <button
          onClick={() => toggle(setShowRatioTag)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showRatioTag
              ? 'bg-amber-50 border-amber-200 text-amber-800 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Toggle Golden Ratio Convergence Badge"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ratio f Tag</span>
        </button>

        <button
          onClick={() => toggle(setShowArcCenters)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showArcCenters
              ? 'bg-amber-50 border-amber-200 text-amber-800 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Show Quarter Arc Centers and Radii"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Arc Centers</span>
        </button>

        <button
          onClick={() => toggle(setSnapEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            snapEnabled
              ? 'bg-amber-50 border-amber-200 text-amber-800 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Toggle Grid Snapping"
        >
          <Magnet className="w-3.5 h-3.5" />
          <span>Snap</span>
        </button>
      </div>
    </div>
  );
};
