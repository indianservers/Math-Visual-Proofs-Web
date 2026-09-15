import React, { useState } from 'react';
import { 
  HelpCircle, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';
import { NATURAL_SUM_PRESETS, NaturalSumPreset } from '../../data/naturalSumData';
import { ProofState } from '../../types';
import { NaturalSumMissionBar } from './NaturalSumMissionBar';
import { Panel1NaturalSumCanvas } from './Panel1NaturalSumCanvas';
import { Panel2NaturalSumGuide } from './Panel2NaturalSumGuide';
import { Panel3NaturalSumProof } from './Panel3NaturalSumProof';
import { NaturalSumWhyItWorksPanel } from './NaturalSumWhyItWorksPanel';
import { NaturalSumChallengeSection } from './NaturalSumChallengeSection';
import { NaturalSumAnimationBar } from './NaturalSumAnimationBar';
import { NaturalSumHintModal } from './NaturalSumHintModal';

interface Props {
  onBackToDashboard: () => void;
}

export const SumFirstNNaturalNumbersProofPage: React.FC<Props> = ({
  onBackToDashboard,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<NaturalSumPreset>(NATURAL_SUM_PRESETS[0]);
  const [n, setN] = useState<number>(NATURAL_SUM_PRESETS[0].n);
  const [interlockProgress, setInterlockProgress] = useState<number>(1.0);

  const [showStaircase1, setShowStaircase1] = useState(true);
  const [showTwinStaircase, setShowTwinStaircase] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [showFormulaTag, setShowFormulaTag] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [proofState, setProofState] = useState<ProofState>('manipulate');
  const [isHintsOpen, setIsHintsOpen] = useState(false);

  const handleReset = () => {
    setSelectedPreset(NATURAL_SUM_PRESETS[0]);
    setN(NATURAL_SUM_PRESETS[0].n);
    setInterlockProgress(1.0);
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
              <span className="text-blue-600 font-bold">Sequences & Series</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-blue-50 text-blue-800 font-bold text-xs border border-blue-200 shadow-sm">
                Beginner
              </span>

              <span className="px-3 py-1 rounded-full bg-white text-slate-600 font-semibold text-xs border border-slate-200 shadow-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>8 min</span>
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
              Sum of First n Natural Numbers
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              <strong className="text-blue-950 font-bold">Mission:</strong> Duplicate a triangular dot pattern to make a rectangle.
            </p>
          </div>
        </header>

        {/* Mission Bar */}
        <NaturalSumMissionBar
          showStaircase1={showStaircase1}
          setShowStaircase1={setShowStaircase1}
          showTwinStaircase={showTwinStaircase}
          setShowTwinStaircase={setShowTwinStaircase}
          showDimensions={showDimensions}
          setShowDimensions={setShowDimensions}
          showFormulaTag={showFormulaTag}
          setShowFormulaTag={setShowFormulaTag}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
        />

        {/* Proof Stepper Bar */}
        <NaturalSumAnimationBar
          currentState={proofState}
          onSelectState={setProofState}
          onOpenHints={() => setIsHintsOpen(true)}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          <div className="xl:col-span-8 space-y-5">
            <Panel1NaturalSumCanvas
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              n={n}
              setN={setN}
              interlockProgress={interlockProgress}
              setInterlockProgress={setInterlockProgress}
              showStaircase1={showStaircase1}
              showTwinStaircase={showTwinStaircase}
              showDimensions={showDimensions}
              showFormulaTag={showFormulaTag}
            />

            <Panel3NaturalSumProof />
          </div>

          <div className="xl:col-span-4 space-y-5">
            <Panel2NaturalSumGuide
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
            />

            <NaturalSumWhyItWorksPanel
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Challenge Section */}
        <NaturalSumChallengeSection />
      </div>

      <NaturalSumHintModal
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
      />
    </div>
  );
};
