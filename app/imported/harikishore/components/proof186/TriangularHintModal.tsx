import React, { useState } from 'react';
import { X, Sparkles, ChevronRight, Lightbulb } from 'lucide-react';
import { HintItem } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TRIANGULAR_HINTS: HintItem[] = [
  {
    level: 1,
    type: 'Notice',
    title: '1. Notice the Row Pattern',
    message: 'Row 1 has 1 dot, row 2 has 2 dots, row 3 has 3 dots... Row n has n dots.',
  },
  {
    level: 2,
    type: 'Choose',
    title: '2. The Duplicate Twin Strategy',
    message: 'Instead of summing one by one, make an exact duplicate copy of the triangle and invert it.',
  },
  {
    level: 3,
    type: 'Predict',
    title: '3. Perfect Row Matching',
    message: 'When interlocked, row k (k dots) combines with row (n + 1 - k dots). Every single row has exactly n + 1 dots!',
  },
  {
    level: 4,
    type: 'Guide',
    title: '4. Count the Rectangle Dots',
    message: 'With n rows and (n + 1) columns, the full rectangle holds exactly n · (n + 1) dots.',
  },
  {
    level: 5,
    type: 'Explain',
    title: '5. Halving to Get T_n',
    message: 'The original triangle is exactly half of the rectangle! Therefore, Tn = n(n + 1) / 2.',
  }
];

export const TriangularHintModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [level, setLevel] = useState(1);
  if (!isOpen) return null;
  const current = TRIANGULAR_HINTS.find(h => h.level === level) || TRIANGULAR_HINTS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-sky-100 relative">
        <button onClick={onClose} className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-sans">Triangular Numbers Hint Coach</h3>
            <p className="text-xs text-slate-500 font-sans">Twin triangle rectangular pairing intuition</p>
          </div>
        </div>

        <div className="flex gap-1.5 mb-6">
          {TRIANGULAR_HINTS.map(h => (
            <button
              key={h.level}
              onClick={() => setLevel(h.level)}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                h.level === level ? 'bg-sky-600' : h.level < level ? 'bg-sky-200' : 'bg-slate-100'
              }`}
            />
          ))}
        </div>

        <div className="bg-sky-50/50 border border-sky-100 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-700">
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
            {level < TRIANGULAR_HINTS.length ? (
              <button
                onClick={() => setLevel(prev => Math.min(TRIANGULAR_HINTS.length, prev + 1))}
                className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-sky-200"
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