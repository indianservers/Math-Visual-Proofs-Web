import React, { useState } from 'react';
import { X, Sparkles, ChevronRight, Lightbulb } from 'lucide-react';
import { HintItem } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TRAP_HINTS: HintItem[] = [
  {
    level: 1,
    type: 'Notice',
    title: '1. Notice the Subinterval Width h',
    message: 'The interval [a, b] is divided into n equal subintervals. The step width of each strip is h = (b - a) / n.',
  },
  {
    level: 2,
    type: 'Choose',
    title: '2. Adjust the Subinterval Count n',
    message: 'Increase n from 2 to 8. As n grows, the trapezoids fit the curve much closer, and the error drops rapidly.',
  },
  {
    level: 3,
    type: 'Predict',
    title: '3. Predict Why Interior Nodes are Doubled',
    message: 'Look at the node tags: endpoints x_0 and x_n have badge ×1, but all interior nodes x_1, ..., x_{n-1} have badge ×2. Why?',
  },
  {
    level: 4,
    type: 'Guide',
    title: '4. Algebraic Overlap Breakdown',
    message: 'Strip 1 uses (y_0 + y_1), Strip 2 uses (y_1 + y_2). Summing them gives y_0 + 2y_1 + y_2. Every interior line is shared by two neighboring strips!',
  },
  {
    level: 5,
    type: 'Explain',
    title: '5. The Limit as n Approaches Infinity',
    message: 'As n → ∞ (h → 0), the composite trapezoid sum T_n converges to the exact Riemann definite integral ∫_a^b f(x) dx.',
  }
];

export const TrapezoidHintModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [level, setLevel] = useState(1);
  if (!isOpen) return null;
  const current = TRAP_HINTS.find(h => h.level === level) || TRAP_HINTS[0];

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
            <h3 className="text-lg font-bold text-slate-900 font-sans">Trapezoidal Rule Hint Coach</h3>
            <p className="text-xs text-slate-500">Pedagogical hints for Visual Proof 175</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-1 mb-5">
          {TRAP_HINTS.map((h) => (
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
