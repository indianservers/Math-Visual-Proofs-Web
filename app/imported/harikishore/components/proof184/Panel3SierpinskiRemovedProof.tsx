import React from 'react';
import { BookOpen, CheckCircle2, Sparkles } from 'lucide-react';
import { MathView } from '../common/MathView';

export const Panel3SierpinskiRemovedProof: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-violet-100/80 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-black">
            3
          </span>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-sans">
            Formal Geometric Sum Derivation
          </h3>
        </div>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Algebraic Proof
        </span>
      </div>

      {/* Proof Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        {/* Step 1 */}
        <div className="p-3.5 rounded-2xl bg-violet-50/40 border border-violet-100/80 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            <span className="text-xs font-bold text-slate-800 font-sans">Identify First Term & Ratio</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            At step 1, exactly 1 hole is created: <MathView math="a = 1" />.
            At every next step, each of 8 sub-squares spawns 1 new hole: <MathView math="r = 8" />.
          </p>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-violet-100 text-center font-bold text-violet-900 text-xs">
            <MathView math="a_k = 8^{k - 1}" />
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-3.5 rounded-2xl bg-violet-50/40 border border-violet-100/80 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <span className="text-xs font-bold text-slate-800 font-sans">Write the Series & Multiply by 8</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            Write the sum of holes and its scaled copy multiplied by 8:
          </p>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-violet-100 text-center font-bold text-violet-900 text-xs space-y-0.5">
            <div><MathView math="S_n = 1 + 8 + 8^2 + \dots + 8^{n-1}" /></div>
            <div><MathView math="8S_n = 8 + 8^2 + \dots + 8^n" /></div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-3.5 rounded-2xl bg-violet-50/40 border border-violet-100/80 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <span className="text-xs font-bold text-slate-800 font-sans">Subtract to Telescopingly Cancel</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            Subtract the top equation from the bottom equation. All intermediate powers cancel:
          </p>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-violet-100 text-center font-bold text-violet-900 text-xs">
            <MathView math="8S_n - S_n = 8^n - 1" />
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-200/60 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
              4
            </span>
            <span className="text-xs font-bold text-slate-800 font-sans">Factor & Isolate Sum S_n</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            Factor out <MathView math="S_n(8 - 1) = 7S_n" /> and divide both sides by 7:
          </p>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-emerald-200 text-center font-bold text-emerald-800 text-xs">
            <MathView math="S_n = \frac{8^n - 1}{7}" />
          </div>
        </div>
      </div>

      {/* Proof Conclusion Banner */}
      <div className="bg-violet-950 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-violet-200 font-sans">Q.E.D. Cumulative Void Formula</div>
            <div className="text-xs font-medium text-slate-200 font-sans mt-0.5">
              The cumulative hole count after n recursive steps is always exactly <MathView math="(8^n - 1) / 7" />!
            </div>
          </div>
        </div>
        <div className="bg-white/15 px-4 py-2 rounded-xl text-center font-mono font-bold text-xs text-amber-200 border border-white/20 shrink-0">
          <MathView math="\sum_{k=0}^{n-1} 8^k = \frac{8^n - 1}{7}" />
        </div>
      </div>
    </div>
  );
};