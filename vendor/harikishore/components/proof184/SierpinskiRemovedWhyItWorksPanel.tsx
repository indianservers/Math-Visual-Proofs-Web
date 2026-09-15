import React, { useState } from 'react';
import { Sparkles, RotateCcw, ChevronDown, ChevronUp, CheckCircle2, HelpCircle } from 'lucide-react';
import { MathView } from '../common/MathView';

interface WhyItWorksProps {
  onReset: () => void;
}

export const SierpinskiRemovedWhyItWorksPanel: React.FC<WhyItWorksProps> = ({
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
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-violet-100/80 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200/60">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-sans">
            Why It Works & Intuition
          </h3>
        </div>
        <button
          onClick={handleResetInternal}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          title="Reset prediction"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Intuition Cards */}
      <div className="space-y-3">
        <div className="p-3.5 rounded-2xl bg-violet-50/50 border border-violet-100 space-y-2">
          <div className="text-xs font-bold text-violet-950 font-sans flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-violet-600" />
            <span>The 8-Surrounding Ring Rule</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            When you punch 1 center square out of a 3×3 grid, exactly 8 solid sub-squares surround it.
            In the next step, every single one of those 8 solid squares gets its own center punched!
          </p>
          <div className="bg-white py-1.5 px-2.5 rounded-xl border border-violet-100 text-center text-xs font-mono font-bold text-violet-700">
            1 hole → 8 solid squares → 8 new holes!
          </div>
        </div>

        {/* Misconception: Divisor 7 */}
        <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1.5">
          <div className="text-xs font-bold text-amber-950 font-sans">
            Misconception: "Why is the denominator 7 and not 8?"
          </div>
          <p className="text-xs text-slate-600 font-sans leading-relaxed">
            Students often expect <MathView math="8^n / 8" />. But in the geometric telescoping subtraction:
          </p>
          <div className="bg-white py-1.5 px-2 rounded-xl border border-amber-200 text-center font-mono font-bold text-amber-800 text-xs">
            8 · S - 1 · S = 7 · S
          </div>
          <p className="text-[11px] text-slate-500 font-sans">
            Subtracting the single original copy reduces the factor from 8 to 7!
          </p>
        </div>
      </div>

      {/* Interactive Prediction Check */}
      <div className="border border-violet-100 rounded-2xl overflow-hidden">
        <button
          onClick={() => setIsPredictionOpen(!isPredictionOpen)}
          className="w-full flex items-center justify-between p-3.5 bg-violet-50/70 hover:bg-violet-50 transition-colors text-left font-sans"
        >
          <span className="text-xs font-bold text-violet-950 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-violet-600" />
            <span>Interactive Prediction: Step 3 Count</span>
          </span>
          {isPredictionOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {isPredictionOpen && (
          <div className="p-4 bg-white space-y-3">
            <p className="text-xs text-slate-700 font-sans">
              At step 3, how many <em>cumulative total</em> holes are removed from the carpet?
            </p>

            <div className="space-y-2">
              {[
                { id: 'opt64', label: '64 holes (only the newly punched holes)' },
                { id: 'opt73', label: '73 holes (1 + 8 + 64 = 73 = (8³ - 1)/7)' },
                { id: 'opt81', label: '81 holes (9² holes)' }
              ].map(opt => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedPrediction === opt.id
                      ? 'border-violet-600 bg-violet-50/60 font-semibold text-violet-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="prediction"
                    checked={selectedPrediction === opt.id}
                    onChange={() => setSelectedPrediction(opt.id)}
                    className="accent-violet-600"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            {!isRevealed ? (
              <button
                onClick={handleReveal}
                disabled={!selectedPrediction}
                className="w-full py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Check Answer
              </button>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Correct! 73 total holes</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed font-sans">
                  The cumulative holes sum all generations: <MathView math="1 + 8 + 64 = 73" />. And <MathView math="(512 - 1) / 7 = 511 / 7 = 73" /> matches perfectly!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};