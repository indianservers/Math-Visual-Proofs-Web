import React from 'react';
import { MathView } from '../common/MathView';

export const Panel3NaturalSumProof: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-blue-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            3
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Visual Proof <span className="text-sm font-semibold text-slate-500 font-sans">(Staircase Interlock Dissection)</span>
          </h2>
        </div>
      </div>

      {/* Main Proof Dissection Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: 3 Pedagogical Steps */}
        <div className="lg:col-span-5 space-y-2 text-xs text-slate-600 font-medium">
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-blue-600 font-bold">•</span>
            <span>Single staircase has <MathView math="S = 1 + 2 + \dots + n" /> dots.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-amber-500 font-bold">•</span>
            <span>Duplicate twin staircase rotated 180° has the identical count <MathView math="S" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-blue-600 font-bold">•</span>
            <span>The two staircases fit together into a rectangle of size <MathView math="n \times (n+1)" />.</span>
          </p>
        </div>

        {/* Right Column: Visual Diagram Equation */}
        <div className="lg:col-span-7 flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          {/* Step 1: Blue Triangle S */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <polygon points="15,65 15,15 65,65" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.8" />
              <text x="32" y="52" fill="#1e40af" fontSize="11" fontWeight="bold" textAnchor="middle">S</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Staircase 1</span>
          </div>

          <span className="text-sm font-bold text-blue-500">+</span>

          {/* Step 2: Orange Twin S */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <polygon points="15,15 65,15 65,65" fill="#fef3c7" stroke="#d97706" strokeWidth="1.8" />
              <text x="48" y="38" fill="#b45309" fontSize="11" fontWeight="bold" textAnchor="middle">S</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Twin Inverted</span>
          </div>

          <span className="text-sm font-bold text-blue-500">=</span>

          {/* Step 3: Combined Rectangle */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect x="15" y="15" width="50" height="50" fill="#eff6ff" stroke="#2563eb" strokeWidth="2" rx="4" />
              <line x1="15" y1="15" x2="65" y2="65" stroke="#94a3b8" strokeDasharray="2 2" strokeWidth="1" />
              <text x="40" y="44" fill="#1e40af" fontSize="9" fontWeight="bold" textAnchor="middle">n(n + 1)</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Rectangle</span>
          </div>
        </div>
      </div>

      {/* Bottom Therefore Banner */}
      <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100/90 flex items-center justify-center text-center">
        <p className="text-xs font-medium text-slate-800">
          <strong className="text-blue-800 font-extrabold mr-1.5 font-sans">Therefore:</strong>
          Since two identical staircases make a rectangle of area <MathView math="n(n + 1)" />, one staircase has half the area: <MathView math="S = \frac{n(n + 1)}{2}" />.
        </p>
      </div>
    </div>
  );
};
