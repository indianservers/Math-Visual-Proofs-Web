import React, { useState } from 'react';
import { Sparkles, RotateCcw, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { MathView } from '../common/MathView';

interface WhyItWorksProps {
  onReset: () => void;
}

export const GPSumWhyItWorksPanel: React.FC<WhyItWorksProps> = ({
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
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-pink-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-pink-50/80">
        <Sparkles className="w-4 h-4 text-pink-600" />
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight font-sans">
          Why it works
        </h2>
      </div>

      <div className="space-y-4">
        {/* Section 1: Alignment via Multiplication */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-800 flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              One-Step Multiplication Shift
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Multiplying each term by <MathView math="r" /> shifts every term <MathView math="a r^{k-1}" /> to <MathView math="a r^k" />, creating an identical duplicate copy displaced by 1 slot.
          </p>
        </div>

        {/* Section 2: Subtraction Cancellation */}
        <div className="space-y-1.5 pt-1 border-t border-pink-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-800 flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Internal Telescoping Collapse
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Subtracting the two series cancels every intermediate term completely. Only the unmatched first term <MathView math="a" /> and the trailing term <MathView math="a r^n" /> survive!
          </p>
        </div>

        {/* Section 3: When r = 1 */}
        <div className="space-y-1.5 pt-1 border-t border-pink-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-800 flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              The r = 1 Singular Case
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            When <MathView math="r = 1" />, the denominator <MathView math="1 - r = 0" />. In this case, all terms equal <MathView math="a" />, so the sum is simply <MathView math="n \cdot a" />.
          </p>
        </div>

        {/* Prediction Quiz */}
        <div className="pt-2 border-t border-pink-50/60">
          <button
            onClick={() => setIsPredictionOpen(!isPredictionOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-pink-600 transition-colors py-1"
          >
            <span>Your prediction</span>
            {isPredictionOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isPredictionOpen && (
            <div className="mt-2 space-y-2.5">
              <p className="text-[11px] text-slate-600">
                What is the sum of <MathView math="1 + 2 + 4 + 8 + 16 + 32" /> (first 6 powers of 2)?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['63', '64', '62', '127'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedPrediction(opt)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border text-left ${
                      selectedPrediction === opt
                        ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-pink-50/50'
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
            className="flex-1 py-2 px-3 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl shadow-md shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
          <div className="bg-pink-50 border border-pink-200 rounded-2xl p-3 flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-pink-950 font-bold block">Correct! 63.</strong>
              <p className="text-pink-800 text-[11px] mt-0.5 leading-tight">
                <MathView math="S_6 = \\frac{1 - 2^6}{1 - 2} = \\frac{1 - 64}{-1} = 63" />. (Always 1 less than the next power 64).
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
