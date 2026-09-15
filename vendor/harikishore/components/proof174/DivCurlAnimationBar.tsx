import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, HelpCircle } from 'lucide-react';
import { ProofState } from '../../types';

interface Props {
  currentState: ProofState;
  onSelectState: (state: ProofState) => void;
  onOpenHints: () => void;
}

const DC_STATES: { id: ProofState; label: string; step: number; desc: string }[] = [
  { id: 'inspect', label: 'Inspect', step: 1, desc: 'Identify 2D vector field arrows and probe disk' },
  { id: 'manipulate', label: 'Manipulate', step: 2, desc: 'Drag test probe through source, sink, and vortex' },
  { id: 'preserve', label: 'Preserve', step: 3, desc: 'Verify divergence as outward normal flux density' },
  { id: 'connect', label: 'Connect', step: 4, desc: 'Spin paddle wheel to measure curl circulation' },
  { id: 'conclude', label: 'Conclude', step: 5, desc: 'Synthesize 2D Divergence and Green Circulation Theorems' },
  { id: 'transfer', label: 'Transfer', step: 6, desc: 'Test shear flow with zero divergence but nonzero curl' },
];

export const DivCurlAnimationBar: React.FC<Props> = ({
  currentState,
  onSelectState,
  onOpenHints,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<0.5 | 1 | 1.5>(1);

  const currentIndex = DC_STATES.findIndex(s => s.id === currentState);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        const nextIdx = (currentIndex + 1) % DC_STATES.length;
        onSelectState(DC_STATES[nextIdx].id);
      }, 3500 / speed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentIndex, speed, onSelectState]);

  return (
    <div className="bg-white rounded-3xl p-4 md:p-5 border border-pink-100/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
        {DC_STATES.map((st, idx) => {
          const isActive = currentState === st.id;
          const isPassed = idx <= currentIndex;
          return (
            <button
              key={st.id}
              onClick={() => onSelectState(st.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                isActive
                  ? 'bg-pink-600 text-white border-pink-600 shadow-sm scale-105'
                  : isPassed
                  ? 'bg-pink-50 text-pink-800 border-pink-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {st.step}
              </span>
              <span>{st.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 self-end md:self-auto">
        <button
          onClick={() => onSelectState(DC_STATES[Math.max(0, currentIndex - 1)].id)}
          disabled={currentIndex === 0}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-40"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2.5 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white shadow-md shadow-pink-500/20"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
        </button>

        <button
          onClick={() => onSelectState(DC_STATES[Math.min(DC_STATES.length - 1, currentIndex + 1)].id)}
          disabled={currentIndex === DC_STATES.length - 1}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-40"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <button
          onClick={() => setSpeed(s => (s === 0.5 ? 1 : s === 1 ? 1.5 : 0.5))}
          className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-mono font-bold"
        >
          {speed}x
        </button>

        <div className="h-5 w-[1px] bg-slate-200 mx-1" />

        <button
          onClick={onOpenHints}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 rounded-xl text-xs font-bold"
        >
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span>Hint Coach</span>
        </button>
      </div>
    </div>
  );
};
