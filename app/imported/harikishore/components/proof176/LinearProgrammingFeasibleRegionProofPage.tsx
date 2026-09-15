import React, { useState } from 'react';
import { 
  HelpCircle, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';
import { LP_PRESETS, LPPreset } from '../../data/lpData';
import { ProofState } from '../../types';
import { LPMissionBar } from './LPMissionBar';
import { Panel1LPCanvas } from './Panel1LPCanvas';
import { Panel2LPGuide } from './Panel2LPGuide';
import { Panel3LPProof } from './Panel3LPProof';
import { LPWhyItWorksPanel } from './LPWhyItWorksPanel';
import { LPChallengeSection } from './LPChallengeSection';
import { LPAnimationBar } from './LPAnimationBar';
import { LPHintModal } from './LPHintModal';

interface Props {
  onBackToDashboard: () => void;
}

export const LinearProgrammingFeasibleRegionProofPage: React.FC<Props> = ({
  onBackToDashboard,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<LPPreset>(LP_PRESETS[0]);
  const [currentK, setCurrentK] = useState<number>(LP_PRESETS[0].defaultK);

  const [showFeasibleRegion, setShowFeasibleRegion] = useState(true);
  const [showConstraints, setShowConstraints] = useState(true);
  const [showVertices, setShowVertices] = useState(true);
  const [showObjectiveLine, setShowObjectiveLine] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [proofState, setProofState] = useState<ProofState>('manipulate');
  const [isHintsOpen, setIsHintsOpen] = useState(false);

  const handleReset = () => {
    setSelectedPreset(LP_PRESETS[0]);
    setCurrentK(LP_PRESETS[0].defaultK);
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
                className="hover:text-violet-600 flex items-center gap-1 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Visual Proofs</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-violet-600 font-bold">Engineering Mathematics</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-violet-50 text-violet-800 font-bold text-xs border border-violet-200 shadow-sm">
                Intermediate
              </span>

              <span className="px-3 py-1 rounded-full bg-white text-slate-600 font-semibold text-xs border border-slate-200 shadow-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>11 min</span>
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
              Linear Programming Feasible Region
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              <strong className="text-violet-950 font-bold">Mission:</strong> Intersect half-planes and slide an objective line to find the optimum vertex.
            </p>
          </div>
        </header>

        {/* Mission Bar */}
        <LPMissionBar
          showFeasibleRegion={showFeasibleRegion}
          setShowFeasibleRegion={setShowFeasibleRegion}
          showConstraints={showConstraints}
          setShowConstraints={setShowConstraints}
          showVertices={showVertices}
          setShowVertices={setShowVertices}
          showObjectiveLine={showObjectiveLine}
          setShowObjectiveLine={setShowObjectiveLine}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
        />

        {/* Proof Stepper Bar */}
        <LPAnimationBar
          currentState={proofState}
          onSelectState={setProofState}
          onOpenHints={() => setIsHintsOpen(true)}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          <div className="xl:col-span-8 space-y-5">
            <Panel1LPCanvas
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              currentK={currentK}
              setCurrentK={setCurrentK}
              showFeasibleRegion={showFeasibleRegion}
              showConstraints={showConstraints}
              showVertices={showVertices}
              showObjectiveLine={showObjectiveLine}
              snapEnabled={snapEnabled}
            />

            <Panel3LPProof />
          </div>

          <div className="xl:col-span-4 space-y-5">
            <Panel2LPGuide
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
            />

            <LPWhyItWorksPanel
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Challenge Section */}
        <LPChallengeSection />
      </div>

      <LPHintModal
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
      />
    </div>
  );
};
