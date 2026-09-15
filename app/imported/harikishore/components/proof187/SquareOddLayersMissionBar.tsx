import React from 'react';
import { Target, Layers, Eye, Grid, Sparkles, Magnet } from 'lucide-react';

interface MissionBarProps {
  showLLayers: boolean;
  setShowLLayers: (val: boolean | ((prev: boolean) => boolean)) => void;
  showCornerBlocks: boolean;
  setShowCornerBlocks: (val: boolean | ((prev: boolean) => boolean)) => void;
  showPrevSquareOutline: boolean;
  setShowPrevSquareOutline: (val: boolean | ((prev: boolean) => boolean)) => void;
  showTileCounts: boolean;
  setShowTileCounts: (val: boolean | ((prev: boolean) => boolean)) => void;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const SquareOddLayersMissionBar: React.FC<MissionBarProps> = ({
  showLLayers,
  setShowLLayers,
  showCornerBlocks,
  setShowCornerBlocks,
  showPrevSquareOutline,
  setShowPrevSquareOutline,
  showTileCounts,
  setShowTileCounts,
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
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
              Gnomon Geometry · Square Numbers
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              <Sparkles className="w-3 h-3" /> n² - (n-1)² = 2n - 1
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Grow n × n squares using odd L-shaped layers. Each new layer adds exactly 2n - 1 unit tiles.
          </p>
        </div>
      </div>

      {/* Right Control Toggles */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
        <button
          onClick={() => toggle(setShowLLayers)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showLLayers
              ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Toggle Rainbow L-Shaped Layers"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>L-Layers</span>
        </button>

        <button
          onClick={() => toggle(setShowCornerBlocks)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showCornerBlocks
              ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Highlight Corner Pivot Blocks"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Corner Pivot</span>
        </button>

        <button
          onClick={() => toggle(setShowPrevSquareOutline)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showPrevSquareOutline
              ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Show (n-1) × (n-1) Inner Square Outline"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>(n-1)² Outline</span>
        </button>

        <button
          onClick={() => toggle(setShowTileCounts)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showTileCounts
              ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Show Tile Counts & Formulas"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Tile Counts</span>
        </button>

        <button
          onClick={() => toggle(setSnapEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            snapEnabled
              ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-xs'
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