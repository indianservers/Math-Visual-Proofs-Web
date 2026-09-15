import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { MathView } from '../common/MathView';

export const Panel3MatrixProof: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-blue-100/80 shadow-sm flex flex-col justify-between space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            3
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Formal Proofs: Determinant Area & The Inverse Identity
          </h2>
        </div>
      </div>

      {/* Proof Part 1: Determinant as Area Scaling Factor */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span>Part A: Determinant as Area Scaling Factor</span>
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: 3 Pedagogical Steps */}
          <div className="lg:col-span-5 space-y-2 text-xs text-slate-600 font-medium">
            <p className="leading-relaxed flex items-start gap-1.5">
              <span className="text-blue-600 font-bold">•</span>
              <span>The original unit square has Area = <MathView math="1 \times 1 = 1" />.</span>
            </p>
            <p className="leading-relaxed flex items-start gap-1.5">
              <span className="text-blue-600 font-bold">•</span>
              <span>Under <MathView math="M" />, it transforms into a parallelogram spanned by <MathView math="\hat{i}' = (a, b)" /> and <MathView math="\hat{j}' = (c, d)" />.</span>
            </p>
            <p className="leading-relaxed flex items-start gap-1.5">
              <span className="text-blue-600 font-bold">•</span>
              <span>Dissecting the surrounding bounding box <MathView math="(a+c)(b+d)" /> reveals: <MathView math="\text{Area} = ad - bc = \det(M)" />.</span>
            </p>
          </div>

          {/* Right Column: Geometric Box Dissection Visual */}
          <div className="lg:col-span-7 flex items-center justify-center">
            <div className="bg-blue-50/40 p-3 rounded-2xl border border-blue-100 flex items-center gap-6">
              <svg className="w-40 h-32" viewBox="0 0 160 120">
                {/* Bounding Box */}
                <rect x="20" y="20" width="120" height="80" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />

                {/* Parallelogram in center */}
                <polygon
                  points="20,80 100,100 140,40 60,20"
                  fill="rgba(59, 130, 246, 0.3)"
                  stroke="#2563eb"
                  strokeWidth="2"
                />

                {/* 4 Corner Dissection Triangles */}
                <polygon points="20,80 100,100 20,100" fill="rgba(244, 63, 94, 0.15)" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" />
                <polygon points="100,100 140,40 140,100" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                <polygon points="140,40 60,20 140,20" fill="rgba(244, 63, 94, 0.15)" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" />
                <polygon points="60,20 20,80 20,20" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />

                {/* Labels */}
                <text x="75" y="65" fill="#1e3a8a" fontSize="11" fontWeight="bold" textAnchor="middle">
                  ad - bc
                </text>
              </svg>

              <div className="text-[11px] font-mono text-slate-700 space-y-1">
                <div><strong className="text-blue-900">Total Box:</strong> (a+c)(b+d)</div>
                <div><strong className="text-rose-600">- Triangles:</strong> 2(½ab) + 2(½cd)</div>
                <div><strong className="text-amber-600">- Rectangles:</strong> 2(bc)</div>
                <div className="pt-1 border-t border-blue-200 font-bold text-blue-700">= ad - bc</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Item 172: Proof Part 2: Why M · M⁻¹ = Identity Matrix I */}
      <div className="pt-3 border-t border-slate-100 space-y-2.5">
        <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wide flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Part B: Why Does M · M⁻¹ Produce the Identity Matrix I?</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          {/* Geometric Perspective */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5">
            <span className="font-extrabold text-slate-800 block text-[11px] uppercase tracking-wide">
              1. The Geometric Perspective
            </span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              If matrix <MathView math="M" /> maps a coordinate <MathView math="\vec{v} \to \vec{w}" />, its inverse <MathView math="M^{-1}" /> is defined as the reverse map <MathView math="\vec{w} \to \vec{v}" />. 
              Applying both transformations consecutively returns the vector directly to its starting location:
            </p>
            <div className="bg-white p-2 rounded-xl border border-slate-200 text-center font-mono font-bold text-indigo-900 text-xs shadow-2xs">
              <MathView math="M^{-1}(M \vec{v}) = \vec{v} = I \vec{v}" />
            </div>
            <p className="text-[10px] text-slate-500">
              The only matrix that leaves every vector completely unchanged is the <strong>Identity Matrix <MathView math="I" /></strong>.
            </p>
          </div>

          {/* Algebraic Multiplication Step-by-Step */}
          <div className="bg-indigo-50/50 p-3.5 rounded-2xl border border-indigo-100 space-y-1.5">
            <span className="font-extrabold text-indigo-950 block text-[11px] uppercase tracking-wide">
              2. The Algebraic Matrix Multiplication
            </span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Multiplying <MathView math="M" /> by the scaled adjugate matrix:
            </p>
            <div className="bg-white p-2 rounded-xl border border-indigo-100 text-center font-mono font-bold text-indigo-900 text-[11px] shadow-2xs overflow-x-auto">
              <MathView math="\begin{bmatrix} a & c \\ b & d \end{bmatrix} \begin{bmatrix} d & -c \\ -b & a \end{bmatrix} = \begin{bmatrix} ad - bc & -ac + ca \\ bd - db & -bc + da \end{bmatrix}" />
            </div>
            <p className="text-slate-600 text-[11px]">
              The off-diagonal terms cancel to <MathView math="0" />, and the diagonals equal <MathView math="\det(M) = ad - bc" />:
            </p>
            <div className="bg-white p-2 rounded-xl border border-emerald-200 text-center font-mono font-bold text-emerald-800 text-xs shadow-2xs">
              <MathView math="\frac{1}{\det(M)} \begin{bmatrix} \det(M) & 0 \\ 0 & \det(M) \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} = I \quad \blacksquare" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Therefore Banner */}
      <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100/90 flex items-center justify-center text-center">
        <p className="text-xs font-medium text-slate-800">
          <strong className="text-blue-800 font-extrabold mr-1.5 font-sans">Conclusion:</strong>
          Multiplying any invertible matrix by its inverse algebraically and geometrically restores the coordinate space to the <strong>Identity state</strong>.
        </p>
      </div>
    </div>
  );
};
