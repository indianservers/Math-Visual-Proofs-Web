import React from 'react';
import { MathView } from '../common/MathView';

export const Panel3DivCurlProof: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-pink-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            3
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Visual Proof <span className="text-sm font-semibold text-slate-500 font-sans">(Flux Expansion & Circulation Limits)</span>
          </h2>
        </div>
      </div>

      {/* Main Proof Dissection Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: 3 Pedagogical Steps */}
        <div className="lg:col-span-5 space-y-2 text-xs text-slate-600 font-medium">
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-pink-600 font-bold">•</span>
            <span>Flux balance through a box <MathView math="\Delta x \Delta y" /> gives net outflow <MathView math="\frac{\partial P}{\partial x} + \frac{\partial Q}{\partial y}" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-pink-600 font-bold">•</span>
            <span>Loop line integral gives circulation per unit area <MathView math="(\text{curl } \vec{F})_z = \frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-pink-600 font-bold">•</span>
            <span>Internal shared boundary flows cancel identically, proving 2D Divergence and Green's Theorems.</span>
          </p>
        </div>

        {/* Right Column: Visual Diagram Equation */}
        <div className="lg:col-span-7 flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          {/* Step 1: Flux Box */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect x="15" y="15" width="50" height="50" fill="#fdf2f8" stroke="#db2777" strokeWidth="1.8" rx="4" />
              <line x1="65" y1="40" x2="76" y2="40" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
              <line x1="15" y1="40" x2="4" y2="40" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
              <text x="40" y="44" fill="#be185d" fontSize="9" fontWeight="bold" textAnchor="middle">Δx Δy</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Flux Box</span>
          </div>

          <span className="text-sm font-bold text-pink-500">→</span>

          {/* Step 2: Boundary Integrals */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="#f8fafc" rx="8" />
              <circle cx="40" cy="40" r="24" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="3 2" />
              <text x="40" y="36" fill="#4338ca" fontSize="9" fontWeight="bold" textAnchor="middle">∮ F · n ds</text>
              <text x="40" y="52" fill="#d97706" fontSize="8" fontWeight="bold" textAnchor="middle">∮ F · dr</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Boundary Line</span>
          </div>

          <span className="text-sm font-bold text-pink-500">→</span>

          {/* Step 3: Fundamental Operators */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="#fdf2f8" rx="8" />
              <text x="40" y="34" fill="#db2777" fontSize="11" fontWeight="bold" textAnchor="middle">∇ · F</text>
              <text x="40" y="54" fill="#d97706" fontSize="10" fontWeight="bold" textAnchor="middle">∇ × F</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Local Operators</span>
          </div>
        </div>
      </div>

      {/* Bottom Therefore Banner */}
      <div className="bg-pink-50/70 p-3 rounded-2xl border border-pink-100/90 flex items-center justify-center text-center">
        <p className="text-xs font-medium text-slate-800">
          <strong className="text-pink-800 font-extrabold mr-1.5 font-sans">Therefore:</strong>
          Divergence (<MathView math="\nabla \cdot \vec{F}" />) measures source/sink expansion flux per unit area, while Curl (<MathView math="\nabla \times \vec{F}" />) measures paddle-wheel micro-circulation density.
        </p>
      </div>
    </div>
  );
};
