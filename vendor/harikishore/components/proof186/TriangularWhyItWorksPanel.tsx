import React, { useState } from 'react';
import { Sparkles, RotateCcw, ChevronDown, ChevronUp, CheckCircle2, HelpCircle } from 'lucide-react';
import { MathView } from '../common/MathView';

interface WhyItWorksProps {
  onReset: () => void;
}

export const TriangularWhyItWorksPanel: React.FC<WhyItWorksProps> = ({
  onReset,
}) => {
  const [isPredictionOpen, setIsPredictionOpen] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleResetInternal = () => {
    setSelectedPrediction(null);
    setIsRevealed(false);
    onReset();
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-sky-100/80 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200/60">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-sans">
            Why It Works & Real-World Intuition
          </h3>
        </div>
        <button
          onClick={handleResetInternal}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          title="Reset prediction"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Intuition Cards */}
      <div className="space-y-3">
        <div className="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-2">
          <div className="text-xs font-bold text-sky-950 font-sans flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-600" />
            <span>The Bowling Pin Triangle (T₄ = 10)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            Have you ever bowled? The 10 bowling pins form a triangle with 4 rows: 1 pin, then 2, then 3, then 4.
            <MathView math="1 + 2 + 3 + 4 = 10" />!
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1.5">
          <div className="text-xs font-bold text-amber-950 font-sans">
            The Handshake Problem
          </div>
          <p className="text-xs text-slate-600 font-sans leading-relaxed">
            If 5 friends meet and everyone shakes hands with everyone else once, how many handshakes happen?
            Friend 1 shakes 4 hands, friend 2 shakes 3, friend 3 shakes 2, friend 4 shakes 1:
          </p>
          <div className="bg-white py-1.5 px-2 rounded-xl border border-amber-200 text-center font-mono font-bold text-amber-800 text-xs">
            4 + 3 + 2 + 1 = T₄ = 10 handshakes!
          </div>
        </div>
      </div>

      {/* Interactive Prediction Check */}
      <div className="border border-sky-100 rounded-2xl overflow-hidden">
        <button
          onClick={() => setIsPredictionOpen(!isPredictionOpen)}
          className="w-full flex items-center justify-between p-3.5 bg-sky-50/70 hover:bg-sky-50 transition-colors text-left font-sans"
        >
          <span className="text-xs font-bold text-sky-950 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-sky-600" />
            <span>Interactive Prediction: T₅ Dot Count</span>
          </span>
          {isPredictionOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {isPredictionOpen && (
          <div className="p-4 bg-white space-y-3">
            <p className="text-xs text-slate-700 font-sans">
              What is the 5th triangular number <MathView math="T_5 = 1 + 2 + 3 + 4 + 5" />?
            </p>

            <div className="space-y-2">
              {[
                { id: 'opt12', label: '12 dots (5 + 7)' },
                { id: 'opt15', label: '15 dots (half of a 5 × 6 = 30 rectangle)' },
                { id: 'opt20', label: '20 dots (4 × 5)' }
              ].map(opt => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedPrediction === opt.id
                      ? 'border-sky-600 bg-sky-50/60 font-semibold text-sky-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="prediction"
                    checked={selectedPrediction === opt.id}
                    onChange={() => setSelectedPrediction(opt.id)}
                    className="accent-sky-600"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            {!isRevealed ? (
              <button
                onClick={handleReveal}
                disabled={!selectedPrediction}
                className="w-full py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Check Answer
              </button>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Correct! T₅ = 15 dots</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed font-sans">
                  Two T₅ triangles pair into a <MathView math="5 \times 6 = 30" /> rectangle, so <MathView math="T_5 = 30 / 2 = 15" />!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};