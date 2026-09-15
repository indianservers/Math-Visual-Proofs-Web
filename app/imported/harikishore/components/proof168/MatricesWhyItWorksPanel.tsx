import React, { useState } from 'react';
import { Sparkles, RotateCcw, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { Matrix2x2, getDeterminant } from '../../utils/matricesMath';
import { MathView } from '../common/MathView';
import { sound } from '../../utils/sound';

interface WhyItWorksProps {
  matrix: Matrix2x2;
  onReset: () => void;
}

export const MatricesWhyItWorksPanel: React.FC<WhyItWorksProps> = ({
  matrix,
  onReset,
}) => {
  const [isPredictionOpen, setIsPredictionOpen] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const det = getDeterminant(matrix);

  const handleReveal = () => {
    sound.playSuccess();
    setIsRevealed(true);
  };

  const handleResetInternal = () => {
    sound.playClick();
    setSelectedPrediction(null);
    setIsRevealed(false);
    onReset();
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-blue-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-blue-50/80">
        <Sparkles className="w-4 h-4 text-blue-600" />
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight font-sans">
          Why it works
        </h2>
      </div>

      <div className="space-y-4">
        {/* Section 1: Basis Vector Columns */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Columns = Where î and ĵ Land
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Column 1 tells you where <MathView math="\hat{i} = (1, 0)" /> moves, and Column 2 tells you where <MathView math="\hat{j} = (0, 1)" /> moves.
          </p>
        </div>

        {/* Section 2: Linear Superposition */}
        <div className="space-y-1.5 pt-1 border-t border-blue-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Linear Superposition
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Because the transformation is linear, any vector <MathView math="\vec{v} = x\hat{i} + y\hat{j}" /> maps to <MathView math="x M\hat{i} + y M\hat{j}" />. Grid lines remain parallel and evenly spaced.
          </p>
        </div>

        {/* Section 3: Determinant & Orientation */}
        <div className="space-y-1.5 pt-1 border-t border-blue-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Determinant = Area Multiplier
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            <MathView math="\det(M) = ad - bc" /> measures how much areas are scaled. If negative, the shape is flipped (orientation reversed).
          </p>
        </div>

        {/* Section 4: Matrix Inverse & Why det = 0 Fails (Items 66 & 172) */}
        <div className="space-y-1.5 pt-1 border-t border-blue-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
              4
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              The Inverse Matrix & Irreversibility of det = 0
            </h3>
          </div>
          <p className="text-[11px] text-slate-600 ml-7 leading-relaxed">
            • <strong>Why M · M⁻¹ = I:</strong> Just like dividing 5 by 5 yields 1, applying <MathView math="M^{-1}" /> undoes the transformation of <MathView math="M" />. Every point returns to its original coordinate, which by definition is the Identity matrix <MathView math="I" />.<br/>
            • <strong>Why det = 0 cannot be inverted:</strong> When <MathView math="\det = 0" />, the entire 2D plane collapses onto a single flat line. Infinite different points collapse into the same spots. Because original positions are lost, you cannot "un-collapse" the line back into the original 2D space.
          </p>
        </div>

        {/* Prediction Quiz */}
        <div className="pt-2 border-t border-blue-50/60">
          <button
            onClick={() => setIsPredictionOpen(!isPredictionOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors py-1"
          >
            <span>Your prediction</span>
            {isPredictionOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isPredictionOpen && (
            <div className="mt-2 space-y-2.5">
              <p className="text-[11px] text-slate-600">
                If a matrix has <MathView math="a=3, d=2, b=0, c=1" />, what is the area of a circle with original area 5?
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {[10, 25, 30, 35].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      sound.playClick();
                      setSelectedPrediction(val);
                    }}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      selectedPrediction === val
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50/50'
                    }`}
                  >
                    {val}
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
            className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
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

        {/* Success / Feedback */}
        {isRevealed && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-blue-900 font-bold block">Correct! Area = 30.</strong>
              <p className="text-blue-700 text-[11px] mt-0.5 leading-tight">
                <MathView math="\det(M) = (3)(2) - (0)(1) = 6" />. The new area is <MathView math="6 \times 5 = 30" />.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
