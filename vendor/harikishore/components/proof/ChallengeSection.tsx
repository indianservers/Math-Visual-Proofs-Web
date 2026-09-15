import React, { useState } from 'react';
import { Trophy, Lightbulb, CheckCircle2, XCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { BASE_CHALLENGES, generateRandomChallenge } from '../../data/challengesData';
import { ChallengeQuestion } from '../../types';
import { sound } from '../../utils/sound';
import confetti from 'canvas-confetti';

export const ChallengeSection: React.FC = () => {
  const [currentChallenge, setCurrentChallenge] = useState<ChallengeQuestion>(BASE_CHALLENGES[0]);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [streak, setStreak] = useState(0);

  const handleCheck = () => {
    const parsed = parseInt(userAnswer.trim(), 10);
    if (isNaN(parsed)) return;

    if (parsed === currentChallenge.correctAnswer) {
      sound.playSuccess();
      setFeedback('correct');
      setStreak(prev => prev + 1);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.85 }
        });
      } catch {
        // Ignore
      }
    } else {
      sound.playSnap();
      setFeedback('incorrect');
      setStreak(0);
    }
  };

  const handleNextChallenge = () => {
    sound.playClick();
    setCurrentChallenge(generateRandomChallenge());
    setUserAnswer('');
    setFeedback('idle');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Challenge Card */}
      <div className="md:col-span-8 bg-white rounded-3xl p-5 md:p-6 border border-indigo-100/80 shadow-sm flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
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

        <p className="text-xs text-slate-700 font-medium">
          {currentChallenge.question}
        </p>

        {/* Input + Check */}
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
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
          />
          <button
            onClick={handleCheck}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-transform active:scale-95"
          >
            Check
          </button>
        </div>

        {/* Feedback Row */}
        {feedback === 'correct' && (
          <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-200 text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Correct!</strong> {currentChallenge.explanation}</span>
            </div>
            <button
              onClick={handleNextChallenge}
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
              <span><strong>Not quite.</strong> {currentChallenge.hint}</span>
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
      <div className="md:col-span-4 bg-white rounded-3xl p-5 md:p-6 border border-indigo-100/80 shadow-sm flex flex-col justify-between space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight font-sans">
            Tip
          </h3>
        </div>

        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          <strong>Think regular!</strong> Consider a regular <span className="font-serif italic font-bold">n</span>-gon: each vertex joined to the centre creates <span className="font-serif italic font-bold">n</span> identical triangles.
        </p>

        <div className="text-[11px] text-indigo-600 font-semibold bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/60">
          Lines of symmetry = Rotational order = <span className="font-serif italic font-bold">n</span>
        </div>
      </div>
    </div>
  );
};
