import React, { useState } from 'react';
import { 
  HelpCircle, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';
import { AP_SUM_PRESETS, APSumPreset } from '../../data/apSumData';
import { ProofState } from '../../types';
import { APSumMissionBar } from './APSumMissionBar';
import { Panel1APSumCanvas } from './Panel1APSumCanvas';
import { Panel2APSumGuide } from './Panel2APSumGuide';
import { Panel3APSumProof } from './Panel3APSumProof';
import { APSumWhyItWorksPanel } from './APSumWhyItWorksPanel';
import { APSumChallengeSection } from './APSumChallengeSection';
import { APSumAnimationBar } from './APSumAnimationBar';
import { APSumHintModal } from './APSumHintModal';

interface Props {
  onBackToDashboard: () => void;
}

export const SumArithmeticProgressionProofPage: React.FC<Props> = ({
  onBackToDashboard,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<APSumPreset>(AP_SUM_PRESETS[0]);
  const [a, setA] = useState<number>(AP_SUM_PRESETS[0].a);
  const [d, setD] = useState<number>(AP_SUM_PRESETS[0].d);
  const [n, setN] = useState<number>(AP_SUM_PRESETS[0].n);
  const [stackProgress, setStackProgress] = useState<number>(1.0);

  const [showOriginalBars, setShowOriginalBars] = useState(true);
  const [showInvertedBars, setShowInvertedBars] = useState(true);
  const [showCeilingLine, setShowCeilingLine] = useState(true);
  const [showFormulaTag, setShowFormulaTag] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [proofState, setProofState] = useState<ProofState>('manipulate');
  const [isHintsOpen, setIsHintsOpen] = useState(false);

  const handleReset = () => {
    setSelectedPreset(AP_SUM_PRESETS[0]);
    setA(AP_SUM_PRESETS[0].a);
    setD(AP_SUM_PRESETS[0].d);
    setN(AP_SUM_PRESETS[0].n);
    setStackProgress(1.0);
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
                className="hover:text-purple-600 flex items-center gap-1 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Visual Proofs</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-purple-600 font-bold">Sequences & Series</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-purple-50 text-purple-800 font-bold text-xs border border-purple-200 shadow-sm">
                Intermediate
              </span>

              <span className="px-3 py-1 rounded-full bg-white text-slate-600 font-semibold text-xs border border-slate-200 shadow-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>9 min</span>
              </span>

              <button
                onClick={() => setIsHintsOpen(true)}
                className="w-7 h-7 rounded-full bg-white hover:bg-purple-50 text-slate-500 hover:text-purple-600 border border-slate-200 shadow-sm flex items-center justify-center"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Sum of Arithmetic Progression
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              <strong className="text-purple-950 font-bold">Mission:</strong> Pair first and last terms to make equal sums.
            </p>
          </div>
        </header>

        {/* Mission Bar */}
        <APSumMissionBar
          showOriginalBars={showOriginalBars}
          setShowOriginalBars={setShowOriginalBars}
          showInvertedBars={showInvertedBars}
          setShowInvertedBars={setShowInvertedBars}
          showCeilingLine={showCeilingLine}
          setShowCeilingLine={setShowCeilingLine}
          showFormulaTag={showFormulaTag}
          setShowFormulaTag={setShowFormulaTag}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
        />

        {/* Proof Stepper Bar */}
        <APSumAnimationBar
          currentState={proofState}
          onSelectState={setProofState}
          onOpenHints={() => setIsHintsOpen(true)}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          <div className="xl:col-span-8 space-y-5">
            <Panel1APSumCanvas
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              a={a}
              setA={setA}
              d={d}
              setD={setD}
              n={n}
              setN={setN}
              stackProgress={stackProgress}
              setStackProgress={setStackProgress}
              showOriginalBars={showOriginalBars}
              showInvertedBars={showInvertedBars}
              showCeilingLine={showCeilingLine}
              showFormulaTag={showFormulaTag}
            />

            <Panel3APSumProof />
          </div>

          <div className="xl:col-span-4 space-y-5">
            <Panel2APSumGuide
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              a={a}
              d={d}
              n={n}
            />

            <APSumWhyItWorksPanel
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Challenge Section */}
        <APSumChallengeSection />
      </div>

      <APSumHintModal
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
      />
    </div>
  );
};
