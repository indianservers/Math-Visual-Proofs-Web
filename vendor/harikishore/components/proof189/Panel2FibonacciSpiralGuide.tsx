import React from 'react';
import { GOLDEN_RATIO } from '../../data/fibonacciSpiralData';
import { MathView } from '../common/MathView';

interface Panel2Props {
  n: number;
  setN: (n: number | ((prev: number) => number)) => void;
}

export const Panel2FibonacciSpiralGuide: React.FC<Panel2Props> = ({
  n,
  setN,
}) => {
  const steps = [
    { k: 1, fk: 1, fkPlus1: 1, frac: '1 / 1', dec: '1.0000', dir: 'Undershoot', err: '0.6180' },
    { k: 2, fk: 1, fkPlus1: 2, frac: '2 / 1', dec: '2.0000', dir: 'Overshoot', err: '0.3820' },
    { k: 3, fk: 2, fkPlus1: 3, frac: '3 / 2', dec: '1.5000', dir: 'Undershoot', err: '0.1180' },
    { k: 4, fk: 3, fkPlus1: 5, frac: '5 / 3', dec: '1.6667', dir: 'Overshoot', err: '0.0486' },
    { k: 5, fk: 5, fkPlus1: 8, frac: '8 / 5', dec: '1.6000', dir: 'Undershoot', err: '0.0180' },
    { k: 6, fk: 8, fkPlus1: 13, frac: '13 / 8', dec: '1.6250', dir: 'Overshoot', err: '0.0070' },
    { k: 7, fk: 13, fkPlus1: 21, frac: '21 / 13', dec: '1.6154', dir: 'Undershoot', err: '0.0026' },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-amber-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-black">
              2
            </span>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-sans">
              Golden Ratio Convergence Ledger
            </h3>
          </div>
          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            f  1.618034
          </span>
        </div>
        <p className="text-xs text-slate-500 font-sans mt-1">
          The ratios oscillate above and below <MathView math="\phi" />, narrowing in with exponential speed.
        </p>
      </div>

      {/* Interactive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
              <th className="py-2 px-2">Arc (k)</th>
              <th className="py-2 px-2">F_(k+1) / F_k</th>
              <th className="py-2 px-2">Value</th>
              <th className="py-2 px-2">Oscillation</th>
              <th className="py-2 px-2 text-right">Error |r - f|</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {steps.map(row => {
              const isSelected = row.k === n;
              return (
                <tr
                  key={row.k}
                  onClick={() => setN(row.k)}
                  className={`cursor-pointer transition-colors font-sans ${
                    isSelected
                      ? 'bg-amber-50/90 text-amber-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <td className="py-2.5 px-2 flex items-center gap-1.5">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                        isSelected ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {row.k}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 font-mono text-[11px] text-amber-700 font-bold">
                    {row.frac}
                  </td>
                  <td className="py-2.5 px-2 font-mono text-[11px] text-slate-800 font-semibold">
                    {row.dec}
                  </td>
                  <td className="py-2.5 px-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        row.dir === 'Overshoot'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {row.dir}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-[11px] font-bold text-amber-800">
                    {row.err}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer key insight */}
      <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-3 text-xs text-amber-900 space-y-1">
        <span className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wide text-amber-800">
          Continuous Tangent Smoothness:
        </span>
        <p className="text-slate-600">
          At every transition between squares, the two connected quarter-circle arcs share the exact same tangent direction, creating an unbroken smooth curve without sharp corners.
        </p>
      </div>
    </div>
  );
};
