import React, { useState } from 'react';
import { X, Sparkles, ChevronRight, CheckCircle2, Lightbulb, Compass, Award } from 'lucide-react';
import { HintItem } from '../../types';
import { sound } from '../../utils/sound';

interface HintCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HINTS: HintItem[] = [
  {
    level: 1,
    type: 'Notice',
    title: '1. Notice the Givens',
    message: 'Look at the regular polygon. Every vertex is at the exact same distance (radius r) from the central point, and all edge lengths and interior angles are equal.',
    actionPrompt: 'Observe the radial lines connecting each vertex to the centre.'
  },
  {
    level: 2,
    type: 'Choose',
    title: '2. Choose the Active Transformation',
    message: 'Grab the rotation dial or click the Step (+60°) button to rotate the polygon around its centre. Also click any mirror axis to fold across that line.',
    actionPrompt: 'Rotate the hexagon to 60°, 120°, 180°, 240°, 300°, and 360° to test superpositions.'
  },
  {
    level: 3,
    type: 'Predict',
    title: '3. Predict Invariants',
    message: 'Under rigid rotations and reflections, distances between points and angles between segments never stretch or shrink. The shape silhouette remains 100% invariant.',
    actionPrompt: 'Check if corresponding vertices map to existing vertex positions.'
  },
  {
    level: 4,
    type: 'Guide',
    title: '4. Guided Regular n-gon Equivalence',
    message: 'A regular n-gon divides into n identical isosceles triangles sharing the apex at the centre. Because each triangle has a vertical axis of symmetry, there are exactly n mirror lines.',
    actionPrompt: 'Each fundamental triangle rotation of 360°/n maps one vertex to the next, producing n total matching turns.'
  },
  {
    level: 5,
    type: 'Explain',
    title: '5. Explain "Maps-To-Itself"',
    message: 'Mapping to itself means applying an isometric transformation (reflection or rotation) such that every point of the resulting image coincides perfectly with the original figure.',
    actionPrompt: 'Theorem proved: Regular n-gon has n lines of symmetry and rotational symmetry of order n.'
  }
];

export const HintCoachModal: React.FC<HintCoachModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentLevel, setCurrentLevel] = useState(1);

  if (!isOpen) return null;

  const currentHint = HINTS.find(h => h.level === currentLevel) || HINTS[0];

  const handleSelectLevel = (lvl: number) => {
    sound.playClick();
    setCurrentLevel(lvl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-indigo-100 relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-sans">Pedagogical Hint Coach</h3>
            <p className="text-xs text-slate-500">Progressive inquiry scaffolding for Proof 166</p>
          </div>
        </div>

        {/* 5 Step Indicator Pill Tabs */}
        <div className="flex items-center justify-between gap-1 mb-5">
          {HINTS.map((hint) => (
            <button
              key={hint.level}
              onClick={() => handleSelectLevel(hint.level)}
              className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border text-center ${
                currentLevel === hint.level
                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm scale-105'
                  : currentLevel > hint.level
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {hint.type}
            </button>
          ))}
        </div>

        {/* Active Hint Content Card */}
        <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h4 className="text-sm font-bold text-slate-900">{currentHint.title}</h4>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {currentHint.message}
          </p>

          {currentHint.actionPrompt && (
            <div className="p-3 bg-white rounded-xl border border-amber-200 flex items-start gap-2">
              <Compass className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-[11px] font-semibold text-indigo-900">
                {currentHint.actionPrompt}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-400 font-medium">
            Hint {currentLevel} of 5
          </span>
          <div className="flex items-center gap-2">
            {currentLevel < 5 ? (
              <button
                onClick={() => handleSelectLevel(currentLevel + 1)}
                className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-transform active:scale-95"
              >
                <span>Next Hint</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                Ready to Prove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
