import React from 'react';
import { MathView } from '../common/MathView';

export const Panel3APProof: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-blue-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            3
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Visual Proof <span className="text-sm font-semibold text-slate-500 font-sans">(Number Line Jump Induction)</span>
          </h2>
        </div>
      </div>

      {/* Main Proof Dissection Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: 3 Pedagogical Steps */}
        <div className="lg:col-span-5 space-y-2 text-xs text-slate-600 font-medium">
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-blue-600 font-bold">•</span>
            <span>Initial term is placed at coordinate <MathView math="a_1 = a" /> with 0 jumps.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-blue-600 font-bold">•</span>
            <span>Each step adds constant difference: <MathView math="a_2 = a + d" />, <MathView math="a_3 = a + 2d" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-blue-600 font-bold">•</span>
            <span>Reaching term <MathView math="n" /> requires precisely <MathView math="(n - 1)" /> equal jumps of length <MathView math="d" />.</span>
          </p>
        </div>

        {/* Right Column: Visual Diagram Equation */}
        <div className="lg:col-span-7 flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          {/* Step 1: Base Term */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="#eff6ff" rx="8" />
              <circle cx="40" cy="40" r="8" fill="#2563eb" />
              <text x="40" y="66" fill="#1e40af" fontSize="9" fontWeight="bold" textAnchor="middle">a₁ = a</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">First Term</span>
          </div>

          <span className="text-sm font-bold text-blue-500">→</span>

          {/* Step 2: (n-1) Jumps */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="#f8fafc" rx="8" />
              <path d="M 15 50 Q 30 20 45 50" fill="none" stroke="#6366f1" strokeWidth="2" />
              <path d="M 45 50 Q 60 20 75 50" fill="none" stroke="#6366f1" strokeWidth="2" />
              <text x="40" y="68" fill="#4338ca" fontSize="8" fontWeight="bold" textAnchor="middle">(n - 1) × d</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Equal Steps</span>
          </div>

          <span className="text-sm font-bold text-blue-500">→</span>

          {/* Step 3: General Term Formula */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="#eff6ff" rx="8" />
              <text x="40" y="36" fill="#1d4ed8" fontSize="10" fontWeight="bold" textAnchor="middle">a + (n - 1)d</text>
              <text x="40" y="56" fill="#2563eb" fontSize="11" fontWeight="bold" textAnchor="middle">a_n Form</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Explicit a_n</span>
          </div>
        </div>
      </div>

      {/* Bottom Therefore Banner */}
      <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100/90 flex items-center justify-center text-center">
        <p className="text-xs font-medium text-slate-800">
          <strong className="text-blue-800 font-extrabold mr-1.5 font-sans">Therefore:</strong>
          Starting at <MathView math="a" /> and taking <MathView math="(n - 1)" /> uniform steps of common difference <MathView math="d" /> establishes the general term formula <MathView math="a_n = a + (n - 1)d" />.
        </p>
      </div>
    </div>
  );
};
