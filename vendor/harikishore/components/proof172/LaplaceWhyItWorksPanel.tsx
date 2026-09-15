import React, { useState } from 'react';
import { Sparkles, RotateCcw, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { MathView } from '../common/MathView';

interface WhyItWorksProps {
  decayRateA: number;
  onReset: () => void;
}

export const LaplaceWhyItWorksPanel: React.FC<WhyItWorksProps> = ({
  decayRateA,
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
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-cyan-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-cyan-50/80">
        <Sparkles className="w-4 h-4 text-cyan-600" />
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight font-sans">
          Why it works
        </h2>
      </div>

      <div className="space-y-4">
        {/* Section 1: Complex Frequency s */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Complex Frequency s = σ + jω
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            The real part <MathView math="\sigma" /> tests exponential decay/growth rates, while the imaginary part <MathView math="j\omega" /> measures pure sinusoidal oscillation frequencies.
          </p>
        </div>

        {/* Section 2: Poles Govern Natural Response */}
        <div className="space-y-1.5 pt-1 border-t border-cyan-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Pole Position Determines Dynamics
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            The roots of the denominator polynomial (poles) completely determine the system's unforced natural response modes <MathView math="e^{p t}" />.
          </p>
        </div>

        {/* Section 3: Time Constant Relation */}
        <div className="space-y-1.5 pt-1 border-t border-cyan-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Speed of Response
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Moving poles further to the left (more negative real part) decreases the time constant <MathView math="\tau = 1/a" />, resulting in faster settling times in physical systems.
          </p>
        </div>

        {/* Prediction Quiz */}
        <div className="pt-2 border-t border-cyan-50/60">
          <button
            onClick={() => setIsPredictionOpen(!isPredictionOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-cyan-600 transition-colors py-1"
          >
            <span>Your prediction</span>
            {isPredictionOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isPredictionOpen && (
            <div className="mt-2 space-y-2.5">
              <p className="text-[11px] text-slate-600">
                If a system has a pole located at <MathView math="s = -5" />, what is its time constant <MathView math="\tau" />?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['0.2 seconds', '5.0 seconds', '0.5 seconds', '25 seconds'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedPrediction(opt)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border text-left ${
                      selectedPrediction === opt
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-cyan-50/50'
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
            className="flex-1 py-2 px-3 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
          <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-3 flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-cyan-950 font-bold block">Correct! τ = 1/a = 1/5 = 0.2 seconds.</strong>
              <p className="text-cyan-800 text-[11px] mt-0.5 leading-tight">
                The pole at <MathView math="s = -5" /> corresponds to time decay <MathView math="e^{-5t}" />, which reaches 63.2% decay at <MathView math="t = 0.2\text{ s}" />.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
