import React, { useState } from 'react';
import { 
  HelpCircle, 
  Clock, 
  ArrowLeft, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import { TILES_DATA, TileDefinition } from '../../data/tessellationsData';
import { ProofState } from '../../types';
import { TessellationsMissionBar } from './TessellationsMissionBar';
import { Panel1TessellationCanvas } from './Panel1TessellationCanvas';
import { Panel2TessellationGuide } from './Panel2TessellationGuide';
import { Panel3TessellationProof } from './Panel3TessellationProof';
import { TessellationsWhyItWorksPanel } from './TessellationsWhyItWorksPanel';
import { TessellationsChallengeSection } from './TessellationsChallengeSection';
import { TessellationsAnimationBar } from './TessellationsAnimationBar';
import { TessellationsHintModal } from './TessellationsHintModal';
import { sound } from '../../utils/sound';

interface Props {
  onBackToDashboard: () => void;
}

export const TessellationsRepeatedTransformationsProofPage: React.FC<Props> = ({
  onBackToDashboard,
}) => {
  const [selectedTile, setSelectedTile] = useState<TileDefinition>(TILES_DATA.hexagon);
  const [showGrid, setShowGrid] = useState(true);
  const [showAngles, setShowAngles] = useState(true);
  const [showGaps, setShowGaps] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [tileCount, setTileCount] = useState(3);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'reflect'>('translate');
  const [proofState, setProofState] = useState<ProofState>('manipulate');
  const [isHintsOpen, setIsHintsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  const handleReset = () => {
    setTileCount(selectedTile.tilesAtVertex);
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
              <span className="text-emerald-600 font-bold">Transformations & Symmetry</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleMute}
                className="p-1.5 rounded-full bg-white text-slate-500 hover:text-emerald-600 border border-slate-200/80 shadow-sm"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

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
              Tessellations by Repeated Transformations
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              <strong className="text-emerald-950 font-bold">Mission:</strong> Repeat tiles by transformations and test for gaps and overlaps.
            </p>
          </div>
        </header>

        {/* Mission Bar */}
        <TessellationsMissionBar
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          showAngles={showAngles}
          setShowAngles={setShowAngles}
          showGaps={showGaps}
          setShowGaps={setShowGaps}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
        />

        {/* Proof Stepper Bar */}
        <TessellationsAnimationBar
          currentState={proofState}
          onSelectState={setProofState}
          onOpenHints={() => setIsHintsOpen(true)}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          <div className="xl:col-span-8 space-y-5">
            <Panel1TessellationCanvas
              selectedTile={selectedTile}
              onSelectTile={setSelectedTile}
              showGrid={showGrid}
              showAngles={showAngles}
              showGaps={showGaps}
              snapEnabled={snapEnabled}
              tileCount={tileCount}
              setTileCount={setTileCount}
              transformMode={transformMode}
              setTransformMode={setTransformMode}
            />

            <Panel3TessellationProof />
          </div>

          <div className="xl:col-span-4 space-y-5">
            <Panel2TessellationGuide
              selectedTile={selectedTile}
              onSelectTile={setSelectedTile}
            />

            <TessellationsWhyItWorksPanel
              selectedTile={selectedTile}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Challenge Section */}
        <TessellationsChallengeSection />
      </div>

      <TessellationsHintModal
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
      />
    </div>
  );
};
