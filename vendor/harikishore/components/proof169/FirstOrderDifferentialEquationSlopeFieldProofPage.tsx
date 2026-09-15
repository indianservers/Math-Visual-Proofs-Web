import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';
import { ODE_PRESETS, ODEPreset } from '../../data/slopeFieldData';
import { ProofState } from '../../types';
import { SlopeFieldMissionBar } from './SlopeFieldMissionBar';
import { Panel1SlopeFieldCanvas } from './Panel1SlopeFieldCanvas';
import { Panel2SlopeFieldGuide } from './Panel2SlopeFieldGuide';
import { Panel3SlopeFieldProof } from './Panel3SlopeFieldProof';
import { SlopeFieldWhyItWorksPanel } from './SlopeFieldWhyItWorksPanel';
import { SlopeFieldChallengeSection } from './SlopeFieldChallengeSection';
import { SlopeFieldAnimationBar } from './SlopeFieldAnimationBar';
import { SlopeFieldHintModal } from './SlopeFieldHintModal';

interface Props {
  onBackToDashboard: () => void;
}

export const FirstOrderDifferentialEquationSlopeFieldProofPage: React.FC<Props> = ({
  onBackToDashboard,
}) => {
  const [selectedODE, setSelectedODE] = useState<ODEPreset>(ODE_PRESETS[0]);
  const [x0, setX0] = useState<number>(0);
  const [y0, setY0] = useState<number>(1);
  const [stepSizeH, setStepSizeH] = useState<number>(0.5);
  const [customEquation, setCustomEquation] = useState<string>('x - y');
  const [showXVariation, setShowXVariation] = useState(false);
  const [showYVariation, setShowYVariation] = useState(false);
  const [show3DPlane, setShow3DPlane] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  const [showGrid, setShowGrid] = useState(true);
  const [showArrows, setShowArrows] = useState(true);
  const [showCurve, setShowCurve] = useState(true);
  const [showEuler, setShowEuler] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [proofState, setProofState] = useState<ProofState>('manipulate');
  const [isHintsOpen, setIsHintsOpen] = useState(false);

  const handleSetInitialCondition = (x: number, y: number) => {
    setX0(x);
    setY0(y);
  };

  const handleReset = () => {
    setX0(0);
    setY0(1);
    setStepSizeH(0.5);
    setAnimationProgress(0);
  };

  // Animation loop for 3D plane
  useEffect(() => {
    if (!show3DPlane) return;
    
    const interval = setInterval(() => {
      setAnimationProgress(prev => (prev + 0.02) % 1);
    }, 50);
    
    return () => clearInterval(interval);
  }, [show3DPlane]);

  return (
    <div className="flex-1 min-h-screen bg-[#f3f4f9] px-4 md:px-8 lg:px-10 py-6 overflow-y-auto font-sans select-none text-slate-800">
      <div className="max-w-[1600px] mx-auto space-y-5">
        
        {/* Top Header */}
        <header className="space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <button
                onClick={onBackToDashboard}
                className="hover:text-sky-600 flex items-center gap-1 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Visual Proofs</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-sky-600 font-bold">Engineering Mathematics</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-sky-50 text-sky-800 font-bold text-xs border border-sky-200 shadow-sm">
                Intermediate
              </span>

              <span className="px-3 py-1 rounded-full bg-white text-slate-600 font-semibold text-xs border border-slate-200 shadow-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>10 min</span>
              </span>

              <button
                onClick={() => setIsHintsOpen(true)}
                className="w-7 h-7 rounded-full bg-white hover:bg-sky-50 text-slate-500 hover:text-sky-600 border border-slate-200 shadow-sm flex items-center justify-center"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              First-Order Differential Equation: Slope Field
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              <strong className="text-sky-950 font-bold">Mission:</strong> Read dy/dx=f(x,y) as local direction arrows and trace a solution from an initial condition.
            </p>
          </div>
        </header>

        {/* Mission Bar */}
        <SlopeFieldMissionBar
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          showArrows={showArrows}
          setShowArrows={setShowArrows}
          showCurve={showCurve}
          setShowCurve={setShowCurve}
          showEuler={showEuler}
          setShowEuler={setShowEuler}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
          showXVariation={showXVariation}
          setShowXVariation={setShowXVariation}
          showYVariation={showYVariation}
          setShowYVariation={setShowYVariation}
          show3DPlane={show3DPlane}
          setShow3DPlane={setShow3DPlane}
        />

        {/* Proof Stepper Bar */}
        <SlopeFieldAnimationBar
          currentState={proofState}
          onSelectState={setProofState}
          onOpenHints={() => setIsHintsOpen(true)}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          <div className="xl:col-span-8 space-y-5">
            <Panel1SlopeFieldCanvas
              selectedODE={selectedODE}
              onSelectODE={setSelectedODE}
              x0={x0}
              y0={y0}
              setInitialCondition={handleSetInitialCondition}
              stepSizeH={stepSizeH}
              setStepSizeH={setStepSizeH}
              showGrid={showGrid}
              showArrows={showArrows}
              showCurve={showCurve}
              showEuler={showEuler}
              snapEnabled={snapEnabled}
              customEquation={customEquation}
              setCustomEquation={setCustomEquation}
              showXVariation={showXVariation}
              showYVariation={showYVariation}
              show3DPlane={show3DPlane}
              animationProgress={animationProgress}
              setAnimationProgress={setAnimationProgress}
            />

            <Panel3SlopeFieldProof />
          </div>

          <div className="xl:col-span-4 space-y-5">
            <Panel2SlopeFieldGuide
              selectedODE={selectedODE}
              onSelectODE={setSelectedODE}
            />

            <SlopeFieldWhyItWorksPanel
              selectedODE={selectedODE}
              x0={x0}
              y0={y0}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Challenge Section */}
        <SlopeFieldChallengeSection />
      </div>

      <SlopeFieldHintModal
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
      />
    </div>
  );
};
