import React, { useState } from 'react';
import { 
  HelpCircle, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';
import { SIERPINSKI_REMOVED_PRESETS, SierpinskiRemovedPreset } from '../../data/sierpinskiRemovedData';
import { ProofState } from '../../types';
import { SierpinskiRemovedMissionBar } from './SierpinskiRemovedMissionBar';
import { Panel1SierpinskiRemovedCanvas } from './Panel1SierpinskiRemovedCanvas';
import { Panel2SierpinskiRemovedGuide } from './Panel2SierpinskiRemovedGuide';
import { Panel3SierpinskiRemovedProof } from './Panel3SierpinskiRemovedProof';
import { SierpinskiRemovedWhyItWorksPanel } from './SierpinskiRemovedWhyItWorksPanel';
import { SierpinskiRemovedChallengeSection } from './SierpinskiRemovedChallengeSection';
import { SierpinskiRemovedAnimationBar } from './SierpinskiRemovedAnimationBar';
import { SierpinskiRemovedHintModal } from './SierpinskiRemovedHintModal';

interface Props {
  onBackToDashboard: () => void;
}

export const SierpinskiRemovedSquareSumProofPage: React.FC<Props> = ({
  onBackToDashboard,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<SierpinskiRemovedPreset>(SIERPINSKI_REMOVED_PRESETS[0]);
  const [level, setLevel] = useState<number>(1);

  const [showNewHolesHighlight, setShowNewHolesHighlight] = useState(true);
  const [showPreviousHoles, setShowPreviousHoles] = useState(true);
  const [showFormulaTag, setShowFormulaTag] = useState(true);
  const [showCounts, setShowCounts] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [proofState, setProofState] = useState<ProofState>('manipulate');
  const [isHintsOpen, setIsHintsOpen] = useState(false);

  const handleReset = () => {
    setSelectedPreset(SIERPINSKI_REMOVED_PRESETS[0]);
    setLevel(1);
  };

  return (
    <div className="flex-1 min-h-screen bg-[#f8f7fd] px-4 md:px-8 lg:px-10 py-6 overflow-y-auto font-sans select-none text-slate-800">
      <div className="max-w-[1600px] mx-auto space-y-5">
        
        {/* Top Header */}
        <header className="space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <button
                onClick={onBackToDashboard}
                className="hover:text-violet-600 flex items-center gap-1 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Visual Proofs</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-violet-600 font-bold">Sequences & Series</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-violet-50 text-violet-800 font-bold text-xs border border-violet-200 shadow-sm">
                Intermediate
              </span>

              <span className="px-3 py-1 rounded-full bg-white text-slate-600 font-semibold text-xs border border-slate-200 shadow-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>9 min</span>
              </span>

              <button
                onClick={() => setIsHintsOpen(true)}
                className="w-7 h-7 rounded-full bg-white hover:bg-violet-50 text-slate-500 hover:text-violet-600 border border-slate-200 shadow-sm flex items-center justify-center"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Sierpinski Removed Square Sum
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              <strong className="text-violet-950 font-bold">Mission:</strong> Count the new holes at each step and sum them as a finite geometric series: 1 + 8 + ... + 8^(n-1) = (8^n - 1)/7.
            </p>
          </div>
        </header>

        {/* Mission Bar */}
        <SierpinskiRemovedMissionBar
          showNewHolesHighlight={showNewHolesHighlight}
          setShowNewHolesHighlight={setShowNewHolesHighlight}
          showPreviousHoles={showPreviousHoles}
          setShowPreviousHoles={setShowPreviousHoles}
          showFormulaTag={showFormulaTag}
          setShowFormulaTag={setShowFormulaTag}
          showCounts={showCounts}
          setShowCounts={setShowCounts}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
        />

        {/* Proof Stepper Bar */}
        <SierpinskiRemovedAnimationBar
          currentState={proofState}
          onSelectState={setProofState}
          onOpenHints={() => setIsHintsOpen(true)}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          <div className="xl:col-span-8 space-y-5">
            <Panel1SierpinskiRemovedCanvas
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              level={level}
              setLevel={setLevel}
              showNewHolesHighlight={showNewHolesHighlight}
              showPreviousHoles={showPreviousHoles}
              showFormulaTag={showFormulaTag}
              showCounts={showCounts}
            />

            <Panel3SierpinskiRemovedProof />
          </div>

          <div className="xl:col-span-4 space-y-5">
            <Panel2SierpinskiRemovedGuide
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              level={level}
              setLevel={setLevel}
            />

            <SierpinskiRemovedWhyItWorksPanel
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Challenge Section */}
        <SierpinskiRemovedChallengeSection />
      </div>

      <SierpinskiRemovedHintModal
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
      />
    </div>
  );
};