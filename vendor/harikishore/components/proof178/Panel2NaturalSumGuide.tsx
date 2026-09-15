import React from 'react';
import { Info } from 'lucide-react';
import { NATURAL_SUM_PRESETS, NaturalSumPreset } from '../../data/naturalSumData';
import { MathView } from '../common/MathView';

interface Panel2Props {
  selectedPreset: NaturalSumPreset;
  onSelectPreset: (p: NaturalSumPreset) => void;
}

export const Panel2NaturalSumGuide: React.FC<Panel2Props> = ({
  selectedPreset,
  onSelectPreset,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-blue-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            2
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Triangular Numbers & Rectangle Guide
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Connecting triangular sums T_n to rectangular areas n × (n + 1).
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-hidden rounded-2xl border border-blue-100/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-blue-50/50 text-[10px] font-bold text-slate-700 uppercase tracking-wider border-b border-blue-100/80">
              <th className="py-2 px-3">Terms n</th>
              <th className="py-2 px-2 text-center">Rectangle n × (n+1)</th>
              <th className="py-2 px-2 text-center">Sum T_n</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50/80">
            {NATURAL_SUM_PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              const rectTotal = preset.n * (preset.n + 1);
              const triSum = rectTotal / 2;
              return (
                <tr
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50/80 font-bold border-l-4 border-l-blue-600 text-blue-950'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <td className="py-2 px-3 font-semibold text-slate-800">
                    n = {preset.n}
                  </td>
                  <td className="py-2 px-2 text-center font-mono text-[11px] text-slate-600">
                    {preset.n} × {preset.n + 1} = {rectTotal}
                  </td>
                  <td className="py-2 px-2 text-center font-mono text-[11px] font-bold text-blue-900">
                    {triSum}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Info Footnote */}
      <div className="flex items-start gap-2 text-blue-900 bg-blue-50/40 p-3 rounded-2xl border border-blue-100/60">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-tight">
          <strong className="text-blue-950">Why is width n + 1?</strong> In the staircase, row 1 has 1 dot and row n has n dots. When the duplicate is inverted, row 1 meets row n ($1 + n = n + 1$), making every single row have exactly <MathView math="n + 1" /> dots!
        </p>
      </div>
    </div>
  );
};
