import React, { useState } from 'react';
import { Trophy, Lightbulb, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { MathView } from '../common/MathView';
import confetti from 'canvas-confetti';

interface GradientChallenge {
  question: string;
  mathPrompt?: string;
  correctAnswer: number;
  hint: string;
  explanation: string;
}

const G_CHALLENGES: GradientChallenge[] = [
  {
    question: 'For f(x, y) = 3x² + 4y², what is the gradient magnitude ||∇f|| at the point (1, 1)?',
    mathPrompt: '\\nabla f(1, 1) = \\begin{bmatrix} 6(1) \\\\ 8(1) \\end{bmatrix} = \\begin{bmatrix} 6 \\\\ 8 \\end{bmatrix}',
    correctAnswer: 10,
    hint: '||∇f|| = √(6² + 8²) = √(36 + 64) = √100.',
    explanation: '||∇f|| = √(6² + 8²) = √100 = 10.',
  },
  {
    question: 'What is the angle in degrees between the gradient vector ∇f and the level curve contour tangent line?',
    correctAnswer: 90,
    hint: 'Gradient vectors are strictly orthogonal (perpendicular) to level curves.',
    explanation: '∇f · T = 0 implies an exact 90° right angle.',
  },
  {
    question: 'If ||∇f|| = 7 at point P, what is the maximum directional derivative D_u f achievable in any direction?',
    mathPrompt: 'D_{\\max} = ||\\nabla f||',
    correctAnswer: 7,
    hint: 'Maximum rate of increase equals the gradient magnitude ||∇f||.',
    explanation: 'D_max = ||∇f|| = 7 (pointing along ∇f).',
  },
];

export const GradientChallengeSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [streak, setStreak] = useState(0);

  const current = G_CHALLENGES[currentIndex];

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
    setCurrentIndex((prev) => (prev + 1) % G_CHALLENGES.length);
    setUserAnswer('');
    setFeedback('idle');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Challenge Card */}
      <div className="md:col-span-8 bg-white rounded-3xl p-5 md:p-6 border border-emerald-100/80 shadow-sm flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
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
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
          />
          <button
            onClick={handleCheck}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-transform active:scale-95"
          >
            Check
          </button>
        </div>

        {feedback === 'correct' && (
          <div className="flex items-center justify-between bg-emerald-50 text-emerald-950 p-2.5 rounded-xl border border-emerald-200 text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Correct!</strong> {current.explanation}</span>
            </div>
            <button
              onClick={handleNext}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0 ml-2"
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
      <div className="md:col-span-4 bg-white rounded-3xl p-5 md:p-6 border border-emerald-100/80 shadow-sm flex flex-col justify-between space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight font-sans">
            Tip
          </h3>
        </div>

        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          <strong>Gradient Descent Optimization:</strong> In machine learning (neural network training), models step in the negative gradient direction <MathView math="-\nabla L" /> to descend loss surfaces as quickly as possible.
        </p>

        <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100/60 font-mono">
          w_{'{new}'} = w_{'{old}'} - η ∇L(w)
        </div>
      </div>
    </div>
  );
};
