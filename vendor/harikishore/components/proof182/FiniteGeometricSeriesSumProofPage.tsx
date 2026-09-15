import React, { useState } from 'react';
import { 
  HelpCircle, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';
import { GP_SUM_PRESETS, GPSumPreset } from '../../data/gpSumData';
import { ProofState } from '../../types';
import { GPSumMissionBar } from './GPSumMissionBar';
import { Panel1GPSumCanvas } from './Panel1GPSumCanvas';
import { Panel2GPSumGuide } from './Panel2GPSumGuide';
import { Panel3GPSumProof } from './Panel3GPSumProof';
import { GPSumWhyItWorksPanel } from './GPSumWhyItWorksPanel';
import { GPSumChallengeSection } from './GPSumChallengeSection';
import { GPSumAnimationBar } from './GPSumAnimationBar';
import { GPSumHintModal } from './GPSumHintModal';

interface Props {
  onBackToDashboard: () => void;
}

export const FiniteGeometricSeriesSumProofPage: React.FC<Props> = ({
  onBackToDashboard,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<GPSumPreset>(GP_SUM_PRESETS[0]);
  const [a, setA] = useState<number>(GP_SUM_PRESETS[0].a);
  const [r, setR] = useState<number>(GP_SUM_PRESETS[0].r);
  const [n, setN] = useState<number>(GP_SUM_PRESETS[0].n);
  const [cancelProgress, setCancelProgress] = useState<number>(0);

  const [showSeriesS, setShowSeriesS] = useState(true);
  const [showShiftedRS, setShowShiftedRS] = useState(true);
  const [showCancellation, setShowCancellation] = useState(true);
  const [showFormulaTag, setShowFormulaTag] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [proofState, setProofState] = useState<ProofState>('manipulate');
  const [isHintsOpen, setIsHintsOpen] = useState(false);

  const handleReset = () => {
    setSelectedPreset(GP_SUM_PRESETS[0]);
    setA(GP_SUM_PRESETS[0].a);
    setR(GP_SUM_PRESETS[0].r);
    setN(GP_SUM_PRESETS[0].n);
    setCancelProgress(0);
  };

  return (
    <div className="flex-1 min-h-screen bg-[#f8f6fb] px-4 md:px-8 lg:px-10 py-6 overflow-y-auto font-sans select-none text-slate-800">
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
              <span className="text-pink-600 font-bold">Sequences & Series</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-pink-50 text-pink-800 font-bold text-xs border border-pink-200 shadow-sm">
                Intermediate
              </span>

              <span className="px-3 py-1 rounded-full bg-white text-slate-600 font-semibold text-xs border border-slate-200 shadow-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>9 min</span>
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
              Sum of Finite Geometric Series
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              <strong className="text-pink-950 font-bold">Mission:</strong> Multiply series by r, shift, and subtract to collapse all middle terms.
            </p>
          </div>
        </header>

        {/* Mission Bar */}
        <GPSumMissionBar
          showSeriesS={showSeriesS}
          setShowSeriesS={setShowSeriesS}
          showShiftedRS={showShiftedRS}
          setShowShiftedRS={setShowShiftedRS}
          showCancellation={showCancellation}
          setShowCancellation={setShowCancellation}
          showFormulaTag={showFormulaTag}
          setShowFormulaTag={setShowFormulaTag}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
        />

        {/* Proof Stepper Bar */}
        <GPSumAnimationBar
          currentState={proofState}
          onSelectState={setProofState}
          onOpenHints={() => setIsHintsOpen(true)}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          <div className="xl:col-span-8 space-y-5">
            <Panel1GPSumCanvas
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              a={a}
              setA={setA}
              r={r}
              setR={setR}
              n={n}
              setN={setN}
              cancelProgress={cancelProgress}
              setCancelProgress={setCancelProgress}
              showSeriesS={showSeriesS}
              showShiftedRS={showShiftedRS}
              showCancellation={showCancellation}
              showFormulaTag={showFormulaTag}
            />

            <Panel3GPSumProof />
          </div>

          <div className="xl:col-span-4 space-y-5">
            <Panel2GPSumGuide
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              a={a}
              r={r}
              n={n}
            />

            <GPSumWhyItWorksPanel
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Challenge Section */}
        <GPSumChallengeSection />
      </div>

      <GPSumHintModal
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
      />
    </div>
  );
};