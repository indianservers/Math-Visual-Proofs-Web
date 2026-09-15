import React, { useState } from 'react';
import { Sparkles, RotateCcw, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { MathView } from '../common/MathView';

interface WhyItWorksProps {
  onReset: () => void;
}

export const OddSumWhyItWorksPanel: React.FC<WhyItWorksProps> = ({
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
        {/* Section 1: The Gnomon Concept */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              The Pythagorean Gnomon
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            An L-shaped piece that wraps around a figure without changing its shape is called a <em>gnomon</em>. For squares, every gnomon contains an odd number of squares.
          </p>
        </div>

        {/* Section 2: Algebraic Difference */}
        <div className="space-y-1.5 pt-1 border-t border-amber-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Difference of Consecutive Squares
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Expanding <MathView math="(k+1)^2 - k^2 = k^2 + 2k + 1 - k^2 = 2k + 1" /> proves algebraically that step increments are always consecutive odd numbers.
          </p>
        </div>

        {/* Section 3: Induction and Telescoping */}
        <div className="space-y-1.5 pt-1 border-t border-amber-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Telescoping Series
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Summing <MathView math="\sum_{k=1}^n (2k - 1) = \sum_{k=1}^n (k^2 - (k-1)^2) = n^2 - 0 = n^2" /> collapses all intermediate boundaries into the outer square!
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
                To expand a 9 × 9 square (81 blocks) into a 10 × 10 square (100 blocks), what odd number of blocks must be wrapped around it?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['19 blocks', '21 blocks', '17 blocks', '18 blocks'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedPrediction(opt)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border text-left ${
                      selectedPrediction === opt
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
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
            className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
              <strong className="text-amber-950 font-bold block">Correct! 19 blocks.</strong>
              <p className="text-amber-800 text-[11px] mt-0.5 leading-tight">
                <MathView math="10^2 - 9^2 = 100 - 81 = 19" /> blocks (9 top + 9 side + 1 corner = 19).
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
