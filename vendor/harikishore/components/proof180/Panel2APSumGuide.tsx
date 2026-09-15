import React from 'react';
import { Info } from 'lucide-react';
import { AP_SUM_PRESETS, APSumPreset } from '../../data/apSumData';
import { computeAPSum } from '../../utils/apSumMath';
import { MathView } from '../common/MathView';

interface Panel2Props {
  selectedPreset: APSumPreset;
  onSelectPreset: (p: APSumPreset) => void;
  a: number;
  d: number;
  n: number;
}

export const Panel2APSumGuide: React.FC<Panel2Props> = ({
  a,
  d,
  n,
}) => {
  const evalResult = computeAPSum(a, d, n);

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-purple-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            2
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Symmetric Pairing Ledger
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Term k and reversed term (n - k + 1) always sum to constant a + l.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-hidden rounded-2xl border border-purple-100/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-purple-50/50 text-[10px] font-bold text-slate-700 uppercase tracking-wider border-b border-purple-100/80">
              <th className="py-2 px-3">Column k</th>
              <th className="py-2 px-2 text-center">Original + Inverted</th>
              <th className="py-2 px-2 text-center">Column Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50/80">
            {evalResult.columns.map((col) => (
              <tr key={`col-ledger-${col.index}`} className="hover:bg-slate-50 transition-colors">
                <td className="py-2 px-3 font-semibold text-slate-800">
                  k = {col.index}
                </td>
                <td className="py-2 px-2 text-center font-mono text-[11px] text-slate-600">
                  {col.originalVal} + {col.invertedVal}
                </td>
                <td className="py-2 px-2 text-center font-mono text-[11px] font-bold text-purple-900">
                  {col.pairSum}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Footnote */}
      <div className="flex items-start gap-2 text-purple-900 bg-purple-50/40 p-3 rounded-2xl border border-purple-100/60">
        <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-tight">
          <strong className="text-purple-950">Cancellation of Steps:</strong> Moving one column forward adds <MathView math="+d" /> from the bottom, while the top bar loses <MathView math="-d" />. The steps cancel perfectly!
        </p>
      </div>
    </div>
  );
};
