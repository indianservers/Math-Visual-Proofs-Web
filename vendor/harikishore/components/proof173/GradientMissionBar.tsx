import React from 'react';
import { Target, TrendingUp, Eye, Compass, Grid, Magnet } from 'lucide-react';

interface MissionBarProps {
  showContours: boolean;
  setShowContours: (val: boolean | ((prev: boolean) => boolean)) => void;
  showGradient: boolean;
  setShowGradient: (val: boolean | ((prev: boolean) => boolean)) => void;
  showTangent: boolean;
  setShowTangent: (val: boolean | ((prev: boolean) => boolean)) => void;
  showDirectionalProbe: boolean;
  setShowDirectionalProbe: (val: boolean | ((prev: boolean) => boolean)) => void;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const GradientMissionBar: React.FC<MissionBarProps> = ({
  showContours,
  setShowContours,
  showGradient,
  setShowGradient,
  showTangent,
  setShowTangent,
  showDirectionalProbe,
  setShowDirectionalProbe,
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
            Drag a point on contours and see grad f point uphill, perpendicular to level curves.
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Discover why ∇f is strictly orthogonal to level curves f(x,y)=C and aligns with the maximum directional derivative.
          </p>
        </div>
      </div>

      {/* Right Show Controls */}
      <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
        <span className="text-xs font-semibold text-slate-400 mr-1">Show</span>

        <button
          onClick={() => toggle(setShowContours)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showContours
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Level Curves</span>
        </button>

        <button
          onClick={() => toggle(setShowGradient)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showGradient
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>Gradient ∇f</span>
        </button>

        <button
          onClick={() => toggle(setShowTangent)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showTangent
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-indigo-500" />
          <span>Tangent Line (90°)</span>
        </button>

        <button
          onClick={() => toggle(setShowDirectionalProbe)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showDirectionalProbe
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-amber-500" />
          <span>Directional D_u</span>
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
