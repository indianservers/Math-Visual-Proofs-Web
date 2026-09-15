import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { MathView } from '../common/MathView';

export const Panel3FibonacciSpiralProof: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-amber-100/80 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-black">
            3
          </span>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-sans">
            Formal Limit & Golden Section Proof
          </h3>
        </div>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Complete Proof
        </span>
      </div>

      {/* Proof Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        {/* Step 1 */}
        <div className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-100/80 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            <span className="text-xs font-bold text-slate-800 font-sans">Recurrence Definition</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            Every term of the Fibonacci sequence is defined by the sum of its two predecessors:
          </p>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-amber-100 text-center font-bold text-amber-900 text-xs">
            <MathView math="F_{n+1} = F_n + F_{n-1}" />
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-100/80 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <span className="text-xs font-bold text-slate-800 font-sans">Divide by Preceding Term</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            Dividing both sides of the equation by <MathView math="F_n" />:
          </p>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-amber-100 text-center font-bold text-amber-900 text-xs">
            <MathView math="\frac{F_{n+1}}{F_n} = 1 + \frac{F_{n-1}}{F_n} = 1 + \frac{1}{\frac{F_n}{F_{n-1}}}" />
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-100/80 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <span className="text-xs font-bold text-slate-800 font-sans">Limit Equation</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            Letting <MathView math="x = \lim_{n \to \infty} \frac{F_{n+1}}{F_n}" /> as <MathView math="n \to \infty" />:
          </p>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-amber-100 text-center font-bold text-amber-900 text-xs">
            <MathView math="x = 1 + \frac{1}{x} \iff x^2 - x - 1 = 0" />
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-100/80 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold">
              4
            </span>
            <span className="text-xs font-bold text-slate-800 font-sans">Golden Ratio Constant</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            Applying the quadratic formula and taking the positive root:
          </p>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-amber-100 text-center font-bold text-amber-900 text-xs">
            <MathView math="\phi = \frac{1 + \sqrt{5}}{2} \approx 1.6180339887... \quad \blacksquare" />
          </div>
        </div>
      </div>
    </div>
  );
};
