import React, { useState } from 'react';
import { X, Sparkles, ChevronRight, Lightbulb } from 'lucide-react';
import { HintItem } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const GP_SCALING_HINTS: HintItem[] = [
  {
    level: 1,
    type: 'Notice',
    title: '1. Notice the Common Ratio r',
    message: 'Every bar is produced by multiplying the preceding bar by the constant ratio r.',
  },
  {
    level: 2,
    type: 'Choose',
    title: '2. Compare Growth and Decay',
    message: 'Try switching ratio between r = 2 (towers shoot up) and r = 0.5 (towers shrink in half).',
  },
  {
    level: 3,
    type: 'Predict',
    title: '3. Predict the Multiplier Count',
    message: 'To get from Term 1 to Term 3 takes 2 multiplications by r: a · r · r = a · r².',
  },
  {
    level: 4,
    type: 'Guide',
    title: '4. The (n - 1) Exponent',
    message: 'Because term 1 has 0 multiplications, term n requires exactly (n - 1) multiplications: an = a · r^(n - 1).',
  },
  {
    level: 5,
    type: 'Explain',
    title: '5. Exponential Scaling Power',
    message: 'In arithmetic progression, you climb stairs by adding. In geometric progression, you multiply — creating exponential curves!',
  }
];

export const GPScalingHintModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [level, setLevel] = useState(1);
  if (!isOpen) return null;
  const current = GP_SCALING_HINTS.find(h => h.level === level) || GP_SCALING_HINTS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-100 relative">
        <button onClick={onClose} className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-sans">Geometric Scaling Hint Coach</h3>
            <p className="text-xs text-slate-500">Pedagogical hints for Visual Proof 181</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-1 mb-5">
          {GP_SCALING_HINTS.map((h) => (
            <button
              key={h.level}
              onClick={() => setLevel(h.level)}
              className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                level === h.level
                  ? 'bg-emerald-600 text-white border-emerald-600 scale-105'
                  : level > h.level
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
            >
              {h.type}
            </button>
          ))}
        </div>

        <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
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
              className="inline-flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
            >
              <span>Next Hint</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={onClose} className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl">
              Ready to Prove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
