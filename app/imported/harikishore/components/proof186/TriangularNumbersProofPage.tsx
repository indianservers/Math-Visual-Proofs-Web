import React, { useState } from 'react';
import { 
  HelpCircle, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';
import { TRIANGULAR_PRESETS, TriangularPreset } from '../../data/triangularData';
import { ProofState } from '../../types';
import { TriangularMissionBar } from './TriangularMissionBar';
import { Panel1TriangularCanvas } from './Panel1TriangularCanvas';
import { Panel2TriangularGuide } from './Panel2TriangularGuide';
import { Panel3TriangularProof } from './Panel3TriangularProof';
import { TriangularWhyItWorksPanel } from './TriangularWhyItWorksPanel';
import { TriangularChallengeSection } from './TriangularChallengeSection';
import { TriangularAnimationBar } from './TriangularAnimationBar';
import { TriangularHintModal } from './TriangularHintModal';

interface Props {
  onBackToDashboard: () => void;
}

export const TriangularNumbersProofPage: React.FC<Props> = ({
  onBackToDashboard,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<TriangularPreset>(TRIANGULAR_PRESETS[0]);
  const [n, setN] = useState<number>(TRIANGULAR_PRESETS[0].n);
  const [interlockProgress, setInterlockProgress] = useState<number>(1);

  const [showTriangle1, setShowTriangle1] = useState(true);
  const [showDuplicateTriangle, setShowDuplicateTriangle] = useState(true);
  const [showRectBoundary, setShowRectBoundary] = useState(true);
  const [showDotCounts, setShowDotCounts] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [proofState, setProofState] = useState<ProofState>('manipulate');
  const [isHintsOpen, setIsHintsOpen] = useState(false);

  const handleReset = () => {
    setSelectedPreset(TRIANGULAR_PRESETS[0]);
    setN(TRIANGULAR_PRESETS[0].n);
    setInterlockProgress(1);
  };

  return (
    <div className="flex-1 min-h-screen bg-[#f3f8fc] px-4 md:px-8 lg:px-10 py-6 overflow-y-auto font-sans select-none text-slate-800">
      <div className="max-w-[1600px] mx-auto space-y-5">
        
        {/* Top Header */}
        <header className="space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <button
                onClick={onBackToDashboard}
                className="hover:text-sky-600 flex items-center gap-1 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Visual Proofs</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-sky-600 font-bold">Sequences & Series</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-sky-50 text-sky-800 font-bold text-xs border border-sky-200 shadow-sm">
                Beginner
              </span>

              <span className="px-3 py-1 rounded-full bg-white text-slate-600 font-semibold text-xs border border-slate-200 shadow-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>7 min</span>
              </span>

              <button
                onClick={() => setIsHintsOpen(true)}
                className="w-7 h-7 rounded-full bg-white hover:bg-sky-50 text-slate-500 hover:text-sky-600 border border-slate-200 shadow-sm flex items-center justify-center"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Triangular Numbers
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              <strong className="text-sky-950 font-bold">Mission:</strong> Arrange dots into triangular rows and duplicate them into an n × (n + 1) rectangle to prove T_n = n(n + 1)/2.
            </p>
          </div>
        </header>

        {/* Mission Bar */}
        <TriangularMissionBar
          showTriangle1={showTriangle1}
          setShowTriangle1={setShowTriangle1}
          showDuplicateTriangle={showDuplicateTriangle}
          setShowDuplicateTriangle={setShowDuplicateTriangle}
          showRectBoundary={showRectBoundary}
          setShowRectBoundary={setShowRectBoundary}
          showDotCounts={showDotCounts}
          setShowDotCounts={setShowDotCounts}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
        />

        {/* Proof Stepper Bar */}
        <TriangularAnimationBar
          currentState={proofState}
          onSelectState={setProofState}
          onOpenHints={() => setIsHintsOpen(true)}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          <div className="xl:col-span-8 space-y-5">
            <Panel1TriangularCanvas
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              n={n}
              setN={setN}
              interlockProgress={interlockProgress}
              setInterlockProgress={setInterlockProgress}
              showTriangle1={showTriangle1}
              showDuplicateTriangle={showDuplicateTriangle}
              showRectBoundary={showRectBoundary}
              showDotCounts={showDotCounts}
            />

            <Panel3TriangularProof />
          </div>

          <div className="xl:col-span-4 space-y-5">
            <Panel2TriangularGuide
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              n={n}
              setN={setN}
            />

            <TriangularWhyItWorksPanel
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Challenge Section */}
        <TriangularChallengeSection />
      </div>

      <TriangularHintModal
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
      />
    </div>
  );
};