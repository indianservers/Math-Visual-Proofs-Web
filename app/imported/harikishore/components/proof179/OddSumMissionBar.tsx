import React from 'react';
import { Target, Layers, Eye, Grid, Sparkles, Magnet } from 'lucide-react';

interface MissionBarProps {
  showSquareGrid: boolean;
  setShowSquareGrid: (val: boolean | ((prev: boolean) => boolean)) => void;
  showLLayers: boolean;
  setShowLLayers: (val: boolean | ((prev: boolean) => boolean)) => void;
  showOddLabels: boolean;
  setShowOddLabels: (val: boolean | ((prev: boolean) => boolean)) => void;
  showFormulaTag: boolean;
  setShowFormulaTag: (val: boolean | ((prev: boolean) => boolean)) => void;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const OddSumMissionBar: React.FC<MissionBarProps> = ({
  showSquareGrid,
  setShowSquareGrid,
  showLLayers,
  setShowLLayers,
  showOddLabels,
  setShowOddLabels,
  showFormulaTag,
  setShowFormulaTag,
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
          <h3 className="text-sm font-bold text-slate-800 tracking-tight font-sans">
            Build a square from successive odd L-shaped layers.
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Each odd number 1, 3, 5, 7, ... wraps around the previous square to form the next perfect square, proving 1+3+...+odd = n².
          </p>
        </div>
      </div>

      {/* Right Show Controls */}
      <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
        <span className="text-xs font-semibold text-slate-400 mr-1">Show</span>

        <button
          onClick={() => toggle(setShowSquareGrid)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showSquareGrid
              ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Grid className="w-3.5 h-3.5 text-amber-600" />
          <span>Square Grid</span>
        </button>

        <button
          onClick={() => toggle(setShowLLayers)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showLLayers
              ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-indigo-500" />
          <span>Odd L-Shells</span>
        </button>

        <button
          onClick={() => toggle(setShowOddLabels)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showOddLabels
              ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-cyan-500" />
          <span>Count Tags</span>
        </button>

        <button
          onClick={() => toggle(setShowFormulaTag)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showFormulaTag
              ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm'
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
              ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm'
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
