import React, { useState } from 'react';
import { X, Sparkles, ChevronRight, Lightbulb } from 'lucide-react';
import { HintItem } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SQUARE_ODD_HINTS: HintItem[] = [
  {
    level: 1,
    type: 'Notice',
    title: '1. Notice the First Unit Tile',
    message: 'The very first square is 1 × 1 = 1 tile. That matches the first odd number 1.',
  },
  {
    level: 2,
    type: 'Choose',
    title: '2. The L-Shaped Wrapper (Gnomon)',
    message: 'To grow a square without changing its square proportions, wrap an L-shaped layer around its top and right sides.',
  },
  {
    level: 3,
    type: 'Predict',
    title: '3. Counting the New Layer',
    message: 'Around a 1 × 1 square, the wrapper needs 1 corner + 2 side tiles = 3 tiles. Now you have 1 + 3 = 4 = 2² tiles!',
  },
  {
    level: 4,
    type: 'Guide',
    title: '4. The General Formula 2n - 1',
    message: 'Around an (n-1) × (n-1) square, the L-layer has 1 corner tile + 2 arms of length (n-1). Total = 1 + 2(n-1) = 2n - 1 tiles.',
  },
  {
    level: 5,
    type: 'Explain',
    title: '5. Telescoping to n²',
    message: 'Because each layer adds n² - (n-1)² = 2n - 1, summing the first n odd numbers telescope-cancels to n²!',
  }
];

export const SquareOddLayersHintModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [level, setLevel] = useState(1);
  if (!isOpen) return null;
  const current = SQUARE_ODD_HINTS.find(h => h.level === level) || SQUARE_ODD_HINTS[0];

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
            <h3 className="text-lg font-bold text-slate-900 font-sans">Square Numbers Hint Coach</h3>
            <p className="text-xs text-slate-500 font-sans">L-shaped gnomon & odd series intuition</p>
          </div>
        </div>

        <div className="flex gap-1.5 mb-6">
          {SQUARE_ODD_HINTS.map(h => (
            <button
              key={h.level}
              onClick={() => setLevel(h.level)}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                h.level === level ? 'bg-amber-600' : h.level < level ? 'bg-amber-200' : 'bg-slate-100'
              }`}
            />
          ))}
        </div>

        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
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
            {level < SQUARE_ODD_HINTS.length ? (
              <button
                onClick={() => setLevel(prev => Math.min(SQUARE_ODD_HINTS.length, prev + 1))}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-amber-200"
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