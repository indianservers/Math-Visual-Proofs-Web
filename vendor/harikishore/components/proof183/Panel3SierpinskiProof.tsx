import React from 'react';
import { BookOpen, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { MathView } from '../common/MathView';

export const Panel3SierpinskiProof: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-indigo-100/80 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black">
            3
          </span>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-sans">
            Formal Algebraic Deduction
          </h3>
        </div>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Complete Proof
        </span>
      </div>

      {/* Proof Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        {/* Step 1 */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/40 border border-indigo-100/80 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            <span className="text-xs font-bold text-slate-800 font-sans">Base Unit Square</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            Begin with a solid square of side length 1. Its initial area is:
          </p>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-indigo-100 text-center font-bold text-indigo-900 text-xs">
            <MathView math="A_0 = 1" />
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/40 border border-indigo-100/80 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <span className="text-xs font-bold text-slate-800 font-sans">Level 1 Center Cutout</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            Subdivide into 9 equal <MathView math="\frac{1}{3} \times \frac{1}{3}" /> squares and remove 1 center square:
          </p>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-indigo-100 text-center font-bold text-indigo-900 text-xs">
            <MathView math="A_1 = 8 \times \left(\frac{1}{3}\right)^2 = \frac{8}{9} A_0" />
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/40 border border-indigo-100/80 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <span className="text-xs font-bold text-slate-800 font-sans">Recursive Multiplication</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            At step <MathView math="k" />, each of the remaining squares loses its own center ninth:
          </p>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-indigo-100 text-center font-bold text-indigo-900 text-xs">
            <MathView math="A_k = \frac{8}{9} \, A_{k-1}" />
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-200/60 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
              4
            </span>
            <span className="text-xs font-bold text-slate-800 font-sans">Explicit Power Formula</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            Applying the common multiplier <MathView math="r = \frac{8}{9}" /> repeatedly for <MathView math="n" /> steps:
          </p>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-emerald-200 text-center font-bold text-emerald-800 text-xs">
            <MathView math="A_n = A_0 \left(\frac{8}{9}\right)^n = \left(\frac{8}{9}\right)^n" />
          </div>
        </div>
      </div>

      {/* Proof Conclusion Banner */}
      <div className="bg-indigo-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-indigo-200 font-sans">Q.E.D. Limit Conclusion</div>
            <div className="text-xs font-medium text-slate-200 font-sans mt-0.5">
              Because <MathView math="|8/9| < 1" />, the retained area converges strictly to zero in the limit!
            </div>
          </div>
        </div>
        <div className="bg-white/15 px-4 py-2 rounded-xl text-center font-mono font-bold text-xs text-amber-200 border border-white/20 shrink-0">
          <MathView math="\lim_{n \to \infty} A_n = 0" />
        </div>
      </div>
    </div>
  );
};