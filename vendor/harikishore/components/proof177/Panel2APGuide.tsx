import React from 'react';
import { Info } from 'lucide-react';
import { APPreset } from '../../data/apData';
import { computeAP } from '../../utils/apMath';

interface Panel2Props {
  selectedPreset: APPreset;
  a: number;
  d: number;
  n: number;
}

export const Panel2APGuide: React.FC<Panel2Props> = ({
  a,
  d,
  n,
}) => {
  const evalResult = computeAP(a, d, Math.min(6, Math.max(4, n)));

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-blue-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            2
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            AP Terms Construction Ledger
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Recursive additions and explicit algebraic formulas for initial terms.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-hidden rounded-2xl border border-blue-100/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-blue-50/50 text-[10px] font-bold text-slate-700 uppercase tracking-wider border-b border-blue-100/80">
              <th className="py-2 px-3">Term n</th>
              <th className="py-2 px-2 text-center">Explicit Formula</th>
              <th className="py-2 px-2 text-center">Value a_n</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50/80">
            {evalResult.terms.map((t) => (
              <tr key={`term-ledger-${t.index}`} className="hover:bg-slate-50 transition-colors">
                <td className="py-2 px-3 font-mono font-bold text-blue-900">
                  a_{t.index}
                </td>
                <td className="py-2 px-2 text-center font-mono text-[10px] text-slate-600">
                  {t.algebraicFormula}
                </td>
                <td className="py-2 px-2 text-center font-mono text-[11px] font-bold text-slate-900">
                  {t.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Footnote */}
      <div className="flex items-start gap-2 text-blue-900 bg-blue-50/40 p-3 rounded-2xl border border-blue-100/60">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-tight">
          <strong className="text-blue-950">Zero-indexed Offset:</strong> Because the sequence starts at term 1 ($a_1 = a + 0\cdot d$), term $n$ requires only $(n - 1)$ step additions of the common difference $d$.
        </p>
      </div>
    </div>
  );
};
