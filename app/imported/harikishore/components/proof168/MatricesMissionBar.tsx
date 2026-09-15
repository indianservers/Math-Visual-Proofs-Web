import React from 'react';
import { Target, Grid, Magnet, Eye, Maximize2, Sparkles } from 'lucide-react';
import { sound } from '../../utils/sound';

interface MissionBarProps {
  showOriginalGrid: boolean;
  setShowOriginalGrid: (val: boolean | ((prev: boolean) => boolean)) => void;
  showTransformedGrid: boolean;
  setShowTransformedGrid: (val: boolean | ((prev: boolean) => boolean)) => void;
  showBasisVectors: boolean;
  setShowBasisVectors: (val: boolean | ((prev: boolean) => boolean)) => void;
  showArea: boolean;
  setShowArea: (val: boolean | ((prev: boolean) => boolean)) => void;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const MatricesMissionBar: React.FC<MissionBarProps> = ({
  showOriginalGrid,
  setShowOriginalGrid,
  showTransformedGrid,
  setShowTransformedGrid,
  showBasisVectors,
  setShowBasisVectors,
  showArea,
  setShowArea,
  snapEnabled,
  setSnapEnabled,
}) => {
  const toggle = (setter: (fn: (prev: boolean) => boolean) => void) => {
    sound.playClick();
    setter(prev => !prev);
  };

  return (
    <div className="bg-white rounded-2xl p-3.5 md:p-4 border border-blue-100/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Left Mission Prompt */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100 shadow-inner">
          <Target className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight font-sans">
            Use a matrix to transform basis vectors, shapes, and every point by one rule.
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Drag the basis vector arrowheads (î and ĵ) or edit matrix values to see the linear transformation in action.
          </p>
        </div>
      </div>

      {/* Right Show Toggles */}
      <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
        <span className="text-xs font-semibold text-slate-400 mr-1">Show</span>

        <button
          onClick={() => toggle(setShowOriginalGrid)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showOriginalGrid
              ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Base Grid</span>
        </button>

        <button
          onClick={() => toggle(setShowTransformedGrid)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showTransformedGrid
              ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5 text-indigo-500" />
          <span>Transformed Grid</span>
        </button>

        <button
          onClick={() => toggle(setShowBasisVectors)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showBasisVectors
              ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="font-mono text-xs font-bold text-emerald-600">î</span>
          <span className="font-mono text-xs font-bold text-rose-500">ĵ</span>
          <span>Basis</span>
        </button>

        <button
          onClick={() => toggle(setShowArea)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            showArea
              ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Det Area</span>
        </button>

        <button
          onClick={() => toggle(setSnapEnabled)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            snapEnabled
              ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
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
