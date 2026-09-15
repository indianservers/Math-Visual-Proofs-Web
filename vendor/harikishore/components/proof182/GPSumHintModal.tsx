import React, { useState } from 'react';
import { X, Sparkles, ChevronRight, Lightbulb } from 'lucide-react';
import { HintItem } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const GP_SUM_HINTS: HintItem[] = [
  {
    level: 1,
    type: 'Notice',
    title: '1. Notice the Shift When Multiplied by r',
    message: 'When you multiply the whole series S_n by r, every term ar^k becomes ar^(k+1). It is an exact copy shifted by one step!',
  },
  {
    level: 2,
    type: 'Choose',
    title: '2. Alignment of Twins',
    message: 'Look at rows S_n and r · S_n lined up. Notice how ar aligns with ar, ar² aligns with ar², all the way to ar^(n-1).',
  },
  {
    level: 3,
    type: 'Predict',
    title: '3. The Great Cancellation',
    message: 'When we subtract (S_n - r · S_n), all identical middle terms cancel completely to 0 like dominoes falling!',
  },
  {
    level: 4,
    type: 'Guide',
    title: '4. Factor S_n on the Left',
    message: 'The left side is S_n - r · S_n = S_n(1 - r). The right side retains only the first term a and the subtracted tail a · r^n: a(1 - r^n).',
  },
  {
    level: 5,
    type: 'Explain',
    title: '5. Dividing to Isolate the Sum',
    message: 'Dividing both sides by (1 - r) yields S_n = a(1 - r^n)/(1 - r). That gives the sum of 1,000 terms in a single instant!',
  }
];

export const GPSumHintModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [level, setLevel] = useState(1);
  if (!isOpen) return null;
  const current = GP_SUM_HINTS.find(h => h.level === level) || GP_SUM_HINTS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-violet-100 relative">
        <button onClick={onClose} className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-sans">Geometric Sum Hint Coach</h3>
            <p className="text-xs text-slate-500 font-sans">Telescoping shifted-copy intuition</p>
          </div>
        </div>

        <div className="flex gap-1.5 mb-6">
          {GP_SUM_HINTS.map(h => (
            <button
              key={h.level}
              onClick={() => setLevel(h.level)}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                h.level === level ? 'bg-violet-600' : h.level < level ? 'bg-violet-200' : 'bg-slate-100'
              }`}
            />
          ))}
        </div>

        <div className="bg-violet-50/50 border border-violet-100 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-100 text-violet-700">
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
            {level < GP_SUM_HINTS.length ? (
              <button
                onClick={() => setLevel(prev => Math.min(GP_SUM_HINTS.length, prev + 1))}
                className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-violet-200"
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