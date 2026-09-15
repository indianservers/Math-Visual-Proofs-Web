import React, { useState } from 'react';
import { 
  HelpCircle, 
  Clock, 
  ArrowLeft, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import { MatrixPreset } from '../../data/matricesData';
import { Matrix2x2 } from '../../utils/matricesMath';
import { ProofState } from '../../types';
import { MatricesMissionBar } from './MatricesMissionBar';
import { Panel1MatrixCanvas } from './Panel1MatrixCanvas';
import { Panel2MatrixGuide } from './Panel2MatrixGuide';
import { Panel3MatrixProof } from './Panel3MatrixProof';
import { MatricesWhyItWorksPanel } from './MatricesWhyItWorksPanel';
import { MatricesChallengeSection } from './MatricesChallengeSection';
import { MatricesAnimationBar } from './MatricesAnimationBar';
import { MatricesHintModal } from './MatricesHintModal';
import { sound } from '../../utils/sound';

interface Props {
  onBackToDashboard: () => void;
}

export const TransformationMatrices2DProofPage: React.FC<Props> = ({
  onBackToDashboard,
}) => {
  const [matrix, setMatrix] = useState<Matrix2x2>({ a: 1, b: 0, c: 0, d: 1 });
  const [showOriginalGrid, setShowOriginalGrid] = useState(true);
  const [showTransformedGrid, setShowTransformedGrid] = useState(true);
  const [showBasisVectors, setShowBasisVectors] = useState(true);
  const [showArea, setShowArea] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [isCustomMatrix, setIsCustomMatrix] = useState(false);
  const [showDerivationShapes, setShowDerivationShapes] = useState(false);
  const [proofState, setProofState] = useState<ProofState>('manipulate');
  const [isHintsOpen, setIsHintsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  const handleReset = () => {
    setMatrix({ a: 1, b: 0, c: 0, d: 1 });
  };

  const handleApplyPreset = (preset: MatrixPreset) => {
    setMatrix({
      a: preset.matrix[0],
      c: preset.matrix[1],
      b: preset.matrix[2],
      d: preset.matrix[3],
    });
  };

  return (
    <div className="flex-1 min-h-screen bg-[#f3f4f9] px-4 md:px-8 lg:px-10 py-6 overflow-y-auto font-sans select-none text-slate-800">
      <div className="max-w-[1600px] mx-auto space-y-5">
        
        {/* Top Header */}
        <header className="space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <button
                onClick={onBackToDashboard}
                className="hover:text-blue-600 flex items-center gap-1 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Visual Proofs</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-blue-600 font-bold">Transformations & Symmetry</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleMute}
                className="p-1.5 rounded-full bg-white text-slate-500 hover:text-blue-600 border border-slate-200/80 shadow-sm"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              <span className="px-3.5 py-1 rounded-full bg-blue-50 text-blue-800 font-bold text-xs border border-blue-200 shadow-sm">
                Advanced
              </span>

              <span className="px-3 py-1 rounded-full bg-white text-slate-600 font-semibold text-xs border border-slate-200 shadow-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>12 min</span>
              </span>

              <button
                onClick={() => setIsHintsOpen(true)}
                className="w-7 h-7 rounded-full bg-white hover:bg-blue-50 text-slate-500 hover:text-blue-600 border border-slate-200 shadow-sm flex items-center justify-center"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Transformation Matrices in 2D
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              <strong className="text-blue-950 font-bold">Mission:</strong> Use a matrix to transform basis vectors, shapes, and every point by one rule.
            </p>
          </div>
        </header>

        {/* Mission Bar */}
        <MatricesMissionBar
          showOriginalGrid={showOriginalGrid}
          setShowOriginalGrid={setShowOriginalGrid}
          showTransformedGrid={showTransformedGrid}
          setShowTransformedGrid={setShowTransformedGrid}
          showBasisVectors={showBasisVectors}
          setShowBasisVectors={setShowBasisVectors}
          showArea={showArea}
          setShowArea={setShowArea}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
        />

        {/* Proof Stepper Bar */}
        <MatricesAnimationBar
          currentState={proofState}
          onSelectState={setProofState}
          onOpenHints={() => setIsHintsOpen(true)}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          <div className="xl:col-span-8 space-y-5">
            <Panel1MatrixCanvas
              matrix={matrix}
              setMatrix={setMatrix}
              showOriginalGrid={showOriginalGrid}
              showTransformedGrid={showTransformedGrid}
              showBasisVectors={showBasisVectors}
              showArea={showArea}
              snapEnabled={snapEnabled}
              isCustomMatrix={isCustomMatrix}
              setIsCustomMatrix={setIsCustomMatrix}
              showDerivationShapes={showDerivationShapes}
              setShowDerivationShapes={setShowDerivationShapes}
            />

            <Panel3MatrixProof />
          </div>

          <div className="xl:col-span-4 space-y-5">
            <Panel2MatrixGuide
              currentMatrix={matrix}
              onApplyMatrix={handleApplyPreset}
            />

            <MatricesWhyItWorksPanel
              matrix={matrix}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Challenge Section */}
        <MatricesChallengeSection />
      </div>

      <MatricesHintModal
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
      />
    </div>
  );
};
