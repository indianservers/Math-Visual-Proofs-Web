import React, { useState } from 'react';
import { X, Sparkles, ChevronRight, Lightbulb, Compass } from 'lucide-react';
import { HintItem } from '../../types';
import { sound } from '../../utils/sound';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const T_HINTS: HintItem[] = [
  {
    level: 1,
    type: 'Notice',
    title: '1. Notice the Vertex Meeting Point',
    message: 'Focus on where multiple tiles meet at a single corner. For tiles to lay completely flat on a plane, their corners must wrap around 360° completely.',
  },
  {
    level: 2,
    type: 'Choose',
    title: '2. Choose Repeated Transformations',
    message: 'Try translating or rotating the chosen polygon to place copies edge-to-edge. Notice which polygons fit smoothly and which create gaps.',
  },
  {
    level: 3,
    type: 'Predict',
    title: '3. Predict Gap and Overlap Angles',
    message: 'Calculate k × θ. If the sum is less than 360°, a gap remains. If greater than 360°, tiles overlap.',
  },
  {
    level: 4,
    type: 'Guide',
    title: '4. The Divisibility Proof',
    message: 'Because θ = (n-2)×180°/n, requiring 360°/θ to be an integer simplifies to n-2 dividing 4. The divisors of 4 are 1, 2, 4, corresponding to n = 3 (triangles), n = 4 (squares), and n = 6 (hexagons).',
  },
  {
    level: 5,
    type: 'Explain',
    title: '5. Semi-Regular Tilings',
    message: 'Shapes that cannot tessellate alone (like octagons with 135°) can still tessellate if combined with other shapes (like squares with 90°) to satisfy 135° + 135° + 90° = 360°!',
  }
];

export const TessellationsHintModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [level, setLevel] = useState(1);
  if (!isOpen) return null;
  const current = T_HINTS.find(h => h.level === level) || T_HINTS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-100 relative">
        <button onClick={onClose} className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-sans">Tessellations Hint Coach</h3>
            <p className="text-xs text-slate-500">Pedagogical hints for Visual Proof 167</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-1 mb-5">
          {T_HINTS.map((h) => (
            <button
              key={h.level}
              onClick={() => {
                sound.playClick();
                setLevel(h.level);
              }}
              className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                level === h.level
                  ? 'bg-amber-500 text-white border-amber-500 scale-105'
                  : level > h.level
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
            >
              {h.type}
            </button>
          ))}
        </div>

        <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h4 className="text-sm font-bold text-slate-900">{current.title}</h4>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {current.message}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-400 font-medium">Hint {level} of 5</span>
          {level < 5 ? (
            <button
              onClick={() => setLevel(l => l + 1)}
              className="inline-flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
            >
              <span>Next Hint</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={onClose} className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl">
              Ready to Prove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
