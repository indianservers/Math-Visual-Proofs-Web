import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, FastForward, HelpCircle } from 'lucide-react';
import { ProofState } from '../../types';
import { sound } from '../../utils/sound';

interface AnimationPlayerBarProps {
  currentState: ProofState;
  onSelectState: (state: ProofState) => void;
  onOpenHints: () => void;
}

const PROOF_STATES: { id: ProofState; label: string; step: number; desc: string }[] = [
  { id: 'inspect', label: 'Inspect', step: 1, desc: 'Identify givens and symmetric properties' },
  { id: 'manipulate', label: 'Manipulate', step: 2, desc: 'Test mirror lines and rotation angles' },
  { id: 'preserve', label: 'Preserve', step: 3, desc: 'Verify rigid motion invariants' },
  { id: 'connect', label: 'Connect', step: 4, desc: 'Tabulate line symmetry vs rotational order' },
  { id: 'conclude', label: 'Conclude', step: 5, desc: 'Synthesize the regular n-gon theorem' },
  { id: 'transfer', label: 'Transfer', step: 6, desc: 'Apply to arbitrary regular polygons' },
];

export const AnimationPlayerBar: React.FC<AnimationPlayerBarProps> = ({
  currentState,
  onSelectState,
  onOpenHints,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<0.5 | 1 | 1.5>(1);

  const currentIndex = PROOF_STATES.findIndex(s => s.id === currentState);

  // Auto-play timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      const intervalMs = 3500 / playbackSpeed;
      timer = setInterval(() => {
        const nextIdx = (currentIndex + 1) % PROOF_STATES.length;
        onSelectState(PROOF_STATES[nextIdx].id);
        sound.playSnap();
      }, intervalMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentIndex, playbackSpeed, onSelectState]);

  const handleNext = () => {
    sound.playClick();
    const nextIdx = Math.min(currentIndex + 1, PROOF_STATES.length - 1);
    onSelectState(PROOF_STATES[nextIdx].id);
  };

  const handlePrev = () => {
    sound.playClick();
    const prevIdx = Math.max(currentIndex - 1, 0);
    onSelectState(PROOF_STATES[prevIdx].id);
  };

  const handleTogglePlay = () => {
    sound.playClick();
    setIsPlaying(!isPlaying);
  };

  const handleSpeedToggle = () => {
    sound.playClick();
    setPlaybackSpeed(prev => (prev === 0.5 ? 1 : prev === 1 ? 1.5 : 0.5));
  };

  return (
    <div className="bg-white rounded-3xl p-4 md:p-5 border border-indigo-100/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
      {/* 6 Proof Stages Step Indicators */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
        {PROOF_STATES.map((st, idx) => {
          const isActive = currentState === st.id;
          const isPassed = idx <= currentIndex;
          return (
            <button
              key={st.id}
              onClick={() => {
                sound.playClick();
                onSelectState(st.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm scale-105'
                  : isPassed
                  ? 'bg-indigo-50/80 text-indigo-700 border-indigo-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
              }`}
              title={st.desc}
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

      {/* Playback Controls & Hint Coach Trigger */}
      <div className="flex items-center gap-2 self-end md:self-auto">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
          title="Previous Proof Stage"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={handleTogglePlay}
          className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-105"
          title={isPlaying ? 'Pause Guided Tour' : 'Play Guided Tour'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === PROOF_STATES.length - 1}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
          title="Next Proof Stage"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <button
          onClick={handleSpeedToggle}
          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold transition-colors"
          title="Toggle Animation Speed"
        >
          {playbackSpeed}x
        </button>

        <div className="h-5 w-[1px] bg-slate-200 mx-1" />

        <button
          onClick={onOpenHints}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 rounded-xl text-xs font-bold transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span>Hint Coach</span>
        </button>
      </div>
    </div>
  );
};
