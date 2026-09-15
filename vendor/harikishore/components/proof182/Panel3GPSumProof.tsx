import React from 'react';
import { MathView } from '../common/MathView';

export const Panel3GPSumProof: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-pink-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            3
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Visual Proof <span className="text-sm font-semibold text-slate-500 font-sans">(Shifted Algebraic Cancellation)</span>
          </h2>
        </div>
      </div>

      {/* Main Proof Dissection Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: 3 Pedagogical Steps */}
        <div className="lg:col-span-5 space-y-2 text-xs text-slate-600 font-medium">
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-pink-600 font-bold">•</span>
            <span>Write the sum: <MathView math="S_n = a + ar + ar^2 + \dots + ar^{n-1}" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-amber-500 font-bold">•</span>
            <span>Multiply by <MathView math="r" />: <MathView math="r S_n = ar + ar^2 + \dots + ar^n" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-pink-600 font-bold">•</span>
            <span>Subtract: <MathView math="(1 - r) S_n = a - ar^n = a(1 - r^n)" />.</span>
          </p>
        </div>

        {/* Right Column: Visual Diagram Equation */}
        <div className="lg:col-span-7 flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          {/* Step 1: Head a */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect x="20" y="25" width="40" height="35" fill="#fce7f3" stroke="#db2777" strokeWidth="1.8" rx="4" />
              <text x="40" y="46" fill="#9d174d" fontSize="12" fontWeight="bold" textAnchor="middle">+a</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Head Term</span>
          </div>

          <span className="text-sm font-bold text-pink-500">−</span>

          {/* Step 2: Tail ar^n */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect x="20" y="25" width="40" height="35" fill="#fee2e2" stroke="#dc2626" strokeWidth="1.8" rx="4" />
              <text x="40" y="46" fill="#991b1b" fontSize="10" fontWeight="bold" textAnchor="middle">a · rⁿ</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Tail Term</span>
          </div>

          <span className="text-sm font-bold text-pink-500">=</span>

          {/* Step 3: Factored (1 - r) S_n */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect x="15" y="18" width="50" height="48" fill="#fdf2f8" stroke="#db2777" strokeWidth="2" rx="4" />
              <text x="40" y="42" fill="#be185d" fontSize="9" fontWeight="bold" textAnchor="middle">(1 − r) S_n</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Difference</span>
          </div>
        </div>
      </div>

      {/* Bottom Therefore Banner */}
      <div className="bg-pink-50/70 p-3 rounded-2xl border border-pink-100/90 flex items-center justify-center text-center">
        <p className="text-xs font-medium text-slate-800">
          <strong className="text-pink-800 font-extrabold mr-1.5 font-sans">Therefore:</strong>
          Dividing both sides by <MathView math="(1 - r)" /> yields the finite geometric sum formula <MathView math="S_n = a \frac{1 - r^n}{1 - r}" /> (for <MathView math="r \ne 1" />).
        </p>
      </div>
    </div>
  );
};
