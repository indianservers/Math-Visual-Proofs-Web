import React from 'react';
import { Target, Layers, Eye, Grid, Sparkles, Magnet } from 'lucide-react';

interface MissionBarProps {
  showStaircase1: boolean;
  setShowStaircase1: (val: boolean | ((prev: boolean) => boolean)) => void;
  showTwinStaircase: boolean;
  setShowTwinStaircase: (val: boolean | ((prev: boolean) => boolean)) => void;
  showDimensions: boolean;
  setShowDimensions: (val: boolean | ((prev: boolean) => boolean)) => void;
  showFormulaTag: boolean;
  setShowFormulaTag: (val: boolean | ((prev: boolean) => boolean)) => void;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const NaturalSumMissionBar: React.FC<MissionBarProps> = ({
  showStaircase1,
  setShowStaircase1,
  showTwinStaircase,
  setShowTwinStaircase,
  showDimensions,
  setShowDimensions,
  showFormulaTag,
  setShowFormulaTag,
  snapEnabled,
  setSnapEnabled,
}) => {
  const toggle = (setter: (fn: (prev: boolean) => boolean) => void) => {
    setter(prev => !prev);
  };

  return (
    <div className="bg-white rounded-2xl p-3.5 md:p-4 border border-blue-100/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Left Mission Statement */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100 shadow-inner">
          <Target className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight font-sans">
            Duplicate a triangular dot pattern to make a rectangle.
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Watch two identical staircases of 1+2+...+n dots interlock to form an n × (n+1) rectangle, proving the sum is half.
          </p>
        </div>
      </div>

      {/* Right Show Controls */}
      <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
        <span className="text-xs font-semibold text-slate-400 mr-1">Show</span>

        <button
          onClick={() => toggle(setShowStaircase1)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showStaircase1
              ? 'bg-blue-50 text-blue-800 border-blue-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>Staircase 1</span>
        </button>

        <button
          onClick={() => toggle(setShowTwinStaircase)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showTwinStaircase
              ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-amber-500" />
          <span>Twin Staircase</span>
        </button>

        <button
          onClick={() => toggle(setShowDimensions)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showDimensions
              ? 'bg-blue-50 text-blue-800 border-blue-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Grid className="w-3.5 h-3.5 text-indigo-500" />
          <span>Dimensions n × (n+1)</span>
        </button>

        <button
          onClick={() => toggle(setShowFormulaTag)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showFormulaTag
              ? 'bg-blue-50 text-blue-800 border-blue-200 shadow-sm'
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
              ? 'bg-blue-50 text-blue-800 border-blue-200 shadow-sm'
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
