import React from 'react';
import { MathView } from '../common/MathView';

export const Panel3LaplaceProof: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-cyan-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            3
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Visual Proof <span className="text-sm font-semibold text-slate-500 font-sans">(Direct Integration & ROC Condition)</span>
          </h2>
        </div>
      </div>

      {/* Main Proof Dissection Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: 3 Pedagogical Steps */}
        <div className="lg:col-span-5 space-y-2 text-xs text-slate-600 font-medium">
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-cyan-600 font-bold">•</span>
            <span>By definition: <MathView math="F(s) = \int_0^\infty e^{-at} e^{-st} dt = \int_0^\infty e^{-(s+a)t} dt" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-cyan-600 font-bold">•</span>
            <span>Evaluating antiderivative: <MathView math="\left[ \frac{-e^{-(s+a)t}}{s+a} \right]_0^\infty = 0 - \left(-\frac{1}{s+a}\right) = \frac{1}{s+a}" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-cyan-600 font-bold">•</span>
            <span>Upper limit vanishes (<MathView math="e^{-(s+a)\infty} \to 0" />) strictly when <MathView math="\text{Re}(s) > -a" />.</span>
          </p>
        </div>

        {/* Right Column: Visual Diagram Equation */}
        <div className="lg:col-span-7 flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          {/* Step 1: Integral */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="#f8fafc" rx="8" />
              <path d="M 15 25 Q 40 70 70 70" fill="none" stroke="#0891b2" strokeWidth="2.2" />
              <text x="40" y="22" fill="#0891b2" fontSize="9" fontWeight="bold" textAnchor="middle">∫ e^-(s+a)t dt</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Definition</span>
          </div>

          <span className="text-sm font-bold text-cyan-500">→</span>

          {/* Step 2: Boundary Evaluation */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="#f8fafc" rx="8" />
              <text x="40" y="38" fill="#0e7490" fontSize="11" fontWeight="bold" textAnchor="middle">[ -e^-(s+a)t ]</text>
              <text x="40" y="55" fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle">t = 0 to ∞</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Limit t→∞</span>
          </div>

          <span className="text-sm font-bold text-cyan-500">→</span>

          {/* Step 3: Resulting Pole Fraction */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="#ecfeff" rx="8" />
              <text x="40" y="36" fill="#0891b2" fontSize="13" fontWeight="bold" textAnchor="middle">1 / (s + a)</text>
              <line x1="36" y1="52" x2="44" y2="60" stroke="#e11d48" strokeWidth="2" />
              <line x1="44" y1="52" x2="36" y2="60" stroke="#e11d48" strokeWidth="2" />
              <text x="40" y="72" fill="#e11d48" fontSize="8" fontWeight="bold" textAnchor="middle">Pole at -a</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">F(s) = 1/(s+a)</span>
          </div>
        </div>
      </div>

      {/* Bottom Therefore Banner */}
      <div className="bg-cyan-50/70 p-3 rounded-2xl border border-cyan-100/90 flex items-center justify-center text-center">
        <p className="text-xs font-medium text-slate-800">
          <strong className="text-cyan-800 font-extrabold mr-1.5 font-sans">Therefore:</strong>
          The time decay factor <MathView math="a" /> shifts the transfer function denominator directly, placing the pole at <MathView math="s = -a" /> with Region of Convergence <MathView math="\text{Re}(s) > -a" />.
        </p>
      </div>
    </div>
  );
};
