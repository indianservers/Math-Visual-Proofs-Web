import React, { useState } from 'react';
import { Sparkles, Check, RotateCcw, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { ShapeDefinition } from '../../types';
import { MathView } from '../common/MathView';
import { sound } from '../../utils/sound';

interface WhyItWorksProps {
  selectedShape: ShapeDefinition;
  rotationAngle: number;
  matchedSteps: number[];
  onReset: () => void;
}

export const WhyItWorksPanel: React.FC<WhyItWorksProps> = ({
  selectedShape,
  rotationAngle,
  matchedSteps,
  onReset,
}) => {
  const [isPredictionOpen, setIsPredictionOpen] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const order = selectedShape.rotationalOrder;
  const turnsCount = Math.min(order, 8); // max 8 mini icons

  const handleReveal = () => {
    sound.playSuccess();
    setIsRevealed(true);
  };

  const handleResetInternal = () => {
    sound.playClick();
    setSelectedPrediction(null);
    setIsRevealed(false);
    onReset();
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-indigo-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-indigo-50/80">
        <Sparkles className="w-4 h-4 text-indigo-600" />
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight font-sans">
          Why it works
        </h2>
      </div>

      <div className="space-y-4">
        {/* Section 1: Line Symmetry (Mirrors) */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Line Symmetry (Mirrors)
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Count the lines that fold the shape onto itself.
          </p>

          {/* Mini Folding Hexagon Diagram */}
          <div className="ml-7 flex items-center justify-center py-1">
            <div className="w-20 h-20 relative flex items-center justify-center">
              <svg className="w-18 h-18" viewBox="0 0 80 80">
                {/* Hexagon */}
                <polygon
                  points="40,8 68,24 68,56 40,72 12,56 12,24"
                  fill="rgba(124, 58, 237, 0.18)"
                  stroke="#7c3aed"
                  strokeWidth="1.5"
                />
                {/* Folding mirror line */}
                <line x1="40" y1="4" x2="40" y2="76" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="3 2" />
                <line x1="8" y1="22" x2="72" y2="58" stroke="#818cf8" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                <line x1="8" y1="58" x2="72" y2="22" stroke="#818cf8" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                <circle cx="40" cy="40" r="2.5" fill="#4338ca" />
              </svg>
            </div>
          </div>
        </div>

        {/* Section 2: Rotational Symmetry (Turns) */}
        <div className="space-y-1.5 pt-1 border-t border-indigo-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Rotational Symmetry (Turns)
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Count how many times it matches itself in a 360° turn.
          </p>

          {/* Sequence of Mini Rotated Icons (1, 2, 3, 4, 5, 6...) */}
          <div className="ml-5 flex items-center justify-center gap-1.5 py-1.5 flex-wrap">
            {Array.from({ length: turnsCount }).map((_, i) => {
              const stepNum = i + 1;
              const stepAngle = (360 / order) * i;
              const isMatched = matchedSteps.includes(stepNum);

              return (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      isMatched
                        ? 'bg-indigo-600 text-white shadow-sm scale-110'
                        : 'bg-indigo-50/80 text-indigo-400'
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 30 30"
                      style={{ transform: `rotate(${stepAngle}deg)` }}
                    >
                      <polygon
                        points={
                          selectedShape.isRegular
                            ? '15,3 25,9 25,21 15,27 5,21 5,9'
                            : '4,8 26,8 26,22 4,22'
                        }
                        fill={isMatched ? 'rgba(255,255,255,0.4)' : 'rgba(124, 58, 237, 0.2)'}
                        stroke={isMatched ? '#ffffff' : '#7c3aed'}
                        strokeWidth="1.2"
                      />
                    </svg>
                  </div>
                  <span className={`text-[9px] font-bold mt-0.5 ${isMatched ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {stepNum}
                  </span>
                </div>
              );
            })}

            {/* Circular completion arrow icon */}
            <div className="w-5 h-5 flex items-center justify-center text-indigo-500 ml-0.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
            </div>
          </div>
        </div>

        {/* Section 3: Every regular n-gon */}
        <div className="space-y-1.5 pt-1 border-t border-indigo-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Every regular n-gon
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Has <MathView math="n" /> lines of symmetry and rotational symmetry of order <MathView math="n" />.
          </p>

          {/* Tri-flow diagram n -> n -> n */}
          <div className="ml-7 bg-indigo-50/40 p-2 rounded-xl border border-indigo-100/60 flex items-center justify-around text-center">
            <div>
              <span className="text-xs font-mono font-extrabold text-indigo-700">n</span>
              <div className="text-[8px] text-slate-400 font-medium">n sides</div>
            </div>
            <span className="text-xs font-bold text-indigo-300">→</span>
            <div>
              <span className="text-xs font-mono font-extrabold text-indigo-700">n</span>
              <div className="text-[8px] text-slate-400 font-medium">mirrors</div>
            </div>
            <span className="text-xs font-bold text-indigo-300">→</span>
            <div>
              <span className="text-xs font-mono font-extrabold text-indigo-700">n</span>
              <div className="text-[8px] text-slate-400 font-medium">rotational order</div>
            </div>
          </div>
        </div>

        {/* Prediction Accordion */}
        <div className="pt-2 border-t border-indigo-50/60">
          <button
            onClick={() => setIsPredictionOpen(!isPredictionOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors py-1"
          >
            <span>Your prediction</span>
            {isPredictionOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isPredictionOpen && (
            <div className="mt-2 space-y-2.5">
              <p className="text-[11px] text-slate-600">
                For a regular <strong>{selectedShape.name}</strong>, lines of symmetry =
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {[selectedShape.lineSymmetries - 1, selectedShape.lineSymmetries, selectedShape.lineSymmetries + 1, selectedShape.lineSymmetries + 2].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      sound.playClick();
                      setSelectedPrediction(val);
                    }}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      selectedPrediction === val
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50/50'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons: Reveal Answer and Reset */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleReveal}
            className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Reveal Answer
          </button>
          <button
            onClick={handleResetInternal}
            className="py-2 px-3 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl border border-slate-200 shadow-sm transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>

        {/* Success / Feedback Alert Box */}
        {isRevealed && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-emerald-900 font-bold block">Correct! Well done.</strong>
              <p className="text-emerald-700 text-[11px] mt-0.5 leading-tight">
                {selectedShape.isRegular
                  ? `Every regular ${selectedShape.name} has ${selectedShape.lineSymmetries} lines of symmetry and rotational symmetry of order ${selectedShape.rotationalOrder}.`
                  : `A rectangle has 2 lines of symmetry and rotational symmetry of order 2.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
