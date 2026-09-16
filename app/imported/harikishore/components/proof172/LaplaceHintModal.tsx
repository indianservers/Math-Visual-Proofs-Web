import React, { useState } from 'react';
import { X, Sparkles, ChevronRight, Lightbulb } from 'lucide-react';
import { HintItem } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const L_HINTS: HintItem[] = [
  {
    level: 1,
    type: 'Notice',
    title: '1. Notice Time Decay vs Complex Plane',
    message: 'The left plot shows exponential decay f(t) = e^(-at), while the right plot represents the complex frequency s-plane (σ, jω).',
  },
  {
    level: 2,
    type: 'Choose',
    title: '2. Adjust the Decay Rate a',
    message: 'Increasing a causes f(t) to decay much faster in time and shifts the transfer function pole s = -a deeper into the left half of the s-plane.',
  },
  {
    level: 3,
    type: 'Predict',
    title: '3. Predict Stability & ROC',
    message: 'For e^(-at)u(t) to converge under integration, we require Re(s) > -a. The region to the right of the vertical line σ = -a is shaded cyan as the ROC.',
  },
  {
    level: 4,
    type: 'Guide',
    title: '4. Physical Time Constant τ = 1/a',
    message: 'At t = τ = 1/a, the signal decays to exactly 1/e ≈ 36.8% of its initial peak. A pole closer to the jω axis means a sluggish, long-lasting decay.',
  },
  {
    level: 5,
    type: 'Explain',
    title: '5. The Transfer Function Viewpoint',
    message: 'The Laplace transform unifies differential equations into algebraic polynomials: differentiation in time becomes multiplication by s in the frequency domain.',
  }
];

export const LaplaceHintModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [level, setLevel] = useState(1);
  if (!isOpen) return null;
  const current = L_HINTS.find(h => h.level === level) || L_HINTS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-cyan-100 relative">
        <button onClick={onClose} className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-sans">Laplace Transform Hint Coach</h3>
            <p className="text-xs text-slate-500">Pedagogical hints for Visual Proof 172</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-1 mb-5">
          {L_HINTS.map((h) => (
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
              className="inline-flex items-center gap-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl"
            >
              <span>Next Hint</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={onClose} className="px-4 py-2 bg-cyan-600 text-white text-xs font-bold rounded-xl">
              Ready to Prove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
