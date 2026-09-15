import React from 'react';
import { MathView } from '../common/MathView';

export const Panel3SHMProof: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-amber-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            3
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Visual Proof <span className="text-sm font-semibold text-slate-500 font-sans">(Phasor Projection & Differential Equation Invariant)</span>
          </h2>
        </div>
      </div>

      {/* Main Proof Dissection Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: 3 Pedagogical Steps */}
        <div className="lg:col-span-5 space-y-2 text-xs text-slate-600 font-medium">
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-amber-600 font-bold">•</span>
            <span>Uniform circular motion has vector position <MathView math="\vec{r}(t) = (A\cos\theta, A\sin\theta)" /> with <MathView math="\theta = \omega t + \phi" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-amber-600 font-bold">•</span>
            <span>Projecting onto the horizontal axis gives <MathView math="x(t) = A\cos(\omega t + \phi)" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-amber-600 font-bold">•</span>
            <span>Differentiating twice gives <MathView math="\ddot{x}(t) = -\omega^2 x(t)" />. Combining with Hooke's Law <MathView math="F = -kx = m\ddot{x}" /> proves <MathView math="\omega = \sqrt{k/m}" />.</span>
          </p>
        </div>

        {/* Right Column: Visual Diagram Equation */}
        <div className="lg:col-span-7 flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          {/* Step 1: Phasor Circle */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="28" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1="40" y1="40" x2="62" y2="24" stroke="#b45309" strokeWidth="2" />
              <circle cx="62" cy="24" r="3" fill="#d97706" />
              <text x="50" y="30" fill="#b45309" fontSize="8" fontWeight="bold">A</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Phasor (A, ω)</span>
          </div>

          <span className="text-sm font-bold text-amber-500">→</span>

          {/* Step 2: 1D Projection */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <line x1="10" y1="40" x2="70" y2="40" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="40" y1="15" x2="40" y2="65" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
              <rect x="48" y="32" width="16" height="16" fill="#d97706" rx="3" />
              <text x="56" y="44" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">m</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">x = A cos(θ)</span>
          </div>

          <span className="text-sm font-bold text-amber-500">→</span>

          {/* Step 3: ODE Invariant */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="#fef3c7" rx="8" />
              <text x="40" y="36" fill="#b45309" fontSize="10" fontWeight="bold" textAnchor="middle">ẍ = -ω²x</text>
              <text x="40" y="54" fill="#d97706" fontSize="9" fontWeight="bold" textAnchor="middle">ω = √(k/m)</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Hooke's Law</span>
          </div>
        </div>
      </div>

      {/* Bottom Therefore Banner */}
      <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-100/90 flex items-center justify-center text-center">
        <p className="text-xs font-medium text-slate-800">
          <strong className="text-amber-800 font-extrabold mr-1.5 font-sans">Therefore:</strong>
          Simple harmonic motion is the exact 1D projection of uniform circular motion, with natural angular frequency <MathView math="\omega = \sqrt{k/m}" /> and period <MathView math="T = 2\pi\sqrt{m/k}" />.
        </p>
      </div>
    </div>
  );
};
