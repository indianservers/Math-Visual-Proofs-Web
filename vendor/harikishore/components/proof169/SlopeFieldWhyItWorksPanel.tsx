import React, { useState } from 'react';
import { Sparkles, RotateCcw, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { ODEPreset } from '../../data/slopeFieldData';
import { MathView } from '../common/MathView';

interface WhyItWorksProps {
  selectedODE: ODEPreset;
  x0: number;
  y0: number;
  onReset: () => void;
}

export const SlopeFieldWhyItWorksPanel: React.FC<WhyItWorksProps> = ({
  selectedODE,
  x0,
  y0,
  onReset,
}) => {
  const [isPredictionOpen, setIsPredictionOpen] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const currentSlope = selectedODE.fn(x0, y0);

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleResetInternal = () => {
    setSelectedPrediction(null);
    setIsRevealed(false);
    onReset();
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-sky-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-sky-50/80">
        <Sparkles className="w-4 h-4 text-sky-600" />
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight font-sans">
          Why it works
        </h2>
      </div>

      <div className="space-y-4">
        {/* Section 1: Direction Arrows as Tangents */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Instantaneous Derivatives
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            The differential equation <MathView math="\frac{dy}{dx} = f(x, y)" /> assigns a slope to every coordinate pair <MathView math="(x, y)" /> without requiring integration first.
          </p>
        </div>

        {/* Section 2: Existence & Uniqueness */}
        <div className="space-y-1.5 pt-1 border-t border-sky-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Picard–Lindelöf Uniqueness
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Through any point <MathView math="(x_0, y_0)" /> where <MathView math="f(x, y)" /> is continuously differentiable, exactly one integral curve passes through. Solution curves can never cross each other.
          </p>
        </div>

        {/* Section 3: Isoclines & Flow Field */}
        <div className="space-y-1.5 pt-1 border-t border-sky-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Flow Field & Equilibrium
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Horizontal arrows (<MathView math="\frac{dy}{dx} = 0" />) indicate potential equilibrium states or local maxima/minima along trajectories.
          </p>
        </div>

        {/* Prediction Quiz */}
        <div className="pt-2 border-t border-sky-50/60">
          <button
            onClick={() => setIsPredictionOpen(!isPredictionOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-sky-600 transition-colors py-1"
          >
            <span>Your prediction</span>
            {isPredictionOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isPredictionOpen && (
            <div className="mt-2 space-y-2.5">
              <p className="text-[11px] text-slate-600">
                For <MathView math="\frac{dy}{dx} = x - y" />, what is the slope along the diagonal line <MathView math="y = x" />?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['0 (horizontal)', '1 (diagonal)', '-1', 'Undefined'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedPrediction(opt)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border text-left ${
                      selectedPrediction === opt
                        ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-sky-50/50'
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
            className="flex-1 py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3 flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-sky-950 font-bold block">Correct! Slope = 0.</strong>
              <p className="text-sky-800 text-[11px] mt-0.5 leading-tight">
                When <MathView math="y = x" />, <MathView math="\frac{dy}{dx} = x - x = 0" /> everywhere along the line. Thus all solution curves cross <MathView math="y = x" /> with horizontal tangents.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
