import React from 'react';
import { Target, RotateCcw, Activity, Eye, Disc, Magnet } from 'lucide-react';

interface MissionBarProps {
  showFieldGrid: boolean;
  setShowFieldGrid: (val: boolean | ((prev: boolean) => boolean)) => void;
  showProbe: boolean;
  setShowProbe: (val: boolean | ((prev: boolean) => boolean)) => void;
  showFlux: boolean;
  setShowFlux: (val: boolean | ((prev: boolean) => boolean)) => void;
  showPaddle: boolean;
  setShowPaddle: (val: boolean | ((prev: boolean) => boolean)) => void;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const DivCurlMissionBar: React.FC<MissionBarProps> = ({
  showFieldGrid,
  setShowFieldGrid,
  showProbe,
  setShowProbe,
  showFlux,
  setShowFlux,
  showPaddle,
  setShowPaddle,
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
            Compare source, sink, rotation, and uniform vector fields using a local test region.
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Test outward expansion flux (divergence) and local micro-rotation (curl) with a draggable test probe and paddle wheel.
          </p>
        </div>
      </div>

      {/* Right Show Controls */}
      <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
        <span className="text-xs font-semibold text-slate-400 mr-1">Show</span>

        <button
          onClick={() => toggle(setShowFieldGrid)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showFieldGrid
              ? 'bg-pink-50 text-pink-800 border-pink-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-pink-600" />
          <span>Vector Field</span>
        </button>

        <button
          onClick={() => toggle(setShowProbe)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showProbe
              ? 'bg-pink-50 text-pink-800 border-pink-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Disc className="w-3.5 h-3.5 text-indigo-500" />
          <span>Test Region</span>
        </button>

        <button
          onClick={() => toggle(setShowFlux)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showFlux
              ? 'bg-pink-50 text-pink-800 border-pink-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-cyan-500" />
          <span>Flux Arrows</span>
        </button>

        <button
          onClick={() => toggle(setShowPaddle)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showPaddle
              ? 'bg-pink-50 text-pink-800 border-pink-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
          <span>Paddle Wheel</span>
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
