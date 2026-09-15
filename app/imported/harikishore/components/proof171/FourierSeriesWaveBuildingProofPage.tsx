import React, { useState } from 'react';
import { 
  HelpCircle, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';
import { FOURIER_PRESETS, FourierWavePreset } from '../../data/fourierData';
import { ProofState } from '../../types';
import { FourierMissionBar } from './FourierMissionBar';
import { Panel1FourierCanvas } from './Panel1FourierCanvas';
import { Panel2FourierGuide } from './Panel2FourierGuide';
import { Panel3FourierProof } from './Panel3FourierProof';
import { FourierWhyItWorksPanel } from './FourierWhyItWorksPanel';
import { FourierChallengeSection } from './FourierChallengeSection';
import { FourierAnimationBar } from './FourierAnimationBar';
import { FourierHintModal } from './FourierHintModal';

interface Props {
  onBackToDashboard: () => void;
}

export const FourierSeriesWaveBuildingProofPage: React.FC<Props> = ({
  onBackToDashboard,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<FourierWavePreset>(FOURIER_PRESETS[0]);
  const [numHarmonics, setNumHarmonics] = useState<number>(5);

  const [showTarget, setShowTarget] = useState(true);
  const [showFourier, setShowFourier] = useState(true);
  const [showError, setShowError] = useState(true);
  const [showSpectrum, setShowSpectrum] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [proofState, setProofState] = useState<ProofState>('manipulate');
  const [isHintsOpen, setIsHintsOpen] = useState(false);

  const handleReset = () => {
    setSelectedPreset(FOURIER_PRESETS[0]);
    setNumHarmonics(5);
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
                Advanced
              </span>

              <span className="px-3 py-1 rounded-full bg-white text-slate-600 font-semibold text-xs border border-slate-200 shadow-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>12 min</span>
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
              Fourier Series as Wave Building
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              <strong className="text-violet-950 font-bold">Mission:</strong> Add harmonic waves and watch a periodic signal approximation improve.
            </p>
          </div>
        </header>

        {/* Mission Bar */}
        <FourierMissionBar
          showTarget={showTarget}
          setShowTarget={setShowTarget}
          showFourier={showFourier}
          setShowFourier={setShowFourier}
          showError={showError}
          setShowError={setShowError}
          showSpectrum={showSpectrum}
          setShowSpectrum={setShowSpectrum}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
        />

        {/* Proof Stepper Bar */}
        <FourierAnimationBar
          currentState={proofState}
          onSelectState={setProofState}
          onOpenHints={() => setIsHintsOpen(true)}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          <div className="xl:col-span-8 space-y-5">
            <Panel1FourierCanvas
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              numHarmonics={numHarmonics}
              setNumHarmonics={setNumHarmonics}
              showTarget={showTarget}
              showFourier={showFourier}
              showError={showError}
              showSpectrum={showSpectrum}
              snapEnabled={snapEnabled}
            />

            <Panel3FourierProof />
          </div>

          <div className="xl:col-span-4 space-y-5">
            <Panel2FourierGuide
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
            />

            <FourierWhyItWorksPanel
              numHarmonics={numHarmonics}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Challenge Section */}
        <FourierChallengeSection />
      </div>

      <FourierHintModal
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
      />
    </div>
  );
};
