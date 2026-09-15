import React, { useState } from 'react';
import { 
  HelpCircle, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';
import { GRADIENT_PRESETS, GradientFieldPreset } from '../../data/gradientData';
import { ProofState } from '../../types';
import { GradientMissionBar } from './GradientMissionBar';
import { Panel1GradientCanvas } from './Panel1GradientCanvas';
import { Panel2GradientGuide } from './Panel2GradientGuide';
import { Panel3GradientProof } from './Panel3GradientProof';
import { GradientWhyItWorksPanel } from './GradientWhyItWorksPanel';
import { GradientChallengeSection } from './GradientChallengeSection';
import { GradientAnimationBar } from './GradientAnimationBar';
import { GradientHintModal } from './GradientHintModal';

interface Props {
  onBackToDashboard: () => void;
}

export const GradientSteepestIncreaseProofPage: React.FC<Props> = ({
  onBackToDashboard,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<GradientFieldPreset>(GRADIENT_PRESETS[0]);
  const [probePos, setProbePos] = useState<{ x: number; y: number }>(GRADIENT_PRESETS[0].defaultPos);
  const [testAngleDeg, setTestAngleDeg] = useState<number>(45);

  const [showContours, setShowContours] = useState(true);
  const [showGradient, setShowGradient] = useState(true);
  const [showTangent, setShowTangent] = useState(true);
  const [showDirectionalProbe, setShowDirectionalProbe] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [proofState, setProofState] = useState<ProofState>('manipulate');
  const [isHintsOpen, setIsHintsOpen] = useState(false);

  const handleReset = () => {
    setSelectedPreset(GRADIENT_PRESETS[0]);
    setProbePos(GRADIENT_PRESETS[0].defaultPos);
    setTestAngleDeg(45);
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
                className="hover:text-emerald-600 flex items-center gap-1 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Visual Proofs</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-emerald-600 font-bold">Engineering Mathematics</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200 shadow-sm">
                Intermediate
              </span>

              <span className="px-3 py-1 rounded-full bg-white text-slate-600 font-semibold text-xs border border-slate-200 shadow-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>10 min</span>
              </span>

              <button
                onClick={() => setIsHintsOpen(true)}
                className="w-7 h-7 rounded-full bg-white hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 border border-slate-200 shadow-sm flex items-center justify-center"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Gradient and Direction of Steepest Increase
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              <strong className="text-emerald-950 font-bold">Mission:</strong> Drag a point on contours and see grad f point uphill, perpendicular to level curves.
            </p>
          </div>
        </header>

        {/* Mission Bar */}
        <GradientMissionBar
          showContours={showContours}
          setShowContours={setShowContours}
          showGradient={showGradient}
          setShowGradient={setShowGradient}
          showTangent={showTangent}
          setShowTangent={setShowTangent}
          showDirectionalProbe={showDirectionalProbe}
          setShowDirectionalProbe={setShowDirectionalProbe}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
        />

        {/* Proof Stepper Bar */}
        <GradientAnimationBar
          currentState={proofState}
          onSelectState={setProofState}
          onOpenHints={() => setIsHintsOpen(true)}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          <div className="xl:col-span-8 space-y-5">
            <Panel1GradientCanvas
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              probePos={probePos}
              setProbePos={setProbePos}
              testAngleDeg={testAngleDeg}
              setTestAngleDeg={setTestAngleDeg}
              showContours={showContours}
              showGradient={showGradient}
              showTangent={showTangent}
              showDirectionalProbe={showDirectionalProbe}
              snapEnabled={snapEnabled}
            />

            <Panel3GradientProof />
          </div>

          <div className="xl:col-span-4 space-y-5">
            <Panel2GradientGuide
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
            />

            <GradientWhyItWorksPanel
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Challenge Section */}
        <GradientChallengeSection />
      </div>

      <GradientHintModal
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
      />
    </div>
  );
};
