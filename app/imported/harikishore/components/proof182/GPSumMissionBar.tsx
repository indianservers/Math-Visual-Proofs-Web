import React from 'react';
import { Target, Layers, Eye, Grid, Sparkles, Magnet } from 'lucide-react';

interface MissionBarProps {
  showSeriesS: boolean;
  setShowSeriesS: (val: boolean | ((prev: boolean) => boolean)) => void;
  showShiftedRS: boolean;
  setShowShiftedRS: (val: boolean | ((prev: boolean) => boolean)) => void;
  showCancellation: boolean;
  setShowCancellation: (val: boolean | ((prev: boolean) => boolean)) => void;
  showFormulaTag: boolean;
  setShowFormulaTag: (val: boolean | ((prev: boolean) => boolean)) => void;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const GPSumMissionBar: React.FC<MissionBarProps> = ({
  showSeriesS,
  setShowSeriesS,
  showShiftedRS,
  setShowShiftedRS,
  showCancellation,
  setShowCancellation,
  showFormulaTag,
  setShowFormulaTag,
  snapEnabled,
  setSnapEnabled,
}) => {
  const toggle = (setter: (fn: (prev: boolean) => boolean) => void) => {
    setter(prev => !prev);
  };

  return (
    <div className="bg-white rounded-2xl p-3.5 md:p-4 border border-pink-100/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Left Mission Statement */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 shrink-0 border border-pink-100 shadow-inner">
          <Target className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight font-sans">
            Use shifted series cancellation to derive the finite GP sum formula.
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Multiplying Sn by r shifts every term by 1 slot. Subtracting S - rS cancels all middle terms, leaving only the head a and tail ar^n.
          </p>
        </div>
      </div>

      {/* Right Show Controls */}
      <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
        <span className="text-xs font-semibold text-slate-400 mr-1">Show</span>

        <button
          onClick={() => toggle(setShowSeriesS)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showSeriesS
              ? 'bg-pink-50 text-pink-800 border-pink-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-pink-600" />
          <span>Series S_n</span>
        </button>

        <button
          onClick={() => toggle(setShowShiftedRS)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showShiftedRS
              ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-amber-500" />
          <span>Shifted r·S_n</span>
        </button>

        <button
          onClick={() => toggle(setShowCancellation)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showCancellation
              ? 'bg-purple-50 text-purple-800 border-purple-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Grid className="w-3.5 h-3.5 text-purple-500" />
          <span>Cancellations</span>
        </button>

        <button
          onClick={() => toggle(setShowFormulaTag)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showFormulaTag
              ? 'bg-pink-50 text-pink-800 border-pink-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>Formula</span>
        </button>

        <button
          onClick={() => toggle(setSnapEnabled)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            snapEnabled
              ? 'bg-pink-50 text-pink-800 border-pink-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Magnet className="w-3.5 h-3.5" />
          <span>Snap</span>
        </button>
      </div>
    </div>
  );
};
