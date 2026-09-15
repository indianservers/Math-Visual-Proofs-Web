import React, { useState } from 'react';
import { Sparkles, RotateCcw, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { MathView } from '../common/MathView';

interface WhyItWorksProps {
  onReset: () => void;
}

export const GradientWhyItWorksPanel: React.FC<WhyItWorksProps> = ({
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
        {/* Section 1: Directional Derivative as Dot Product */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Dot Product Projection
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            The rate of change in any arbitrary unit direction <MathView math="\hat{u}" /> is given by the projection <MathView math="D_{\hat{u}}f = \nabla f \cdot \hat{u} = \|\nabla f\|\cos\phi" />.
          </p>
        </div>

        {/* Section 2: Maximized at phi = 0 */}
        <div className="space-y-1.5 pt-1 border-t border-emerald-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Steepest Ascent & Descent
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Since <MathView math="-1 \le \cos\phi \le 1" />, the maximum rate of increase is <MathView math="+\|\nabla f\|" /> (pointing along <MathView math="\nabla f" />), while steepest descent is <MathView math="-\|\nabla f\|" /> (opposite to <MathView math="\nabla f" />).
          </p>
        </div>

        {/* Section 3: Level Curve Orthogonality */}
        <div className="space-y-1.5 pt-1 border-t border-emerald-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Why Contours are Perpendicular
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Level curves are lines of zero altitude change (<MathView math="D_{\vec{T}}f = 0 \implies \cos\phi = 0 \implies \phi = 90^\circ" />). Moving perpendicular to zero change maximizes the rate of altitude change.
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
                For the surface <MathView math="f(x, y) = x^2 + y^2" />, what is the gradient vector at <MathView math="(2, 3)" />?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['[4, 6]', '[2, 3]', '[6, 4]', '[0, 0]'].map((opt) => (
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
              <strong className="text-emerald-950 font-bold block">Correct! ∇f = [4, 6].</strong>
              <p className="text-emerald-800 text-[11px] mt-0.5 leading-tight">
                Since <MathView math="\partial f/\partial x = 2x = 2(2) = 4" /> and <MathView math="\partial f/\partial y = 2y = 2(3) = 6" />, the gradient vector is <MathView math="[4, 6]" />.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
