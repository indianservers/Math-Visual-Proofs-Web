import React from 'react';
import { Info } from 'lucide-react';
import { LP_PRESETS, LPPreset } from '../../data/lpData';
import { evaluateLPPreset } from '../../utils/lpMath';

interface Panel2Props {
  selectedPreset: LPPreset;
  onSelectPreset: (p: LPPreset) => void;
}

export const Panel2LPGuide: React.FC<Panel2Props> = ({
  selectedPreset,
  onSelectPreset,
}) => {
  const evalResult = evaluateLPPreset(selectedPreset, selectedPreset.defaultK);

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-violet-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            2
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Corner Vertices Evaluation Guide
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Vertex coordinates and corresponding objective function values Z.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-hidden rounded-2xl border border-violet-100/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-violet-50/50 text-[10px] font-bold text-slate-700 uppercase tracking-wider border-b border-violet-100/80">
              <th className="py-2 px-3">Vertex (X₁, X₂)</th>
              <th className="py-2 px-2 text-center">Active Bounds</th>
              <th className="py-2 px-2 text-center">Value Z</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-violet-50/80">
            {evalResult.vertices.map((v, idx) => {
              const isOpt = v.isOptimum;
              return (
                <tr
                  key={`v-row-${idx}`}
                  className={`transition-colors ${
                    isOpt
                      ? 'bg-violet-100/80 font-bold border-l-4 border-l-violet-600 text-violet-950'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <td className="py-2 px-3 font-mono">
                    ({v.x}, {v.y}) {isOpt && <span className="text-[10px] text-violet-700 font-bold ml-1">★ OPT</span>}
                  </td>
                  <td className="py-2 px-2 text-center font-mono text-[10px] text-slate-500">
                    {v.activeConstraints.join(' ∩ ')}
                  </td>
                  <td className="py-2 px-2 text-center font-mono text-[11px] font-bold text-slate-900">
                    {v.zValue}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Info Footnote */}
      <div className="flex items-start gap-2 text-violet-900 bg-violet-50/40 p-3 rounded-2xl border border-violet-100/60">
        <Info className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-tight">
          <strong className="text-violet-950">Fundamental LP Theorem:</strong> If a linear programming problem has an optimal solution on a bounded feasible region, at least one corner vertex attains the optimum value.
        </p>
      </div>
    </div>
  );
};
