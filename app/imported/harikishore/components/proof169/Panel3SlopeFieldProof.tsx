import React from 'react';
import { MathView } from '../common/MathView';

export const Panel3SlopeFieldProof: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-sky-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            3
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Visual Proof <span className="text-sm font-semibold text-slate-500 font-sans">(Euler Tangent Convergence to Solution Curve)</span>
          </h2>
        </div>
      </div>

      {/* Main Proof Dissection Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: 3 Pedagogical Steps */}
        <div className="lg:col-span-5 space-y-2 text-xs text-slate-600 font-medium">
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-sky-600 font-bold">•</span>
            <span>At each point <MathView math="(x_k, y_k)" />, the direction arrow defines the local tangent vector <MathView math="\frac{dy}{dx} = f(x_k, y_k)" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-sky-600 font-bold">•</span>
            <span>Euler's finite step <MathView math="y_{k+1} = y_k + h \cdot f(x_k, y_k)" /> tracks the tangent line for step size <MathView math="h" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-sky-600 font-bold">•</span>
            <span>Taking the limit as <MathView math="h \to 0" />, the piecewise tangent sequence converges to the exact integral curve <MathView math="y(x) = y_0 + \int_{x_0}^x f(t, y(t)) dt" />.</span>
          </p>
        </div>

        {/* Right Column: Visual Diagram Equation */}
        <div className="lg:col-span-7 flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          {/* Step 1: Discrete coarse step */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="#f8fafc" rx="8" />
              <line x1="10" y1="65" x2="45" y2="40" stroke="#f59e0b" strokeWidth="2" />
              <line x1="45" y1="40" x2="75" y2="20" stroke="#f59e0b" strokeWidth="2" />
              <circle cx="10" cy="65" r="3" fill="#0284c7" />
              <circle cx="45" cy="40" r="3" fill="#f59e0b" />
              <circle cx="75" cy="20" r="3" fill="#f59e0b" />
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Coarse (h = 1.0)</span>
          </div>

          <span className="text-sm font-bold text-sky-400">→</span>

          {/* Step 2: Refined steps */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="#f8fafc" rx="8" />
              <polyline points="10,65 25,52 40,41 55,31 70,22" fill="none" stroke="#f59e0b" strokeWidth="2" />
              {[10, 25, 40, 55, 70].map((x, i) => (
                <circle key={i} cx={x} cy={65 - i * 11} r="2" fill="#0284c7" />
              ))}
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Refined (h = 0.25)</span>
          </div>

          <span className="text-sm font-bold text-sky-400">→</span>

          {/* Step 3: Continuous smooth curve */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="#f8fafc" rx="8" />
              <path d="M 10 65 Q 40 40 75 18" fill="none" stroke="#0284c7" strokeWidth="2.5" />
              <circle cx="10" cy="65" r="3" fill="#0284c7" />
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Limit (h → 0)</span>
          </div>
        </div>
      </div>

      {/* Bottom Therefore Banner */}
      <div className="bg-sky-50/70 p-3 rounded-2xl border border-sky-100/90 flex items-center justify-center text-center">
        <p className="text-xs font-medium text-slate-800">
          <strong className="text-sky-800 font-extrabold mr-1.5 font-sans">Therefore:</strong>
          Every direction field encodes the entire family of integral curves. Fixing an initial point <MathView math="(x_0, y_0)" /> selects a single, unique deterministic solution curve.
        </p>
      </div>
    </div>
  );
};
