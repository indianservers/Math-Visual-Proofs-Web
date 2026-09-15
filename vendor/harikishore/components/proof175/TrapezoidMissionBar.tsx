import React from 'react';
import { Target, Activity, Eye, Grid, Layers, Magnet } from 'lucide-react';

interface MissionBarProps {
  showCurve: boolean;
  setShowCurve: (val: boolean | ((prev: boolean) => boolean)) => void;
  showTrapezoids: boolean;
  setShowTrapezoids: (val: boolean | ((prev: boolean) => boolean)) => void;
  showNodes: boolean;
  setShowNodes: (val: boolean | ((prev: boolean) => boolean)) => void;
  showSecants: boolean;
  setShowSecants: (val: boolean | ((prev: boolean) => boolean)) => void;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const TrapezoidMissionBar: React.FC<MissionBarProps> = ({
  showCurve,
  setShowCurve,
  showTrapezoids,
  setShowTrapezoids,
  showNodes,
  setShowNodes,
  showSecants,
  setShowSecants,
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
            Approximate area under a curve by splitting it into trapezoids.
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Compute subinterval width h = (b-a)/n, connect secant chords, and discover why interior heights are counted twice in T_n.
          </p>
        </div>
      </div>

      {/* Right Show Controls */}
      <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
        <span className="text-xs font-semibold text-slate-400 mr-1">Show</span>

        <button
          onClick={() => toggle(setShowCurve)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showCurve
              ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-amber-600" />
          <span>Curve f(x)</span>
        </button>

        <button
          onClick={() => toggle(setShowTrapezoids)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showTrapezoids
              ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-indigo-500" />
          <span>Trapezoid Strips</span>
        </button>

        <button
          onClick={() => toggle(setShowNodes)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showNodes
              ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Grid className="w-3.5 h-3.5 text-cyan-500" />
          <span>Node Multipliers (×2)</span>
        </button>

        <button
          onClick={() => toggle(setShowSecants)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showSecants
              ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-rose-500" />
          <span>Secant Chords</span>
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
