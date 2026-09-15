import React, { useState } from 'react';
import { 
  HelpCircle, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';
import { GP_SCALING_PRESETS, GPScalingPreset } from '../../data/gpScalingData';
import { ProofState } from '../../types';
import { GPScalingMissionBar } from './GPScalingMissionBar';
import { Panel1GPScalingCanvas } from './Panel1GPScalingCanvas';
import { Panel2GPScalingGuide } from './Panel2GPScalingGuide';
import { Panel3GPScalingProof } from './Panel3GPScalingProof';
import { GPScalingWhyItWorksPanel } from './GPScalingWhyItWorksPanel';
import { GPScalingChallengeSection } from './GPScalingChallengeSection';
import { GPScalingAnimationBar } from './GPScalingAnimationBar';
import { GPScalingHintModal } from './GPScalingHintModal';

interface Props {
  onBackToDashboard: () => void;
}

export const GeometricProgressionRepeatedScalingProofPage: React.FC<Props> = ({
  onBackToDashboard,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<GPScalingPreset>(GP_SCALING_PRESETS[0]);
  const [a, setA] = useState<number>(GP_SCALING_PRESETS[0].a);
  const [r, setR] = useState<number>(GP_SCALING_PRESETS[0].r);
  const [n, setN] = useState<number>(GP_SCALING_PRESETS[0].n);

  const [showTowers, setShowTowers] = useState(true);
  const [showMultiplierArcs, setShowMultiplierArcs] = useState(true);
  const [showFormulas, setShowFormulas] = useState(true);
  const [showFormulaTag, setShowFormulaTag] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [proofState, setProofState] = useState<ProofState>('manipulate');
  const [isHintsOpen, setIsHintsOpen] = useState(false);

  const handleReset = () => {
    setSelectedPreset(GP_SCALING_PRESETS[0]);
    setA(GP_SCALING_PRESETS[0].a);
    setR(GP_SCALING_PRESETS[0].r);
    setN(GP_SCALING_PRESETS[0].n);
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
              <span className="text-emerald-600 font-bold">Sequences & Series</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200 shadow-sm">
                Beginner
              </span>

              <span className="px-3 py-1 rounded-full bg-white text-slate-600 font-semibold text-xs border border-slate-200 shadow-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>7 min</span>
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
              Geometric Progression as Repeated Scaling
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              <strong className="text-emerald-950 font-bold">Mission:</strong> Show each term scaling by the same ratio.
            </p>
          </div>
        </header>

        {/* Mission Bar */}
        <GPScalingMissionBar
          showTowers={showTowers}
          setShowTowers={setShowTowers}
          showMultiplierArcs={showMultiplierArcs}
          setShowMultiplierArcs={setShowMultiplierArcs}
          showFormulas={showFormulas}
          setShowFormulas={setShowFormulas}
          showFormulaTag={showFormulaTag}
          setShowFormulaTag={setShowFormulaTag}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
        />

        {/* Proof Stepper Bar */}
        <GPScalingAnimationBar
          currentState={proofState}
          onSelectState={setProofState}
          onOpenHints={() => setIsHintsOpen(true)}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          <div className="xl:col-span-8 space-y-5">
            <Panel1GPScalingCanvas
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              a={a}
              setA={setA}
              r={r}
              setR={setR}
              n={n}
              setN={setN}
              showTowers={showTowers}
              showMultiplierArcs={showMultiplierArcs}
              showFormulas={showFormulas}
              showFormulaTag={showFormulaTag}
            />

            <Panel3GPScalingProof />
          </div>

          <div className="xl:col-span-4 space-y-5">
            <Panel2GPScalingGuide
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              a={a}
              r={r}
              n={n}
            />

            <GPScalingWhyItWorksPanel
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Challenge Section */}
        <GPScalingChallengeSection />
      </div>

      <GPScalingHintModal
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
      />
    </div>
  );
};
