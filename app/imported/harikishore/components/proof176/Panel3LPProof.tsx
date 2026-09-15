import React from 'react';
import { MathView } from '../common/MathView';

export const Panel3LPProof: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-violet-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            3
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Visual Proof <span className="text-sm font-semibold text-slate-500 font-sans">(Level-Line Sweep & Vertex Extremum)</span>
          </h2>
        </div>
      </div>

      {/* Main Proof Dissection Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: 3 Pedagogical Steps */}
        <div className="lg:col-span-5 space-y-2 text-xs text-slate-600 font-medium">
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-violet-600 font-bold">•</span>
            <span>Half-plane inequalities intersect to create a convex polygon <MathView math="\mathcal{R}" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-violet-600 font-bold">•</span>
            <span>Objective <MathView math="Z = c_1 x + c_2 y = k" /> forms parallel lines that sweep across <MathView math="\mathcal{R}" /> as <MathView math="k" /> varies.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-violet-600 font-bold">•</span>
            <span>The final point of contact before the level line exits <MathView math="\mathcal{R}" /> must be a corner vertex.</span>
          </p>
        </div>

        {/* Right Column: Visual Diagram Equation */}
        <div className="lg:col-span-7 flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          {/* Step 1: Convex Region */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <polygon points="20,60 20,25 50,15 65,40 55,60" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1.8" />
              <text x="42" y="44" fill="#6d28d9" fontSize="8" fontWeight="bold" textAnchor="middle">Region R</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Convex Poly</span>
          </div>

          <span className="text-sm font-bold text-violet-500">→</span>

          {/* Step 2: Sweeping Parallel Lines */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="#f8fafc" rx="8" />
              <line x1="10" y1="40" x2="60" y2="10" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1="20" y1="60" x2="70" y2="30" stroke="#d97706" strokeWidth="2" />
              <text x="40" y="54" fill="#b45309" fontSize="8" fontWeight="bold" textAnchor="middle">Z = k Sweep</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Level Lines</span>
          </div>

          <span className="text-sm font-bold text-violet-500">→</span>

          {/* Step 3: Extreme Corner Touch */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="#ede9fe" rx="8" />
              <polygon points="20,60 20,25 50,15 65,40 55,60" fill="#ddd6fe" stroke="#8b5cf6" strokeWidth="1.2" />
              <line x1="30" y1="5" x2="75" y2="35" stroke="#d97706" strokeWidth="2" />
              <circle cx="50" cy="15" r="4" fill="#7c3aed" stroke="#ffffff" strokeWidth="1.5" />
              <text x="40" y="70" fill="#5b21b6" fontSize="8" fontWeight="bold" textAnchor="middle">V* Extreme</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Optimum V*</span>
          </div>
        </div>
      </div>

      {/* Bottom Therefore Banner */}
      <div className="bg-violet-50/70 p-3 rounded-2xl border border-violet-100/90 flex items-center justify-center text-center">
        <p className="text-xs font-medium text-slate-800">
          <strong className="text-violet-800 font-extrabold mr-1.5 font-sans">Therefore:</strong>
          Because level curves of linear functions are parallel hyperplanes sweeping across a convex polytope, the optimum always occurs at one of the finite extreme corner vertices.
        </p>
      </div>
    </div>
  );
};
