import React from 'react';
import { Info } from 'lucide-react';
import { SHM_PRESETS, SHMPreset } from '../../data/shmData';
import { MathView } from '../common/MathView';

interface Panel2Props {
  amplitude: number;
  omega: number;
  phase: number;
  onApplyPreset: (p: SHMPreset) => void;
}

export const Panel2SHMGuide: React.FC<Panel2Props> = ({
  amplitude,
  omega,
  phase,
  onApplyPreset,
}) => {
  const period = ((2 * Math.PI) / omega).toFixed(2);
  const vMax = (omega * amplitude).toFixed(2);
  const aMax = (omega * omega * amplitude).toFixed(2);

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-amber-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            2
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            SHM Kinematics Guide
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Relationships between amplitude, frequency, period, and peak kinematics.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-hidden rounded-2xl border border-amber-100/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-amber-50/50 text-[10px] font-bold text-slate-700 uppercase tracking-wider border-b border-amber-100/80">
              <th className="py-2 px-3">Parameter</th>
              <th className="py-2 px-2 text-center">Formula</th>
              <th className="py-2 px-2 text-center">Live Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-50/80 font-mono">
            <tr>
              <td className="py-2 px-3 font-sans font-semibold text-slate-800">Period T</td>
              <td className="py-2 px-2 text-center text-slate-600">2π / ω</td>
              <td className="py-2 px-2 text-center font-bold text-indigo-700">{period} s</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-sans font-semibold text-slate-800">Max Velocity v_max</td>
              <td className="py-2 px-2 text-center text-slate-600">ω · A</td>
              <td className="py-2 px-2 text-center font-bold text-emerald-700">{vMax} m/s</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-sans font-semibold text-slate-800">Max Accel a_max</td>
              <td className="py-2 px-2 text-center text-slate-600">ω² · A</td>
              <td className="py-2 px-2 text-center font-bold text-rose-700">{aMax} m/s²</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-sans font-semibold text-slate-800">Total Energy E</td>
              <td className="py-2 px-2 text-center text-slate-600">½ k A²</td>
              <td className="py-2 px-2 text-center font-bold text-amber-800">{(0.5 * omega * omega * amplitude * amplitude).toFixed(2)} J</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Info Footnote */}
      <div className="flex items-start gap-2 text-amber-900 bg-amber-50/40 p-3 rounded-2xl border border-amber-100/60">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-tight">
          <strong className="text-amber-950">Phase Shift φ:</strong> Shifts the cosine wave horizontally by <MathView math="\Delta t = -\phi / \omega" />. When <MathView math="\phi = -\pi/2" />, <MathView math="x(t) = A\sin(\omega t)" />.
        </p>
      </div>
    </div>
  );
};
