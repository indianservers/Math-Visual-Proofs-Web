import React, { useState } from 'react';
import { Trophy, Lightbulb, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { MathView } from '../common/MathView';
import confetti from 'canvas-confetti';

interface SHMChallenge {
  question: string;
  mathPrompt?: string;
  correctAnswer: number;
  hint: string;
  explanation: string;
}

const H_CHALLENGES: SHMChallenge[] = [
  {
    question: 'A mass-spring system oscillates with amplitude A = 3 m and angular frequency ω = 2 rad/s. What is its maximum speed in m/s?',
    mathPrompt: 'v_{\\max} = \\omega A',
    correctAnswer: 6,
    hint: 'Multiply angular frequency by amplitude: v_max = ω · A.',
    explanation: 'v_max = 2 rad/s × 3 m = 6 m/s.',
  },
  {
    question: 'An oscillator has amplitude A = 2 m and spring constant k = 8 N/m. What is its total mechanical energy in Joules?',
    mathPrompt: 'E = \\frac{1}{2} k A^2',
    correctAnswer: 16,
    hint: 'E = ½ (8)(2)² = ½ (8)(4).',
    explanation: 'E = 0.5 × 8 × 4 = 16 Joules.',
  },
  {
    question: 'If an oscillator has angular frequency ω = π rad/s, what is its period T in seconds?',
    mathPrompt: 'T = \\frac{2\\pi}{\\omega} = \\frac{2\\pi}{\\pi}',
    correctAnswer: 2,
    hint: 'Divide 2π by ω.',
    explanation: 'T = 2π / π = 2 seconds.',
  },
];

export const SHMChallengeSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [streak, setStreak] = useState(0);

  const current = H_CHALLENGES[currentIndex];

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
    setCurrentIndex((prev) => (prev + 1) % H_CHALLENGES.length);
    setUserAnswer('');
    setFeedback('idle');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Challenge Card */}
      <div className="md:col-span-8 bg-white rounded-3xl p-5 md:p-6 border border-amber-100/80 shadow-sm flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Trophy className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight font-sans">
              Challenge
            </h3>
          </div>
          {streak > 0 && (
            <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[11px] font-bold">
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
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
          />
          <button
            onClick={handleCheck}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-500/20 transition-transform active:scale-95"
          >
            Check
          </button>
        </div>

        {feedback === 'correct' && (
          <div className="flex items-center justify-between bg-amber-50 text-amber-950 p-2.5 rounded-xl border border-amber-200 text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span><strong>Correct!</strong> {current.explanation}</span>
            </div>
            <button
              onClick={handleNext}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0 ml-2"
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
      <div className="md:col-span-4 bg-white rounded-3xl p-5 md:p-6 border border-amber-100/80 shadow-sm flex flex-col justify-between space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight font-sans">
            Tip
          </h3>
        </div>

        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          <strong>Peak Relations:</strong> Speed is maximum at the equilibrium center (v = ωA) where potential energy is 0, while acceleration is maximum at extreme amplitude (a = ω²A) where velocity is 0.
        </p>

        <div className="text-[11px] text-amber-800 font-semibold bg-amber-50/60 p-2.5 rounded-xl border border-amber-100/60 font-mono">
          E = ½ m v_max² = ½ k A²
        </div>
      </div>
    </div>
  );
};
