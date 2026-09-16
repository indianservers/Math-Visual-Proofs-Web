import React, { useState } from 'react';
import { X, Sparkles, ChevronRight, Lightbulb } from 'lucide-react';
import { HintItem } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const G_HINTS: HintItem[] = [
  {
    level: 1,
    type: 'Notice',
    title: '1. Notice the Contour Level Curves',
    message: 'Each contour line represents a constant elevation z = f(x, y) = C. Walking along a contour line means no change in height.',
  },
  {
    level: 2,
    type: 'Choose',
    title: '2. Drag the Probe Point P',
    message: 'Notice the bold emerald arrow ∇f originating from P. It always points perpendicular (normal) to the contour curve passing through P.',
  },
  {
    level: 3,
    type: 'Predict',
    title: '3. Predict Directional Derivative',
    message: 'The directional derivative in direction û is D_u f = ∇f · û = ||∇f|| cos(φ). When û aligns with ∇f (φ = 0), the rate of increase is maximized.',
  },
  {
    level: 4,
    type: 'Guide',
    title: '4. The 90° Orthogonality Proof',
    message: 'Along a contour, df/dt = (∂f/∂x)(dx/dt) + (∂f/∂y)(dy/dt) = ∇f · T = 0. Because the dot product is 0, ∇f must be perpendicular to the tangent vector T.',
  },
  {
    level: 5,
    type: 'Explain',
    title: '5. Gradient Descent & Optimization',
    message: 'Gradient vectors dictate the fastest path uphill. In optimization and machine learning, gradient descent steps opposite to ∇f (-∇f) to reach minima.',
  }
];

export const GradientHintModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [level, setLevel] = useState(1);
  if (!isOpen) return null;
  const current = G_HINTS.find(h => h.level === level) || G_HINTS[0];

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
            <h3 className="text-lg font-bold text-slate-900 font-sans">Gradient Hint Coach</h3>
            <p className="text-xs text-slate-500">Pedagogical hints for Visual Proof 173</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-1 mb-5">
          {G_HINTS.map((h) => (
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
