import React, { useState } from 'react';
import { HelpCircle, Sparkles, Check, X, Compass, Flower2 } from 'lucide-react';
import { MathView } from '../common/MathView';

export const FibonacciTilingWhyItWorksPanel: React.FC = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const question = {
    text: "If you tile the first 8 Fibonacci squares (F1 through F8 = 21), what are the exact dimensions of the full bounding rectangle?",
    options: [
      "13 × 21",
      "21 × 34",
      "21 × 21",
      "34 × 55"
    ],
    correct: 1, // "21 × 34"
    explanation: "By the Fibonacci tiling theorem, tiling squares up to F_n yields a rectangle of dimensions F_n × F_(n+1). Since F8 = 21 and F9 = 34, the rectangle dimensions are 21 × 34."
  };

  const handleSelect = (idx: number) => {
    setSelectedAnswer(idx);
    setShowResult(true);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-emerald-100/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100 shadow-inner">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 font-sans">
            Why Does Fibonacci Tiling Work So Elegantly?
          </h2>
          <p className="text-xs text-slate-500 font-sans">
            The fundamental relationship between linear recursion and 2D geometric tiling.
          </p>
        </div>
      </div>

      {/* 2-column Intuition Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-emerald-50/40 rounded-2xl p-5 border border-emerald-100/80 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Seamless Edge-Fitting by Definition</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            Every Fibonacci number is defined as the sum of the preceding two numbers: <MathView math="F_n = F_{n-1} + F_{n-2}" />.
            In 2D space, placing square <MathView math="F_{n-1}" /> next to square <MathView math="F_{n-2}" /> creates an exposed edge that measures exactly <MathView math="F_{n-1} + F_{n-2}" />. That is precisely the side length of square <MathView math="F_n" />!
          </p>
        </div>

        <div className="bg-teal-50/40 rounded-2xl p-5 border border-teal-100/80 space-y-3">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
            <Flower2 className="w-4 h-4 text-teal-600" />
            <span>Optimal Packing in Biological Growth</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            Sunflower seed heads, pinecones, and pineapple scales pack seeds according to Fibonacci spirals. Because the ratio of consecutive Fibonacci numbers approaches the Golden Ratio <MathView math="\phi \approx 1.618" />, this tiling pattern provides the mathematically tightest packing without wasting empty space.
          </p>
        </div>
      </div>

      {/* Interactive Micro-Check */}
      <div className="border border-slate-200/80 rounded-2xl p-5 bg-slate-50/50 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
            Quick Check: Predict Dimensions
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
                btnStyle = "bg-emerald-500 border-emerald-600 text-white font-bold";
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
                className={`py-2 px-3 text-xs rounded-xl border transition-all text-left flex items-center justify-between font-sans ${btnStyle}`}
              >
                <span>{opt}</span>
                {showResult && isCorrect && <Check className="w-4 h-4 text-white" />}
                {showResult && isChosen && !isCorrect && <X className="w-4 h-4 text-white" />}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="bg-white rounded-xl p-3 border border-emerald-100 text-xs text-slate-700 font-sans">
            <span className="font-bold text-emerald-700">Explanation: </span>
            {question.explanation}
          </div>
        )}
      </div>
    </div>
  );
};
