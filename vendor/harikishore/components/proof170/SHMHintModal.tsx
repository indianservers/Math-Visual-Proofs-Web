import React, { useState } from 'react';
import { X, Sparkles, ChevronRight, Lightbulb } from 'lucide-react';
import { HintItem } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const H_HINTS: HintItem[] = [
  {
    level: 1,
    type: 'Notice',
    title: '1. Notice the Cosine Waveform x(t)',
    message: 'The displacement follows a standard sinusoidal curve with maximum peak +A and minimum trough -A.',
  },
  {
    level: 2,
    type: 'Choose',
    title: '2. Adjust Angular Frequency ω',
    message: 'Increasing ω packs more wave oscillations per second into the same time window, shortening the period T = 2π/ω.',
  },
  {
    level: 3,
    type: 'Predict',
    title: '3. Predict Energy Transformation',
    message: 'At peak displacement x = ±A, all energy is potential (U = ½kA²). At equilibrium x = 0, all energy is kinetic (K = ½mv²). Total energy K + U remains constant.',
  },
  {
    level: 4,
    type: 'Guide',
    title: '4. The Reference Phasor Connection',
    message: 'Imagine a spotlight shining on a peg on a rotating wheel. The peg\'s shadow moving back and forth on the wall exhibits exact simple harmonic motion.',
  },
  {
    level: 5,
    type: 'Explain',
    title: '5. The Governing Differential Equation',
    message: 'Because acceleration is directly proportional and opposite to displacement (a = -ω²x), Hooke\'s restoring force F = -kx gives natural frequency ω = √(k/m).',
  }
];

export const SHMHintModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [level, setLevel] = useState(1);
  if (!isOpen) return null;
  const current = H_HINTS.find(h => h.level === level) || H_HINTS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-amber-100 relative">
        <button onClick={onClose} className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-sans">SHM Hint Coach</h3>
            <p className="text-xs text-slate-500">Pedagogical hints for Visual Proof 170</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-1 mb-5">
          {H_HINTS.map((h) => (
            <button
              key={h.level}
              onClick={() => setLevel(h.level)}
              className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                level === h.level
                  ? 'bg-amber-500 text-white border-amber-500 scale-105'
                  : level > h.level
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
            >
              {h.type}
            </button>
          ))}
        </div>

        <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h4 className="text-sm font-bold text-slate-900">{current.title}</h4>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {current.message}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-400 font-medium">Hint {level} of 5</span>
          {level < 5 ? (
            <button
              onClick={() => setLevel(l => l + 1)}
              className="inline-flex items-center gap-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl"
            >
              <span>Next Hint</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={onClose} className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl">
              Ready to Prove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
