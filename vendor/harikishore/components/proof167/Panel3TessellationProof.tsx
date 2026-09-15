import React from 'react';
import { MathView } from '../common/MathView';

export const Panel3TessellationProof: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-emerald-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            3
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Visual Proof <span className="text-sm font-semibold text-slate-500 font-sans">(The 360° Vertex Condition)</span>
          </h2>
        </div>
      </div>

      {/* Main Proof Dissection Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: 3 Pedagogical Steps */}
        <div className="lg:col-span-5 space-y-2 text-xs text-slate-600 font-medium">
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-emerald-600 font-bold">•</span>
            <span>At each meeting vertex, tiles must surround the point with no gaps and no overlaps (<MathView math="\sum \theta = 360^\circ" />).</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-emerald-600 font-bold">•</span>
            <span>For regular <MathView math="n" />-gons: <MathView math="\theta = \frac{(n-2) \times 180^\circ}{n}" />.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-emerald-600 font-bold">•</span>
            <span>Number of tiles <MathView math="k = \frac{360^\circ}{\theta} = \frac{2n}{n-2} = 2 + \frac{4}{n-2}" /> must be an integer.</span>
          </p>
        </div>

        {/* Right Column: 3 Regular Tessellations Dissection */}
        <div className="lg:col-span-7 flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none">
          {/* 1. Triangles 3^6 */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              {/* 6 equilateral triangles around vertex */}
              {[0, 60, 120, 180, 240, 300].map((deg, i) => {
                const rad1 = (deg * Math.PI) / 180;
                const rad2 = ((deg + 60) * Math.PI) / 180;
                const r = 32;
                return (
                  <polygon
                    key={i}
                    points={`40,40 ${40 + r * Math.cos(rad1)},${40 + r * Math.sin(rad1)} ${40 + r * Math.cos(rad2)},${40 + r * Math.sin(rad2)}`}
                    fill={`rgba(139, 92, 246, ${0.2 + (i % 2) * 0.15})`}
                    stroke="#7c3aed"
                    strokeWidth="1.2"
                  />
                );
              })}
              <circle cx="40" cy="40" r="2.5" fill="#4338ca" />
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">6 × 60° = 360°</span>
            <span className="text-[9px] text-indigo-600 font-semibold">(3⁶ Triangles)</span>
          </div>

          <span className="text-sm font-bold text-slate-300">|</span>

          {/* 2. Squares 4^4 */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              <rect x="12" y="12" width="28" height="28" fill="rgba(59, 130, 246, 0.25)" stroke="#2563eb" strokeWidth="1.2" />
              <rect x="40" y="12" width="28" height="28" fill="rgba(59, 130, 246, 0.35)" stroke="#2563eb" strokeWidth="1.2" />
              <rect x="12" y="40" width="28" height="28" fill="rgba(59, 130, 246, 0.35)" stroke="#2563eb" strokeWidth="1.2" />
              <rect x="40" y="40" width="28" height="28" fill="rgba(59, 130, 246, 0.25)" stroke="#2563eb" strokeWidth="1.2" />
              <circle cx="40" cy="40" r="2.5" fill="#1d4ed8" />
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">4 × 90° = 360°</span>
            <span className="text-[9px] text-blue-600 font-semibold">(4⁴ Squares)</span>
          </div>

          <span className="text-sm font-bold text-slate-300">|</span>

          {/* 3. Hexagons 6^3 */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-18 h-18" viewBox="0 0 80 80">
              {/* 3 hexagons meeting at center (40, 40) */}
              <polygon points="40,40 14,40 1,17 14,-5 40,-5 53,17" fill="rgba(16, 185, 129, 0.25)" stroke="#059669" strokeWidth="1.2" />
              <polygon points="40,40 53,17 79,17 92,40 79,62 53,62" fill="rgba(16, 185, 129, 0.35)" stroke="#059669" strokeWidth="1.2" />
              <polygon points="40,40 53,62 40,84 14,84 1,62 14,40" fill="rgba(16, 185, 129, 0.28)" stroke="#059669" strokeWidth="1.2" />
              <circle cx="40" cy="40" r="2.5" fill="#047857" />
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">3 × 120° = 360°</span>
            <span className="text-[9px] text-emerald-600 font-semibold">(6³ Hexagons)</span>
          </div>
        </div>
      </div>

      {/* Bottom Therefore Banner */}
      <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100/90 flex items-center justify-center text-center">
        <p className="text-xs font-medium text-slate-800">
          <strong className="text-emerald-800 font-extrabold mr-1.5 font-sans">Therefore:</strong>
          Since <MathView math="n-2" /> must divide 4, the only solutions are <MathView math="n = 3, 4, 6" />. Exactly <strong>three regular tessellations</strong> exist.
        </p>
      </div>
    </div>
  );
};
