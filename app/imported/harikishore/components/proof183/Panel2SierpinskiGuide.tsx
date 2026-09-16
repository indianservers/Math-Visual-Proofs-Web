import React from 'react';
import { Info, Layers, TrendingDown, Infinity as InfinityIcon } from 'lucide-react';
import { SierpinskiPreset } from '../../data/sierpinskiData';
import { computeSierpinski } from '../../utils/sierpinskiMath';
import { MathView } from '../common/MathView';

interface Panel2Props {
  selectedPreset: SierpinskiPreset;
  onSelectPreset: (p: SierpinskiPreset) => void;
  level: number;
  setLevel: (l: number) => void;
}

export const Panel2SierpinskiGuide: React.FC<Panel2Props> = ({
  level,
  setLevel,
}) => {
  const tableRows = [
    { n: 0, count: '1', single: '1', frac: '1 / 1', pct: 100.0 },
    { n: 1, count: '8', single: '1 / 9', frac: '8 / 9', pct: 88.9 },
    { n: 2, count: '64', single: '1 / 81', frac: '64 / 81', pct: 79.0 },
    { n: 3, count: '512', single: '1 / 729', frac: '512 / 729', pct: 70.2 },
    { n: 4, count: '4,096', single: '1 / 6,561', frac: '4096 / 6561', pct: 62.4 },
  ];

  const currentEval = computeSierpinski(level);

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-indigo-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black">
              2
            </span>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-sans">
              Iteration Ledger & Area Decay
            </h3>
          </div>
          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
            Ratio = 8/9
          </span>
        </div>
        <p className="text-xs text-slate-500 font-sans mt-1">
          Tracking remaining squares and cumulative retained area at each recursive subdivision level.
        </p>
      </div>

      {/* Progress visualizer */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2">
        <div className="flex justify-between text-xs font-bold text-slate-700">
          <span>Area Retained vs Punched Out</span>
          <span className="text-indigo-600">{currentEval.retainedAreaPercent}</span>
        </div>
        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
            style={{ width: currentEval.retainedAreaPercent }}
          />
          <div
            className="h-full bg-rose-300 transition-all duration-500"
            style={{ width: currentEval.removedAreaPercent }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
          <span>Solid: {currentEval.retainedAreaPercent}</span>
          <span>Void: {currentEval.removedAreaPercent}</span>
        </div>
      </div>

      {/* Iteration Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
              <th className="py-2 px-2">Level (n)</th>
              <th className="py-2 px-2">Squares (8ⁿ)</th>
              <th className="py-2 px-2">Total Retained</th>
              <th className="py-2 px-2 text-right">Area %</th>
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
                      ? 'bg-indigo-50/80 text-indigo-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <td className="py-2.5 px-2 flex items-center gap-1.5">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {row.n}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 font-mono text-[11px]">{row.count}</td>
                  <td className="py-2.5 px-2 font-mono text-[11px]">{row.frac}</td>
                  <td className="py-2.5 px-2 text-right font-mono font-bold">
                    {row.pct.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Asymptotic Limit Callout */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200/70 rounded-2xl p-3.5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <InfinityIcon className="w-4 h-4" />
        </div>
        <div className="text-xs space-y-1">
          <div className="font-extrabold text-indigo-950 font-sans">
            Infinite Limit (As n → ∞)
          </div>
          <p className="text-slate-600 leading-relaxed font-sans text-[11px]">
            Since <MathView math="0 < \frac{8}{9} < 1" />, repeated multiplication makes the remaining area strictly converge to zero:
          </p>
          <div className="pt-1 text-center font-bold text-indigo-700 bg-white/70 py-1 rounded-lg border border-indigo-100">
            <MathView math="\lim_{n \to \infty} \left(\frac{8}{9}\right)^n = 0" />
          </div>
        </div>
      </div>
    </div>
  );
};