import React from 'react';
import { Info } from 'lucide-react';
import { GRADIENT_PRESETS, GradientFieldPreset } from '../../data/gradientData';
import { MathView } from '../common/MathView';

interface Panel2Props {
  selectedPreset: GradientFieldPreset;
  onSelectPreset: (p: GradientFieldPreset) => void;
}

export const Panel2GradientGuide: React.FC<Panel2Props> = ({
  selectedPreset,
  onSelectPreset,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-emerald-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            2
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Gradient & Field Guide
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Multivariable surfaces, gradient formulas, and contour geometries.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-hidden rounded-2xl border border-emerald-100/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-emerald-50/50 text-[10px] font-bold text-slate-700 uppercase tracking-wider border-b border-emerald-100/80">
              <th className="py-2 px-3">Surface f(x, y)</th>
              <th className="py-2 px-2 text-center">Gradient ∇f</th>
              <th className="py-2 px-2 text-center">Contour Geometry</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50/80">
            {GRADIENT_PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <tr
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-50/80 font-bold border-l-4 border-l-emerald-600 text-emerald-950'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <td className="py-2 px-3 font-semibold text-slate-800">
                    <MathView math={preset.latexField} className="text-[11px] font-semibold text-emerald-900" />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <MathView math={preset.latexGradient} className="text-[10px] font-mono text-slate-700" />
                  </td>
                  <td className="py-2 px-2 text-center text-[10px] font-medium text-slate-500">
                    {preset.id === 'paraboloid' ? 'Concentric Circles' : preset.id === 'saddle' ? 'Hyperbolas' : preset.id === 'gaussian' ? 'Circular Bell' : 'Ellipses'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Info Footnote */}
      <div className="flex items-start gap-2 text-emerald-900 bg-emerald-50/40 p-3 rounded-2xl border border-emerald-100/60">
        <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-tight">
          <strong className="text-emerald-950">Direction of Zero Change:</strong> Moving along the contour tangent vector <MathView math="\vec{T}" /> produces <MathView math="D_{\vec{T}} f = \nabla f \cdot \vec{T} = 0" />, meaning height remains perfectly constant.
        </p>
      </div>
    </div>
  );
};
