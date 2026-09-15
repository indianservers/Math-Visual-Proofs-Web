import React, { useState } from 'react';
import { X, Lightbulb, ChevronRight, CheckCircle2 } from 'lucide-react';
import { MathView } from '../common/MathView';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HINTS = [
  {
    level: 1,
    title: "Drawing Quarter-Circle Arcs",
    content: "Inside each Fibonacci square of size F_k, draw a 90° circular arc from one corner to the diagonally opposite corner, using the opposite corner as the arc's center.",
    formula: "\\theta = 90^\\circ = \\frac{\\pi}{2} \\text{ rad per tile}"
  },
  {
    level: 2,
    title: "Smooth Tangent Continuity",
    content: "Because each square sits flush along the previous rectangle, the arc from the previous square ends at the exact location where the next arc begins, pointing in the same direction!",
    formula: "\\frac{dy}{dx}_{\\text{end of arc } k} = \\frac{dy}{dx}_{\\text{start of arc } k+1}"
  },
  {
    level: 3,
    title: "Golden Ratio Convergence",
    content: "The ratio between consecutive radii F_(k+1) / F_k oscillates around the Golden Ratio f  1.6180339887... With each quarter-turn, the radius grows by approximately f.",
    formula: "\\lim_{n \\to \\infty} \\frac{F_{n+1}}{F_n} = \\phi = \\frac{1+\\sqrt{5}}{2}"
  },
  {
    level: 4,
    title: "The Logarithmic Spiral Equation",
    content: "The true Golden Spiral satisfies the polar equation r = a e^(b ?), where b = ln(f) / (p/2). The Fibonacci spiral provides an astonishingly accurate piecewise-circular approximation.",
    formula: "r(\\theta) = a \\cdot \\phi^{\\frac{2\\theta}{\\pi}}"
  },
  {
    level: 5,
    title: "Scale Invariance in Nature",
    content: "When magnified, a logarithmic spiral looks identical to its unmagnified form. This self-similarity is why growing shells, hurricanes, and spiral galaxies all mirror this curve.",
    formula: "r(c \\cdot \\theta) \\propto r(\\theta) \\quad (\\text{Self-Similarity})"
  }
];

export const FibonacciSpiralHintModal: React.FC<HintModalProps> = ({ isOpen, onClose }) => {
  const [currentLevel, setCurrentLevel] = useState(1);

  if (!isOpen) return null;

  const currentHint = HINTS[currentLevel - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-amber-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-amber-700">
            <Lightbulb className="w-5 h-5" />
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
              Golden Spiral Guidance & Hints
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level selector */}
        <div className="flex items-center gap-1.5 justify-between bg-slate-50 p-1.5 rounded-2xl">
          {HINTS.map(h => (
            <button
              key={h.level}
              onClick={() => setCurrentLevel(h.level)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentLevel === h.level
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              Hint {h.level}
            </button>
          ))}
        </div>

        {/* Hint Body */}
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
              Level {currentHint.level}: {currentHint.title}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            {currentHint.content}
          </p>
          <div className="bg-white p-3 rounded-xl border border-amber-100 text-center font-mono font-bold text-amber-900 text-xs shadow-2xs">
            <MathView math={currentHint.formula} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setCurrentLevel(prev => Math.max(1, prev - 1))}
            disabled={currentLevel <= 1}
            className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-30"
          >
            Previous
          </button>

          {currentLevel < HINTS.length ? (
            <button
              onClick={() => setCurrentLevel(prev => Math.min(HINTS.length, prev + 1))}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-all"
            >
              <span>Next Hint</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-xs transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Got it!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
