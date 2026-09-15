import React, { useState } from 'react';
import { 
  HelpCircle, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';
import { LAPLACE_PRESETS, LaplacePreset } from '../../data/laplaceData';
import { ProofState } from '../../types';
import { LaplaceMissionBar } from './LaplaceMissionBar';
import { Panel1LaplaceCanvas } from './Panel1LaplaceCanvas';
import { Panel2LaplaceGuide } from './Panel2LaplaceGuide';
import { Panel3LaplaceProof } from './Panel3LaplaceProof';
import { LaplaceWhyItWorksPanel } from './LaplaceWhyItWorksPanel';
import { LaplaceChallengeSection } from './LaplaceChallengeSection';
import { LaplaceAnimationBar } from './LaplaceAnimationBar';
import { LaplaceHintModal } from './LaplaceHintModal';

interface Props {
  onBackToDashboard: () => void;
}

export const LaplaceTransformDecaySystemProofPage: React.FC<Props> = ({
  onBackToDashboard,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<LaplacePreset>(LAPLACE_PRESETS[0]);
  const [decayRateA, setDecayRateA] = useState<number>(1.5);

  const [showTimeCurve, setShowTimeCurve] = useState(true);
  const [showTau, setShowTau] = useState(true);
  const [showPoles, setShowPoles] = useState(true);
  const [showROC, setShowROC] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [proofState, setProofState] = useState<ProofState>('manipulate');
  const [isHintsOpen, setIsHintsOpen] = useState(false);

  const handleReset = () => {
    setSelectedPreset(LAPLACE_PRESETS[0]);
    setDecayRateA(1.5);
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
                className="hover:text-cyan-600 flex items-center gap-1 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Visual Proofs</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-cyan-600 font-bold">Engineering Mathematics</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-cyan-50 text-cyan-800 font-bold text-xs border border-cyan-200 shadow-sm">
                Advanced
              </span>

              <span className="px-3 py-1 rounded-full bg-white text-slate-600 font-semibold text-xs border border-slate-200 shadow-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>11 min</span>
              </span>

              <button
                onClick={() => setIsHintsOpen(true)}
                className="w-7 h-7 rounded-full bg-white hover:bg-cyan-50 text-slate-500 hover:text-cyan-600 border border-slate-200 shadow-sm flex items-center justify-center"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Laplace Transform as Time-to-System View
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              <strong className="text-cyan-950 font-bold">Mission:</strong> Transform e^(-at) into 1/(s+a) and compare time decay with s-domain expression.
            </p>
          </div>
        </header>

        {/* Mission Bar */}
        <LaplaceMissionBar
          showTimeCurve={showTimeCurve}
          setShowTimeCurve={setShowTimeCurve}
          showTau={showTau}
          setShowTau={setShowTau}
          showPoles={showPoles}
          setShowPoles={setShowPoles}
          showROC={showROC}
          setShowROC={setShowROC}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
        />

        {/* Proof Stepper Bar */}
        <LaplaceAnimationBar
          currentState={proofState}
          onSelectState={setProofState}
          onOpenHints={() => setIsHintsOpen(true)}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          <div className="xl:col-span-8 space-y-5">
            <Panel1LaplaceCanvas
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              decayRateA={decayRateA}
              setDecayRateA={setDecayRateA}
              showTimeCurve={showTimeCurve}
              showTau={showTau}
              showPoles={showPoles}
              showROC={showROC}
              snapEnabled={snapEnabled}
            />

            <Panel3LaplaceProof />
          </div>

          <div className="xl:col-span-4 space-y-5">
            <Panel2LaplaceGuide
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
            />

            <LaplaceWhyItWorksPanel
              decayRateA={decayRateA}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Challenge Section */}
        <LaplaceChallengeSection />
      </div>

      <LaplaceHintModal
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
      />
    </div>
  );
};
