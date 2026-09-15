import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { MathView } from '../common/MathView';

export const Panel3FibonacciTilingProof: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-emerald-100/80 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">
            3
          </span>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-sans">
            Formal Geometric Induction Proof
          </h3>
        </div>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Complete Proof
        </span>
      </div>

      {/* Proof Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        {/* Step 1 */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100/80 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            <span className="text-xs font-bold text-slate-800 font-sans">Base Cases (n = 1, 2)</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            For <MathView math="n = 1" />, we have <MathView math="F_1^2 = 1^2 = 1 = 1 \times 1 = F_1 F_2" />.
            For <MathView math="n = 2" />, two unit squares side-by-side make a <MathView math="1 \times 2" /> rectangle of area <MathView math="1^2 + 1^2 = 2 = F_2 F_3" />.
          </p>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-emerald-100 text-center font-bold text-emerald-900 text-xs">
            <MathView math="F_1^2 + F_2^2 = 1 + 1 = 1 \times 2 = F_2 F_3" />
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100/80 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <span className="text-xs font-bold text-slate-800 font-sans">Inductive Hypothesis</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            Assume the first <MathView math="k" /> squares form a rectangle of dimensions <MathView math="F_k \times F_{k+1}" /> with area:
          </p>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-emerald-100 text-center font-bold text-emerald-900 text-xs">
            <MathView math="\sum_{i=1}^{k} F_i^2 = F_k F_{k+1}" />
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100/80 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <span className="text-xs font-bold text-slate-800 font-sans">Attaching the Next Square</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            We attach a square of side <MathView math="F_{k+1}" /> along the rectangle side that also has length <MathView math="F_{k+1}" />.
          </p>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-emerald-100 text-center font-bold text-emerald-900 text-xs">
            <MathView math="\text{New Side} = F_k + F_{k+1} = F_{k+2}" />
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100/80 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
              4
            </span>
            <span className="text-xs font-bold text-slate-800 font-sans">Total Induction Completion</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            The sum of all square areas equals the newly formed rectangle:
          </p>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-emerald-100 text-center font-bold text-emerald-900 text-xs">
            <MathView math="F_k F_{k+1} + F_{k+1}^2 = F_{k+1}(F_k + F_{k+1}) = F_{k+1} F_{k+2} \quad \blacksquare" />
          </div>
        </div>
      </div>
    </div>
  );
};
