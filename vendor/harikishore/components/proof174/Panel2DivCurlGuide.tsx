import React from 'react';
import { Info } from 'lucide-react';
import { DIV_CURL_PRESETS, DivCurlPreset } from '../../data/divCurlData';
import { MathView } from '../common/MathView';

interface Panel2Props {
  selectedPreset: DivCurlPreset;
  onSelectPreset: (p: DivCurlPreset) => void;
}

export const Panel2DivCurlGuide: React.FC<Panel2Props> = ({
  selectedPreset,
  onSelectPreset,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-pink-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            2
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Vector Fields & Operator Guide
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Comparison of source/sink divergence and local curl circulation.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-hidden rounded-2xl border border-pink-100/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-pink-50/50 text-[10px] font-bold text-slate-700 uppercase tracking-wider border-b border-pink-100/80">
              <th className="py-2 px-3">Field F(x,y)</th>
              <th className="py-2 px-2 text-center">Div ∇·F</th>
              <th className="py-2 px-2 text-center">Curl (∇×F)z</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pink-50/80">
            {DIV_CURL_PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              const divVal = preset.div(0, 0);
              const curlVal = preset.curl(0, 0);
              return (
                <tr
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-pink-50/80 font-bold border-l-4 border-l-pink-600 text-pink-950'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <td className="py-2 px-3 font-semibold text-slate-800">
                    <MathView math={preset.latexField} className="text-[11px] font-semibold text-pink-900" />
                  </td>
                  <td className="py-2 px-2 text-center font-mono text-[11px]">
                    <span className={divVal > 0 ? 'text-cyan-700 font-bold' : divVal < 0 ? 'text-rose-700 font-bold' : 'text-slate-600'}>
                      {divVal > 0 ? `+${divVal}` : divVal}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center font-mono text-[11px]">
                    <span className={curlVal !== 0 ? 'text-amber-700 font-bold' : 'text-slate-600'}>
                      {curlVal > 0 ? `+${curlVal}` : curlVal}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Info Footnote */}
      <div className="flex items-start gap-2 text-pink-900 bg-pink-50/40 p-3 rounded-2xl border border-pink-100/60">
        <Info className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-tight">
          <strong className="text-pink-950">Microscopic vs Macroscopic:</strong> Integrating local point divergence over an area gives the total boundary flux (<MathView math="\iint_R (\nabla \cdot \vec{F}) \, dA = \oint_C \vec{F} \cdot \hat{n} \, ds" />).
        </p>
      </div>
    </div>
  );
};
