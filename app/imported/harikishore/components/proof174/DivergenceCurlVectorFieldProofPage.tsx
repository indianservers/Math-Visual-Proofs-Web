import React, { useState } from 'react';
import { 
  HelpCircle, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';
import { DIV_CURL_PRESETS, DivCurlPreset } from '../../data/divCurlData';
import { ProofState } from '../../types';
import { DivCurlMissionBar } from './DivCurlMissionBar';
import { Panel1DivCurlCanvas } from './Panel1DivCurlCanvas';
import { Panel2DivCurlGuide } from './Panel2DivCurlGuide';
import { Panel3DivCurlProof } from './Panel3DivCurlProof';
import { DivCurlWhyItWorksPanel } from './DivCurlWhyItWorksPanel';
import { DivCurlChallengeSection } from './DivCurlChallengeSection';
import { DivCurlAnimationBar } from './DivCurlAnimationBar';
import { DivCurlHintModal } from './DivCurlHintModal';

interface Props {
  onBackToDashboard: () => void;
}

export const DivergenceCurlVectorFieldProofPage: React.FC<Props> = ({
  onBackToDashboard,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<DivCurlPreset>(DIV_CURL_PRESETS[0]);
  const [probePos, setProbePos] = useState<{ x: number; y: number }>(DIV_CURL_PRESETS[0].defaultProbe);
  const [probeRadius, setProbeRadius] = useState<number>(0.6);

  const [showFieldGrid, setShowFieldGrid] = useState(true);
  const [showProbe, setShowProbe] = useState(true);
  const [showFlux, setShowFlux] = useState(true);
  const [showPaddle, setShowPaddle] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [proofState, setProofState] = useState<ProofState>('manipulate');
  const [isHintsOpen, setIsHintsOpen] = useState(false);

  const handleReset = () => {
    setSelectedPreset(DIV_CURL_PRESETS[0]);
    setProbePos(DIV_CURL_PRESETS[0].defaultProbe);
    setProbeRadius(0.6);
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
                className="hover:text-pink-600 flex items-center gap-1 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Visual Proofs</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-pink-600 font-bold">Engineering Mathematics</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-pink-50 text-pink-800 font-bold text-xs border border-pink-200 shadow-sm">
                Advanced
              </span>

              <span className="px-3 py-1 rounded-full bg-white text-slate-600 font-semibold text-xs border border-slate-200 shadow-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>12 min</span>
              </span>

              <button
                onClick={() => setIsHintsOpen(true)}
                className="w-7 h-7 rounded-full bg-white hover:bg-pink-50 text-slate-500 hover:text-pink-600 border border-slate-200 shadow-sm flex items-center justify-center"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Divergence and Curl Intuition
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              <strong className="text-pink-950 font-bold">Mission:</strong> Compare source, sink, rotation, and uniform vector fields using a local test region.
            </p>
          </div>
        </header>

        {/* Mission Bar */}
        <DivCurlMissionBar
          showFieldGrid={showFieldGrid}
          setShowFieldGrid={setShowFieldGrid}
          showProbe={showProbe}
          setShowProbe={setShowProbe}
          showFlux={showFlux}
          setShowFlux={setShowFlux}
          showPaddle={showPaddle}
          setShowPaddle={setShowPaddle}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
        />

        {/* Proof Stepper Bar */}
        <DivCurlAnimationBar
          currentState={proofState}
          onSelectState={setProofState}
          onOpenHints={() => setIsHintsOpen(true)}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          <div className="xl:col-span-8 space-y-5">
            <Panel1DivCurlCanvas
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              probePos={probePos}
              setProbePos={setProbePos}
              probeRadius={probeRadius}
              setProbeRadius={setProbeRadius}
              showFieldGrid={showFieldGrid}
              showProbe={showProbe}
              showFlux={showFlux}
              showPaddle={showPaddle}
              snapEnabled={snapEnabled}
            />

            <Panel3DivCurlProof />
          </div>

          <div className="xl:col-span-4 space-y-5">
            <Panel2DivCurlGuide
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
            />

            <DivCurlWhyItWorksPanel
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Challenge Section */}
        <DivCurlChallengeSection />
      </div>

      <DivCurlHintModal
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
      />
    </div>
  );
};
