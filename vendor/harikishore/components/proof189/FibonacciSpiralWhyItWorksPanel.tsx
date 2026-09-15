import React, { useState } from 'react';
import { HelpCircle, Sparkles, Check, X, Compass, Shell } from 'lucide-react';
import { MathView } from '../common/MathView';

export const FibonacciSpiralWhyItWorksPanel: React.FC = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const question = {
    text: "Why does the Fibonacci spiral make an almost exact approximation of the true logarithmic Golden Spiral?",
    options: [
      "Because each quarter-turn expands the distance from the center by a factor close to the golden ratio f",
      "Because circles and squares have the exact same perimeter",
      "Because every Fibonacci number is divisible by 5",
      "Because the total angle of all arcs sums to exactly 360 degrees"
    ],
    correct: 0,
    explanation: "In a true logarithmic golden spiral, each 90° rotation increases the radius by f^(1/2) and every full turn expands by f4. The ratio of successive Fibonacci numbers F_(k+1)/F_k rapidly converges to f, making the circular arc sequence virtually indistinguishable from the true spiral."
  };

  const handleSelect = (idx: number) => {
    setSelectedAnswer(idx);
    setShowResult(true);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-amber-100/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 border border-amber-100 shadow-inner">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 font-sans">
            Why Does the Fibonacci Spiral Appear Everywhere in Nature?
          </h2>
          <p className="text-xs text-slate-500 font-sans">
            Self-similarity and scale-invariance in natural growth patterns.
          </p>
        </div>
      </div>

      {/* 2-column Intuition Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-amber-50/40 rounded-2xl p-5 border border-amber-100/80 space-y-3">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
            <Shell className="w-4 h-4 text-amber-600" />
            <span>Equiangular Growth (Spira Mirabilis)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            A growing organism (like a chambered nautilus or a ram's horn) must grow continuously without altering its overall shape. The only 2D curve with this constant-shape property is the logarithmic spiral, where any line from the center cuts the curve at an identical angle.
          </p>
        </div>

        <div className="bg-orange-50/40 rounded-2xl p-5 border border-orange-100/80 space-y-3">
          <div className="flex items-center gap-2 text-orange-800 font-bold text-sm">
            <Compass className="w-4 h-4 text-orange-600" />
            <span>Golden Angle & Leaf Phyllotaxis</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            Plants position new leaves or petals at the Golden Angle: <MathView math="360^\circ \times (1 - 1/\phi) \approx 137.5^\circ" />. Because <MathView math="\phi" /> is the most irrational number (its continued fraction consists purely of 1s), this rotation angle ensures that consecutive leaves never overlap directly over older ones, maximizing sun exposure.
          </p>
        </div>
      </div>

      {/* Interactive Micro-Check */}
      <div className="border border-slate-200/80 rounded-2xl p-5 bg-slate-50/50 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
            Quick Check: The Spiral Growth Factor
          </h4>
        </div>
        <p className="text-xs font-medium text-slate-700 font-sans">
          {question.text}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {question.options.map((opt, idx) => {
            const isChosen = selectedAnswer === idx;
            const isCorrect = idx === question.correct;
            let btnStyle = "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";

            if (showResult) {
              if (isCorrect) {
                btnStyle = "bg-amber-500 border-amber-600 text-white font-bold";
              } else if (isChosen) {
                btnStyle = "bg-rose-500 border-rose-600 text-white font-bold";
              } else {
                btnStyle = "bg-white/50 border-slate-200 text-slate-400 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => !showResult && handleSelect(idx)}
                disabled={showResult}
                className={`py-2.5 px-3 text-xs rounded-xl border transition-all text-left flex items-center justify-between font-sans ${btnStyle}`}
              >
                <span>{opt}</span>
                {showResult && isCorrect && <Check className="w-4 h-4 text-white shrink-0 ml-1" />}
                {showResult && isChosen && !isCorrect && <X className="w-4 h-4 text-white shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="bg-white rounded-xl p-3 border border-amber-100 text-xs text-slate-700 font-sans">
            <span className="font-bold text-amber-800">Explanation: </span>
            {question.explanation}
          </div>
        )}
      </div>
    </div>
  );
};
