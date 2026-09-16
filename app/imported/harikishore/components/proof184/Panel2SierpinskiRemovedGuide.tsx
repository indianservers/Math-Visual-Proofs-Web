import React from 'react';
import { Info, Layers, Sparkles, HelpCircle } from 'lucide-react';
import { SierpinskiRemovedPreset } from '../../data/sierpinskiRemovedData';
import { computeSierpinskiRemoved } from '../../utils/sierpinskiRemovedMath';
import { MathView } from '../common/MathView';

interface Panel2Props {
  selectedPreset: SierpinskiRemovedPreset;
  onSelectPreset: (p: SierpinskiRemovedPreset) => void;
  level: number;
  setLevel: (l: number) => void;
}

export const Panel2SierpinskiRemovedGuide: React.FC<Panel2Props> = ({
  level,
  setLevel,
}) => {
  const evaluation = computeSierpinskiRemoved(level);

  const tableRows = [
    { n: 1, term: '8⁰ = 1', sumFormula: '1', total: 1, closed: '(8¹ - 1)/7 = 7/7 = 1' },
    { n: 2, term: '8¹ = 8', sumFormula: '1 + 8', total: 9, closed: '(8² - 1)/7 = 63/7 = 9' },
    { n: 3, term: '8² = 64', sumFormula: '1 + 8 + 64', total: 73, closed: '(8³ - 1)/7 = 511/7 = 73' },
    { n: 4, term: '8³ = 512', sumFormula: '1 + 8 + 64 + 512', total: 585, closed: '(8⁴ - 1)/7 = 4095/7 = 585' },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-violet-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-black">
              2
            </span>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-sans">
              Hole Count Ledger
            </h3>
          </div>
          <span className="text-[11px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100">
            Multiplier r = 8
          </span>
        </div>
        <p className="text-xs text-slate-500 font-sans mt-1">
          Tracking newly removed square counts and their cumulative finite geometric series sum.
        </p>
      </div>

      {/* Interactive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
              <th className="py-2 px-2">Step (n)</th>
              <th className="py-2 px-2">New (8ⁿ⁻¹)</th>
              <th className="py-2 px-2">Sum Expression</th>
              <th className="py-2 px-2 text-right">Total Holes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tableRows.map(row => {
              const isSelected = row.n === level;
              return (
                <tr
                  key={row.n}
                  onClick={() => setLevel(row.n)}
                  className={`cursor-pointer transition-colors font-sans ${
                    isSelected
                      ? 'bg-violet-50/80 text-violet-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <td className="py-2.5 px-2 flex items-center gap-1.5">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                      isSelected ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {row.n}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 font-mono text-[11px] text-amber-600 font-bold">{row.term}</td>
                  <td className="py-2.5 px-2 font-mono text-[11px]">{row.sumFormula}</td>
                  <td className="py-2.5 px-2 text-right font-mono font-bold text-violet-700">
                    {row.total}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Why Divisor is 7 Callout */}
      <div className="bg-gradient-to-br from-violet-50 to-amber-50 border border-violet-200/70 rounded-2xl p-3.5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-xs space-y-1">
          <div className="font-extrabold text-violet-950 font-sans">
            Why Divide by 7?
          </div>
          <p className="text-slate-600 leading-relaxed font-sans text-[11px]">
            Multiplying the series by 8 scales everything by one step: <MathView math="8S - S = 7S" />.
            Dividing isolates the sum:
          </p>
          <div className="pt-1 text-center font-bold text-violet-800 bg-white/80 py-1.5 rounded-lg border border-violet-100">
            <MathView math="S_n = \frac{8^n - 1}{8 - 1} = \frac{8^n - 1}{7}" />
          </div>
        </div>
      </div>
    </div>
  );
};