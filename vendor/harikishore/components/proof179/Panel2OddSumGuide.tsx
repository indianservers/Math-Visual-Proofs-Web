import React from 'react';
import { Info } from 'lucide-react';
import { ODD_SUM_PRESETS, OddSumPreset } from '../../data/oddSumData';
import { MathView } from '../common/MathView';

interface Panel2Props {
  selectedPreset: OddSumPreset;
  onSelectPreset: (p: OddSumPreset) => void;
}

export const Panel2OddSumGuide: React.FC<Panel2Props> = ({
  selectedPreset,
  onSelectPreset,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-amber-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            2
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Odd Numbers & Perfect Squares Guide
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Step-by-step odd increments and square area growth.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-hidden rounded-2xl border border-amber-100/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-amber-50/50 text-[10px] font-bold text-slate-700 uppercase tracking-wider border-b border-amber-100/80">
              <th className="py-2 px-3">Layers n</th>
              <th className="py-2 px-2 text-center">Odd Terms Added</th>
              <th className="py-2 px-2 text-center">Sum = n²</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-50/80">
            {ODD_SUM_PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              const sq = preset.n * preset.n;
              return (
                <tr
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-amber-50/80 font-bold border-l-4 border-l-amber-500 text-amber-950'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <td className="py-2 px-3 font-semibold text-slate-800">
                    n = {preset.n}
                  </td>
                  <td className="py-2 px-2 text-center font-mono text-[11px] text-slate-600">
                    1 + 3 + ... + {2 * preset.n - 1}
                  </td>
                  <td className="py-2 px-2 text-center font-mono text-[11px] font-bold text-amber-900">
                    {preset.n}² = {sq}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Info Footnote */}
      <div className="flex items-start gap-2 text-amber-900 bg-amber-50/40 p-3 rounded-2xl border border-amber-100/60">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-tight">
          <strong className="text-amber-950">Gnomon Difference:</strong> The difference between two consecutive squares is always odd: <MathView math="(n+1)^2 - n^2 = 2n + 1" />. This proves every square is a sum of odds!
        </p>
      </div>
    </div>
  );
};
