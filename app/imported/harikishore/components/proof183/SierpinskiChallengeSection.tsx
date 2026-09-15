import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { MathView } from '../common/MathView';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'At iteration level n = 2, how many small solid squares remain?',
    options: ['16 squares', '64 squares (8²)', '72 squares', '81 squares (9²)'],
    correctIndex: 1,
    explanation: 'Each retained square splits into 8 copies. Therefore at level 2 there are 8 × 8 = 8² = 64 squares.',
  },
  {
    id: 2,
    question: 'What fraction of area is kept from one level to the next?',
    options: ['1/9', '1/3', '8/9', '9/8'],
    correctIndex: 2,
    explanation: 'The unit 3×3 grid has 9 squares. Exactly 1 center square is removed, leaving 8 squares, so the retention ratio is 8/9.',
  },
  {
    id: 3,
    question: 'What is the Hausdorff fractal dimension of the Sierpinski carpet?',
    options: [
      'D = 1.0 (pure 1D curve)',
      'D = ln(8)/ln(3) ≈ 1.8928',
      'D = 2.0 (solid 2D area)',
      'D = 3.0 (3D volume)'
    ],
    correctIndex: 1,
    explanation: 'Magnifying by scale factor 3 yields 8 self-similar pieces. Hence 3^D = 8, giving D = ln(8)/ln(3) ≈ 1.8928.',
  },
];

export const SierpinskiChallengeSection: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qId: number, optIdx: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    return QUESTIONS.reduce((acc, q) => {
      return acc + (selectedAnswers[q.id] === q.correctIndex ? 1 : 0);
    }, 0);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-indigo-100/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-inner">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-sans">
              Fractal Understanding Challenge
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Verify your comprehension of recursive self-similarity, retained area decay, and fractal dimensions.
            </p>
          </div>
        </div>

        {submitted && (
          <div className="flex items-center gap-3">
            <div className="text-xs font-bold text-slate-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 font-sans">
              Score: <span className="text-indigo-600 font-black">{calculateScore()}</span> / {QUESTIONS.length}
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors font-sans"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Try Again
            </button>
          </div>
        )}
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {QUESTIONS.map((q, idx) => {
          const userAns = selectedAnswers[q.id];
          const isCorrect = userAns === q.correctIndex;

          return (
            <div
              key={q.id}
              className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    Question {idx + 1}
                  </span>
                  {submitted && (
                    isCorrect ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-rose-500">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )
                  )}
                </div>

                <p className="text-xs font-bold text-slate-800 font-sans leading-snug">
                  {q.question}
                </p>

                <div className="space-y-2 pt-1">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = userAns === oIdx;
                    let btnStyle = 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50';

                    if (submitted) {
                      if (oIdx === q.correctIndex) {
                        btnStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-bold';
                      } else if (isSelected) {
                        btnStyle = 'border-rose-400 bg-rose-50 text-rose-800';
                      }
                    } else if (isSelected) {
                      btnStyle = 'border-indigo-600 bg-indigo-50/80 text-indigo-900 font-bold';
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={submitted}
                        onClick={() => handleSelect(q.id, oIdx)}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all font-sans ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {submitted && (
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-[11px] text-slate-600 leading-relaxed font-sans mt-2">
                  <strong className="text-indigo-950 font-bold">Insight: </strong>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <div className="flex justify-end pt-2">
          <button
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(selectedAnswers).length < QUESTIONS.length}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-200 font-sans"
          >
            <span>Submit Answers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};