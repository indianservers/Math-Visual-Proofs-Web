import React, { useState } from 'react';
import { 
  HelpCircle, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';
import { ODD_SUM_PRESETS, OddSumPreset } from '../../data/oddSumData';
import { ProofState } from '../../types';
import { OddSumMissionBar } from './OddSumMissionBar';
import { Panel1OddSumCanvas } from './Panel1OddSumCanvas';
import { Panel2OddSumGuide } from './Panel2OddSumGuide';
import { Panel3OddSumProof } from './Panel3OddSumProof';
import { OddSumWhyItWorksPanel } from './OddSumWhyItWorksPanel';
import { OddSumChallengeSection } from './OddSumChallengeSection';
import { OddSumAnimationBar } from './OddSumAnimationBar';
import { OddSumHintModal } from './OddSumHintModal';

interface Props {
  onBackToDashboard: () => void;
}

export const SumFirstNOddNumbersProofPage: React.FC<Props> = ({
  onBackToDashboard,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<OddSumPreset>(ODD_SUM_PRESETS[0]);
  const [n, setN] = useState<number>(ODD_SUM_PRESETS[0].n);

  const [showSquareGrid, setShowSquareGrid] = useState(true);
  const [showLLayers, setShowLLayers] = useState(true);
  const [showOddLabels, setShowOddLabels] = useState(true);
  const [showFormulaTag, setShowFormulaTag] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [proofState, setProofState] = useState<ProofState>('manipulate');
  const [isHintsOpen, setIsHintsOpen] = useState(false);

  const handleReset = () => {
    setSelectedPreset(ODD_SUM_PRESETS[0]);
    setN(ODD_SUM_PRESETS[0].n);
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
                className="hover:text-amber-600 flex items-center gap-1 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Visual Proofs</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-amber-600 font-bold">Sequences & Series</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200 shadow-sm">
                Beginner
              </span>

              <span className="px-3 py-1 rounded-full bg-white text-slate-600 font-semibold text-xs border border-slate-200 shadow-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>8 min</span>
              </span>

              <button
                onClick={() => setIsHintsOpen(true)}
                className="w-7 h-7 rounded-full bg-white hover:bg-amber-50 text-slate-500 hover:text-amber-600 border border-slate-200 shadow-sm flex items-center justify-center"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Sum of First n Odd Numbers
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              <strong className="text-amber-950 font-bold">Mission:</strong> Build a square from successive odd L-shaped layers.
            </p>
          </div>
        </header>

        {/* Mission Bar */}
        <OddSumMissionBar
          showSquareGrid={showSquareGrid}
          setShowSquareGrid={setShowSquareGrid}
          showLLayers={showLLayers}
          setShowLLayers={setShowLLayers}
          showOddLabels={showOddLabels}
          setShowOddLabels={setShowOddLabels}
          showFormulaTag={showFormulaTag}
          setShowFormulaTag={setShowFormulaTag}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
        />

        {/* Proof Stepper Bar */}
        <OddSumAnimationBar
          currentState={proofState}
          onSelectState={setProofState}
          onOpenHints={() => setIsHintsOpen(true)}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          <div className="xl:col-span-8 space-y-5">
            <Panel1OddSumCanvas
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              n={n}
              setN={setN}
              showSquareGrid={showSquareGrid}
              showLLayers={showLLayers}
              showOddLabels={showOddLabels}
              showFormulaTag={showFormulaTag}
            />

            <Panel3OddSumProof />
          </div>

          <div className="xl:col-span-4 space-y-5">
            <Panel2OddSumGuide
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
            />

            <OddSumWhyItWorksPanel
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Challenge Section */}
        <OddSumChallengeSection />
      </div>

      <OddSumHintModal
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
      />
    </div>
  );
};
