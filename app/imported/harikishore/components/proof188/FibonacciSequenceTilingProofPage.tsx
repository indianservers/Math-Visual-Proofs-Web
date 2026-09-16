import React, { useState } from 'react';
import { 
  HelpCircle, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';
import { FIBONACCI_PRESETS, FibonacciPreset } from '../../data/fibonacciTilingData';
import { ProofState } from '../../types';
import { FibonacciTilingMissionBar } from './FibonacciTilingMissionBar';
import { Panel1FibonacciTilingCanvas } from './Panel1FibonacciTilingCanvas';
import { Panel2FibonacciTilingGuide } from './Panel2FibonacciTilingGuide';
import { Panel3FibonacciTilingProof } from './Panel3FibonacciTilingProof';
import { FibonacciTilingWhyItWorksPanel } from './FibonacciTilingWhyItWorksPanel';
import { FibonacciTilingChallengeSection } from './FibonacciTilingChallengeSection';
import { FibonacciTilingAnimationBar } from './FibonacciTilingAnimationBar';
import { FibonacciTilingHintModal } from './FibonacciTilingHintModal';

interface Props {
  onBackToDashboard: () => void;
}

export const FibonacciSequenceTilingProofPage: React.FC<Props> = ({
  onBackToDashboard,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<FibonacciPreset>(FIBONACCI_PRESETS[0]);
  const [n, setN] = useState<number>(FIBONACCI_PRESETS[0].n);

  const [showSquareLabels, setShowSquareLabels] = useState(true);
  const [showEdgeBrackets, setShowEdgeBrackets] = useState(true);
  const [showBoundingRect, setShowBoundingRect] = useState(true);
  const [showAreaFormula, setShowAreaFormula] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [proofState, setProofState] = useState<ProofState>('manipulate');
  const [isHintsOpen, setIsHintsOpen] = useState(false);

  return (
    <div className="flex-1 min-h-screen bg-[#f7fbf8] px-4 md:px-8 lg:px-10 py-6 overflow-y-auto font-sans select-none text-slate-800">
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
              <span className="text-emerald-700 font-bold">Sequences & Series</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-900 font-bold text-xs border border-emerald-200 shadow-xs">
                Intermediate
              </span>

              <span className="px-3 py-1 rounded-full bg-white text-slate-600 font-semibold text-xs border border-slate-200 shadow-xs flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>9 min</span>
              </span>

              <button
                onClick={() => setIsHintsOpen(true)}
                className="w-7 h-7 rounded-full bg-white hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 border border-slate-200 shadow-xs flex items-center justify-center transition-colors"
                title="Open Hints & Guidance"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-baseline gap-3 pt-1">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 font-sans">
              Fibonacci Sequence by Tiling
            </h1>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80 font-mono">
              F? = F??1 + F??2 &nbsp;|&nbsp; S F?² = F? F??1
            </span>
          </div>
          <p className="text-xs text-slate-500 font-sans">
            Watch squares with edge lengths of Fibonacci numbers pack side-by-side into a growing rectangle with zero gaps.
          </p>
        </header>

        {/* Mission / Control Bar */}
        <FibonacciTilingMissionBar
          showSquareLabels={showSquareLabels}
          setShowSquareLabels={setShowSquareLabels}
          showEdgeBrackets={showEdgeBrackets}
          setShowEdgeBrackets={setShowEdgeBrackets}
          showBoundingRect={showBoundingRect}
          setShowBoundingRect={setShowBoundingRect}
          showAreaFormula={showAreaFormula}
          setShowAreaFormula={setShowAreaFormula}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
        />

        {/* Top Main Grid: Canvas & Right-side Guides */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Visualizer Canvas */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <Panel1FibonacciTilingCanvas
              n={n}
              setN={setN}
              selectedPreset={selectedPreset}
              setSelectedPreset={setSelectedPreset}
              showSquareLabels={showSquareLabels}
              showEdgeBrackets={showEdgeBrackets}
              showBoundingRect={showBoundingRect}
              showAreaFormula={showAreaFormula}
            />
          </div>

          {/* Right Panels: Ledger & Proof */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <Panel2FibonacciTilingGuide
              n={n}
              setN={setN}
            />
            <Panel3FibonacciTilingProof />
          </div>
        </div>

        {/* Animation & Step Playback Bar */}
        <FibonacciTilingAnimationBar
          n={n}
          setN={setN}
          proofState={proofState}
          setProofState={setProofState}
        />

        {/* Intuition / Why It Works Section */}
        <FibonacciTilingWhyItWorksPanel />

        {/* Interactive Challenges Section */}
        <FibonacciTilingChallengeSection />

        {/* Modal Hints */}
        <FibonacciTilingHintModal
          isOpen={isHintsOpen}
          onClose={() => setIsHintsOpen(false)}
        />

      </div>
    </div>
  );
};
