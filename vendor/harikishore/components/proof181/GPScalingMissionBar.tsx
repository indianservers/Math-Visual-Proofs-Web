import React from 'react';
import { Target, Layers, Eye, Grid, Sparkles, Magnet } from 'lucide-react';

interface MissionBarProps {
  showTowers: boolean;
  setShowTowers: (val: boolean | ((prev: boolean) => boolean)) => void;
  showMultiplierArcs: boolean;
  setShowMultiplierArcs: (val: boolean | ((prev: boolean) => boolean)) => void;
  showFormulas: boolean;
  setShowFormulas: (val: boolean | ((prev: boolean) => boolean)) => void;
  showFormulaTag: boolean;
  setShowFormulaTag: (val: boolean | ((prev: boolean) => boolean)) => void;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const GPScalingMissionBar: React.FC<MissionBarProps> = ({
  showTowers,
  setShowTowers,
  showMultiplierArcs,
  setShowMultiplierArcs,
  showFormulas,
  setShowFormulas,
  showFormulaTag,
  setShowFormulaTag,
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
          <h3 className="text-sm font-bold text-slate-800 tracking-tight font-sans">
            Show each term scaling by the same ratio.
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Bars grow or shrink by a fixed multiplier r at every step, making the common ratio and explicit formula an = a·r^(n-1) visible.
          </p>
        </div>
      </div>

      {/* Right Show Controls */}
      <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
        <span className="text-xs font-semibold text-slate-400 mr-1">Show</span>

        <button
          onClick={() => toggle(setShowTowers)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showTowers
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          <span>Bar Towers</span>
        </button>

        <button
          onClick={() => toggle(setShowMultiplierArcs)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showMultiplierArcs
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-indigo-500" />
          <span>Multiplier Arcs (× r)</span>
        </button>

        <button
          onClick={() => toggle(setShowFormulas)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showFormulas
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Grid className="w-3.5 h-3.5 text-amber-500" />
          <span>Formula Tags</span>
        </button>

        <button
          onClick={() => toggle(setShowFormulaTag)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showFormulaTag
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Formula</span>
        </button>

        <button
          onClick={() => toggle(setSnapEnabled)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            snapEnabled
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm'
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
