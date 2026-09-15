import React, { useState } from 'react';
import { Sparkles, RotateCcw, ChevronDown, ChevronUp, CheckCircle2, HelpCircle } from 'lucide-react';
import { MathView } from '../common/MathView';

interface WhyItWorksProps {
  onReset: () => void;
}

export const SierpinskiWhyItWorksPanel: React.FC<WhyItWorksProps> = ({
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
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-indigo-100/80 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200/60">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-sans">
            Why It Works & Fractal Paradox
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

      {/* Paradox: Zero Area vs Infinite Perimeter */}
      <div className="space-y-3">
        <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
          <div className="text-xs font-bold text-indigo-950 font-sans flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            <span>The Swiss Cheese Paradox</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            Every hole punched adds new interior edges. While area shrinks by <MathView math="\frac{8}{9}" /> per step, the perimeter grows by <MathView math="\frac{4}{3}" />:
          </p>
          <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono font-bold pt-1">
            <div className="bg-white py-1.5 px-2 rounded-xl border border-indigo-100 text-rose-600">
              Area → 0
            </div>
            <div className="bg-white py-1.5 px-2 rounded-xl border border-indigo-100 text-indigo-600">
              Perimeter → ∞
            </div>
          </div>
        </div>

        {/* Hausdorff Dimension Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
          <div className="text-xs font-bold text-slate-800 font-sans">
            Fractal Dimension (Hausdorff)
          </div>
          <p className="text-xs text-slate-600 font-sans leading-relaxed">
            Scaling by a factor of 3 yields 8 self-similar replicas:
          </p>
          <div className="bg-white py-1.5 px-2.5 rounded-xl border border-slate-200 text-center font-mono font-bold text-indigo-700 text-xs">
            <MathView math="D = \frac{\ln 8}{\ln 3} \approx 1.8928" />
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            It is richer than a 1D line (<MathView math="D=1" />) but has less substance than a solid 2D square (<MathView math="D=2" />).
          </p>
        </div>
      </div>

      {/* Interactive Prediction Check */}
      <div className="border border-indigo-100 rounded-2xl overflow-hidden">
        <button
          onClick={() => setIsPredictionOpen(!isPredictionOpen)}
          className="w-full flex items-center justify-between p-3.5 bg-indigo-50/70 hover:bg-indigo-50 transition-colors text-left font-sans"
        >
          <span className="text-xs font-bold text-indigo-950 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>Interactive Prediction: Infinite Limit</span>
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
              If we punch center holes into every sub-square forever (<MathView math="n \to \infty" />), what is the final remaining area?
            </p>

            <div className="space-y-2">
              {[
                { id: 'half', label: 'Exactly 50% of the original square area' },
                { id: 'zero', label: 'Zero (all 2D area completely vanishes!)' },
                { id: 'inf', label: 'Infinite area because there are infinitely many squares' }
              ].map(opt => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedPrediction === opt.id
                      ? 'border-indigo-600 bg-indigo-50/60 font-semibold text-indigo-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="prediction"
                    checked={selectedPrediction === opt.id}
                    onChange={() => setSelectedPrediction(opt.id)}
                    className="accent-indigo-600"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            {!isRevealed ? (
              <button
                onClick={handleReveal}
                disabled={!selectedPrediction}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Check Answer
              </button>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Correct! Retained Area = 0</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed font-sans">
                  Even though an uncountable dust of points remains, the 2-dimensional Lebesgue area is strictly <MathView math="\lim_{n\to\infty}(8/9)^n = 0" />!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};