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
    title: "Understanding Fibonacci Squares",
    content: "Each square's side length is a Fibonacci number: 1, 1, 2, 3, 5, 8, 13... Every term is the sum of the two preceding terms.",
    formula: "F_n = F_{n-1} + F_{n-2}"
  },
  {
    level: 2,
    title: "Edge Matching Rule",
    content: "When two squares are placed side by side, their combined side length equals the side length of the next Fibonacci square. This means the next square attaches flush against them with no gap!",
    formula: "F_{k-1} + F_{k-2} = F_k"
  },
  {
    level: 3,
    title: "Rectangle Expansion",
    content: "Adding each new square turns the existing rectangle into a larger rectangle rotated by 90 degrees. At step n, the rectangle has side lengths F_n and F_(n+1).",
    formula: "\\text{Dimensions} = F_n \\times F_{n+1}"
  },
  {
    level: 4,
    title: "Area Equivalence Proof",
    content: "The area of each square is F_k². The total area of all tiled squares must equal the area of the outer bounding rectangle.",
    formula: "\\sum_{k=1}^n F_k^2 = F_n \\times F_{n+1}"
  },
  {
    level: 5,
    title: "Connecting to the Golden Spiral",
    content: "If you draw a quarter-circle arc inside each square connecting opposite corners, the arcs join smoothly into the famous Fibonacci Spiral!",
    formula: "\\lim_{n \\to \\infty} \\frac{F_{n+1}}{F_n} = \\phi = \\frac{1+\\sqrt{5}}{2} \\approx 1.6180339887..."
  }
];

export const FibonacciTilingHintModal: React.FC<HintModalProps> = ({ isOpen, onClose }) => {
  const [currentLevel, setCurrentLevel] = useState(1);

  if (!isOpen) return null;

  const currentHint = HINTS[currentLevel - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-emerald-700">
            <Lightbulb className="w-5 h-5" />
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
              Fibonacci Tiling Guide & Hints
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
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              Hint {h.level}
            </button>
          ))}
        </div>

        {/* Hint Body */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
              Level {currentHint.level}: {currentHint.title}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            {currentHint.content}
          </p>
          <div className="bg-white p-3 rounded-xl border border-emerald-100 text-center font-mono font-bold text-emerald-900 text-xs shadow-2xs">
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
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all"
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
