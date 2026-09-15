import React from 'react';
import { Info } from 'lucide-react';
import { LAPLACE_PRESETS, LaplacePreset } from '../../data/laplaceData';
import { MathView } from '../common/MathView';

interface Panel2Props {
  selectedPreset: LaplacePreset;
  onSelectPreset: (p: LaplacePreset) => void;
}

export const Panel2LaplaceGuide: React.FC<Panel2Props> = ({
  selectedPreset,
  onSelectPreset,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-cyan-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            2
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Laplace Transform Pairs Guide
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Standard time functions, s-domain expressions, and ROC boundaries.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-hidden rounded-2xl border border-cyan-100/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-cyan-50/50 text-[10px] font-bold text-slate-700 uppercase tracking-wider border-b border-cyan-100/80">
              <th className="py-2 px-3">Time f(t)</th>
              <th className="py-2 px-2 text-center">Laplace F(s)</th>
              <th className="py-2 px-2 text-center">Poles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-50/80">
            {LAPLACE_PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <tr
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-cyan-50/80 font-bold border-l-4 border-l-cyan-600 text-cyan-950'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <td className="py-2 px-3">
                    <MathView math={preset.latexTime} className="text-[11px] font-semibold text-cyan-900" />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <MathView math={preset.latexLaplace} className="text-[11px] font-mono text-slate-700" />
                  </td>
                  <td className="py-2 px-2 text-center text-[10px] font-bold text-rose-700 font-mono">
                    {preset.id === 'exp_decay' ? 's = -a' : preset.id === 'unit_step' ? 's = 0' : preset.id === 'damped_oscillation' ? 's = -a ± jω₀' : 's = -a (2nd)'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Info Footnote */}
      <div className="flex items-start gap-2 text-cyan-900 bg-cyan-50/40 p-3 rounded-2xl border border-cyan-100/60">
        <Info className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-tight">
          <strong className="text-cyan-950">BIBO Stability Criterion:</strong> A continuous-time LTI system is bounded-input bounded-output stable if and only if all transfer function poles lie strictly in the open Left-Half s-Plane (<MathView math="\text{Re}(s) < 0" />).
        </p>
      </div>
    </div>
  );
};
