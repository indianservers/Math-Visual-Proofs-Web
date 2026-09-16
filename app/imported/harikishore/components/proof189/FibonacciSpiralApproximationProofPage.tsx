import React, { useState } from 'react';
import { 
  HelpCircle, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';
import { SPIRAL_PRESETS, SpiralPreset } from '../../data/fibonacciSpiralData';
import { ProofState } from '../../types';
import { FibonacciSpiralMissionBar } from './FibonacciSpiralMissionBar';
import { Panel1FibonacciSpiralCanvas } from './Panel1FibonacciSpiralCanvas';
import { Panel2FibonacciSpiralGuide } from './Panel2FibonacciSpiralGuide';
import { Panel3FibonacciSpiralProof } from './Panel3FibonacciSpiralProof';
import { FibonacciSpiralWhyItWorksPanel } from './FibonacciSpiralWhyItWorksPanel';
import { FibonacciSpiralChallengeSection } from './FibonacciSpiralChallengeSection';
import { FibonacciSpiralAnimationBar } from './FibonacciSpiralAnimationBar';
import { FibonacciSpiralHintModal } from './FibonacciSpiralHintModal';

interface Props {
  onBackToDashboard: () => void;
}

export const FibonacciSpiralApproximationProofPage: React.FC<Props> = ({
  onBackToDashboard,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<SpiralPreset>(SPIRAL_PRESETS[0]);
  const [n, setN] = useState<number>(SPIRAL_PRESETS[0].n);

  const [showSpiralCurve, setShowSpiralCurve] = useState(true);
  const [showTilingBoxes, setShowTilingBoxes] = useState(true);
  const [showRatioTag, setShowRatioTag] = useState(true);
  const [showArcCenters, setShowArcCenters] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [proofState, setProofState] = useState<ProofState>('manipulate');
  const [isHintsOpen, setIsHintsOpen] = useState(false);

  return (
    <div className="flex-1 min-h-screen bg-[#fcf9f2] px-4 md:px-8 lg:px-10 py-6 overflow-y-auto font-sans select-none text-slate-800">
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
              <span className="text-amber-700 font-bold">Sequences & Series</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-amber-50 text-amber-900 font-bold text-xs border border-amber-200 shadow-xs">
                Intermediate
              </span>

              <span className="px-3 py-1 rounded-full bg-white text-slate-600 font-semibold text-xs border border-slate-200 shadow-xs flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>10 min</span>
              </span>

              <button
                onClick={() => setIsHintsOpen(true)}
                className="w-7 h-7 rounded-full bg-white hover:bg-amber-50 text-slate-500 hover:text-amber-700 border border-slate-200 shadow-xs flex items-center justify-center transition-colors"
                title="Open Hints & Guidance"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-baseline gap-3 pt-1">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 font-sans">
              Fibonacci Spiral Approximation
            </h1>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80 font-mono">
              r = F? &nbsp;|&nbsp; lim F??1/F? = f  1.618034
            </span>
          </div>
          <p className="text-xs text-slate-500 font-sans">
            Connect quarter-circle arcs within expanding Fibonacci squares to observe the golden ratio and smooth spiral growth.
          </p>
        </header>

        {/* Mission / Control Bar */}
        <FibonacciSpiralMissionBar
          showSpiralCurve={showSpiralCurve}
          setShowSpiralCurve={setShowSpiralCurve}
          showTilingBoxes={showTilingBoxes}
          setShowTilingBoxes={setShowTilingBoxes}
          showRatioTag={showRatioTag}
          setShowRatioTag={setShowRatioTag}
          showArcCenters={showArcCenters}
          setShowArcCenters={setShowArcCenters}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
        />

        {/* Top Main Grid: Canvas & Right-side Guides */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Visualizer Canvas */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <Panel1FibonacciSpiralCanvas
              n={n}
              setN={setN}
              selectedPreset={selectedPreset}
              setSelectedPreset={setSelectedPreset}
              showSpiralCurve={showSpiralCurve}
              showTilingBoxes={showTilingBoxes}
              showRatioTag={showRatioTag}
              showArcCenters={showArcCenters}
            />
          </div>

          {/* Right Panels: Ledger & Proof */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <Panel2FibonacciSpiralGuide
              n={n}
              setN={setN}
            />
            <Panel3FibonacciSpiralProof />
          </div>
        </div>

        {/* Animation & Step Playback Bar */}
        <FibonacciSpiralAnimationBar
          n={n}
          setN={setN}
          proofState={proofState}
          setProofState={setProofState}
        />

        {/* Intuition / Why It Works Section */}
        <FibonacciSpiralWhyItWorksPanel />

        {/* Interactive Challenges Section */}
        <FibonacciSpiralChallengeSection />

        {/* Modal Hints */}
        <FibonacciSpiralHintModal
          isOpen={isHintsOpen}
          onClose={() => setIsHintsOpen(false)}
        />

      </div>
    </div>
  );
};
