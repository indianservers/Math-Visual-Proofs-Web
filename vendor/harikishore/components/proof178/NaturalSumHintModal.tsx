import React, { useState } from 'react';
import { X, Sparkles, ChevronRight, Lightbulb } from 'lucide-react';
import { HintItem } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const NATURAL_HINTS: HintItem[] = [
  {
    level: 1,
    type: 'Notice',
    title: '1. Notice the Triangular Staircase',
    message: 'Row 1 has 1 dot, Row 2 has 2 dots, Row 3 has 3 dots... Row n has n dots. Adding all rows gives 1 + 2 + ... + n.',
  },
  {
    level: 2,
    type: 'Choose',
    title: '2. Duplicate and Rotate',
    message: 'Look at the orange twin staircase. It has the exact same number of dots, but is rotated upside down.',
  },
  {
    level: 3,
    type: 'Predict',
    title: '3. Predict the Rectangle Shape',
    message: 'When the two staircases slide together, what shape do they form? Count how many rows and columns!',
  },
  {
    level: 4,
    type: 'Guide',
    title: '4. Interlocking Columns',
    message: 'Because row 1 (1 dot) meets row n (n dots), every combined row has exactly 1 + n = n + 1 dots.',
  },
  {
    level: 5,
    type: 'Explain',
    title: '5. The Half Area Conclusion',
    message: 'The whole rectangle has n × (n + 1) dots. Since we used two identical staircases, one staircase has half: n(n + 1)/2.',
  }
];

export const NaturalSumHintModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [level, setLevel] = useState(1);
  if (!isOpen) return null;
  const current = NATURAL_HINTS.find(h => h.level === level) || NATURAL_HINTS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-blue-100 relative">
        <button onClick={onClose} className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-sans">Natural Numbers Sum Hint Coach</h3>
            <p className="text-xs text-slate-500">Pedagogical hints for Visual Proof 178</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-1 mb-5">
          {NATURAL_HINTS.map((h) => (
            <button
              key={h.level}
              onClick={() => setLevel(h.level)}
              className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                level === h.level
                  ? 'bg-blue-600 text-white border-blue-600 scale-105'
                  : level > h.level
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
            >
              {h.type}
            </button>
          ))}
        </div>

        <div className="bg-blue-50/50 border border-blue-200/80 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
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
              className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
            >
              <span>Next Hint</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">
              Ready to Prove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
