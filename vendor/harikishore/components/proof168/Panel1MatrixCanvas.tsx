import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  RotateCcw,
  Play,
  Pause,
  Layers, 
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  Info,
  HelpCircle,
  Undo2
} from 'lucide-react';
import { MATRIX_PRESETS, MatrixPreset } from '../../data/matricesData';
import { 
  Matrix2x2, 
  IDENTITY_MATRIX,
  transformPoint, 
  getDeterminant, 
  computeMatrixInverse,
  interpolateMatrix,
  generateTransformedGridLines 
} from '../../utils/matricesMath';
import { MathView } from '../common/MathView';
import { sound } from '../../utils/sound';

interface Panel1Props {
  matrix: Matrix2x2;
  setMatrix: React.Dispatch<React.SetStateAction<Matrix2x2>>;
  showOriginalGrid: boolean;
  showTransformedGrid: boolean;
  showBasisVectors: boolean;
  showArea: boolean;
  snapEnabled: boolean;
  isCustomMatrix: boolean;
  setIsCustomMatrix: (val: boolean) => void;
  showDerivationShapes: boolean;
  setShowDerivationShapes: (val: boolean) => void;
}

export const Panel1MatrixCanvas: React.FC<Panel1Props> = ({
  matrix,
  setMatrix,
  showOriginalGrid,
  showTransformedGrid,
  showBasisVectors,
  showArea,
  snapEnabled,
  isCustomMatrix,
  setIsCustomMatrix,
  showDerivationShapes,
  setShowDerivationShapes,
}) => {
  const [activePreset, setActivePreset] = useState<string>('identity');
  const [draggingHandle, setDraggingHandle] = useState<'i' | 'j' | 'shape' | null>(null);
  const [draggingShape, setDraggingShape] = useState<number | null>(null);
  const canvasRef = useRef<SVGSVGElement | null>(null);

  // 3 Stages: 1 = Original (Identity), 2 = Transformed (M), 3 = Restored (M^-1 applied)
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [animProgress, setAnimProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [animSpeed, setAnimSpeed] = useState<0.5 | 1 | 1.5>(0.5); // 0.5x slow for kids
  const [inputError, setInputError] = useState<string | null>(null);
  const [showWhatIsInverse, setShowWhatIsInverse] = useState<boolean>(true);

  // Derivation shapes positions
  const [derivationShapes, setDerivationShapes] = useState([
    { id: 1, x: 0.5, y: 0.5, originalX: 0.5, originalY: 0.5, color: '#f59e0b', label: '🐱 Cat' },
    { id: 2, x: 1.0, y: 1.0, originalX: 1.0, originalY: 1.0, color: '#10b981', label: '⭐ Star' },
  ]);

  const invDetails = computeMatrixInverse(matrix);
  const det = invDetails.det;
  const isSingular = !invDetails.isInvertible;

  // Active matrix being rendered based on stage and interpolation
  const currentRenderMatrix: Matrix2x2 = (() => {
    if (stage === 1) return IDENTITY_MATRIX;
    if (stage === 2) {
      if (animProgress < 1) return interpolateMatrix(IDENTITY_MATRIX, matrix, animProgress);
      return matrix;
    }
    // stage === 3: returning to identity
    if (animProgress < 1) return interpolateMatrix(matrix, IDENTITY_MATRIX, animProgress);
    return IDENTITY_MATRIX;
  })();

  // Automatic Smooth Play Loop
  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();

    if (isPlaying) {
      const duration = 2500 / animSpeed;
      const tick = (now: number) => {
        const delta = now - lastTime;
        lastTime = now;

        setAnimProgress((prev) => {
          const next = prev + delta / duration;
          if (next >= 1) {
            setStage((curr) => {
              if (curr === 1) return 2;
              if (curr === 2) {
                if (isSingular) {
                  setIsPlaying(false);
                  return 2;
                }
                return 3;
              }
              return 1;
            });
            return 0;
          }
          return next;
        });

        animFrame = requestAnimationFrame(tick);
      };
      animFrame = requestAnimationFrame(tick);
    }

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [isPlaying, animSpeed, isSingular]);
  const scale = 36; // 36 px per coordinate unit
  const cx = 140;
  const cy = 120;

  // Screen coordinates for origin and basis vectors using current animated matrix
  const iScreen = { x: cx + currentRenderMatrix.a * scale, y: cy - currentRenderMatrix.b * scale };
  const jScreen = { x: cx + currentRenderMatrix.c * scale, y: cy - currentRenderMatrix.d * scale };
  const sumScreen = { 
    x: cx + (currentRenderMatrix.a + currentRenderMatrix.c) * scale, 
    y: cy - (currentRenderMatrix.b + currentRenderMatrix.d) * scale 
  };

  // Parallelogram path
  const parallelogramPath = `M ${cx},${cy} L ${iScreen.x.toFixed(1)},${iScreen.y.toFixed(1)} L ${sumScreen.x.toFixed(1)},${sumScreen.y.toFixed(1)} L ${jScreen.x.toFixed(1)},${jScreen.y.toFixed(1)} Z`;

  // Transformed grid lines
  const { xLines, yLines } = generateTransformedGridLines(currentRenderMatrix, 3, scale, cx, cy);

  const handleApplyPreset = (preset: MatrixPreset) => {
    sound.playClick();
    setActivePreset(preset.id);
    setInputError(null);
    setMatrix({
      a: preset.matrix[0],
      c: preset.matrix[1],
      b: preset.matrix[2],
      d: preset.matrix[3],
    });
    setStage(2);
    setAnimProgress(1);
  };

  const handleMatrixInputChange = (field: keyof Matrix2x2, rawVal: string) => {
    if (rawVal.trim() === '') {
      setInputError('Please enter a number.');
      return;
    }
    const val = parseFloat(rawVal);
    if (isNaN(val)) {
      setInputError('Invalid numeric value.');
      return;
    }
    setInputError(null);
    setMatrix((prev) => ({ ...prev, [field]: val }));
    setActivePreset('custom');
    if (stage === 1) setStage(2);
    setAnimProgress(1);
  };

  const jumpToStage = (targetStage: 1 | 2 | 3) => {
    setIsPlaying(false);
    setStage(targetStage);
    setAnimProgress(1);
  };

  const handlePointerDown = (handle: 'i' | 'j' | 'shape', shapeId?: number, e?: React.PointerEvent) => {
    if (e) {
      e.stopPropagation();
      (e.target as Element).setPointerCapture(e.pointerId);
    }
    if (handle === 'shape' && shapeId !== undefined) {
      setDraggingShape(shapeId);
    }
    setDraggingHandle(handle);
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingHandle || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = 280 / rect.width;
    const scaleY = 240 / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    let mathX = (mouseX - cx) / scale;
    let mathY = (cy - mouseY) / scale;

    if (snapEnabled) {
      mathX = Math.round(mathX * 2) / 2; // snap to 0.5 increments
      mathY = Math.round(mathY * 2) / 2;
    } else {
      mathX = Math.round(mathX * 100) / 100;
      mathY = Math.round(mathY * 100) / 100;
    }

    if (draggingHandle === 'shape' && draggingShape !== null) {
      setDerivationShapes(prev => prev.map(shape => 
        shape.id === draggingShape ? { ...shape, x: mathX, y: mathY } : shape
      ));
    } else {
      setMatrix(prev => {
        if (draggingHandle === 'i') {
          return { ...prev, a: mathX, b: mathY };
        } else {
          return { ...prev, c: mathX, d: mathY };
        }
      });
      setActivePreset('custom');
      setStage(2);
      setAnimProgress(1);
    }
  }, [draggingHandle, draggingShape, snapEnabled, setMatrix, cx, cy, scale]);

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingHandle) {
      setDraggingHandle(null);
      setDraggingShape(null);
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-blue-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
              1
            </span>
            <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
              Transformation & Inverse Studio
            </h2>
          </div>
          <button
            onClick={() => setShowWhatIsInverse(!showWhatIsInverse)}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showWhatIsInverse ? 'Hide Intro' : 'What is a Matrix Inverse?'}</span>
          </button>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          See how applying a matrix transforms 2D space, and applying its inverse returns everything back to its original position!
        </p>
      </div>

      {/* Item 71: What is a Matrix Inverse? Educational Card */}
      {showWhatIsInverse && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 border border-blue-200 rounded-2xl p-4 text-xs text-slate-700 space-y-2 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs uppercase tracking-wide">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Understanding Matrix Inverses (For Beginners & Kids)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-blue-100">
              <span className="font-bold text-blue-800 block mb-0.5">1. Normal Numbers:</span>
              <span>In regular math, dividing undoes multiplying: <MathView math="5 \times \frac{1}{5} = 1" />.</span>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-blue-100">
              <span className="font-bold text-indigo-800 block mb-0.5">2. Matrix Geometric Undo:</span>
              <span>If matrix <MathView math="M" /> stretches or tilts an object, its inverse <MathView math="M^{-1}" /> is the "Undo" matrix that puts it back!</span>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-blue-100">
              <span className="font-bold text-emerald-800 block mb-0.5">3. Identity Matrix (I):</span>
              <span>Multiplying them together gives <MathView math="M \cdot M^{-1} = I" />, which means "stay in the original position".</span>
            </div>
          </div>
        </div>
      )}

      {/* Item 171: Stage Progress Indicator (Original -> Transformed -> Restored) */}
      <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          {/* Stage 1 Pill */}
          <button
            onClick={() => jumpToStage(1)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
              stage === 1
                ? 'bg-blue-600 text-white border-blue-700 shadow-sm scale-102'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 text-center text-[10px] leading-4">1</span>
            <span>Original (Identity)</span>
          </button>

          {/* Arrow */}
          <span className="text-slate-400 font-bold">→</span>

          {/* Stage 2 Pill */}
          <button
            onClick={() => jumpToStage(2)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
              stage === 2
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm scale-102'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 text-center text-[10px] leading-4">2</span>
            <span>Transformed (M)</span>
          </button>

          {/* Arrow */}
          <span className="text-slate-400 font-bold">→</span>

          {/* Stage 3 Pill */}
          <button
            onClick={() => {
              if (isSingular) {
                sound.playSnap();
              } else {
                jumpToStage(3);
              }
            }}
            disabled={isSingular}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
              isSingular
                ? 'bg-slate-100 text-slate-400 border-slate-200 opacity-50 cursor-not-allowed'
                : stage === 3
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm scale-102 ring-2 ring-emerald-400'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 text-center text-[10px] leading-4">3</span>
            <span>Restored (M⁻¹)</span>
            {stage === 3 && <CheckCircle2 className="w-3.5 h-3.5 text-white animate-bounce" />}
          </button>
        </div>
      </div>

      {/* Item 173: Celebratory Identity Highlight when Restored */}
      {stage === 3 && (
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-950 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block">
                Inverse Transformation Complete: Back to Original Position!
              </span>
              <p className="text-xs text-emerald-700">
                Applying matrix <MathView math="M" /> and then its inverse <MathView math="M^{-1}" /> returned every point back to where it started.
              </p>
            </div>
          </div>
          <div className="bg-white px-3.5 py-1.5 rounded-xl border border-emerald-300 font-mono text-xs font-extrabold text-emerald-900 shadow-sm flex items-center gap-2">
            <span>M · M⁻¹ =</span>
            <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
              I = [[1, 0], [0, 1]]
            </span>
          </div>
        </div>
      )}

      {/* Item 66: Prominent Singular Warning when det = 0 */}
      {isSingular && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-950">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-black text-rose-800 uppercase tracking-wide block">
                Determinant is Zero: Matrix CANNOT be Inverted!
              </span>
              <p className="text-xs text-rose-700 mt-0.5">
                The determinant is 0, which means 2D space has been squashed flat into a single 1D line or point. Different points merged together, so there is no way to undo this transformation!
              </p>
            </div>
          </div>
          <button
            onClick={() => handleApplyPreset(MATRIX_PRESETS[0])}
            className="px-3 py-1.5 bg-white border border-rose-200 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold shrink-0 transition-colors"
          >
            Reset to Invertible Matrix
          </button>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start py-1">
        {/* Left Column: Interactive 2x2 Matrix Input & Step-by-Step Inverse Display */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          {/* Matrix M Editor */}
          <div className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Matrix M = [ î' | ĵ' ]
              </span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                det(M) = {det.toFixed(2)}
              </span>
            </div>

            {/* Matrix 2x2 bracket editor */}
            <div className="flex items-center justify-center gap-2">
              <div className="text-3xl text-slate-400 font-light">[</div>
              <div className="grid grid-cols-2 gap-2 font-mono">
                {/* a = i_x */}
                <div>
                  <label className="block text-[9px] text-emerald-700 font-bold mb-0.5">î.x (a)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={matrix.a}
                    onChange={(e) => handleMatrixInputChange('a', e.target.value)}
                    className="w-16 px-2 py-1 bg-white rounded-lg border border-emerald-300 text-xs font-bold text-slate-800 text-center focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  />
                </div>
                {/* c = j_x */}
                <div>
                  <label className="block text-[9px] text-rose-700 font-bold mb-0.5">ĵ.x (c)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={matrix.c}
                    onChange={(e) => handleMatrixInputChange('c', e.target.value)}
                    className="w-16 px-2 py-1 bg-white rounded-lg border border-rose-300 text-xs font-bold text-slate-800 text-center focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                  />
                </div>
                {/* b = i_y */}
                <div>
                  <label className="block text-[9px] text-emerald-700 font-bold mb-0.5">î.y (b)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={matrix.b}
                    onChange={(e) => handleMatrixInputChange('b', e.target.value)}
                    className="w-16 px-2 py-1 bg-white rounded-lg border border-emerald-300 text-xs font-bold text-slate-800 text-center focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  />
                </div>
                {/* d = j_y */}
                <div>
                  <label className="block text-[9px] text-rose-700 font-bold mb-0.5">ĵ.y (d)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={matrix.d}
                    onChange={(e) => handleMatrixInputChange('d', e.target.value)}
                    className="w-16 px-2 py-1 bg-white rounded-lg border border-rose-300 text-xs font-bold text-slate-800 text-center focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                  />
                </div>
              </div>
              <div className="text-3xl text-slate-400 font-light">]</div>
            </div>

            {/* Error Message if invalid (Item 175) */}
            {inputError && (
              <p className="text-[11px] text-rose-600 font-semibold mt-2 text-center bg-rose-50 p-1.5 rounded-lg border border-rose-200">
                {inputError}
              </p>
            )}
          </div>

          {/* Item 176: Step-by-Step Determinant & Inverse Calculation Box */}
          <div className="bg-indigo-50/60 rounded-2xl p-3.5 border border-indigo-100 space-y-2 text-xs">
            <div className="font-extrabold text-indigo-900 uppercase tracking-wide flex items-center justify-between">
              <span>Inverse Calculation Steps</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                invDetails.isInvertible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {invDetails.isInvertible ? 'Invertible' : 'Non-Invertible'}
              </span>
            </div>

            {/* Step 1: Det calculation */}
            <div className="bg-white/90 p-2 rounded-xl border border-indigo-100 space-y-0.5">
              <span className="font-bold text-slate-700 block text-[11px]">1. Determinant (ad - bc):</span>
              <div className="font-mono text-indigo-900 text-xs">
                det(M) = ({matrix.a})({matrix.d}) - ({matrix.b})({matrix.c}) = <strong className="text-indigo-600">{det}</strong>
              </div>
            </div>

            {/* Step 2: Swap diagonal & negate off-diagonal */}
            {invDetails.isInvertible && invDetails.inverse ? (
              <>
                <div className="bg-white/90 p-2 rounded-xl border border-indigo-100 space-y-0.5">
                  <span className="font-bold text-slate-700 block text-[11px]">2. Adjugate Matrix:</span>
                  <div className="font-mono text-xs text-slate-700">
                    Swap a ↔ d, negate b and c:
                    <div className="font-bold text-indigo-800">
                      [[{invDetails.adjugate.a}, {invDetails.adjugate.c}], [{invDetails.adjugate.b}, {invDetails.adjugate.d}]]
                    </div>
                  </div>
                </div>

                {/* Step 3: Divide by det */}
                <div className="bg-white/90 p-2 rounded-xl border border-indigo-100 space-y-0.5">
                  <span className="font-bold text-slate-700 block text-[11px]">3. Inverse Matrix M⁻¹ = (1/det) · adj(M):</span>
                  <div className="font-mono font-bold text-emerald-700 text-xs bg-emerald-50 p-1.5 rounded-lg border border-emerald-200 text-center">
                    M⁻¹ ≈ [[{invDetails.inverse.a}, {invDetails.inverse.c}], [{invDetails.inverse.b}, {invDetails.inverse.d}]]
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-rose-50 p-2 rounded-xl border border-rose-200 text-[11px] text-rose-800">
                Division by 0 is undefined. Because det(M) = 0, no inverse matrix exists.
              </div>
            )}
          </div>
        </div>

        {/* Middle / Right Canvas */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[420px] h-[250px] rounded-2xl bg-slate-50/50 border border-blue-100 shadow-sm overflow-hidden flex items-center justify-center select-none">
            <svg
              ref={canvasRef}
              className="w-full h-full touch-none"
              viewBox="0 0 280 240"
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {/* 1. Base Cartesian Grid */}
              {showOriginalGrid && (
                <g stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3">
                  {[-3, -2, -1, 1, 2, 3].map(i => (
                    <React.Fragment key={`bg-${i}`}>
                      <line x1={cx + i * scale} y1="10" x2={cx + i * scale} y2="230" />
                      <line x1="10" y1={cy + i * scale} x2="270" y2={cy + i * scale} />
                    </React.Fragment>
                  ))}
                </g>
              )}

              {/* 2. Main Fixed Axes (x, y) */}
              <g stroke="#94a3b8" strokeWidth="1.5" opacity="0.7">
                <line x1="10" y1={cy} x2="270" y2={cy} />
                <line x1={cx} y1="10" x2={cx} y2="230" />
              </g>

              {/* 3. Transformed Warped Grid */}
              {showTransformedGrid && (
                <g stroke="#93c5fd" strokeWidth="1.2" opacity="0.65">
                  {xLines.map((l, idx) => (
                    <line key={`tx-${idx}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
                  ))}
                  {yLines.map((l, idx) => (
                    <line key={`ty-${idx}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
                  ))}
                </g>
              )}

              {/* 4. Original Unit Square Outline */}
              <rect
                x={cx}
                y={cy - scale}
                width={scale}
                height={scale}
                fill="rgba(148, 163, 184, 0.15)"
                stroke="#cbd5e1"
                strokeWidth="1.5"
                strokeDasharray="3 2"
              />

              {/* 5. Transformed Parallelogram (Determinant Area) */}
              {showArea && Math.abs(det) > 0.001 && (
                <path
                  d={parallelogramPath}
                  fill={det >= 0 ? 'rgba(59, 130, 246, 0.25)' : 'rgba(244, 63, 94, 0.25)'}
                  stroke={det >= 0 ? '#2563eb' : '#e11d48'}
                  strokeWidth="2"
                  className="transition-colors"
                />
              )}

              {/* 6. Basis Vector î' (Green) */}
              {showBasisVectors && (
                <g>
                  {/* Arrow body */}
                  <line
                    x1={cx}
                    y1={cy}
                    x2={iScreen.x}
                    y2={iScreen.y}
                    stroke="#059669"
                    strokeWidth="2.5"
                  />
                  {/* Draggable Tip Handle */}
                  <g
                    onPointerDown={(e) => handlePointerDown('i', undefined, e)}
                    className="cursor-grab active:cursor-grabbing group/i"
                  >
                    <circle cx={iScreen.x} cy={iScreen.y} r="18" fill="transparent" />
                    <circle
                      cx={iScreen.x}
                      cy={iScreen.y}
                      r="7"
                      fill="#059669"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="group-hover/i:scale-125 transition-transform shadow-md"
                    />
                    <text x={iScreen.x + 8} y={iScreen.y - 4} fill="#047857" fontSize="11" fontWeight="bold" fontFamily="monospace">
                      î'({currentRenderMatrix.a.toFixed(1)},{currentRenderMatrix.b.toFixed(1)})
                    </text>
                  </g>
                </g>
              )}

              {/* 7. Basis Vector ĵ' (Rose/Orange) */}
              {showBasisVectors && (
                <g>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={jScreen.x}
                    y2={jScreen.y}
                    stroke="#e11d48"
                    strokeWidth="2.5"
                  />
                  <g
                    onPointerDown={(e) => handlePointerDown('j', undefined, e)}
                    className="cursor-grab active:cursor-grabbing group/j"
                  >
                    <circle cx={jScreen.x} cy={jScreen.y} r="18" fill="transparent" />
                    <circle
                      cx={jScreen.x}
                      cy={jScreen.y}
                      r="7"
                      fill="#e11d48"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="group-hover/j:scale-125 transition-transform shadow-md"
                    />
                    <text x={jScreen.x + 8} y={jScreen.y - 4} fill="#be123c" fontSize="11" fontWeight="bold" fontFamily="monospace">
                      ĵ'({currentRenderMatrix.c.toFixed(1)},{currentRenderMatrix.d.toFixed(1)})
                    </text>
                  </g>
                </g>
              )}

              {/* Center Origin Node */}
              <circle cx={cx} cy={cy} r="4" fill="#1e293b" />

              {/* Derivation Shapes (movable small shapes to show transformation process) */}
              {showDerivationShapes && derivationShapes.map((shape) => {
                // Original position
                const originalScreen = { 
                  x: cx + shape.originalX * scale, 
                  y: cy - shape.originalY * scale 
                };
                // Transformed position
                const transformed = transformPoint({ x: shape.originalX, y: shape.originalY }, currentRenderMatrix);
                const transformedScreen = { 
                  x: cx + transformed.x * scale, 
                  y: cy - transformed.y * scale 
                };

                return (
                  <g key={shape.id}>
                    {/* Original position (faded) */}
                    <circle
                      cx={originalScreen.x}
                      cy={originalScreen.y}
                      r="6"
                      fill={shape.color}
                      opacity={0.3}
                    />
                    <text
                      x={originalScreen.x}
                      y={originalScreen.y - 10}
                      fill={shape.color}
                      fontSize="8"
                      textAnchor="middle"
                      opacity={0.5}
                    >
                      P{shape.id}
                    </text>

                    {/* Arrow showing transformation */}
                    <line
                      x1={originalScreen.x}
                      y1={originalScreen.y}
                      x2={transformedScreen.x}
                      y2={transformedScreen.y}
                      stroke={shape.color}
                      strokeWidth="1.5"
                      strokeDasharray="3 2"
                      opacity={0.6}
                    />

                    {/* Transformed position (movable) */}
                    <g
                      onPointerDown={(e) => handlePointerDown('shape', shape.id, e)}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <circle
                        cx={transformedScreen.x}
                        cy={transformedScreen.y}
                        r="8"
                        fill="transparent"
                      />
                      <circle
                        cx={transformedScreen.x}
                        cy={transformedScreen.y}
                        r="6"
                        fill={shape.color}
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="hover:scale-125 transition-transform"
                      />
                      <text
                        x={transformedScreen.x}
                        y={transformedScreen.y - 12}
                        fill={shape.color}
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        P{shape.id}'
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* Top Right Orientation Badge */}
            <div className="absolute top-2 right-2">
              {det > 0.01 ? (
                <span className="px-2.5 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-bold shadow-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Preserved Orientation (Det = {det.toFixed(2)})</span>
                </span>
              ) : det < -0.01 ? (
                <span className="px-2.5 py-1 bg-rose-500 text-white rounded-full text-[10px] font-bold shadow-md flex items-center gap-1">
                  <RotateCw className="w-3 h-3" />
                  <span>Inverted Orientation (Reflected)</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-amber-500 text-white rounded-full text-[10px] font-bold shadow-md flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Singular (Det = 0, Collapsed)</span>
                </span>
              )}
            </div>

            {/* Bottom Left Status */}
            <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-lg border border-blue-100 text-[10px] font-mono font-bold text-slate-700 shadow-sm">
              Area Scale = |det| = {Math.abs(det).toFixed(2)}×
            </div>
          </div>

          {/* Item 168 & 169: Play / Pause, Speed Control, & Manual Stepping Bar */}
          <div className="w-full max-w-[420px] bg-slate-50 rounded-2xl p-2.5 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
            {/* Play/Pause & Reset */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all shadow-xs ${
                  isPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                title={isPlaying ? 'Pause Transformation' : 'Play Automatic Transformation & Inverse'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 translate-x-0.5" />}
                <span>{isPlaying ? 'Pause' : 'Play Proof'}</span>
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  jumpToStage(1);
                }}
                className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                title="Reset to Original Stage"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Speed Toggle: Slower option for kids (Item 168) */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-500">Speed:</span>
              <button
                onClick={() => setAnimSpeed(0.5)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  animSpeed === 0.5
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                title="Slower speed for kids to observe clearly"
              >
                0.5x (Kids)
              </button>
              <button
                onClick={() => setAnimSpeed(1)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  animSpeed === 1
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                1x
              </button>
              <button
                onClick={() => setAnimSpeed(1.5)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  animSpeed === 1.5
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                1.5x
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Presets Bar */}
      <div className="pt-2.5 border-t border-blue-50/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">Presets:</span>
          {MATRIX_PRESETS.map((preset) => {
            const isSelected = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
