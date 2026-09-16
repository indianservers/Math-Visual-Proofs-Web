import React, { useState } from 'react';
import { 
  HelpCircle, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';
import { SQUARE_ODD_LAYER_PRESETS, SquareOddLayerPreset } from '../../data/squareOddLayersData';
import { ProofState } from '../../types';
import { SquareOddLayersMissionBar } from './SquareOddLayersMissionBar';
import { Panel1SquareOddLayersCanvas } from './Panel1SquareOddLayersCanvas';
import { Panel2SquareOddLayersGuide } from './Panel2SquareOddLayersGuide';
import { Panel3SquareOddLayersProof } from './Panel3SquareOddLayersProof';
import { SquareOddLayersWhyItWorksPanel } from './SquareOddLayersWhyItWorksPanel';
import { SquareOddLayersChallengeSection } from './SquareOddLayersChallengeSection';
import { SquareOddLayersAnimationBar } from './SquareOddLayersAnimationBar';
import { SquareOddLayersHintModal } from './SquareOddLayersHintModal';

interface Props {
  onBackToDashboard: () => void;
}

export const SquareNumbersOddLayersProofPage: React.FC<Props> = ({
  onBackToDashboard,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<SquareOddLayerPreset>(SQUARE_ODD_LAYER_PRESETS[0]);
  const [n, setN] = useState<number>(SQUARE_ODD_LAYER_PRESETS[0].n);

  const [showLLayers, setShowLLayers] = useState(true);
  const [showCornerBlocks, setShowCornerBlocks] = useState(true);
  const [showPrevSquareOutline, setShowPrevSquareOutline] = useState(true);
  const [showTileCounts, setShowTileCounts] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [proofState, setProofState] = useState<ProofState>('manipulate');
  const [isHintsOpen, setIsHintsOpen] = useState(false);

  const handleReset = () => {
    setSelectedPreset(SQUARE_ODD_LAYER_PRESETS[0]);
    setN(SQUARE_ODD_LAYER_PRESETS[0].n);
  };

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
              <span className="px-3.5 py-1 rounded-full bg-amber-50 text-amber-900 font-bold text-xs border border-amber-200 shadow-sm">
                Beginner
              </span>

              <span className="px-3 py-1 rounded-full bg-white text-slate-600 font-semibold text-xs border border-slate-200 shadow-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>8 min</span>
              </span>

              <button
                onClick={() => setIsHintsOpen(true)}
                className="w-7 h-7 rounded-full bg-white hover:bg-amber-50 text-slate-500 hover:text-amber-700 border border-slate-200 shadow-sm flex items-center justify-center"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Square Numbers from Odd Number Layers
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              <strong className="text-amber-950 font-bold">Mission:</strong> Grow n × n squares using odd L-shaped layers: n² - (n - 1)² = 2n - 1.
            </p>
          </div>
        </header>

        {/* Mission Bar */}
        <SquareOddLayersMissionBar
          showLLayers={showLLayers}
          setShowLLayers={setShowLLayers}
          showCornerBlocks={showCornerBlocks}
          setShowCornerBlocks={setShowCornerBlocks}
          showPrevSquareOutline={showPrevSquareOutline}
          setShowPrevSquareOutline={setShowPrevSquareOutline}
          showTileCounts={showTileCounts}
          setShowTileCounts={setShowTileCounts}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
        />

        {/* Proof Stepper Bar */}
        <SquareOddLayersAnimationBar
          currentState={proofState}
          onSelectState={setProofState}
          onOpenHints={() => setIsHintsOpen(true)}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          <div className="xl:col-span-8 space-y-5">
            <Panel1SquareOddLayersCanvas
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              n={n}
              setN={setN}
              showLLayers={showLLayers}
              showCornerBlocks={showCornerBlocks}
              showPrevSquareOutline={showPrevSquareOutline}
              showTileCounts={showTileCounts}
            />

            <Panel3SquareOddLayersProof />
          </div>

          <div className="xl:col-span-4 space-y-5">
            <Panel2SquareOddLayersGuide
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              n={n}
              setN={setN}
            />

            <SquareOddLayersWhyItWorksPanel
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Challenge Section */}
        <SquareOddLayersChallengeSection />
      </div>

      <SquareOddLayersHintModal
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
      />
    </div>
  );
};