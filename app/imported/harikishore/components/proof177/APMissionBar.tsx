import React from 'react';
import { Target, ArrowRight, Eye, Grid, Layers, Magnet } from 'lucide-react';

interface MissionBarProps {
  showNumberLine: boolean;
  setShowNumberLine: (val: boolean | ((prev: boolean) => boolean)) => void;
  showJumps: boolean;
  setShowJumps: (val: boolean | ((prev: boolean) => boolean)) => void;
  showTerms: boolean;
  setShowTerms: (val: boolean | ((prev: boolean) => boolean)) => void;
  showFormulas: boolean;
  setShowFormulas: (val: boolean | ((prev: boolean) => boolean)) => void;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const APMissionBar: React.FC<MissionBarProps> = ({
  showNumberLine,
  setShowNumberLine,
  showJumps,
  setShowJumps,
  showTerms,
  setShowTerms,
  showFormulas,
  setShowFormulas,
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
            Place AP terms on a number line and see the constant difference.
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Watch each term emerge as an equal step jump d from the initial term a. Discover why a_n = a + (n-1)d.
          </p>
        </div>
      </div>

      {/* Right Show Controls */}
      <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
        <span className="text-xs font-semibold text-slate-400 mr-1">Show</span>

        <button
          onClick={() => toggle(setShowNumberLine)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showNumberLine
              ? 'bg-blue-50 text-blue-800 border-blue-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Grid className="w-3.5 h-3.5 text-blue-600" />
          <span>Number Line</span>
        </button>

        <button
          onClick={() => toggle(setShowJumps)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showJumps
              ? 'bg-blue-50 text-blue-800 border-blue-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
          <span>Jump Arcs (+d)</span>
        </button>

        <button
          onClick={() => toggle(setShowTerms)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showTerms
              ? 'bg-blue-50 text-blue-800 border-blue-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-cyan-500" />
          <span>Term Dots (a_k)</span>
        </button>

        <button
          onClick={() => toggle(setShowFormulas)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showFormulas
              ? 'bg-blue-50 text-blue-800 border-blue-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-amber-500" />
          <span>Formula Tags</span>
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
