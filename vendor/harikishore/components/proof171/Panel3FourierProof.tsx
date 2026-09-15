import React from 'react';
import { MathView } from '../common/MathView';

export const Panel3FourierProof: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-violet-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            3
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Visual Proof <span className="text-sm font-semibold text-slate-500 font-sans">(Orthogonal Basis Projection & Convergence)</span>
          </h2>
        </div>
      </div>

      {/* Main Proof Dissection Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: 3 Pedagogical Steps */}
        <div className="lg:col-span-5 space-y-2 text-xs text-slate-600 font-medium">
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-violet-600 font-bold">•</span>
            <span>Trigonometric sinusoids form an infinite orthogonal basis in <MathView math="L^2[-\pi, \pi]" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-violet-600 font-bold">•</span>
            <span>Inner product vanishes for distinct frequencies: <MathView math="\int_{-\pi}^\pi \sin(nt)\sin(mt)dt = \pi \delta_{nm}" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-violet-600 font-bold">•</span>
            <span>Projecting <MathView math="f(t)" /> onto each basis vector extracts independent coefficients <MathView math="b_n = \frac{1}{\pi}\int_{-\pi}^\pi f(t)\sin(nt)dt" />.</span>
          </p>
        </div>

        {/* Right Column: Visual Diagram Equation */}
        <div className="lg:col-span-7 flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          {/* Step 1: Target Signal */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="#f8fafc" rx="8" />
              <polyline points="10,60 10,20 40,20 40,60 70,60" fill="none" stroke="#475569" strokeWidth="2.2" />
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Signal f(t)</span>
          </div>

          <span className="text-sm font-bold text-violet-500">→</span>

          {/* Step 2: Harmonic Projection */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="#f8fafc" rx="8" />
              <path d="M 10 40 Q 25 15 40 40 T 70 40" fill="none" stroke="#8b5cf6" strokeWidth="2" />
              <path d="M 10 40 Q 15 28 20 40 T 30 40 T 40 40 T 50 40 T 60 40 T 70 40" fill="none" stroke="#c084fc" strokeWidth="1.5" opacity="0.7" />
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">bₙ = ⟨f, sin(nt)⟩</span>
          </div>

          <span className="text-sm font-bold text-violet-500">→</span>

          {/* Step 3: Fourier Summation */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="#f5f3ff" rx="8" />
              <path d="M 10 60 L 10 20 L 40 20 L 40 60 L 70 60" fill="none" stroke="#475569" strokeWidth="1.2" strokeDasharray="2 2" />
              <path d="M 10 55 Q 25 15 40 40 Q 55 65 70 25" fill="none" stroke="#7c3aed" strokeWidth="2.5" />
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">S_N(t) → f(t)</span>
          </div>
        </div>
      </div>

      {/* Bottom Therefore Banner */}
      <div className="bg-violet-50/70 p-3 rounded-2xl border border-violet-100/90 flex items-center justify-center text-center">
        <p className="text-xs font-medium text-slate-800">
          <strong className="text-violet-800 font-extrabold mr-1.5 font-sans">Therefore:</strong>
          Any periodic signal can be decomposed into an equivalent discrete frequency spectrum. Summing orthogonal sinusoidal harmonics minimizes mean squared error <MathView math="\|f - S_N\|^2 \to 0" />.
        </p>
      </div>
    </div>
  );
};
