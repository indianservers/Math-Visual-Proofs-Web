import React, { useState } from 'react';
import { 
  HelpCircle, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';
import { SHMPreset } from '../../data/shmData';
import { ProofState } from '../../types';
import { SHMMissionBar } from './SHMMissionBar';
import { Panel1SHMCanvas } from './Panel1SHMCanvas';
import { Panel2SHMGuide } from './Panel2SHMGuide';
import { Panel3SHMProof } from './Panel3SHMProof';
import { SHMWhyItWorksPanel } from './SHMWhyItWorksPanel';
import { SHMChallengeSection } from './SHMChallengeSection';
import { SHMAnimationBar } from './SHMAnimationBar';
import { SHMHintModal } from './SHMHintModal';

interface Props {
  onBackToDashboard: () => void;
}

export const SimpleHarmonicMotionProofPage: React.FC<Props> = ({
  onBackToDashboard,
}) => {
  const [amplitude, setAmplitude] = useState<number>(1.5);
  const [omega, setOmega] = useState<number>(2.0);
  const [phase, setPhase] = useState<number>(0);
  const [mass, setMass] = useState<number>(1.0);
  const [springK, setSpringK] = useState<number>(4.0);

  const [showSpring, setShowSpring] = useState(true);
  const [showWave, setShowWave] = useState(true);
  const [showPhasor, setShowPhasor] = useState(true);
  const [showEnergy, setShowEnergy] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [isCustomParams, setIsCustomParams] = useState(false);
  const [showDerivationShapes, setShowDerivationShapes] = useState(false);
  const [proofState, setProofState] = useState<ProofState>('manipulate');
  const [isHintsOpen, setIsHintsOpen] = useState(false);

  const handleApplyPreset = (p: SHMPreset) => {
    setAmplitude(p.amplitude);
    setOmega(p.omega);
    setPhase(p.phase);
    setMass(p.mass);
    setSpringK(p.springK);
  };

  const handleReset = () => {
    setAmplitude(1.5);
    setOmega(2.0);
    setPhase(0);
    setMass(1.0);
    setSpringK(4.0);
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
              Simple Harmonic Motion
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              <strong className="text-amber-950 font-bold">Mission:</strong> Connect an oscillating mass to x(t)=A cos(omega t + phi).
            </p>
          </div>
        </header>

        {/* Mission Bar */}
        <SHMMissionBar
          showSpring={showSpring}
          setShowSpring={setShowSpring}
          showWave={showWave}
          setShowWave={setShowWave}
          showPhasor={showPhasor}
          setShowPhasor={setShowPhasor}
          showEnergy={showEnergy}
          setShowEnergy={setShowEnergy}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
        />

        {/* Proof Stepper Bar */}
        <SHMAnimationBar
          currentState={proofState}
          onSelectState={setProofState}
          onOpenHints={() => setIsHintsOpen(true)}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          <div className="xl:col-span-8 space-y-5">
            <Panel1SHMCanvas
              amplitude={amplitude}
              setAmplitude={setAmplitude}
              omega={omega}
              setOmega={setOmega}
              phase={phase}
              setPhase={setPhase}
              mass={mass}
              setMass={setMass}
              springK={springK}
              setSpringK={setSpringK}
              showSpring={showSpring}
              showWave={showWave}
              showPhasor={showPhasor}
              showEnergy={showEnergy}
              snapEnabled={snapEnabled}
              isCustomParams={isCustomParams}
              setIsCustomParams={setIsCustomParams}
              showDerivationShapes={showDerivationShapes}
              setShowDerivationShapes={setShowDerivationShapes}
            />

            <Panel3SHMProof />
          </div>

          <div className="xl:col-span-4 space-y-5">
            <Panel2SHMGuide
              amplitude={amplitude}
              omega={omega}
              phase={phase}
              onApplyPreset={handleApplyPreset}
            />

            <SHMWhyItWorksPanel
              amplitude={amplitude}
              omega={omega}
              phase={phase}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Challenge Section */}
        <SHMChallengeSection />
      </div>

      <SHMHintModal
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
      />
    </div>
  );
};
