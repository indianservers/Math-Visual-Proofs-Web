import React from 'react';
import { Info, Sparkles, HelpCircle } from 'lucide-react';
import { SquareOddLayerPreset } from '../../data/squareOddLayersData';
import { computeSquareOddLayers } from '../../utils/squareOddLayersMath';
import { MathView } from '../common/MathView';

interface Panel2Props {
  selectedPreset: SquareOddLayerPreset;
  onSelectPreset: (p: SquareOddLayerPreset) => void;
  n: number;
  setN: (n: number) => void;
}

export const Panel2SquareOddLayersGuide: React.FC<Panel2Props> = ({
  n,
  setN,
}) => {
  const tableRows = [
    { k: 1, odd: 1, prev: '0² = 0', next: '1² = 1', diff: '1 - 0 = 1' },
    { k: 2, odd: 3, prev: '1² = 1', next: '2² = 4', diff: '4 - 1 = 3' },
    { k: 3, odd: 5, prev: '2² = 4', next: '3² = 9', diff: '9 - 4 = 5' },
    { k: 4, odd: 7, prev: '3² = 9', next: '4² = 16', diff: '16 - 9 = 7' },
    { k: 5, odd: 9, prev: '4² = 16', next: '5² = 25', diff: '25 - 16 = 9' },
    { k: 6, odd: 11, prev: '5² = 25', next: '6² = 36', diff: '36 - 25 = 11' },
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
              Odd Layer Growth Ledger
            </h3>
          </div>
          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            2n - 1 Odd Step
          </span>
        </div>
        <p className="text-xs text-slate-500 font-sans mt-1">
          Each step wraps around the previous square, adding an odd number equal to the area difference.
        </p>
      </div>

      {/* Interactive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
              <th className="py-2 px-2">Layer (k)</th>
              <th className="py-2 px-2">Odd (2k-1)</th>
              <th className="py-2 px-2">Area Step (k² - (k-1)²)</th>
              <th className="py-2 px-2 text-right">Square k²</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tableRows.map(row => {
              const isSelected = row.k === n;
              return (
                <tr
                  key={row.k}
                  onClick={() => setN(row.k)}
                  className={`cursor-pointer transition-colors font-sans ${
                    isSelected
                      ? 'bg-amber-50/80 text-amber-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <td className="py-2.5 px-2 flex items-center gap-1.5">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                      isSelected ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {row.k}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 font-mono text-[11px] text-amber-600 font-bold">+{row.odd}</td>
                  <td className="py-2.5 px-2 font-mono text-[11px]">{row.diff}</td>
                  <td className="py-2.5 px-2 text-right font-mono font-bold text-amber-900">
                    {row.k * row.k}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Gnomon Structure Callout */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/70 rounded-2xl p-3.5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-xs space-y-1">
          <div className="font-extrabold text-amber-950 font-sans">
            The Gnomon Formula: 1 + 2(n - 1)
          </div>
          <p className="text-slate-600 leading-relaxed font-sans text-[11px]">
            Every L-shaped layer consists of 1 corner pivot tile plus two symmetric arms of length <MathView math="n - 1" />.
            Adding them together:
          </p>
          <div className="pt-1 text-center font-bold text-amber-900 bg-white/80 py-1.5 rounded-lg border border-amber-200">
            <MathView math="1 + (n - 1) + (n - 1) = 2n - 1" />
          </div>
        </div>
      </div>
    </div>
  );
};