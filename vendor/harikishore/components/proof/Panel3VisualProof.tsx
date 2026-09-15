import React from 'react';
import { MathView } from '../common/MathView';

interface Panel3Props {
  sides?: number;
}

export const Panel3VisualProof: React.FC<Panel3Props> = ({ sides = 6 }) => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-indigo-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            3
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Visual Proof <span className="text-sm font-semibold text-slate-500 font-sans">(Regular n-gon)</span>
          </h2>
        </div>
      </div>

      {/* Main Proof Dissection Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: 3 Pedagogical Steps */}
        <div className="lg:col-span-4 space-y-2 text-xs text-slate-600 font-medium">
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-indigo-600 font-bold">•</span>
            <span>Join the centre to all vertices.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-indigo-600 font-bold">•</span>
            <span>There are <MathView math="n" /> identical isosceles triangles.</span>
          </p>
          <p className="leading-relaxed flex items-start gap-1.5">
            <span className="text-indigo-600 font-bold">•</span>
            <span>Each gives one mirror line and one rotational step.</span>
          </p>
        </div>

        {/* Right Column: Mathematical Visual Diagram Equation */}
        <div className="lg:col-span-8 flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          {/* 1. n-gon with radial lines */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-20 h-20" viewBox="0 0 100 100">
              {/* Hexagon fill */}
              <polygon
                points="50,10 86,28 86,72 50,90 14,72 14,28"
                fill="rgba(124, 58, 237, 0.18)"
                stroke="#7c3aed"
                strokeWidth="1.8"
              />
              {/* Radial segments to vertices */}
              <line x1="50" y1="50" x2="50" y2="10" stroke="#7c3aed" strokeWidth="1.2" strokeDasharray="3 2" />
              <line x1="50" y1="50" x2="86" y2="28" stroke="#7c3aed" strokeWidth="1.2" strokeDasharray="3 2" />
              <line x1="50" y1="50" x2="86" y2="72" stroke="#7c3aed" strokeWidth="1.2" strokeDasharray="3 2" />
              <line x1="50" y1="50" x2="50" y2="90" stroke="#7c3aed" strokeWidth="1.2" strokeDasharray="3 2" />
              <line x1="50" y1="50" x2="14" y2="72" stroke="#7c3aed" strokeWidth="1.2" strokeDasharray="3 2" />
              <line x1="50" y1="50" x2="14" y2="28" stroke="#7c3aed" strokeWidth="1.2" strokeDasharray="3 2" />
              {/* Center dot */}
              <circle cx="50" cy="50" r="3.5" fill="#4338ca" />
            </svg>
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">n-gon</span>
          </div>

          <span className="text-base font-bold text-indigo-400">=</span>

          {/* 2. Fanned out isosceles triangles */}
          <div className="flex flex-col items-center min-w-[95px] relative">
            <span className="text-[11px] font-serif italic text-indigo-600 font-bold -mb-1">n</span>
            <svg className="w-22 h-20" viewBox="0 0 110 80">
              {/* Fan of triangles with shared apex */}
              {[-50, -30, -10, 10, 30, 50].map((deg, i) => {
                const rad = ((deg - 90) * Math.PI) / 180;
                const radNext = ((deg + 18 - 90) * Math.PI) / 180;
                const r = 48;
                const x1 = 55 + r * Math.cos(rad);
                const y1 = 65 + r * Math.sin(rad);
                const x2 = 55 + r * Math.cos(radNext);
                const y2 = 65 + r * Math.sin(radNext);
                return (
                  <polygon
                    key={i}
                    points={`55,65 ${x1},${y1} ${x2},${y2}`}
                    fill={`rgba(124, 58, 237, ${0.15 + i * 0.05})`}
                    stroke="#7c3aed"
                    strokeWidth="1.2"
                  />
                );
              })}
              <circle cx="55" cy="65" r="2.5" fill="#4338ca" />
            </svg>
            <span className="text-[10px] font-medium text-slate-600 mt-0.5">isosceles triangles</span>
          </div>

          <span className="text-base font-bold text-indigo-400">=</span>

          {/* 3. n mirror lines starburst */}
          <div className="flex flex-col items-center min-w-[85px]">
            <svg className="w-20 h-20" viewBox="0 0 100 100">
              {/* Starburst mirror lines */}
              <circle cx="50" cy="50" r="34" fill="rgba(124, 58, 237, 0.1)" stroke="#818cf8" strokeWidth="1" strokeDasharray="3 3" />
              {[0, 30, 60, 90, 120, 150].map((deg, i) => {
                const rad = (deg * Math.PI) / 180;
                const r = 42;
                return (
                  <line
                    key={i}
                    x1={50 - r * Math.cos(rad)}
                    y1={50 - r * Math.sin(rad)}
                    x2={50 + r * Math.cos(rad)}
                    y2={50 + r * Math.sin(rad)}
                    stroke="#7c3aed"
                    strokeWidth="1.4"
                    strokeDasharray="3 2"
                  />
                );
              })}
              <circle cx="50" cy="50" r="3" fill="#4338ca" />
            </svg>
            <span className="text-[10px] font-medium text-slate-600 mt-1">n mirror lines</span>
          </div>

          <span className="text-base font-bold text-indigo-400">=</span>

          {/* 4. n steps to match (360°) circular arrow */}
          <div className="flex flex-col items-center min-w-[95px] relative">
            <span className="text-[11px] font-serif italic text-emerald-600 font-bold -mb-1">n</span>
            <svg className="w-20 h-20" viewBox="0 0 100 100">
              {/* Circular rotation arrows */}
              <circle cx="50" cy="50" r="32" fill="none" stroke="#e0e7ff" strokeWidth="2" />
              
              {/* Arc 1 */}
              <path
                d="M 50 18 A 32 32 0 0 1 82 50"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <polygon points="82,46 86,52 80,53" fill="#6366f1" />

              {/* Arc 2 */}
              <path
                d="M 82 50 A 32 32 0 0 1 50 82"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
              />
              <polygon points="54,82 48,86 49,80" fill="#8b5cf6" />

              {/* Arc 3 */}
              <path
                d="M 50 82 A 32 32 0 0 1 18 50"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
              />
              <polygon points="18,54 14,48 20,49" fill="#10b981" />

              <circle cx="50" cy="50" r="3" fill="#4338ca" />
            </svg>
            <span className="text-[10px] font-medium text-slate-600 mt-1 text-center">
              n steps to match<br />
              <span className="text-[9px] text-slate-400 font-mono">(360°)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Therefore Banner */}
      <div className="bg-indigo-50/70 p-3 rounded-2xl border border-indigo-100/90 flex items-center justify-center text-center">
        <p className="text-xs font-medium text-slate-800">
          <strong className="text-indigo-700 font-extrabold mr-1.5 font-sans">Therefore:</strong>
          A regular <MathView math="n" />-gon has <MathView math="n" /> lines of symmetry and rotational symmetry of order <MathView math="n" />.
        </p>
      </div>
    </div>
  );
};
