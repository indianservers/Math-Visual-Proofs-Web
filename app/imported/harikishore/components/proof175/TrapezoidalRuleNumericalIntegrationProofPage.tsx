import React, { useState } from 'react';
import { 
  HelpCircle, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';
import { TRAPEZOID_PRESETS, TrapezoidPreset } from '../../data/trapezoidData';
import { ProofState } from '../../types';
import { TrapezoidMissionBar } from './TrapezoidMissionBar';
import { Panel1TrapezoidCanvas } from './Panel1TrapezoidCanvas';
import { Panel2TrapezoidGuide } from './Panel2TrapezoidGuide';
import { Panel3TrapezoidProof } from './Panel3TrapezoidProof';
import { TrapezoidWhyItWorksPanel } from './TrapezoidWhyItWorksPanel';
import { TrapezoidChallengeSection } from './TrapezoidChallengeSection';
import { TrapezoidAnimationBar } from './TrapezoidAnimationBar';
import { TrapezoidHintModal } from './TrapezoidHintModal';

interface Props {
  onBackToDashboard: () => void;
}

export const TrapezoidalRuleNumericalIntegrationProofPage: React.FC<Props> = ({
  onBackToDashboard,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<TrapezoidPreset>(TRAPEZOID_PRESETS[0]);
  const [subintervalN, setSubintervalN] = useState<number>(4);

  const [showCurve, setShowCurve] = useState(true);
  const [showTrapezoids, setShowTrapezoids] = useState(true);
  const [showNodes, setShowNodes] = useState(true);
  const [showSecants, setShowSecants] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [proofState, setProofState] = useState<ProofState>('manipulate');
  const [isHintsOpen, setIsHintsOpen] = useState(false);

  const handleReset = () => {
    setSelectedPreset(TRAPEZOID_PRESETS[0]);
    setSubintervalN(4);
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
              <span className="text-amber-600 font-bold">Engineering Mathematics</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200 shadow-sm">
                Intermediate
              </span>

              <span className="px-3 py-1 rounded-full bg-white text-slate-600 font-semibold text-xs border border-slate-200 shadow-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>10 min</span>
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
              Numerical Integration: Trapezoidal Rule
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              <strong className="text-amber-950 font-bold">Mission:</strong> Approximate area under a curve by splitting it into trapezoids.
            </p>
          </div>
        </header>

        {/* Mission Bar */}
        <TrapezoidMissionBar
          showCurve={showCurve}
          setShowCurve={setShowCurve}
          showTrapezoids={showTrapezoids}
          setShowTrapezoids={setShowTrapezoids}
          showNodes={showNodes}
          setShowNodes={setShowNodes}
          showSecants={showSecants}
          setShowSecants={setShowSecants}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
        />

        {/* Proof Stepper Bar */}
        <TrapezoidAnimationBar
          currentState={proofState}
          onSelectState={setProofState}
          onOpenHints={() => setIsHintsOpen(true)}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          <div className="xl:col-span-8 space-y-5">
            <Panel1TrapezoidCanvas
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              subintervalN={subintervalN}
              setSubintervalN={setSubintervalN}
              showCurve={showCurve}
              showTrapezoids={showTrapezoids}
              showNodes={showNodes}
              showSecants={showSecants}
              snapEnabled={snapEnabled}
            />

            <Panel3TrapezoidProof />
          </div>

          <div className="xl:col-span-4 space-y-5">
            <Panel2TrapezoidGuide
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
            />

            <TrapezoidWhyItWorksPanel
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Challenge Section */}
        <TrapezoidChallengeSection />
      </div>

      <TrapezoidHintModal
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
      />
    </div>
  );
};
