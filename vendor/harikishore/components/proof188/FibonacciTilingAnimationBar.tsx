import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, FastForward, CheckCircle2 } from 'lucide-react';
import { ProofState } from '../../types';

interface AnimationBarProps {
  n: number;
  setN: (n: number | ((prev: number) => number)) => void;
  proofState: ProofState;
  setProofState: (state: ProofState) => void;
}

export const FibonacciTilingAnimationBar: React.FC<AnimationBarProps> = ({
  n,
  setN,
  proofState,
  setProofState,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);

  const steps = [
    { n: 2, label: '1. Base Tiles (1, 1)' },
    { n: 3, label: '2. Attach F3 = 2' },
    { n: 4, label: '3. Attach F4 = 3' },
    { n: 5, label: '4. Attach F5 = 5' },
    { n: 6, label: '5. Attach F6 = 8' },
    { n: 7, label: '6. Attach F7 = 13' },
  ];

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        setN(prev => {
          const current = prev as number;
          if (current >= 7) {
            setIsPlaying(false);
            return 7;
          }
          return current + 1;
        });
      }, 1800 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed, setN]);

  return (
    <div className="bg-white rounded-3xl p-4 md:p-5 border border-emerald-100/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 transition-all"
          title={isPlaying ? "Pause Tiling Animation" : "Play Tiling Animation"}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 translate-x-0.5" />}
        </button>

        <button
          onClick={() => {
            setIsPlaying(false);
            setN(1);
          }}
          className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all"
          title="Reset to Step 1"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Speed button */}
        <button
          onClick={() => {
            const nextSpeed = speed === 1 ? 2 : speed === 2 ? 0.5 : 1;
            setSpeed(nextSpeed);
          }}
          className="px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-mono transition-all flex items-center gap-1"
        >
          <FastForward className="w-3.5 h-3.5 text-slate-500" />
          <span>{speed}x</span>
        </button>
      </div>

      {/* Step Pills */}
      <div className="flex flex-wrap items-center gap-1.5 justify-center flex-1 max-w-2xl">
        {steps.map((st, idx) => {
          const isActive = n === st.n;
          const isPassed = n > st.n;

          return (
            <button
              key={idx}
              onClick={() => {
                setIsPlaying(false);
                setN(st.n);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isPassed
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {isPassed && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
              <span>{st.label}</span>
            </button>
          );
        })}
      </div>

      {/* Proof completion badge */}
      <div className="hidden lg:flex items-center gap-2">
        <span className="text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          Rect: F{n} × F{n + 1}
        </span>
      </div>
    </div>
  );
};
