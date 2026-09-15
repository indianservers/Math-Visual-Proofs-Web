import React from 'react';
import { Info } from 'lucide-react';
import { ODE_PRESETS, ODEPreset } from '../../data/slopeFieldData';
import { MathView } from '../common/MathView';

interface Panel2Props {
  selectedODE: ODEPreset;
  onSelectODE: (ode: ODEPreset) => void;
}

export const Panel2SlopeFieldGuide: React.FC<Panel2Props> = ({
  selectedODE,
  onSelectODE,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-sky-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            2
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Slope Field Guide
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          First-order ODE models and asymptotic behavior.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-sky-100/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-sky-50/50 text-[10px] font-bold text-slate-700 uppercase tracking-wider border-b border-sky-100/80">
              <th className="py-2 px-3">ODE dy/dx</th>
              <th className="py-2 px-2 text-center">Solution Family y(x)</th>
              <th className="py-2 px-2 text-center">Equilibrium / Limit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-50/80">
            {ODE_PRESETS.map((preset) => {
              const isSelected = selectedODE.id === preset.id;
              return (
                <tr
                  key={preset.id}
                  onClick={() => onSelectODE(preset)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-sky-50/80 font-bold border-l-4 border-l-sky-600 text-sky-950'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <td className="py-2 px-3">
                    <MathView math={preset.latexODE} className="text-[11px] font-semibold text-sky-900" />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span className="text-[10px] font-mono text-slate-600">
                      {preset.name}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center text-[10px] font-medium text-slate-500">
                    {preset.equilibriumPoints}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Info Footnote */}
      <div className="flex items-start gap-2 text-sky-900 bg-sky-50/40 p-3 rounded-2xl border border-sky-100/60">
        <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-tight">
          <strong className="text-sky-950">Isoclines:</strong> Curves along which all slope segments have identical slope <MathView math="f(x, y) = c" />. For <MathView math="\frac{dy}{dx} = x - y" />, the isoclines are straight parallel lines <MathView math="y = x - c" />.
        </p>
      </div>
    </div>
  );
};
