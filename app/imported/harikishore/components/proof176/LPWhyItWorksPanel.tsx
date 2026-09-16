import React, { useState } from 'react';
import { Sparkles, RotateCcw, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { MathView } from '../common/MathView';

interface WhyItWorksProps {
  onReset: () => void;
}

export const LPWhyItWorksPanel: React.FC<WhyItWorksProps> = ({
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
        {/* Section 1: Convex Polytopes */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-800 flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Convexity of Feasible Regions
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            The intersection of linear half-planes is always convex: the line segment connecting any two feasible points lies entirely within the region.
          </p>
        </div>

        {/* Section 2: Linear Level Lines */}
        <div className="space-y-1.5 pt-1 border-t border-violet-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-800 flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Constant Objective Gradient
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Because <MathView math="\nabla Z = [c_1, c_2]" /> is constant everywhere, the objective function has no interior peaks or valleys. It increases monotonically in the direction of <MathView math="\nabla Z" />.
          </p>
        </div>

        {/* Section 3: Simplex Algorithm Basis */}
        <div className="space-y-1.5 pt-1 border-t border-violet-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-800 flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              The Simplex Method
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Dantzig's Simplex Algorithm operates by walking along the edges from one vertex to an adjacent higher-value vertex until the global maximum vertex is reached.
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
                If the vertices of a feasible region are (0,0), (4,0), and (0,3), what is the maximum value of <MathView math="Z = 2x + 5y" />?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['Z = 15 at (0,3)', 'Z = 8 at (4,0)', 'Z = 23 at (4,3)', 'Z = 0 at (0,0)'].map((opt) => (
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
              <strong className="text-violet-950 font-bold block">Correct! Z = 15 at vertex (0, 3).</strong>
              <p className="text-violet-800 text-[11px] mt-0.5 leading-tight">
                Evaluating vertices: <MathView math="Z(0,0) = 0" />, <MathView math="Z(4,0) = 8" />, and <MathView math="Z(0,3) = 2(0) + 5(3) = 15" /> (optimal maximum).
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
