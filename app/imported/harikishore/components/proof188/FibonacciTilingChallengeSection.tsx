import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, RotateCcw, Sparkles } from 'lucide-react';
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
    question: "What is the sum of the areas of the first 4 Fibonacci squares: 1², 1², 2², 3²?",
    options: ["14", "15", "16", "18"],
    correct: 1,
    explanation: "1² + 1² + 2² + 3² = 1 + 1 + 4 + 9 = 15. Notice this equals F4 × F5 = 3 × 5 = 15!"
  },
  {
    id: 2,
    question: "Which general formula gives the total area of squares up to F_n?",
    mathSnippet: "\\sum_{k=1}^n F_k^2 = ?",
    options: [
      "F_n^2",
      "F_n \\times F_{n+1}",
      "F_{n-1} \\times F_{n+1}",
      "F_{n+2} - 1"
    ],
    correct: 1,
    explanation: "The sum of the first n squared Fibonacci numbers always equals the rectangle area F_n × F_(n+1)."
  },
  {
    id: 3,
    question: "If F7 = 13 and F8 = 21, what is the area of a rectangle tiled with the first 7 Fibonacci squares?",
    options: [
      "169",
      "273",
      "441",
      "144"
    ],
    correct: 1,
    explanation: "The area is F7 × F8 = 13 × 21 = 273. It is also equal to 1² + 1² + 2² + 3² + 5² + 8² + 13² = 273."
  }
];

export const FibonacciTilingChallengeSection: React.FC = () => {
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
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-emerald-100/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-100 shadow-inner">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 font-sans">
              Test Your Fibonacci Tiling Mastery
            </h3>
            <p className="text-xs text-slate-500 font-sans">
              3 questions on square sums, edge recurrence, and outer rectangle dimensions.
            </p>
          </div>
        </div>

        {submitted && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
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
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
                      {ch.id}
                    </span>
                    <span className="text-xs font-bold text-slate-800 font-sans">
                      {ch.question}
                    </span>
                  </div>
                  {ch.mathSnippet && (
                    <div className="pl-7 pt-1 font-bold text-emerald-800 text-xs">
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
                    optStyle = "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold ring-2 ring-emerald-400/20";
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
            className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            Submit Answers
          </button>
        </div>
      )}
    </div>
  );
};
