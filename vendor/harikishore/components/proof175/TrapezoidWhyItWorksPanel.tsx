import React, { useState } from 'react';
import { Sparkles, RotateCcw, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { MathView } from '../common/MathView';

interface WhyItWorksProps {
  onReset: () => void;
}

export const TrapezoidWhyItWorksPanel: React.FC<WhyItWorksProps> = ({
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
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-amber-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-amber-50/80">
        <Sparkles className="w-4 h-4 text-amber-600" />
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight font-sans">
          Why it works
        </h2>
      </div>

      <div className="space-y-4">
        {/* Section 1: Linear Interpolation (Secants) */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Piecewise Linear Secant Chords
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            The trapezoidal rule replaces the true curve <MathView math="f(x)" /> across each subinterval with a straight secant line connecting <MathView math="(x_{k-1}, y_{k-1})" /> to <MathView math="(x_k, y_k)" />.
          </p>
        </div>

        {/* Section 2: Convexity & Concavity Over/Under Estimation */}
        <div className="space-y-1.5 pt-1 border-t border-amber-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Convexity vs Concavity
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            If <MathView math="f''(x) > 0" /> (convex/concave up like <MathView math="x^2" />), secants lie above the curve, causing <MathView math="T_n" /> to overestimate. If <MathView math="f''(x) < 0" />, secants lie below, underestimating.
          </p>
        </div>

        {/* Section 3: Quadratic Error Bound */}
        <div className="space-y-1.5 pt-1 border-t border-amber-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              O(h²) Error Convergence
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            The error is bounded by <MathView math="|E_n| \le \frac{(b-a)^3}{12n^2} \max |f''(\xi)|" />. Increasing <MathView math="n" /> shrinks error quadratically.
          </p>
        </div>

        {/* Prediction Quiz */}
        <div className="pt-2 border-t border-amber-50/60">
          <button
            onClick={() => setIsPredictionOpen(!isPredictionOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-amber-600 transition-colors py-1"
          >
            <span>Your prediction</span>
            {isPredictionOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isPredictionOpen && (
            <div className="mt-2 space-y-2.5">
              <p className="text-[11px] text-slate-600">
                If we split the interval <MathView math="[0, 6]" /> into <MathView math="n = 3" /> subintervals, what is the step width <MathView math="h" />?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['h = 2.0', 'h = 3.0', 'h = 1.5', 'h = 6.0'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedPrediction(opt)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border text-left ${
                      selectedPrediction === opt
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50/50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleReveal}
            className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
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

        {/* Success Feedback */}
        {isRevealed && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-amber-950 font-bold block">Correct! h = (b - a)/n = (6 - 0)/3 = 2.0.</strong>
              <p className="text-amber-800 text-[11px] mt-0.5 leading-tight">
                The nodes are at <MathView math="x_0 = 0, x_1 = 2, x_2 = 4, x_3 = 6" />, and <MathView math="x_1" /> and <MathView math="x_2" /> are counted with multiplier 2.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
