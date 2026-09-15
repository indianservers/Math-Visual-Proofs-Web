import React, { useState } from 'react';
import { 
  HelpCircle, 
  Clock, 
  ChevronRight, 
  Layers, 
  ArrowLeft,
  Share2,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';
import { SHAPES_DATA } from '../../data/shapesData';
import { ShapeDefinition, ProofState } from '../../types';
import { MissionBar } from './MissionBar';
import { Panel1DragRotateDiscover } from './Panel1DragRotateDiscover';
import { Panel2SymmetryGuide } from './Panel2SymmetryGuide';
import { Panel3VisualProof } from './Panel3VisualProof';
import { WhyItWorksPanel } from './WhyItWorksPanel';
import { ChallengeSection } from './ChallengeSection';
import { AnimationPlayerBar } from './AnimationPlayerBar';
import { HintCoachModal } from './HintCoachModal';
import { sound } from '../../utils/sound';

interface LineRotationalSymmetryProofPageProps {
  onBackToDashboard: () => void;
}

export const LineRotationalSymmetryProofPage: React.FC<LineRotationalSymmetryProofPageProps> = ({
  onBackToDashboard,
}) => {
  // Active selected shape state (default: Regular Hexagon as in screenshot)
  const [selectedShape, setSelectedShape] = useState<ShapeDefinition>(SHAPES_DATA.hexagon);
  
  // Show / Display toggles
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [showCentre, setShowCentre] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);

  // Rotation and symmetry match state
  const [rotationAngle, setRotationAngle] = useState(0);
  const [matchedSteps, setMatchedSteps] = useState<number[]>([1]);
  const [isDropped, setIsDropped] = useState(true);
  const [customN, setCustomN] = useState(6); // default hexagon (6 sides)

  // Proof Guided Player State
  const [proofState, setProofState] = useState<ProofState>('manipulate');
  
  // Modals & Audio
  const [isHintsOpen, setIsHintsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  const handleReset = () => {
    setRotationAngle(0);
    setMatchedSteps([1]);
  };

  return (
    <div className="flex-1 min-h-screen bg-[#f3f4f9] px-4 md:px-8 lg:px-10 py-6 overflow-y-auto font-sans select-none text-slate-800">
      <div className="max-w-[1600px] mx-auto space-y-5">
        
        {/* Top Header & Breadcrumb Hierarchy */}
        <header className="space-y-1.5">
          {/* Breadcrumb & Badges Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <button
                onClick={onBackToDashboard}
                className="hover:text-indigo-600 flex items-center gap-1 transition-colors group"
                title="Back to Catalog"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Visual Proofs</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-indigo-600 font-bold">Symmetry</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleMute}
                className="p-1.5 rounded-full bg-white text-slate-500 hover:text-indigo-600 border border-slate-200/80 shadow-sm transition-colors"
                title={isMuted ? 'Unmute Sounds' : 'Mute Sounds'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              {/* Intermediate Pill Badge */}
              <span className="px-3.5 py-1 rounded-full bg-indigo-50/90 text-indigo-700 font-bold text-xs border border-indigo-100 shadow-sm">
                Intermediate
              </span>

              {/* 15 min Timer Badge */}
              <span className="px-3 py-1 rounded-full bg-white text-slate-600 font-semibold text-xs border border-slate-200/80 shadow-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>15 min</span>
              </span>

              {/* Help Button */}
              <button
                onClick={() => setIsHintsOpen(true)}
                className="w-7 h-7 rounded-full bg-white hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 border border-slate-200/80 shadow-sm flex items-center justify-center transition-colors"
                title="Open Hint Guide"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Title & Mission Statement */}
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Line Symmetry and Rotational Symmetry
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              <strong className="text-indigo-950 font-bold">Mission:</strong> Discover how many ways a shape matches itself across a line or around a centre.
            </p>
          </div>
        </header>

        {/* Mission Bar with Show Toggles */}
        <MissionBar
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          showAxes={showAxes}
          setShowAxes={setShowAxes}
          showCentre={showCentre}
          setShowCentre={setShowCentre}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
        />

        {/* Guided Proof Player Controller */}
        <AnimationPlayerBar
          currentState={proofState}
          onSelectState={setProofState}
          onOpenHints={() => setIsHintsOpen(true)}
        />

        {/* Main Grid: Left 2/3 (Panel 1 & Panel 3), Right 1/3 (Panel 2 & Why It Works) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* Left Column (Panels 1 & 3) */}
          <div className="xl:col-span-8 space-y-5">
            {/* Panel 1: Drag, Rotate, Discover */}
            <Panel1DragRotateDiscover
              selectedShape={selectedShape}
              onSelectShape={setSelectedShape}
              showGrid={showGrid}
              showAxes={showAxes}
              showCentre={showCentre}
              snapEnabled={snapEnabled}
              rotationAngle={rotationAngle}
              setRotationAngle={setRotationAngle}
              matchedSteps={matchedSteps}
              setMatchedSteps={setMatchedSteps}
              isDropped={isDropped}
              setIsDropped={setIsDropped}
              customN={customN}
              setCustomN={setCustomN}
            />

            {/* Panel 3: Visual Proof (Regular n-gon) */}
            <Panel3VisualProof sides={selectedShape.sides} />
          </div>

          {/* Right Column (Panel 2 & Why It Works) */}
          <div className="xl:col-span-4 space-y-5">
            {/* Panel 2: Symmetry Guide */}
            <Panel2SymmetryGuide
              selectedShape={selectedShape}
              onSelectShape={setSelectedShape}
            />

            {/* Why It Works & Prediction Quiz */}
            <WhyItWorksPanel
              selectedShape={selectedShape}
              rotationAngle={rotationAngle}
              matchedSteps={matchedSteps}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Bottom Section: Challenge and Tip */}
        <ChallengeSection />
      </div>

      {/* Progressive Hint Coach Modal */}
      <HintCoachModal
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
      />
    </div>
  );
};
