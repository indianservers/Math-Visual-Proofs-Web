import React from 'react';
import { BookOpen, CheckCircle2, Sparkles } from 'lucide-react';
import { MathView } from '../common/MathView';

export const Panel3TriangularProof: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-sky-100/80 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-black">
            3
          </span>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-sans">
            Formal Geometric Halving Proof
          </h3>
        </div>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Visual Proof
        </span>
      </div>

      {/* Proof Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        {/* Step 1 */}
        <div className="p-3.5 rounded-2xl bg-sky-50/40 border border-sky-100/80 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            <span className="text-xs font-bold text-slate-800 font-sans">Define Triangular Rows</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            Row 1 contains 1 dot, row 2 contains 2 dots, up to row <MathView math="n" /> with <MathView math="n" /> dots:
          </p>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-sky-100 text-center font-bold text-sky-900 text-xs">
            <MathView math="T_n = 1 + 2 + 3 + \dots + n" />
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-3.5 rounded-2xl bg-sky-50/40 border border-sky-100/80 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <span className="text-xs font-bold text-slate-800 font-sans">Duplicate & Rotate 180°</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            Create an exact duplicate triangle and invert it so its bottom row aligns with the top row:
          </p>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-sky-100 text-center font-bold text-amber-700 text-xs">
            <MathView math="\text{Row } k \text{ has } k + (n + 1 - k) = n + 1 \text{ dots}" />
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-3.5 rounded-2xl bg-sky-50/40 border border-sky-100/80 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <span className="text-xs font-bold text-slate-800 font-sans">Compute Rectangle Dot Count</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            The combined rectangle has exactly <MathView math="n" /> rows and <MathView math="n + 1" /> columns:
          </p>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-sky-100 text-center font-bold text-sky-900 text-xs">
            <MathView math="2 \cdot T_n = n(n + 1)" />
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-200/60 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
              4
            </span>
            <span className="text-xs font-bold text-slate-800 font-sans">Divide by 2 to Isolate T_n</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            Since the original triangle is exactly half of the rectangle:
          </p>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-emerald-200 text-center font-bold text-emerald-800 text-xs">
            <MathView math="T_n = \frac{n(n + 1)}{2}" />
          </div>
        </div>
      </div>

      {/* Proof Conclusion Banner */}
      <div className="bg-sky-950 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-sky-200 font-sans">Q.E.D. Closed Triangular Formula</div>
            <div className="text-xs font-medium text-slate-200 font-sans mt-0.5">
              Every triangular number is equal to half of an <MathView math="n \times (n+1)" /> rectangle!
            </div>
          </div>
        </div>
        <div className="bg-white/15 px-4 py-2 rounded-xl text-center font-mono font-bold text-xs text-amber-200 border border-white/20 shrink-0">
          <MathView math="T_n = \frac{n(n + 1)}{2}" />
        </div>
      </div>
    </div>
  );
};