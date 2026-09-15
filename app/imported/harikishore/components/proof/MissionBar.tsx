import React from 'react';
import { Target, Grid, Compass, Magnet, CircleDot } from 'lucide-react';
import { sound } from '../../utils/sound';

interface MissionBarProps {
  showGrid: boolean;
  setShowGrid: (val: boolean | ((prev: boolean) => boolean)) => void;
  showAxes: boolean;
  setShowAxes: (val: boolean | ((prev: boolean) => boolean)) => void;
  showCentre: boolean;
  setShowCentre: (val: boolean | ((prev: boolean) => boolean)) => void;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const MissionBar: React.FC<MissionBarProps> = ({
  showGrid,
  setShowGrid,
  showAxes,
  setShowAxes,
  showCentre,
  setShowCentre,
  snapEnabled,
  setSnapEnabled,
}) => {
  const toggle = (setter: (fn: (prev: boolean) => boolean) => void) => {
    sound.playClick();
    setter(prev => !prev);
  };

  return (
    <div className="bg-white rounded-2xl p-3.5 md:p-4 border border-indigo-100/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Left Mission Prompt */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100 shadow-inner">
          <Target className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight font-sans">
            Drag shapes to the targets.
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Reveal and count line symmetries (mirrors) and rotational symmetry (turns).
          </p>
        </div>
      </div>

      {/* Right Show Toggles */}
      <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
        <span className="text-xs font-semibold text-slate-400 mr-1">Show</span>

        {/* Grid Toggle */}
        <button
          onClick={() => toggle(setShowGrid)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showGrid
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
          title="Toggle Grid Lines"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Grid</span>
        </button>

        {/* Axes Toggle */}
        <button
          onClick={() => toggle(setShowAxes)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showAxes
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
          title="Toggle Symmetry & Coordinate Axes"
        >
          <span className="font-mono text-xs">---</span>
          <span>Axes</span>
        </button>

        {/* Centre Toggle */}
        <button
          onClick={() => toggle(setShowCentre)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showCentre
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
          title="Toggle Center of Rotation"
        >
          <CircleDot className="w-3.5 h-3.5" />
          <span>Centre</span>
        </button>

        {/* Snap Toggle */}
        <button
          onClick={() => toggle(setSnapEnabled)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            snapEnabled
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
          title="Toggle Symmetry Angle Snapping"
        >
          <Magnet className="w-3.5 h-3.5" />
          <span>Snap</span>
        </button>
      </div>
    </div>
  );
};
