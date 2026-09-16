import React from 'react';
import { MathView } from '../common/MathView';

export const Panel3OddSumProof: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-amber-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            3
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Visual Proof <span className="text-sm font-semibold text-slate-500 font-sans">(L-Shaped Gnomon Induction)</span>
          </h2>
        </div>
      </div>

      {/* Main Proof Dissection Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: 3 Pedagogical Steps */}
        <div className="lg:col-span-5 space-y-2 text-xs text-slate-600 font-medium">
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-amber-500 font-bold">•</span>
            <span>Start with base square <MathView math="1 = 1^2" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-amber-500 font-bold">•</span>
            <span>To grow a square from <MathView math="k \times k" /> to <MathView math="(k+1) \times (k+1)" />, add an L-shaped shell.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-amber-500 font-bold">•</span>
            <span>The L-shell has <MathView math="k" /> top + <MathView math="k" /> side + 1 corner = <MathView math="2k + 1" /> blocks (always odd!).</span>
          </p>
        </div>

        {/* Right Column: Visual Diagram Equation */}
        <div className="lg:col-span-7 flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          {/* Step 1: Core Square k^2 */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect x="20" y="20" width="40" height="40" fill="#fef3c7" stroke="#d97706" strokeWidth="1.8" rx="4" />
              <text x="40" y="44" fill="#b45309" fontSize="12" fontWeight="bold" textAnchor="middle">k²</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Core k²</span>
          </div>

          <span className="text-sm font-bold text-amber-500">+</span>

          {/* Step 2: L-layer (2k + 1) */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <polygon points="15,65 15,15 30,15 30,50 65,50 65,65" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.8" />
              <text x="35" y="40" fill="#c2410c" fontSize="9" fontWeight="bold" textAnchor="middle">2k + 1</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">L-Gnomon</span>
          </div>

          <span className="text-sm font-bold text-amber-500">=</span>

          {/* Step 3: Next Square (k+1)^2 */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect x="15" y="15" width="50" height="50" fill="#fef9c3" stroke="#ca8a04" strokeWidth="2" rx="4" />
              <text x="40" y="44" fill="#854d0e" fontSize="10" fontWeight="bold" textAnchor="middle">(k + 1)²</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Next Square</span>
          </div>
        </div>
      </div>

      {/* Bottom Therefore Banner */}
      <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-100/90 flex items-center justify-center text-center">
        <p className="text-xs font-medium text-slate-800">
          <strong className="text-amber-800 font-extrabold mr-1.5 font-sans">Therefore:</strong>
          Because each new odd number <MathView math="2k - 1" /> is precisely the L-shaped border needed to expand square <MathView math="(k-1)^2" /> to <MathView math="k^2" />, the first <MathView math="n" /> odd numbers sum to <MathView math="n^2" />.
        </p>
      </div>
    </div>
  );
};
