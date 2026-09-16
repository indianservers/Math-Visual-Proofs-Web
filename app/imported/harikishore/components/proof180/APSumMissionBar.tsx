import React from 'react';
import { Target, Layers, Eye, Grid, Sparkles, Magnet } from 'lucide-react';

interface MissionBarProps {
  showOriginalBars: boolean;
  setShowOriginalBars: (val: boolean | ((prev: boolean) => boolean)) => void;
  showInvertedBars: boolean;
  setShowInvertedBars: (val: boolean | ((prev: boolean) => boolean)) => void;
  showCeilingLine: boolean;
  setShowCeilingLine: (val: boolean | ((prev: boolean) => boolean)) => void;
  showFormulaTag: boolean;
  setShowFormulaTag: (val: boolean | ((prev: boolean) => boolean)) => void;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const APSumMissionBar: React.FC<MissionBarProps> = ({
  showOriginalBars,
  setShowOriginalBars,
  showInvertedBars,
  setShowInvertedBars,
  showCeilingLine,
  setShowCeilingLine,
  showFormulaTag,
  setShowFormulaTag,
  snapEnabled,
  setSnapEnabled,
}) => {
  const toggle = (setter: (fn: (prev: boolean) => boolean) => void) => {
    setter(prev => !prev);
  };

  return (
    <div className="bg-white rounded-2xl p-3.5 md:p-4 border border-purple-100/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Left Mission Statement */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0 border border-purple-100 shadow-inner">
          <Target className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight font-sans">
            Pair first and last terms to make equal sums.
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Stack duplicate reversed AP bars on top. Every column reaches the uniform height (a + l), proving Sn = n/2(a + l).
          </p>
        </div>
      </div>

      {/* Right Show Controls */}
      <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
        <span className="text-xs font-semibold text-slate-400 mr-1">Show</span>

        <button
          onClick={() => toggle(setShowOriginalBars)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showOriginalBars
              ? 'bg-purple-50 text-purple-800 border-purple-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-purple-600" />
          <span>Original Bars (a_k)</span>
        </button>

        <button
          onClick={() => toggle(setShowInvertedBars)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showInvertedBars
              ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-amber-500" />
          <span>Inverted Twin</span>
        </button>

        <button
          onClick={() => toggle(setShowCeilingLine)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showCeilingLine
              ? 'bg-purple-50 text-purple-800 border-purple-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Grid className="w-3.5 h-3.5 text-indigo-500" />
          <span>Ceiling (a + l)</span>
        </button>

        <button
          onClick={() => toggle(setShowFormulaTag)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showFormulaTag
              ? 'bg-purple-50 text-purple-800 border-purple-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>Formula</span>
        </button>

        <button
          onClick={() => toggle(setSnapEnabled)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            snapEnabled
              ? 'bg-purple-50 text-purple-800 border-purple-200 shadow-sm'
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
