import React, { useState } from 'react';
import { X, Sparkles, ChevronRight, Lightbulb } from 'lucide-react';
import { HintItem } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SIERPINSKI_HINTS: HintItem[] = [
  {
    level: 1,
    type: 'Notice',
    title: '1. Notice the Center Square Cutout',
    message: 'Dividing the square into a 3×3 grid yields 9 identical sub-squares. Only the 1 center square is removed!',
  },
  {
    level: 2,
    type: 'Choose',
    title: '2. The Retention Factor (8/9)',
    message: 'Since 8 of the 9 squares remain, exactly 8/9 (≈ 88.9%) of the area is preserved in the very first iteration.',
  },
  {
    level: 3,
    type: 'Predict',
    title: '3. Recursive Punching',
    message: 'In iteration 2, each of the 8 surviving squares is itself subdivided into 9 parts, discarding its center. Now 8 × 8 = 64 squares remain.',
  },
  {
    level: 4,
    type: 'Guide',
    title: '4. Exponential Area Formula (8/9)ⁿ',
    message: 'At step n, the total retained area is (8/9)ⁿ. Because each step multiplies by a fraction less than 1, area shrinks steadily.',
  },
  {
    level: 5,
    type: 'Explain',
    title: '5. The Infinite Vanishing Limit',
    message: 'As n → ∞, lim (8/9)ⁿ = 0. The carpet has zero 2D area, yet its border perimeter blows up to infinity!',
  }
];

export const SierpinskiHintModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [level, setLevel] = useState(1);
  if (!isOpen) return null;
  const current = SIERPINSKI_HINTS.find(h => h.level === level) || SIERPINSKI_HINTS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-indigo-100 relative">
        <button onClick={onClose} className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-sans">Sierpinski Fractal Hint Coach</h3>
            <p className="text-xs text-slate-500 font-sans">Self-similar punchout & geometric decay</p>
          </div>
        </div>

        <div className="flex gap-1.5 mb-6">
          {SIERPINSKI_HINTS.map(h => (
            <button
              key={h.level}
              onClick={() => setLevel(h.level)}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                h.level === level ? 'bg-indigo-600' : h.level < level ? 'bg-indigo-200' : 'bg-slate-100'
              }`}
            />
          ))}
        </div>

        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
              Level {current.level} · {current.type}
            </span>
            <span className="font-bold text-slate-800 text-sm">{current.title}</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed font-sans mt-2">{current.message}</p>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setLevel(prev => Math.max(1, prev - 1))}
            disabled={level === 1}
            className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-40 disabled:hover:text-slate-500"
          >
            Previous
          </button>
          <div className="flex gap-2">
            {level < SIERPINSKI_HINTS.length ? (
              <button
                onClick={() => setLevel(prev => Math.min(SIERPINSKI_HINTS.length, prev + 1))}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-indigo-200"
              >
                Next Hint <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-emerald-200"
              >
                Got It! <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};