import React from 'react';
import { Info } from 'lucide-react';
import { FOURIER_PRESETS, FourierWavePreset } from '../../data/fourierData';
import { MathView } from '../common/MathView';

interface Panel2Props {
  selectedPreset: FourierWavePreset;
  onSelectPreset: (preset: FourierWavePreset) => void;
}

export const Panel2FourierGuide: React.FC<Panel2Props> = ({
  selectedPreset,
  onSelectPreset,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-violet-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            2
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Fourier Harmonics Guide
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Symmetry, harmonic contents, and decay rate comparison.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-hidden rounded-2xl border border-violet-100/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-violet-50/50 text-[10px] font-bold text-slate-700 uppercase tracking-wider border-b border-violet-100/80">
              <th className="py-2 px-3">Waveform</th>
              <th className="py-2 px-2 text-center">Harmonic Falloff</th>
              <th className="py-2 px-2 text-center">Continuity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-violet-50/80">
            {FOURIER_PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <tr
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-violet-50/80 font-bold border-l-4 border-l-violet-600 text-violet-950'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <td className="py-2 px-3 font-semibold text-slate-800">
                    {preset.name}
                  </td>
                  <td className="py-2 px-2 text-center text-[10px] font-mono text-slate-600">
                    {preset.decayRate.split('-')[0]}
                  </td>
                  <td className="py-2 px-2 text-center text-[10px] font-medium text-slate-500">
                    {preset.id === 'triangle' || preset.id === 'rectified' ? 'Continuous (No Gibbs)' : 'Discontinuous (Gibbs)'}
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
          <strong className="text-violet-950">Gibbs Phenomenon:</strong> At any jump discontinuity, the Fourier series always overshoots the jump by approximately <MathView math="8.949\%" /> of the jump size, regardless of how large <MathView math="N" /> becomes!
        </p>
      </div>
    </div>
  );
};
