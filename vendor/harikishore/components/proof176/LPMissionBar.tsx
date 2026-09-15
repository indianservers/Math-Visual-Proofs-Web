import React from 'react';
import { Target, Layers, Eye, Grid, Maximize2, Magnet } from 'lucide-react';

interface MissionBarProps {
  showFeasibleRegion: boolean;
  setShowFeasibleRegion: (val: boolean | ((prev: boolean) => boolean)) => void;
  showConstraints: boolean;
  setShowConstraints: (val: boolean | ((prev: boolean) => boolean)) => void;
  showVertices: boolean;
  setShowVertices: (val: boolean | ((prev: boolean) => boolean)) => void;
  showObjectiveLine: boolean;
  setShowObjectiveLine: (val: boolean | ((prev: boolean) => boolean)) => void;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const LPMissionBar: React.FC<MissionBarProps> = ({
  showFeasibleRegion,
  setShowFeasibleRegion,
  showConstraints,
  setShowConstraints,
  showVertices,
  setShowVertices,
  showObjectiveLine,
  setShowObjectiveLine,
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
          <h3 className="text-sm font-bold text-slate-800 tracking-tight font-sans">
            Intersect half-planes and slide an objective line to find the optimum vertex.
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Discover why the maximum/minimum of any linear objective function over a convex polygon always occurs at a corner vertex.
          </p>
        </div>
      </div>

      {/* Right Show Controls */}
      <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
        <span className="text-xs font-semibold text-slate-400 mr-1">Show</span>

        <button
          onClick={() => toggle(setShowFeasibleRegion)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showFeasibleRegion
              ? 'bg-violet-50 text-violet-800 border-violet-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-violet-600" />
          <span>Feasible Region</span>
        </button>

        <button
          onClick={() => toggle(setShowConstraints)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showConstraints
              ? 'bg-violet-50 text-violet-800 border-violet-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Grid className="w-3.5 h-3.5 text-indigo-500" />
          <span>Constraint Lines</span>
        </button>

        <button
          onClick={() => toggle(setShowVertices)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showVertices
              ? 'bg-violet-50 text-violet-800 border-violet-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-cyan-500" />
          <span>Corner Vertices</span>
        </button>

        <button
          onClick={() => toggle(setShowObjectiveLine)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showObjectiveLine
              ? 'bg-violet-50 text-violet-800 border-violet-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5 text-amber-500" />
          <span>Objective Line Z</span>
        </button>

        <button
          onClick={() => toggle(setSnapEnabled)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            snapEnabled
              ? 'bg-violet-50 text-violet-800 border-violet-200 shadow-sm'
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
