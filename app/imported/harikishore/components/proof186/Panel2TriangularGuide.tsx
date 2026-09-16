import React from 'react';
import { Info, Sparkles, HelpCircle } from 'lucide-react';
import { TriangularPreset } from '../../data/triangularData';
import { computeTriangular } from '../../utils/triangularMath';
import { MathView } from '../common/MathView';

interface Panel2Props {
  selectedPreset: TriangularPreset;
  onSelectPreset: (p: TriangularPreset) => void;
  n: number;
  setN: (n: number) => void;
}

export const Panel2TriangularGuide: React.FC<Panel2Props> = ({
  n,
  setN,
}) => {
  const tableRows = [
    { n: 1, sum: '1', rect: '1 × 2 = 2', tn: 1 },
    { n: 2, sum: '1 + 2', rect: '2 × 3 = 6', tn: 3 },
    { n: 3, sum: '1 + 2 + 3', rect: '3 × 4 = 12', tn: 6 },
    { n: 4, sum: '1 + 2 + 3 + 4', rect: '4 × 5 = 20', tn: 10 },
    { n: 5, sum: '1 + 2 + 3 + 4 + 5', rect: '5 × 6 = 30', tn: 15 },
    { n: 6, sum: '1 + ... + 6', rect: '6 × 7 = 42', tn: 21 },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-sky-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-black">
              2
            </span>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-sans">
              Triangular Number Ledger
            </h3>
          </div>
          <span className="text-[11px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
            T_n = n(n+1)/2
          </span>
        </div>
        <p className="text-xs text-slate-500 font-sans mt-1">
          Comparing the natural sum to the bounding rectangle area of two paired triangles.
        </p>
      </div>

      {/* Interactive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
              <th className="py-2 px-2">n</th>
              <th className="py-2 px-2">Sum Expression</th>
              <th className="py-2 px-2">Rectangle (2T_n)</th>
              <th className="py-2 px-2 text-right">T_n</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tableRows.map(row => {
              const isSelected = row.n === n;
              return (
                <tr
                  key={row.n}
                  onClick={() => setN(row.n)}
                  className={`cursor-pointer transition-colors font-sans ${
                    isSelected
                      ? 'bg-sky-50/80 text-sky-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <td className="py-2.5 px-2 flex items-center gap-1.5">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                      isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {row.n}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 font-mono text-[11px]">{row.sum}</td>
                  <td className="py-2.5 px-2 font-mono text-[11px] text-amber-600">{row.rect}</td>
                  <td className="py-2.5 px-2 text-right font-mono font-bold text-sky-700">
                    {row.tn}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Gauss Prodigy Callout */}
      <div className="bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-200/70 rounded-2xl p-3.5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-xs space-y-1">
          <div className="font-extrabold text-sky-950 font-sans">
            Young Gauss's Discovery
          </div>
          <p className="text-slate-600 leading-relaxed font-sans text-[11px]">
            When asked to sum numbers from 1 to 100, 10-year-old Carl Friedrich Gauss visualized two identical triangles forming a <MathView math="100 \times 101 = 10{,}100" /> rectangle. Halving it gave <MathView math="5{,}050" /> in seconds!
          </p>
        </div>
      </div>
    </div>
  );
};