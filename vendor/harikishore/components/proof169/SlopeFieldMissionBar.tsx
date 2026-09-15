import React from 'react';
import { Target, Grid, Magnet, Eye, Compass, TrendingUp, Sparkles, ArrowRight, ArrowUp, Box } from 'lucide-react';

interface MissionBarProps {
  showGrid: boolean;
  setShowGrid: (val: boolean | ((prev: boolean) => boolean)) => void;
  showArrows: boolean;
  setShowArrows: (val: boolean | ((prev: boolean) => boolean)) => void;
  showCurve: boolean;
  setShowCurve: (val: boolean | ((prev: boolean) => boolean)) => void;
  showEuler: boolean;
  setShowEuler: (val: boolean | ((prev: boolean) => boolean)) => void;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
  showXVariation: boolean;
  setShowXVariation: (val: boolean | ((prev: boolean) => boolean)) => void;
  showYVariation: boolean;
  setShowYVariation: (val: boolean | ((prev: boolean) => boolean)) => void;
  show3DPlane: boolean;
  setShow3DPlane: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const SlopeFieldMissionBar: React.FC<MissionBarProps> = ({
  showGrid,
  setShowGrid,
  showArrows,
  setShowArrows,
  showCurve,
  setShowCurve,
  showEuler,
  setShowEuler,
  snapEnabled,
  setSnapEnabled,
  showXVariation,
  setShowXVariation,
  showYVariation,
  setShowYVariation,
  show3DPlane,
  setShow3DPlane,
}) => {
  const toggle = (setter: (fn: (prev: boolean) => boolean) => void) => {
    setter(prev => !prev);
  };

  return (
    <div className="bg-white rounded-2xl p-3.5 md:p-4 border border-sky-100/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Left Mission Statement */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0 border border-sky-100 shadow-inner">
          <Target className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight font-sans">
            Read dy/dx=f(x,y) as local direction arrows and trace a solution from an initial condition.
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Drag initial condition point (x₀, y₀) to see how the integral curve follows the direction field.
          </p>
        </div>
      </div>

      {/* Right Show Controls */}
      <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
        <span className="text-xs font-semibold text-slate-400 mr-1">Show</span>

        <button
          onClick={() => toggle(setShowGrid)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showGrid
              ? 'bg-sky-50 text-sky-700 border-sky-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Grid</span>
        </button>

        <button
          onClick={() => toggle(setShowArrows)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showArrows
              ? 'bg-sky-50 text-sky-700 border-sky-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-indigo-500" />
          <span>Slope Field</span>
        </button>

        <button
          onClick={() => toggle(setShowCurve)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showCurve
              ? 'bg-sky-50 text-sky-700 border-sky-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
          <span>Solution Curve</span>
        </button>

        <button
          onClick={() => toggle(setShowEuler)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showEuler
              ? 'bg-sky-50 text-sky-700 border-sky-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Euler Tangent</span>
        </button>

        <button
          onClick={() => toggle(setSnapEnabled)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            snapEnabled
              ? 'bg-sky-50 text-sky-700 border-sky-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Magnet className="w-3.5 h-3.5" />
          <span>Snap</span>
        </button>

        <button
          onClick={() => toggle(setShowXVariation)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showXVariation
              ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
          <span>X-Var</span>
        </button>

        <button
          onClick={() => toggle(setShowYVariation)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showYVariation
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>Y-Var</span>
        </button>

        <button
          onClick={() => toggle(setShow3DPlane)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            show3DPlane
              ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Box className="w-3.5 h-3.5 text-purple-600" />
          <span>3D Plane</span>
        </button>
      </div>
    </div>
  );
};
