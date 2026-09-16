import React, { useState } from 'react';
import { Sparkles, RotateCcw, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { TileDefinition } from '../../data/tessellationsData';
import { MathView } from '../common/MathView';
import { sound } from '../../utils/sound';

interface WhyItWorksProps {
  selectedTile: TileDefinition;
  onReset: () => void;
}

export const TessellationsWhyItWorksPanel: React.FC<WhyItWorksProps> = ({
  selectedTile,
  onReset,
}) => {
  const [isPredictionOpen, setIsPredictionOpen] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

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
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-emerald-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-emerald-50/80">
        <Sparkles className="w-4 h-4 text-emerald-600" />
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight font-sans">
          Why it works
        </h2>
      </div>

      <div className="space-y-4">
        {/* Section 1: Rigid Transformations in Tiling */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Transformations (Translations & Rotations)
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            Tiles are repeated by translation vectors and rotations around edge midpoints/vertices without resizing.
          </p>
        </div>

        {/* Section 2: The Gap & Overlap Condition */}
        <div className="space-y-1.5 pt-1 border-t border-emerald-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              The Vertex Sum Invariant
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            For a plane to be completely covered with zero gaps and zero overlaps, the interior angles meeting at every vertex must sum to exactly 360°.
          </p>
          <div className="ml-7 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/80 text-center font-mono text-xs text-emerald-900 font-bold">
            <MathView math="\theta_1 + \theta_2 + \dots + \theta_k = 360^\circ" />
          </div>
        </div>

        {/* Section 3: Only 3 Regular Tilings */}
        <div className="space-y-1.5 pt-1 border-t border-emerald-50/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              Regular Solutions: n = 3, 4, 6
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 ml-7 leading-tight">
            6 triangles (6×60°), 4 squares (4×90°), and 3 hexagons (3×120°) are the only single regular polygons that divide 360°.
          </p>
        </div>

        {/* Prediction Accordion */}
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
                Can regular octagons (135°) tessellate alone?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['No, leaves 90° gap', 'Yes, perfectly', 'No, overlaps by 45°', 'Yes, with rotation'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      sound.playClick();
                      setSelectedPrediction(opt);
                    }}
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

        {/* Success / Feedback */}
        {isRevealed && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-emerald-900 font-bold block">Correct! Well done.</strong>
              <p className="text-emerald-700 text-[11px] mt-0.5 leading-tight">
                Two octagons give 135° + 135° = 270°, leaving exactly a 90° square gap (which enables the famous 8.8.4 semi-regular tessellation).
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
