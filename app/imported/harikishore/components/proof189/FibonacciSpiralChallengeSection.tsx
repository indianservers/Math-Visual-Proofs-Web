import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { MathView } from '../common/MathView';

interface Challenge {
  id: number;
  question: string;
  mathSnippet?: string;
  options: string[];
  correct: number;
  explanation: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    question: "What is the positive solution to the golden ratio equation x² - x - 1 = 0?",
    mathSnippet: "\\phi = ?",
    options: [
      "\\frac{1 + \\sqrt{3}}{2} \\approx 1.366",
      "\\frac{1 + \\sqrt{5}}{2} \\approx 1.618",
      "\\frac{3 + \\sqrt{5}}{2} \\approx 2.618",
      "\\sqrt{2} \\approx 1.414"
    ],
    correct: 1,
    explanation: "By the quadratic formula on x² - x - 1 = 0, x = (1 ± v5)/2. The positive root is f = (1 + v5)/2  1.6180339887."
  },
  {
    id: 2,
    question: "At what angle does each adjacent quarter-circle arc turn in the Fibonacci spiral?",
    options: [
      "45 degrees",
      "90 degrees",
      "120 degrees",
      "180 degrees"
    ],
    correct: 1,
    explanation: "Each tile contains a 90° (quarter-circle) arc. Successive arcs connect with matching tangent slopes at 90° intervals."
  },
  {
    id: 3,
    question: "Compute the ratio F8 / F7 where F7 = 13 and F8 = 21:",
    mathSnippet: "\\frac{21}{13} = ?",
    options: [
      "1.6000",
      "1.6154",
      "1.6250",
      "1.6667"
    ],
    correct: 1,
    explanation: "21 / 13  1.61538... which is within 0.0026 of the true golden ratio f  1.61803."
  }
];

export const FibonacciSpiralChallengeSection: React.FC = () => {
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([null, null, null]);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    const next = [...userAnswers];
    next[qIdx] = optIdx;
    setUserAnswers(next);
  };

  const score = userAnswers.reduce((acc: number, ans, idx) => {
    return ans === CHALLENGES[idx].correct ? acc + 1 : acc;
  }, 0);

  const handleReset = () => {
    setUserAnswers([null, null, null]);
    setSubmitted(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-amber-100/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold border border-amber-100 shadow-inner">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 font-sans">
              Test Your Golden Spiral Knowledge
            </h3>
            <p className="text-xs text-slate-500 font-sans">
              3 challenges on the Golden Ratio, circular arc continuity, and limits.
            </p>
          </div>
        </div>

        {submitted && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Score: {score} / {CHALLENGES.length}
            </span>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}
      </div>

      {/* Challenges List */}
      <div className="space-y-6">
        {CHALLENGES.map((ch, qIdx) => {
          const isAnswered = userAnswers[qIdx] !== null;
          const isCorrect = submitted && userAnswers[qIdx] === ch.correct;
          const isWrong = submitted && isAnswered && !isCorrect;

          return (
            <div
              key={ch.id}
              className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200/80 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-black">
                      {ch.id}
                    </span>
                    <span className="text-xs font-bold text-slate-800 font-sans">
                      {ch.question}
                    </span>
                  </div>
                  {ch.mathSnippet && (
                    <div className="pl-7 pt-1 font-bold text-amber-800 text-xs">
                      <MathView math={ch.mathSnippet} />
                    </div>
                  )}
                </div>

                {submitted && (
                  <div>
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    {isWrong && <XCircle className="w-5 h-5 text-rose-500" />}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {ch.options.map((opt, optIdx) => {
                  const isSelected = userAnswers[qIdx] === optIdx;
                  let optStyle = "bg-white border-slate-200 text-slate-700 hover:bg-slate-100";

                  if (submitted) {
                    if (optIdx === ch.correct) {
                      optStyle = "bg-emerald-500 border-emerald-600 text-white font-bold";
                    } else if (isSelected) {
                      optStyle = "bg-rose-500 border-rose-600 text-white font-bold";
                    } else {
                      optStyle = "bg-white/60 border-slate-200 text-slate-400 opacity-60";
                    }
                  } else if (isSelected) {
                    optStyle = "bg-amber-50 border-amber-500 text-amber-900 font-bold ring-2 ring-amber-400/20";
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(qIdx, optIdx)}
                      disabled={submitted}
                      className={`p-2.5 rounded-xl border text-xs font-sans transition-all text-left flex items-center justify-between ${optStyle}`}
                    >
                      <span><MathView math={opt} /></span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation on submit */}
              {submitted && (
                <div className="bg-white rounded-xl p-3 border border-slate-200 text-xs text-slate-600 font-sans mt-2">
                  <span className="font-bold text-slate-800">Explanation: </span>
                  {ch.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <div className="flex justify-end pt-2">
          <button
            onClick={() => setSubmitted(true)}
            disabled={userAnswers.includes(null)}
            className="px-6 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-500/20 disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            Submit Answers
          </button>
        </div>
      )}
    </div>
  );
};
