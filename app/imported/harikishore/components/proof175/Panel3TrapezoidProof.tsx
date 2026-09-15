import React from 'react';
import { MathView } from '../common/MathView';

export const Panel3TrapezoidProof: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-amber-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            3
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Visual Proof <span className="text-sm font-semibold text-slate-500 font-sans">(Interior Height Overlap Dissection)</span>
          </h2>
        </div>
      </div>

      {/* Main Proof Dissection Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: 3 Pedagogical Steps */}
        <div className="lg:col-span-5 space-y-2 text-xs text-slate-600 font-medium">
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-amber-600 font-bold">•</span>
            <span>Single strip area: <MathView math="A_k = \frac{h}{2}(y_{k-1} + y_k)" /> for each subinterval.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-amber-600 font-bold">•</span>
            <span>Total sum: <MathView math="T_n = \frac{h}{2}(y_0+y_1) + \frac{h}{2}(y_1+y_2) + \dots + \frac{h}{2}(y_{n-1}+y_n)" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-amber-600 font-bold">•</span>
            <span>Interior boundaries appear in both left and right strips, combining into <MathView math="2y_k" />.</span>
          </p>
        </div>

        {/* Right Column: Visual Diagram Equation */}
        <div className="lg:col-span-7 flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          {/* Step 1: Strip 1 */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <polygon points="15,70 15,40 50,25 50,70" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
              <text x="32" y="52" fill="#b45309" fontSize="8" fontWeight="bold" textAnchor="middle">h/2(y₀+y₁)</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Strip 1</span>
          </div>

          <span className="text-sm font-bold text-amber-500">+</span>

          {/* Step 2: Strip 2 */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <polygon points="30,70 30,25 65,35 65,70" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
              <text x="47" y="52" fill="#b45309" fontSize="8" fontWeight="bold" textAnchor="middle">h/2(y₁+y₂)</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Strip 2</span>
          </div>

          <span className="text-sm font-bold text-amber-500">=</span>

          {/* Step 3: Combined Composite Formula */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="#fffbeb" rx="8" />
              <text x="40" y="36" fill="#b45309" fontSize="9" fontWeight="bold" textAnchor="middle">y₀ + 2y₁ + y₂</text>
              <text x="40" y="54" fill="#2563eb" fontSize="10" fontWeight="bold" textAnchor="middle">×2 Factor</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">T_n Rule</span>
          </div>
        </div>
      </div>

      {/* Bottom Therefore Banner */}
      <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-100/90 flex items-center justify-center text-center">
        <p className="text-xs font-medium text-slate-800">
          <strong className="text-amber-800 font-extrabold mr-1.5 font-sans">Therefore:</strong>
          Because each interior vertical boundary is shared by two neighboring trapezoids, its height is counted twice (<MathView math="\times 2" />), producing <MathView math="T_n = \frac{h}{2}[y_0 + 2y_1 + \dots + 2y_{n-1} + y_n]" />.
        </p>
      </div>
    </div>
  );
};
