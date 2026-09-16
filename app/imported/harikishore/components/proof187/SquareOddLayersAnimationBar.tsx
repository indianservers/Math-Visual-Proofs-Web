import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, HelpCircle } from 'lucide-react';
import { ProofState } from '../../types';

interface Props {
  currentState: ProofState;
  onSelectState: (state: ProofState) => void;
  onOpenHints: () => void;
}

const SQUARE_ODD_STATES: { id: ProofState; label: string; step: number; desc: string }[] = [
  { id: 'inspect', label: 'Inspect', step: 1, desc: 'Start with 1 unit tile: 1² = 1 (first odd number)' },
  { id: 'manipulate', label: 'Attach L-Layer', step: 2, desc: 'Add L-shaped layer of 2n - 1 tiles around (n-1)²' },
  { id: 'preserve', label: 'Preserve Square', step: 3, desc: 'Notice the resulting shape remains a perfect square' },
  { id: 'connect', label: 'Connect Diff', step: 4, desc: 'Equate L-layer count to difference n² - (n - 1)²' },
  { id: 'conclude', label: 'Sum = n²', step: 5, desc: 'Telescoping sum of first n odds equals n²' },
  { id: 'transfer', label: 'Scale Up', step: 6, desc: 'Apply to n = 10: 1 + 3 + ... + 19 = 10² = 100' },
];

export const SquareOddLayersAnimationBar: React.FC<Props> = ({
  currentState,
  onSelectState,
  onOpenHints,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<0.5 | 1 | 1.5>(1);

  const currentIndex = SQUARE_ODD_STATES.findIndex(s => s.id === currentState);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        const nextIdx = (currentIndex + 1) % SQUARE_ODD_STATES.length;
        onSelectState(SQUARE_ODD_STATES[nextIdx].id);
      }, 3500 / speed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentIndex, speed, onSelectState]);

  return (
    <div className="bg-white rounded-3xl p-4 md:p-5 border border-amber-100/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
        {SQUARE_ODD_STATES.map((st, idx) => {
          const isActive = currentState === st.id;
          const isPassed = idx <= currentIndex;
          return (
            <button
              key={st.id}
              onClick={() => onSelectState(st.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                isActive
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm scale-105'
                  : isPassed
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                isActive ? 'bg-white text-amber-600' : 'bg-slate-200 text-slate-600'
              }`}>
                {st.step}
              </span>
              <span>{st.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const prevIdx = (currentIndex - 1 + SQUARE_ODD_STATES.length) % SQUARE_ODD_STATES.length;
              onSelectState(SQUARE_ODD_STATES[prevIdx].id);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            title="Previous Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-xl transition-all ${
              isPlaying ? 'bg-rose-500 text-white shadow-sm' : 'bg-amber-600 text-white shadow-sm'
            }`}
            title={isPlaying ? 'Pause Stepper' : 'Auto Play Stepper'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>

          <button
            onClick={() => {
              const nextIdx = (currentIndex + 1) % SQUARE_ODD_STATES.length;
              onSelectState(SQUARE_ODD_STATES[nextIdx].id);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            title="Next Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/80">
          {([0.5, 1, 1.5] as const).map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                speed === s ? 'bg-white text-amber-600 shadow-2xs' : 'text-slate-400'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        <button
          onClick={onOpenHints}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Hint Coach</span>
        </button>
      </div>
    </div>
  );
};