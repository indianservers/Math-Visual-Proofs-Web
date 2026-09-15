import React from 'react';
import { BookOpen, CheckCircle2, Sparkles } from 'lucide-react';
import { MathView } from '../common/MathView';

export const Panel3SquareOddLayersProof: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-amber-100/80 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-black">
            3
          </span>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-sans">
            Formal Algebraic & Telescoping Proof
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
            <span className="text-xs font-bold text-slate-800 font-sans">Base Unit Tile</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            A single tile forms the base square: <MathView math="1^2 = 1" />, which is the first odd number.
          </p>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-amber-100 text-center font-bold text-amber-900 text-xs">
            <MathView math="S_1 = 1^2 = 1" />
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-100/80 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <span className="text-xs font-bold text-slate-800 font-sans">Gnomon L-Layer Count</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            To expand an <MathView math="(n-1) \times (n-1)" /> square to <MathView math="n \times n" />, we add 1 corner plus two arms of length <MathView math="n - 1" />:
          </p>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-amber-100 text-center font-bold text-amber-900 text-xs">
            <MathView math="\Delta = 1 + (n - 1) + (n - 1) = 2n - 1" />
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-100/80 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <span className="text-xs font-bold text-slate-800 font-sans">Difference of Squares Identity</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            Expanding the algebraic difference of two consecutive squares:
          </p>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-amber-100 text-center font-bold text-amber-900 text-xs">
            <MathView math="n^2 - (n - 1)^2 = n^2 - (n^2 - 2n + 1) = 2n - 1" />
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-200/60 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
              4
            </span>
            <span className="text-xs font-bold text-slate-800 font-sans">Telescoping Sum Cancellation</span>
          </div>
          <p className="text-xs text-slate-600 font-sans">
            Summing all layers from 1 to <MathView math="n" />, all interior square terms cancel:
          </p>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-emerald-200 text-center font-bold text-emerald-800 text-xs">
            <MathView math="\sum_{k=1}^n (2k - 1) = \sum_{k=1}^n (k^2 - (k - 1)^2) = n^2" />
          </div>
        </div>
      </div>

      {/* Proof Conclusion Banner */}
      <div className="bg-amber-950 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-200 font-sans">Q.E.D. Odd Numbers Build Perfect Squares</div>
            <div className="text-xs font-medium text-slate-200 font-sans mt-0.5">
              The sum of the first <MathView math="n" /> odd integers is always a perfect square <MathView math="n^2" />!
            </div>
          </div>
        </div>
        <div className="bg-white/15 px-4 py-2 rounded-xl text-center font-mono font-bold text-xs text-amber-200 border border-white/20 shrink-0">
          <MathView math="\sum_{k=1}^n (2k - 1) = n^2" />
        </div>
      </div>
    </div>
  );
};