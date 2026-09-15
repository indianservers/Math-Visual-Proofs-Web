import React, { useState } from 'react';
import { Sparkles, RotateCcw, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { MathView } from '../common/MathView';

interface WhyItWorksProps {
  onReset: () => void;
}

export const DivCurlWhyItWorksPanel: React.FC<WhyItWorksProps> = ({
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
        {/* Section 1: Divergence as Flux Density */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-800 flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Flux Outflow Density (Divergence)
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            If more fluid exits a small box than enters it, mass is being created inside (<MathView math="\nabla \cdot \vec{F} > 0" />, a source). If more enters than exits, mass is being destroyed (<MathView math="\nabla \cdot \vec{F} < 0" />, a sink).
          </p>
        </div>

        {/* Section 2: Curl as Paddle Wheel Spin */}
        <div className="space-y-1.5 pt-1 border-t border-pink-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-800 flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Local Paddle Wheel Rotation (Curl)
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Placing a tiny paddle wheel in the field reveals circulation: if the fluid exerts an unbalanced torque on opposite blades, the wheel spins with angular speed proportional to <MathView math="(\nabla \times \vec{F})_z" />.
          </p>
        </div>

        {/* Section 3: Independence of Div & Curl */}
        <div className="space-y-1.5 pt-1 border-t border-pink-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-800 flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Helmholtz Decomposition
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Any sufficiently smooth vector field can be uniquely decomposed into an irrotational component (<MathView math="\text{curl} = 0" />) and an incompressible component (<MathView math="\text{div} = 0" />).
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
                For the vector field <MathView math="\vec{F} = (-y, x)" />, what are its divergence and curl?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['div = 0, curl = 2', 'div = 2, curl = 0', 'div = 0, curl = 0', 'div = -2, curl = 2'].map((opt) => (
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
              <strong className="text-pink-950 font-bold block">Correct! div = 0, curl = 2.</strong>
              <p className="text-pink-800 text-[11px] mt-0.5 leading-tight">
                <MathView math="\partial(-y)/\partial x + \partial x/\partial y = 0 + 0 = 0" />, while <MathView math="\partial x/\partial x - \partial(-y)/\partial y = 1 - (-1) = 2" /> (counterclockwise vortex).
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
