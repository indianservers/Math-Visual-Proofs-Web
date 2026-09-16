import React from 'react';
import { Info } from 'lucide-react';
import { GPSumPreset } from '../../data/gpSumData';
import { computeGPSum } from '../../utils/gpSumMath';
import { MathView } from '../common/MathView';

interface Panel2Props {
  selectedPreset: GPSumPreset;
  onSelectPreset: (p: GPSumPreset) => void;
  a: number;
  r: number;
  n: number;
}

export const Panel2GPSumGuide: React.FC<Panel2Props> = ({
  a,
  r,
  n,
}) => {
  const evalResult = computeGPSum(a, r, n);

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-pink-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            2
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Shifted Cancellation Ledger
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Tracking which terms cancel and which terms survive subtraction.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-hidden rounded-2xl border border-pink-100/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-pink-50/50 text-[10px] font-bold text-slate-700 uppercase tracking-wider border-b border-pink-100/80">
              <th className="py-2 px-3">Power</th>
              <th className="py-2 px-2 text-center">In S_n</th>
              <th className="py-2 px-2 text-center">In r·S_n</th>
              <th className="py-2 px-2 text-center">Difference S - rS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pink-50/80">
            {evalResult.terms.map((term) => (
              <tr key={`term-cancel-${term.power}`} className="hover:bg-slate-50 transition-colors">
                <td className="py-2 px-3 font-mono font-semibold text-slate-800">
                  r^{term.power}
                </td>
                <td className="py-2 px-2 text-center font-mono text-[10px]">
                  {term.inS ? term.algebraic : '—'}
                </td>
                <td className="py-2 px-2 text-center font-mono text-[10px]">
                  {term.inRS ? term.algebraic : '—'}
                </td>
                <td className="py-2 px-2 text-center font-mono text-[11px] font-bold">
                  {term.isCanceled ? (
                    <span className="text-slate-400 line-through">0 (Cancels)</span>
                  ) : term.power === 0 ? (
                    <span className="text-emerald-600">+{term.algebraic} (Head)</span>
                  ) : (
                    <span className="text-rose-600">−{term.algebraic} (Tail)</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Footnote */}
      <div className="flex items-start gap-2 text-pink-900 bg-pink-50/40 p-3 rounded-2xl border border-pink-100/60">
        <Info className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-tight">
          <strong className="text-pink-950">Telescoping Magic:</strong> Multiplying by <MathView math="r" /> turns each term into its exact successor. When subtracting, the entire intermediate chain cancels, leaving only <MathView math="a - ar^n" />.
        </p>
      </div>
    </div>
  );
};
