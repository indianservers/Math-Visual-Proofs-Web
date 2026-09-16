import React from 'react';
import { Target, Radio, Activity, Eye, Zap, Magnet } from 'lucide-react';

interface MissionBarProps {
  showTarget: boolean;
  setShowTarget: (val: boolean | ((prev: boolean) => boolean)) => void;
  showFourier: boolean;
  setShowFourier: (val: boolean | ((prev: boolean) => boolean)) => void;
  showError: boolean;
  setShowError: (val: boolean | ((prev: boolean) => boolean)) => void;
  showSpectrum: boolean;
  setShowSpectrum: (val: boolean | ((prev: boolean) => boolean)) => void;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const FourierMissionBar: React.FC<MissionBarProps> = ({
  showTarget,
  setShowTarget,
  showFourier,
  setShowFourier,
  showError,
  setShowError,
  showSpectrum,
  setShowSpectrum,
  snapEnabled,
  setSnapEnabled,
}) => {
  const toggle = (setter: (fn: (prev: boolean) => boolean) => void) => {
    setter(prev => !prev);
  };

  return (
    <div className="bg-white rounded-2xl p-3.5 md:p-4 border border-violet-100/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Left Mission Prompt */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 shrink-0 border border-violet-100 shadow-inner">
          <Target className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight font-sans">
            Add harmonic waves and watch a periodic signal approximation improve.
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Superimpose sine and cosine harmonics to reconstruct square, sawtooth, and triangle waveforms with real-time error tracking.
          </p>
        </div>
      </div>

      {/* Right Show Controls */}
      <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
        <span className="text-xs font-semibold text-slate-400 mr-1">Show</span>

        <button
          onClick={() => toggle(setShowTarget)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showTarget
              ? 'bg-violet-50 text-violet-800 border-violet-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Target Wave</span>
        </button>

        <button
          onClick={() => toggle(setShowFourier)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showFourier
              ? 'bg-violet-50 text-violet-800 border-violet-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-violet-600" />
          <span>Partial Sum S_N(t)</span>
        </button>

        <button
          onClick={() => toggle(setShowError)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showError
              ? 'bg-violet-50 text-violet-800 border-violet-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Error Band</span>
        </button>

        <button
          onClick={() => toggle(setShowSpectrum)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showSpectrum
              ? 'bg-violet-50 text-violet-800 border-violet-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Spectrum</span>
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
