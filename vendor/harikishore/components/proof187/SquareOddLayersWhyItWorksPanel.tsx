import React, { useState } from 'react';
import { Sparkles, RotateCcw, ChevronDown, ChevronUp, CheckCircle2, HelpCircle } from 'lucide-react';
import { MathView } from '../common/MathView';

interface WhyItWorksProps {
  onReset: () => void;
}

export const SquareOddLayersWhyItWorksPanel: React.FC<WhyItWorksProps> = ({
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
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-amber-100/80 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200/60">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-sans">
            Why It Works & Geometric Intuition
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
        <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2">
          <div className="text-xs font-bold text-amber-950 font-sans flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            <span>Why Is It Always an ODD Number?</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            A square has 2 perpendicular sides of length <MathView math="n - 1" />.
            When you add tiles to both sides, you get an even number: <MathView math="2 \times (n - 1)" />.
            Then you need exactly <strong>1 single corner tile</strong> to fill the joint!
          </p>
          <div className="bg-white py-1.5 px-2.5 rounded-xl border border-amber-200 text-center font-mono font-bold text-amber-800 text-xs">
            Even + 1 = Always ODD!
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
          <div className="text-xs font-bold text-slate-800 font-sans">
            Ancient Greek "Gnomon"
          </div>
          <p className="text-xs text-slate-600 font-sans leading-relaxed">
            Pythagoras and his school called this L-shaped carpenter's square a <em>gnomon</em>. They observed that wrapping a gnomon around a square keeps it a square!
          </p>
        </div>
      </div>

      {/* Interactive Prediction Check */}
      <div className="border border-amber-100 rounded-2xl overflow-hidden">
        <button
          onClick={() => setIsPredictionOpen(!isPredictionOpen)}
          className="w-full flex items-center justify-between p-3.5 bg-amber-50/70 hover:bg-amber-50 transition-colors text-left font-sans"
        >
          <span className="text-xs font-bold text-amber-950 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>Interactive Prediction: Layer 7 Count</span>
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
              To grow a <MathView math="6 \times 6" /> square (36 tiles) to a <MathView math="7 \times 7" /> square (49 tiles), how many tiles are in the 7th layer?
            </p>

            <div className="space-y-2">
              {[
                { id: 'opt11', label: '11 tiles' },
                { id: 'opt13', label: '13 tiles (2 × 7 - 1 = 13, and 49 - 36 = 13)' },
                { id: 'opt14', label: '14 tiles' }
              ].map(opt => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedPrediction === opt.id
                      ? 'border-amber-600 bg-amber-50/60 font-semibold text-amber-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="prediction"
                    checked={selectedPrediction === opt.id}
                    onChange={() => setSelectedPrediction(opt.id)}
                    className="accent-amber-600"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            {!isRevealed ? (
              <button
                onClick={handleReveal}
                disabled={!selectedPrediction}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Check Answer
              </button>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Correct! 13 tiles</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed font-sans">
                  The formula gives <MathView math="2(7) - 1 = 13" />. And <MathView math="7^2 - 6^2 = 49 - 36 = 13" />!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};