import React, { useState } from 'react';
import { Sparkles, RotateCcw, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { MathView } from '../common/MathView';

interface WhyItWorksProps {
  onReset: () => void;
}

export const APSumWhyItWorksPanel: React.FC<WhyItWorksProps> = ({
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
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-purple-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-purple-50/80">
        <Sparkles className="w-4 h-4 text-purple-600" />
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight font-sans">
          Why it works
        </h2>
      </div>

      <div className="space-y-4">
        {/* Section 1: Symmetric Invariance */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Symmetric Pair Invariance
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            For any term <MathView math="a_k = a + (k-1)d" />, the complementary term from the other end is <MathView math="a_{n-k+1} = l - (k-1)d" />. Adding them cancels the <MathView math="d" /> term entirely!
          </p>
        </div>

        {/* Section 2: Last Term Formula */}
        <div className="space-y-1.5 pt-1 border-t border-purple-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Connecting Last Term l to d
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Since <MathView math="l = a + (n - 1)d" />, substituting into <MathView math="a + l" /> gives <MathView math="2a + (n - 1)d" />, connecting both standard AP sum forms.
          </p>
        </div>

        {/* Section 3: Rectangular Averaging */}
        <div className="space-y-1.5 pt-1 border-t border-purple-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Average Term Multiplier
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            The sum equals the number of terms <MathView math="n" /> multiplied by the average of the first and last terms: <MathView math="S_n = n \times \frac{a + l}{2}" />.
          </p>
        </div>

        {/* Prediction Quiz */}
        <div className="pt-2 border-t border-purple-50/60">
          <button
            onClick={() => setIsPredictionOpen(!isPredictionOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-purple-600 transition-colors py-1"
          >
            <span>Your prediction</span>
            {isPredictionOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isPredictionOpen && (
            <div className="mt-2 space-y-2.5">
              <p className="text-[11px] text-slate-600">
                In an AP of 20 terms with first term <MathView math="a = 5" /> and last term <MathView math="l = 95" />, what is the sum <MathView math="S_{20}" />?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['1,000', '1,900', '2,000', '500'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedPrediction(opt)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border text-left ${
                      selectedPrediction === opt
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50/50'
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
            className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3 flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-purple-950 font-bold block">Correct! 1,000.</strong>
              <p className="text-purple-800 text-[11px] mt-0.5 leading-tight">
                <MathView math="S_{20} = \frac{20}{2}(5 + 95) = 10 \times 100 = 1,000" />.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
