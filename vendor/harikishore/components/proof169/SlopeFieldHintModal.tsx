import React, { useState } from 'react';
import { X, Sparkles, ChevronRight, Lightbulb } from 'lucide-react';
import { HintItem } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const S_HINTS: HintItem[] = [
  {
    level: 1,
    type: 'Notice',
    title: '1. Notice the Local Direction Arrows',
    message: 'Each short tick mark on the grid represents the derivative dy/dx = f(x, y) at that exact coordinate.',
  },
  {
    level: 2,
    type: 'Choose',
    title: '2. Set an Initial Condition (x₀, y₀)',
    message: 'A general differential equation has infinitely many solution curves. Dragging P₀ fixes the integration constant C to pick one specific curve.',
  },
  {
    level: 3,
    type: 'Predict',
    title: '3. Predict Trajectory Flow',
    message: 'Look at the arrows ahead of P₀. The curve will follow the arrows like a boat following water currents.',
  },
  {
    level: 4,
    type: 'Guide',
    title: '4. Euler’s Method & Step Size',
    message: 'Euler\'s method steps along the tangent line: y_{k+1} = y_k + h·f(x_k, y_k). Decreasing h reduces approximation error.',
  },
  {
    level: 5,
    type: 'Explain',
    title: '5. The Fundamental Theorem of Calculus',
    message: 'As h → 0, Euler\'s polygonal approximation matches the exact continuous integral y(x) = y₀ + ∫ f(t, y(t)) dt.',
  }
];

export const SlopeFieldHintModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [level, setLevel] = useState(1);
  if (!isOpen) return null;
  const current = S_HINTS.find(h => h.level === level) || S_HINTS[0];

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
            <h3 className="text-lg font-bold text-slate-900 font-sans">Slope Field Hint Coach</h3>
            <p className="text-xs text-slate-500">Pedagogical hints for Visual Proof 169</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-1 mb-5">
          {S_HINTS.map((h) => (
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
              className="inline-flex items-center gap-1 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl"
            >
              <span>Next Hint</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={onClose} className="px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl">
              Ready to Prove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
