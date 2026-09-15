import React, { useState } from 'react';
import { Sparkles, RotateCcw, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { MathView } from '../common/MathView';

interface WhyItWorksProps {
  amplitude: number;
  omega: number;
  phase: number;
  onReset: () => void;
}

export const SHMWhyItWorksPanel: React.FC<WhyItWorksProps> = ({
  amplitude,
  omega,
  phase,
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
        {/* Section 1: Amplitude & Peak Kinetic Energy */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Amplitude = Max Displacement
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            The oscillating mass swings symmetrically between <MathView math="-A" /> and <MathView math="+A" />. Velocity reaches zero at endpoints and reaches peak <MathView math="v_{\max} = \omega A" /> at equilibrium (<MathView math="x=0" />).
          </p>
        </div>

        {/* Section 2: Frequency & Period Independence */}
        <div className="space-y-1.5 pt-1 border-t border-amber-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Period is Amplitude-Independent (Isochronous)
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            The period <MathView math="T = 2\pi\sqrt{m/k}" /> depends only on mass and spring stiffness, not on how far the mass was initially pulled!
          </p>
        </div>

        {/* Section 3: Energy Conservation */}
        <div className="space-y-1.5 pt-1 border-t border-amber-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Energy Conservation (K + U = Constant)
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Kinetic energy <MathView math="\frac{1}{2}mv^2" /> transforms continuously into spring potential energy <MathView math="\frac{1}{2}kx^2" /> while total energy stays fixed at <MathView math="\frac{1}{2}kA^2" />.
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
                If the spring stiffness <MathView math="k" /> is multiplied by 4, what happens to the oscillation period <MathView math="T" />?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['Halved (T / 2)', 'Doubled (2T)', 'Quartered (T / 4)', 'Unchanged'].map((opt) => (
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
              <strong className="text-amber-950 font-bold block">Correct! Period is Halved (T / 2).</strong>
              <p className="text-amber-800 text-[11px] mt-0.5 leading-tight">
                Since <MathView math="T = 2\pi\sqrt{m/k}" />, quadrupling <MathView math="k" /> results in <MathView math="\sqrt{4} = 2" /> in the denominator, so the period is halved and the frequency doubles.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
