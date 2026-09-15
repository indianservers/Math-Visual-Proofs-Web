import React from 'react';
import { MathView } from '../common/MathView';

export const Panel3APSumProof: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-purple-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            3
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Visual Proof <span className="text-sm font-semibold text-slate-500 font-sans">(Gauss Inverted Pairing)</span>
          </h2>
        </div>
      </div>

      {/* Main Proof Dissection Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: 3 Pedagogical Steps */}
        <div className="lg:col-span-5 space-y-2 text-xs text-slate-600 font-medium">
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-purple-600 font-bold">•</span>
            <span>Write sum forwards: <MathView math="S_n = a_1 + a_2 + \dots + a_n" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-amber-500 font-bold">•</span>
            <span>Write sum backwards: <MathView math="S_n = a_n + a_{n-1} + \dots + a_1" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-purple-600 font-bold">•</span>
            <span>Adding both sets vertically gives <MathView math="n" /> pairs, each equal to <MathView math="(a + l)" />.</span>
          </p>
        </div>

        {/* Right Column: Visual Diagram Equation */}
        <div className="lg:col-span-7 flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          {/* Step 1: Forward S */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <polygon points="15,65 15,45 65,15 65,65" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.8" />
              <text x="40" y="52" fill="#5b21b6" fontSize="11" fontWeight="bold" textAnchor="middle">S_n</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Forward AP</span>
          </div>

          <span className="text-sm font-bold text-purple-500">+</span>

          {/* Step 2: Reversed S */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <polygon points="15,15 65,15 65,45 15,65" fill="#fef3c7" stroke="#d97706" strokeWidth="1.8" />
              <text x="40" y="38" fill="#b45309" fontSize="11" fontWeight="bold" textAnchor="middle">S_n</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Reversed AP</span>
          </div>

          <span className="text-sm font-bold text-purple-500">=</span>

          {/* Step 3: Constant Rectangle */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect x="15" y="15" width="50" height="50" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="2" rx="4" />
              <line x1="15" y1="40" x2="65" y2="40" stroke="#c4b5fd" strokeDasharray="2 2" strokeWidth="1" />
              <text x="40" y="44" fill="#6d28d9" fontSize="9" fontWeight="bold" textAnchor="middle">n × (a + l)</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Total 2S_n</span>
          </div>
        </div>
      </div>

      {/* Bottom Therefore Banner */}
      <div className="bg-purple-50/70 p-3 rounded-2xl border border-purple-100/90 flex items-center justify-center text-center">
        <p className="text-xs font-medium text-slate-800">
          <strong className="text-purple-800 font-extrabold mr-1.5 font-sans">Therefore:</strong>
          Adding the forward and reversed sequences produces <MathView math="2S_n = n(a + l)" />, directly proving <MathView math="S_n = \frac{n}{2}(a + l) = \frac{n}{2}[2a + (n - 1)d]" />.
        </p>
      </div>
    </div>
  );
};
