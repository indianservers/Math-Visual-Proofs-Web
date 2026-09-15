import React from 'react';
import { FIB_NUMBERS } from '../../utils/fibonacciTilingMath';

interface Panel2Props {
  n: number;
  setN: (n: number | ((prev: number) => number)) => void;
}

export const Panel2FibonacciTilingGuide: React.FC<Panel2Props> = ({
  n,
  setN,
}) => {
  const steps = [
    { k: 1, fk: 1, formula: 'Base F1 = 1', area: 1, sumSq: 1, rectDim: '1 × 1', rectArea: 1 },
    { k: 2, fk: 1, formula: 'Base F2 = 1', area: 1, sumSq: 2, rectDim: '1 × 2', rectArea: 2 },
    { k: 3, fk: 2, formula: '1 + 1 = 2', area: 4, sumSq: 6, rectDim: '2 × 3', rectArea: 6 },
    { k: 4, fk: 3, formula: '1 + 2 = 3', area: 9, sumSq: 15, rectDim: '3 × 5', rectArea: 15 },
    { k: 5, fk: 5, formula: '2 + 3 = 5', area: 25, sumSq: 40, rectDim: '5 × 8', rectArea: 40 },
    { k: 6, fk: 8, formula: '3 + 5 = 8', area: 64, sumSq: 104, rectDim: '8 × 13', rectArea: 104 },
    { k: 7, fk: 13, formula: '5 + 8 = 13', area: 169, sumSq: 273, rectDim: '13 × 21', rectArea: 273 },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-emerald-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">
              2
            </span>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-sans">
              Fibonacci Tiling Ledger
            </h3>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            F_n = F_(n-1) + F_(n-2)
          </span>
        </div>
        <p className="text-xs text-slate-500 font-sans mt-1">
          Each new square wraps alongside the existing rectangle, forming an even bigger rectangle.
        </p>
      </div>

      {/* Interactive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
              <th className="py-2 px-2">Tile (k)</th>
              <th className="py-2 px-2">Side F_k</th>
              <th className="py-2 px-2">Side Sum Rule</th>
              <th className="py-2 px-2">Square F_k²</th>
              <th className="py-2 px-2">Total Area S F_k²</th>
              <th className="py-2 px-2 text-right">Bounding Box</th>
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
                      ? 'bg-emerald-50/90 text-emerald-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <td className="py-2.5 px-2 flex items-center gap-1.5">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {row.k}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 font-mono text-[11px] text-emerald-600 font-bold">
                    {row.fk}
                  </td>
                  <td className="py-2.5 px-2 font-mono text-[11px] text-slate-500">
                    {row.formula}
                  </td>
                  <td className="py-2.5 px-2 font-mono text-[11px] text-teal-600 font-semibold">
                    {row.area}
                  </td>
                  <td className="py-2.5 px-2 font-mono text-[11px] text-emerald-700 font-bold">
                    {row.sumSq}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-[11px] font-bold text-slate-800">
                    {row.rectDim} = {row.rectArea}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer key insight */}
      <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3 text-xs text-emerald-900 space-y-1">
        <span className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wide text-emerald-800">
          Geometric Perfection:
        </span>
        <p className="text-slate-600">
          Because the new square's side matches the entire adjacent long side of the previous rectangle, they fit together seamlessly with zero gaps and zero overlaps.
        </p>
      </div>
    </div>
  );
};
