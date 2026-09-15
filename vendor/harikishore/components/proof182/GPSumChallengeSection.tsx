import React, { useState } from 'react';
import { Trophy, Lightbulb, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { MathView } from '../common/MathView';
import confetti from 'canvas-confetti';

interface GPSumChallenge {
  question: string;
  mathPrompt?: string;
  correctAnswer: number;
  hint: string;
  explanation: string;
}

const GP_SUM_CHALLENGES: GPSumChallenge[] = [
  {
    question: 'What is the sum of the first 4 terms of the GP: 1, 3, 9, 27?',
    mathPrompt: 'S_4 = 1 \\cdot \\frac{3^4 - 1}{3 - 1} = \\frac{81 - 1}{2} = ?',
    correctAnswer: 40,
    hint: '80 divided by 2 is 40.',
    explanation: '1 + 3 + 9 + 27 = 40.',
  },
  {
    question: 'Calculate the sum of the first 5 terms of the powers of 2: 1 + 2 + 4 + 8 + 16.',
    mathPrompt: 'S_5 = 2^5 - 1 = 32 - 1 = ?',
    correctAnswer: 31,
    hint: '32 minus 1 is 31.',
    explanation: '2⁵ - 1 = 32 - 1 = 31.',
  },
  {
    question: 'If a = 2, r = 3, and n = 3, what is the sum S₃?',
    mathPrompt: 'S_3 = 2 \\times \\frac{3^3 - 1}{3 - 1} = 2 \\times \\frac{26}{2} = ?',
    correctAnswer: 26,
    hint: '2 + 6 + 18 = 26.',
    explanation: 'Terms are 2, 6, 18. Sum = 26.',
  },
];

export const GPSumChallengeSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [streak, setStreak] = useState(0);

  const current = GP_SUM_CHALLENGES[currentIndex];

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
    setCurrentIndex((prev) => (prev + 1) % GP_SUM_CHALLENGES.length);
    setUserAnswer('');
    setFeedback('idle');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Challenge Card */}
      <div className="md:col-span-8 bg-white rounded-3xl p-5 md:p-6 border border-pink-100/80 shadow-sm flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
              <Trophy className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight font-sans">
              Challenge
            </h3>
          </div>
          {streak > 0 && (
            <span className="px-2.5 py-0.5 bg-pink-50 text-pink-700 border border-pink-200 rounded-full text-[11px] font-bold">
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
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 font-mono"
          />
          <button
            onClick={handleCheck}
            className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl shadow-md shadow-pink-500/20 transition-transform active:scale-95"
          >
            Check
          </button>
        </div>

        {feedback === 'correct' && (
          <div className="flex items-center justify-between bg-pink-50 text-pink-950 p-2.5 rounded-xl border border-pink-200 text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-pink-600 shrink-0" />
              <span><strong>Correct!</strong> {current.explanation}</span>
            </div>
            <button
              onClick={handleNext}
              className="px-3 py-1 bg-pink-600 hover:bg-pink-700 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0 ml-2"
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
      <div className="md:col-span-4 bg-white rounded-3xl p-5 md:p-6 border border-pink-100/80 shadow-sm flex flex-col justify-between space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight font-sans">
            Tip
          </h3>
        </div>

        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          <strong>Powers of 2 Shortcut:</strong> The sum of powers of 2 starting from 1 is always exactly 1 less than the next power of 2: <MathView math="1 + 2 + 4 + \dots + 2^k = 2^{k+1} - 1" />.
        </p>

        <div className="text-[11px] text-pink-900 font-semibold bg-pink-50/60 p-2.5 rounded-xl border border-pink-100/60 font-mono">
          S_n = a(1 - rⁿ) / (1 - r)
        </div>
      </div>
    </div>
  );
};
