import React, { useState } from 'react';
import { Trophy, Lightbulb, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { MathView } from '../common/MathView';
import confetti from 'canvas-confetti';

interface APChallenge {
  question: string;
  mathPrompt?: string;
  correctAnswer: number;
  hint: string;
  explanation: string;
}

const AP_CHALLENGES: APChallenge[] = [
  {
    question: 'In an AP, the first term is a = 3 and the last term is l = 17 with n = 6 terms. What is the sum S₆?',
    mathPrompt: 'S_6 = \\frac{6}{2}(3 + 17) = 3 \\times 20 = ?',
    correctAnswer: 60,
    hint: '3 × 20 = 60.',
    explanation: 'S_6 = (6 / 2)(3 + 17) = 3 × 20 = 60.',
  },
  {
    question: 'Find the sum of the AP: 4, 7, 10, 13 (where a = 4, l = 13, n = 4).',
    mathPrompt: 'S_4 = \\frac{4}{2}(4 + 13) = 2 \\times 17 = ?',
    correctAnswer: 34,
    hint: '2 × 17 = 34.',
    explanation: 'S_4 = 4 + 7 + 10 + 13 = 34.',
  },
  {
    question: 'If an AP has a = 10, common difference d = 5, and n = 5 terms, what is the sum S₅?',
    mathPrompt: 'l = 10 + 4(5) = 30, \\quad S_5 = \\frac{5}{2}(10 + 30) = ?',
    correctAnswer: 100,
    hint: '5/2 * 40 = 5 * 20 = 100.',
    explanation: 'Terms are 10, 15, 20, 25, 30. Sum = 100.',
  },
];

export const APSumChallengeSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [streak, setStreak] = useState(0);

  const current = AP_CHALLENGES[currentIndex];

  const handleCheck = () => {
    const val = parseInt(userAnswer.trim(), 10);
    if (isNaN(val)) return;

    if (val === current.correctAnswer) {
      setFeedback('correct');
      setStreak(prev => prev + 1);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.85 } });
      } catch {
        // Ignore
      }
    } else {
      setFeedback('incorrect');
      setStreak(0);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % AP_CHALLENGES.length);
    setUserAnswer('');
    setFeedback('idle');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Challenge Card */}
      <div className="md:col-span-8 bg-white rounded-3xl p-5 md:p-6 border border-purple-100/80 shadow-sm flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Trophy className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight font-sans">
              Challenge
            </h3>
          </div>
          {streak > 0 && (
            <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-[11px] font-bold">
              🔥 Streak: {streak}
            </span>
          )}
        </div>

        <div className="text-xs text-slate-700 font-medium space-y-1">
          <p>{current.question}</p>
          {current.mathPrompt && (
            <div className="py-1">
              <MathView math={current.mathPrompt} />
            </div>
          )}
        </div>

        {/* Input Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            Your answer
          </span>
          <input
            type="number"
            placeholder="Enter number"
            value={userAnswer}
            onChange={(e) => {
              setUserAnswer(e.target.value);
              if (feedback !== 'idle') setFeedback('idle');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCheck();
            }}
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-mono"
          />
          <button
            onClick={handleCheck}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-500/20 transition-transform active:scale-95"
          >
            Check
          </button>
        </div>

        {feedback === 'correct' && (
          <div className="flex items-center justify-between bg-purple-50 text-purple-950 p-2.5 rounded-xl border border-purple-200 text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
              <span><strong>Correct!</strong> {current.explanation}</span>
            </div>
            <button
              onClick={handleNext}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0 ml-2"
            >
              Next <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {feedback === 'incorrect' && (
          <div className="flex items-center justify-between bg-rose-50 text-rose-800 p-2.5 rounded-xl border border-rose-200 text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span><strong>Not quite.</strong> {current.hint}</span>
            </div>
            <button
              onClick={() => setFeedback('idle')}
              className="text-[11px] font-bold text-rose-700 underline ml-2"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Tip Card */}
      <div className="md:col-span-4 bg-white rounded-3xl p-5 md:p-6 border border-purple-100/80 shadow-sm flex flex-col justify-between space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight font-sans">
            Tip
          </h3>
        </div>

        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          <strong>Two Equivalent Formulas:</strong> When you know the last term <MathView math="l" />, use <MathView math="S_n = \frac{n}{2}(a + l)" />. When you know step <MathView math="d" />, use <MathView math="S_n = \frac{n}{2}[2a + (n - 1)d]" />. Both give the identical sum!
        </p>

        <div className="text-[11px] text-purple-900 font-semibold bg-purple-50/60 p-2.5 rounded-xl border border-purple-100/60 font-mono">
          S_n = (n/2) × (a + l)
        </div>
      </div>
    </div>
  );
};
