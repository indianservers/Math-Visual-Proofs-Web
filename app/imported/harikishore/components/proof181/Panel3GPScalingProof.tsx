import React from 'react';
import { MathView } from '../common/MathView';

export const Panel3GPScalingProof: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-emerald-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            3
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Visual Proof <span className="text-sm font-semibold text-slate-500 font-sans">(Repeated Multiplicative Scaling)</span>
          </h2>
        </div>
      </div>

      {/* Main Proof Dissection Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: 3 Pedagogical Steps */}
        <div className="lg:col-span-5 space-y-2 text-xs text-slate-600 font-medium">
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-emerald-600 font-bold">•</span>
            <span>First term starts at <MathView math="a_1 = a" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-indigo-500 font-bold">•</span>
            <span>Each step multiplies by ratio <MathView math="r" />: <MathView math="a_2 = a \cdot r" />, <MathView math="a_3 = a \cdot r^2" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-emerald-600 font-bold">•</span>
            <span>Reaching term <MathView math="n" /> applies the multiplier exactly <MathView math="(n - 1)" /> times.</span>
          </p>
        </div>

        {/* Right Column: Visual Diagram Equation */}
        <div className="lg:col-span-7 flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          {/* Step 1: Base a */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect x="25" y="40" width="30" height="25" fill="#d1fae5" stroke="#059669" strokeWidth="1.8" rx="3" />
              <text x="40" y="56" fill="#065f46" fontSize="11" fontWeight="bold" textAnchor="middle">a</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Term 1</span>
          </div>

          <span className="text-sm font-bold text-emerald-500">× r</span>

          {/* Step 2: Multiplier */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect x="25" y="25" width="30" height="40" fill="#a7f3d0" stroke="#059669" strokeWidth="1.8" rx="3" />
              <text x="40" y="48" fill="#065f46" fontSize="10" fontWeight="bold" textAnchor="middle">a · r</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Term 2</span>
          </div>

          <span className="text-sm font-bold text-emerald-500">→</span>

          {/* Step 3: General Formula */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect x="25" y="10" width="30" height="55" fill="#6ee7b7" stroke="#059669" strokeWidth="2" rx="3" />
              <text x="40" y="42" fill="#064e3b" fontSize="9" fontWeight="bold" textAnchor="middle">a · rⁿ⁻¹</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Term n</span>
          </div>
        </div>
      </div>

      {/* Bottom Therefore Banner */}
      <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100/90 flex items-center justify-center text-center">
        <p className="text-xs font-medium text-slate-800">
          <strong className="text-emerald-800 font-extrabold mr-1.5 font-sans">Therefore:</strong>
          Starting with <MathView math="a" /> and repeatedly scaling by common ratio <MathView math="r" /> for <MathView math="(n - 1)" /> steps proves the explicit general term <MathView math="a_n = a \cdot r^{n-1}" />.
        </p>
      </div>
    </div>
  );
};
