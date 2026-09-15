import React, { useState } from 'react';
import { Sparkles, RotateCcw, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { MathView } from '../common/MathView';

interface WhyItWorksProps {
  numHarmonics: number;
  onReset: () => void;
}

export const FourierWhyItWorksPanel: React.FC<WhyItWorksProps> = ({
  numHarmonics,
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
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-violet-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-violet-50/80">
        <Sparkles className="w-4 h-4 text-violet-600" />
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight font-sans">
          Why it works
        </h2>
      </div>

      <div className="space-y-4">
        {/* Section 1: Harmonic Superposition */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-800 flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Harmonic Frequency Multiples
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Each harmonic mode oscillates at an exact integer multiple <MathView math="n\omega_0" /> of the fundamental frequency. Adding higher frequencies sculpts sharp corners and rapid edges.
          </p>
        </div>

        {/* Section 2: Symmetry Selection Rules */}
        <div className="space-y-1.5 pt-1 border-t border-violet-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-800 flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Waveform Symmetry Rules
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Odd functions (<MathView math="f(-t) = -f(t)" />) contain only sine terms <MathView math="b_n" />. Even functions (<MathView math="f(-t) = f(t)" />) contain only cosine terms <MathView math="a_n" />. Half-wave symmetry eliminates all even harmonics!
          </p>
        </div>

        {/* Section 3: Decay vs Smoothness */}
        <div className="space-y-1.5 pt-1 border-t border-violet-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-800 flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Smoothness Dictates Decay
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Discontinuous functions decay slowly as <MathView math="O(1/n)" />. Continuous functions with kinked corners (triangle wave) decay as <MathView math="O(1/n^2)" />. Infinitely smooth functions decay exponentially.
          </p>
        </div>

        {/* Prediction Quiz */}
        <div className="pt-2 border-t border-violet-50/60">
          <button
            onClick={() => setIsPredictionOpen(!isPredictionOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-violet-600 transition-colors py-1"
          >
            <span>Your prediction</span>
            {isPredictionOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isPredictionOpen && (
            <div className="mt-2 space-y-2.5">
              <p className="text-[11px] text-slate-600">
                Why does a symmetric square wave have zero even harmonics (<MathView math="b_2 = b_4 = b_6 = 0" />)?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['Half-Wave Symmetry', 'Even Function', 'Random Chance', 'DC Offset'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedPrediction(opt)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border text-left ${
                      selectedPrediction === opt
                        ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-violet-50/50'
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
            className="flex-1 py-2 px-3 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-md shadow-violet-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
          <div className="bg-violet-50 border border-violet-200 rounded-2xl p-3 flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-violet-950 font-bold block">Correct! Half-Wave Symmetry.</strong>
              <p className="text-violet-800 text-[11px] mt-0.5 leading-tight">
                Since <MathView math="f(t + T/2) = -f(t)" />, shifting by half a period flips the sign, canceling out all even harmonic integrals to exactly zero.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
