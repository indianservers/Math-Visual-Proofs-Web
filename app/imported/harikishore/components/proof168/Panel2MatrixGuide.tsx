import React from 'react';
import { Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { MATRIX_PRESETS, MatrixPreset } from '../../data/matricesData';
import { Matrix2x2, computeMatrixInverse } from '../../utils/matricesMath';
import { MathView } from '../common/MathView';
import { sound } from '../../utils/sound';

interface Panel2Props {
  currentMatrix: Matrix2x2;
  onApplyMatrix: (preset: MatrixPreset) => void;
}

export const Panel2MatrixGuide: React.FC<Panel2Props> = ({
  currentMatrix,
  onApplyMatrix,
}) => {
  const currentInv = computeMatrixInverse(currentMatrix);

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-blue-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            2
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Matrix & Inverse Dictionary
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Standard 2D linear transformation matrices and their inverse partners.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-blue-100/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-blue-50/50 text-[10px] font-bold text-slate-700 uppercase tracking-wider border-b border-blue-100/80">
              <th className="py-2 px-3">Type</th>
              <th className="py-2 px-2 text-center">Matrix Form</th>
              <th className="py-2 px-2 text-center">det</th>
              <th className="py-2 px-2 text-center">Inverse M⁻¹</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50/80">
            {MATRIX_PRESETS.slice(0, 8).map((preset) => {
              const pMat: Matrix2x2 = {
                a: preset.matrix[0],
                c: preset.matrix[1],
                b: preset.matrix[2],
                d: preset.matrix[3],
              };
              const pInv = computeMatrixInverse(pMat);

              return (
                <tr
                  key={preset.id}
                  onClick={() => {
                    sound.playClick();
                    onApplyMatrix(preset);
                  }}
                  className="cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <td className="py-2 px-3 font-semibold text-slate-800">
                    {preset.name.split(' (')[0]}
                  </td>
                  <td className="py-2 px-2 text-center font-mono text-[11px] text-blue-950 font-bold">
                    [{preset.matrix[0]}, {preset.matrix[1]}; {preset.matrix[2]}, {preset.matrix[3]}]
                  </td>
                  <td className="py-2 px-2 text-center font-mono font-bold text-slate-700">
                    {preset.det}
                  </td>
                  <td className="py-2 px-2 text-center font-mono text-[10px]">
                    {pInv.isInvertible && pInv.inverse ? (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        [{pInv.inverse.a}, {pInv.inverse.c}; {pInv.inverse.b}, {pInv.inverse.d}]
                      </span>
                    ) : (
                      <span className="text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                        No Inverse (det=0)
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Item 66: Why Determinant Zero Cannot Be Inverted */}
      <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/80 space-y-1.5 text-xs text-slate-700">
        <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs uppercase tracking-wide">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Why is det = 0 Non-Invertible?</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          When <MathView math="\det(M) = 0" />, the entire 2D plane collapses onto a single line or point. Different input points squash into the exact same location. Since you cannot uniquely trace which point came from where, the operation <strong>cannot be reversed</strong>.
        </p>
      </div>

      {/* Info Footnote */}
      <div className="flex items-start gap-2 text-blue-900 bg-blue-50/40 p-3 rounded-2xl border border-blue-100/60">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-tight">
          <strong className="text-blue-950">Identity Invariance:</strong> An invertible matrix satisfies <MathView math="M \cdot M^{-1} = M^{-1} \cdot M = I" />.
        </p>
      </div>
    </div>
  );
};
