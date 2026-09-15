import React from 'react';
import { Target, Grid, Magnet, Eye, Activity, Zap, Play } from 'lucide-react';

interface MissionBarProps {
  showSpring: boolean;
  setShowSpring: (val: boolean | ((prev: boolean) => boolean)) => void;
  showWave: boolean;
  setShowWave: (val: boolean | ((prev: boolean) => boolean)) => void;
  showPhasor: boolean;
  setShowPhasor: (val: boolean | ((prev: boolean) => boolean)) => void;
  showEnergy: boolean;
  setShowEnergy: (val: boolean | ((prev: boolean) => boolean)) => void;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const SHMMissionBar: React.FC<MissionBarProps> = ({
  showSpring,
  setShowSpring,
  showWave,
  setShowWave,
  showPhasor,
  setShowPhasor,
  showEnergy,
  setShowEnergy,
  snapEnabled,
  setSnapEnabled,
}) => {
  const toggle = (setter: (fn: (prev: boolean) => boolean) => void) => {
    setter(prev => !prev);
  };

  return (
    <div className="bg-white rounded-2xl p-3.5 md:p-4 border border-amber-100/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Left Mission Prompt */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 border border-amber-100 shadow-inner">
          <Target className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight font-sans">
            Connect an oscillating mass to x(t)=A cos(omega t + phi).
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Link amplitude, angular frequency, phase, and energy conservation across physical mass-spring and waveform domains.
          </p>
        </div>
      </div>

      {/* Right Show Controls */}
      <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
        <span className="text-xs font-semibold text-slate-400 mr-1">Show</span>

        <button
          onClick={() => toggle(setShowSpring)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showSpring
              ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Mass-Spring</span>
        </button>

        <button
          onClick={() => toggle(setShowWave)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showWave
              ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="font-serif italic font-bold text-xs">x(t)</span>
          <span>Cosine Graph</span>
        </button>

        <button
          onClick={() => toggle(setShowPhasor)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showPhasor
              ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Phasor Circle</span>
        </button>

        <button
          onClick={() => toggle(setShowEnergy)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showEnergy
              ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Energy (K+U)</span>
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
