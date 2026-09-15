import React, { useState } from 'react';
import { Sparkles, RotateCcw, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { MathView } from '../common/MathView';

interface WhyItWorksProps {
  onReset: () => void;
}

export const APWhyItWorksPanel: React.FC<WhyItWorksProps> = ({
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
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-blue-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-blue-50/80">
        <Sparkles className="w-4 h-4 text-blue-600" />
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight font-sans">
          Why it works
        </h2>
      </div>

      <div className="space-y-4">
        {/* Section 1: Constant First Differences */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Constant Discrete Derivative
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            An arithmetic progression is the discrete analogue of a linear straight line <MathView math="f(x) = mx + c" /> with constant slope <MathView math="\Delta a_n = a_{n+1} - a_n = d" />.
          </p>
        </div>

        {/* Section 2: Telescoping Sum */}
        <div className="space-y-1.5 pt-1 border-t border-blue-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Telescoping Cumulative Addition
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Writing <MathView math="a_n - a_1 = (a_n - a_{n-1}) + \dots + (a_2 - a_1) = \sum_{k=1}^{n-1} d = (n-1)d" /> immediately yields <MathView math="a_n = a_1 + (n-1)d" />.
          </p>
        </div>

        {/* Section 3: Gauss Pairing */}
        <div className="space-y-1.5 pt-1 border-t border-blue-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Pairing Sum Invariant
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Adding the first and last terms yields <MathView math="a_1 + a_n = 2a + (n-1)d" />. Every symmetric pair <MathView math="a_k + a_{n-k+1}" /> equals the exact same constant sum!
          </p>
        </div>

        {/* Prediction Quiz */}
        <div className="pt-2 border-t border-blue-50/60">
          <button
            onClick={() => setIsPredictionOpen(!isPredictionOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors py-1"
          >
            <span>Your prediction</span>
            {isPredictionOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isPredictionOpen && (
            <div className="mt-2 space-y-2.5">
              <p className="text-[11px] text-slate-600">
                For the sequence starting at <MathView math="a = 3" /> with difference <MathView math="d = 4" />, what is the 10th term <MathView math="a_{10}" />?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['a₁₀ = 39', 'a₁₀ = 43', 'a₁₀ = 40', 'a₁₀ = 36'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedPrediction(opt)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border text-left ${
                      selectedPrediction === opt
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50/50'
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
            className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-blue-950 font-bold block">Correct! a₁₀ = 3 + (10 - 1)(4) = 3 + 36 = 39.</strong>
              <p className="text-blue-800 text-[11px] mt-0.5 leading-tight">
                9 jumps of 4 units added to the starting term 3 gives 39.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
