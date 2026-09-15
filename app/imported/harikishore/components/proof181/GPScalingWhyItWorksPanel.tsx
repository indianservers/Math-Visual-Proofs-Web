import React, { useState } from 'react';
import { Sparkles, RotateCcw, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { MathView } from '../common/MathView';

interface WhyItWorksProps {
  onReset: () => void;
}

export const GPScalingWhyItWorksPanel: React.FC<WhyItWorksProps> = ({
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
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-emerald-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-emerald-50/80">
        <Sparkles className="w-4 h-4 text-emerald-600" />
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight font-sans">
          Why it works
        </h2>
      </div>

      <div className="space-y-4">
        {/* Section 1: Multiplication vs Addition */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Multiplication vs Addition
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            While arithmetic progressions add a step (<MathView math="+d" />), geometric progressions scale by a multiplier (<MathView math="\times r" />), producing exponential curves.
          </p>
        </div>

        {/* Section 2: Growth vs Decay */}
        <div className="space-y-1.5 pt-1 border-t border-emerald-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Growth (|r| &gt; 1) vs Decay (|r| &lt; 1)
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            When <MathView math="r > 1" />, terms explode rapidly towards infinity. When <MathView math="0 < r < 1" />, terms halve or third, rapidly decaying towards 0.
          </p>
        </div>

        {/* Section 3: Real World Scales */}
        <div className="space-y-1.5 pt-1 border-t border-emerald-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Real-World Phenomena
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Compound interest, radioactive half-life, computer memory doubling, and population growth are all exact real-world geometric progressions.
          </p>
        </div>

        {/* Prediction Quiz */}
        <div className="pt-2 border-t border-emerald-50/60">
          <button
            onClick={() => setIsPredictionOpen(!isPredictionOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-emerald-600 transition-colors py-1"
          >
            <span>Your prediction</span>
            {isPredictionOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isPredictionOpen && (
            <div className="mt-2 space-y-2.5">
              <p className="text-[11px] text-slate-600">
                Starting with <MathView math="a = 2" /> and multiplier <MathView math="r = 3" />, what is the 4th term <MathView math="a_4" />?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['54', '24', '18', '162'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedPrediction(opt)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border text-left ${
                      selectedPrediction === opt
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50/50'
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
            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-emerald-950 font-bold block">Correct! a₄ = 54.</strong>
              <p className="text-emerald-800 text-[11px] mt-0.5 leading-tight">
                <MathView math="a_4 = 2 \\times 3^{4-1} = 2 \\times 27 = 54" /> (2, 6, 18, 54).
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
