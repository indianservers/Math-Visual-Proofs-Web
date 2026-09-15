import React from 'react';
import { MathView } from '../common/MathView';

export const Panel3GradientProof: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-emerald-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            3
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Visual Proof <span className="text-sm font-semibold text-slate-500 font-sans">(Chain Rule Orthogonality & Steepest Ascent)</span>
          </h2>
        </div>
      </div>

      {/* Main Proof Dissection Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: 3 Pedagogical Steps */}
        <div className="lg:col-span-5 space-y-2 text-xs text-slate-600 font-medium">
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-emerald-600 font-bold">•</span>
            <span>Let <MathView math="\vec{r}(t)" /> parameterize the level curve <MathView math="f(\vec{r}(t)) = C" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-emerald-600 font-bold">•</span>
            <span>Differentiating via Multivariable Chain Rule gives <MathView math="\frac{d}{dt}[f(\vec{r}(t))] = \nabla f \cdot \vec{r}'(t) = 0" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-emerald-600 font-bold">•</span>
            <span>Directional derivative <MathView math="D_{\hat{u}}f = \|\nabla f\|\cos\phi" /> is strictly maximized when <MathView math="\phi = 0" /> (<MathView math="\hat{u} \parallel \nabla f" />).</span>
          </p>
        </div>

        {/* Right Column: Visual Diagram Equation */}
        <div className="lg:col-span-7 flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          {/* Step 1: Level Curve */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="#f8fafc" rx="8" />
              <path d="M 15 65 Q 40 40 65 15" fill="none" stroke="#10b981" strokeWidth="2.2" />
              <text x="40" y="24" fill="#047857" fontSize="8" fontWeight="bold" textAnchor="middle">f(x,y)=C</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Level Curve</span>
          </div>

          <span className="text-sm font-bold text-emerald-500">→</span>

          {/* Step 2: Tangent & Dot Product */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="#f8fafc" rx="8" />
              <line x1="15" y1="65" x2="65" y2="15" stroke="#6366f1" strokeWidth="1.8" strokeDasharray="3 2" />
              <line x1="40" y1="40" x2="65" y2="65" stroke="#059669" strokeWidth="2.5" />
              <rect x="40" y="35" width="6" height="6" fill="none" stroke="#059669" strokeWidth="1.2" transform="rotate(45, 40, 40)" />
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">∇f · r'(t) = 0</span>
          </div>

          <span className="text-sm font-bold text-emerald-500">→</span>

          {/* Step 3: Steepest Ascent Direction */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="#ecfdf5" rx="8" />
              <text x="40" y="34" fill="#047857" fontSize="10" fontWeight="bold" textAnchor="middle">D_u f = ||∇f||</text>
              <text x="40" y="52" fill="#059669" fontSize="9" fontWeight="bold" textAnchor="middle">Max Ascent</text>
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">Orthogonal 90°</span>
          </div>
        </div>
      </div>

      {/* Bottom Therefore Banner */}
      <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100/90 flex items-center justify-center text-center">
        <p className="text-xs font-medium text-slate-800">
          <strong className="text-emerald-800 font-extrabold mr-1.5 font-sans">Therefore:</strong>
          The gradient vector <MathView math="\nabla f" /> points directly in the direction of steepest increase and is everywhere perpendicular to the surface's level curves (<MathView math="\nabla f \perp \vec{T}" />).
        </p>
      </div>
    </div>
  );
};
