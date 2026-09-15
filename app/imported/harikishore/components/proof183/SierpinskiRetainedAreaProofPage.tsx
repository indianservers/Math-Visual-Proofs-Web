import React, { useState } from 'react';
import { 
  HelpCircle, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';
import { SIERPINSKI_PRESETS, SierpinskiPreset } from '../../data/sierpinskiData';
import { ProofState } from '../../types';
import { SierpinskiMissionBar } from './SierpinskiMissionBar';
import { Panel1SierpinskiCanvas } from './Panel1SierpinskiCanvas';
import { Panel2SierpinskiGuide } from './Panel2SierpinskiGuide';
import { Panel3SierpinskiProof } from './Panel3SierpinskiProof';
import { SierpinskiWhyItWorksPanel } from './SierpinskiWhyItWorksPanel';
import { SierpinskiChallengeSection } from './SierpinskiChallengeSection';
import { SierpinskiAnimationBar } from './SierpinskiAnimationBar';
import { SierpinskiHintModal } from './SierpinskiHintModal';

interface Props {
  onBackToDashboard: () => void;
}

export const SierpinskiRetainedAreaProofPage: React.FC<Props> = ({
  onBackToDashboard,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<SierpinskiPreset>(SIERPINSKI_PRESETS[0]);
  const [level, setLevel] = useState<number>(1);

  const [showHoles, setShowHoles] = useState(true);
  const [showGridLines, setShowGridLines] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showFormulaTag, setShowFormulaTag] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [proofState, setProofState] = useState<ProofState>('manipulate');
  const [isHintsOpen, setIsHintsOpen] = useState(false);

  const handleReset = () => {
    setSelectedPreset(SIERPINSKI_PRESETS[0]);
    setLevel(1);
  };

  return (
    <div className="flex-1 min-h-screen bg-[#f7f8fd] px-4 md:px-8 lg:px-10 py-6 overflow-y-auto font-sans select-none text-slate-800">
      <div className="max-w-[1600px] mx-auto space-y-5">
        
        {/* Top Header */}
        <header className="space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <button
                onClick={onBackToDashboard}
                className="hover:text-indigo-600 flex items-center gap-1 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Visual Proofs</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-indigo-600 font-bold">Sequences & Series</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-800 font-bold text-xs border border-indigo-200 shadow-sm">
                Advanced
              </span>

              <span className="px-3 py-1 rounded-full bg-white text-slate-600 font-semibold text-xs border border-slate-200 shadow-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>10 min</span>
              </span>

              <button
                onClick={() => setIsHintsOpen(true)}
                className="w-7 h-7 rounded-full bg-white hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 border border-slate-200 shadow-sm flex items-center justify-center"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Sierpinski Carpet Retained Area
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              <strong className="text-indigo-950 font-bold">Mission:</strong> Punch out the center square of every 3×3 grid to show retained area is (8/9)ⁿ → 0.
            </p>
          </div>
        </header>

        {/* Mission Bar */}
        <SierpinskiMissionBar
          showHoles={showHoles}
          setShowHoles={setShowHoles}
          showGridLines={showGridLines}
          setShowGridLines={setShowGridLines}
          showLabels={showLabels}
          setShowLabels={setShowLabels}
          showFormulaTag={showFormulaTag}
          setShowFormulaTag={setShowFormulaTag}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
        />

        {/* Proof Stepper Bar */}
        <SierpinskiAnimationBar
          currentState={proofState}
          onSelectState={setProofState}
          onOpenHints={() => setIsHintsOpen(true)}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          <div className="xl:col-span-8 space-y-5">
            <Panel1SierpinskiCanvas
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              level={level}
              setLevel={setLevel}
              showHoles={showHoles}
              showGridLines={showGridLines}
              showLabels={showLabels}
              showFormulaTag={showFormulaTag}
            />

            <Panel3SierpinskiProof />
          </div>

          <div className="xl:col-span-4 space-y-5">
            <Panel2SierpinskiGuide
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              level={level}
              setLevel={setLevel}
            />

            <SierpinskiWhyItWorksPanel
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Challenge Section */}
        <SierpinskiChallengeSection />
      </div>

      <SierpinskiHintModal
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
      />
    </div>
  );
};