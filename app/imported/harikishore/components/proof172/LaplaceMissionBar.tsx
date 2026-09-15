import React from 'react';
import { Target, Activity, Zap, Eye, Grid, Magnet } from 'lucide-react';

interface MissionBarProps {
  showTimeCurve: boolean;
  setShowTimeCurve: (val: boolean | ((prev: boolean) => boolean)) => void;
  showTau: boolean;
  setShowTau: (val: boolean | ((prev: boolean) => boolean)) => void;
  showPoles: boolean;
  setShowPoles: (val: boolean | ((prev: boolean) => boolean)) => void;
  showROC: boolean;
  setShowROC: (val: boolean | ((prev: boolean) => boolean)) => void;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const LaplaceMissionBar: React.FC<MissionBarProps> = ({
  showTimeCurve,
  setShowTimeCurve,
  showTau,
  setShowTau,
  showPoles,
  setShowPoles,
  showROC,
  setShowROC,
  snapEnabled,
  setSnapEnabled,
}) => {
  const toggle = (setter: (fn: (prev: boolean) => boolean) => void) => {
    setter(prev => !prev);
  };

  return (
    <div className="bg-white rounded-2xl p-3.5 md:p-4 border border-cyan-100/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Left Mission Prompt */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0 border border-cyan-100 shadow-inner">
          <Target className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight font-sans">
            Transform e^(-at) into 1/(s+a) and compare time decay with s-domain expression.
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Connect time-domain exponential decay rate a to s-domain transfer function pole location s = -a and Region of Convergence.
          </p>
        </div>
      </div>

      {/* Right Show Controls */}
      <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
        <span className="text-xs font-semibold text-slate-400 mr-1">Show</span>

        <button
          onClick={() => toggle(setShowTimeCurve)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showTimeCurve
              ? 'bg-cyan-50 text-cyan-800 border-cyan-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-cyan-600" />
          <span>Time Decay f(t)</span>
        </button>

        <button
          onClick={() => toggle(setShowTau)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showTau
              ? 'bg-cyan-50 text-cyan-800 border-cyan-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-indigo-500" />
          <span>Time Const τ = 1/a</span>
        </button>

        <button
          onClick={() => toggle(setShowPoles)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showPoles
              ? 'bg-cyan-50 text-cyan-800 border-cyan-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-rose-500" />
          <span>s-Plane Pole (X)</span>
        </button>

        <button
          onClick={() => toggle(setShowROC)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showROC
              ? 'bg-cyan-50 text-cyan-800 border-cyan-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>ROC Area</span>
        </button>

        <button
          onClick={() => toggle(setSnapEnabled)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            snapEnabled
              ? 'bg-cyan-50 text-cyan-800 border-cyan-200 shadow-sm'
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
