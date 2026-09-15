import React from 'react';
import { Info } from 'lucide-react';
import { GPScalingPreset } from '../../data/gpScalingData';
import { computeGPScaling } from '../../utils/gpScalingMath';
import { MathView } from '../common/MathView';

interface Panel2Props {
  selectedPreset: GPScalingPreset;
  onSelectPreset: (p: GPScalingPreset) => void;
  a: number;
  r: number;
  n: number;
}

export const Panel2GPScalingGuide: React.FC<Panel2Props> = ({
  a,
  r,
  n,
}) => {
  const evalResult = computeGPScaling(a, r, n);

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-emerald-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            2
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Terms & Multiplier Ledger
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Recursive scaling and explicit closed-form expressions for each term.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-hidden rounded-2xl border border-emerald-100/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-emerald-50/50 text-[10px] font-bold text-slate-700 uppercase tracking-wider border-b border-emerald-100/80">
              <th className="py-2 px-3">Term k</th>
              <th className="py-2 px-2 text-center">Explicit Form</th>
              <th className="py-2 px-2 text-center">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50/80">
            {evalResult.terms.map((term) => (
              <tr key={`term-ledger-${term.index}`} className="hover:bg-slate-50 transition-colors">
                <td className="py-2 px-3 font-semibold text-slate-800">
                  a_{term.index}
                </td>
                <td className="py-2 px-2 text-center font-mono text-[11px] text-slate-600">
                  {term.algebraicFormula}
                </td>
                <td className="py-2 px-2 text-center font-mono text-[11px] font-bold text-emerald-900">
                  {term.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Footnote */}
      <div className="flex items-start gap-2 text-emerald-900 bg-emerald-50/40 p-3 rounded-2xl border border-emerald-100/60">
        <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-tight">
          <strong className="text-emerald-950">Zero Offset Power:</strong> Term 1 has power 0 (<MathView math="a \cdot r^0 = a" />). Therefore, term <MathView math="n" /> has power <MathView math="n - 1" />, yielding <MathView math="a_n = a \cdot r^{n-1}" />.
        </p>
      </div>
    </div>
  );
};
