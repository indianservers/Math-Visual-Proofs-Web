import React, { useState } from 'react';
import { 
  HelpCircle, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';
import { AP_PRESETS, APPreset } from '../../data/apData';
import { ProofState } from '../../types';
import { APMissionBar } from './APMissionBar';
import { Panel1APCanvas } from './Panel1APCanvas';
import { Panel2APGuide } from './Panel2APGuide';
import { Panel3APProof } from './Panel3APProof';
import { APWhyItWorksPanel } from './APWhyItWorksPanel';
import { APChallengeSection } from './APChallengeSection';
import { APAnimationBar } from './APAnimationBar';
import { APHintModal } from './APHintModal';

interface Props {
  onBackToDashboard: () => void;
}

export const ArithmeticProgressionEqualStepsProofPage: React.FC<Props> = ({
  onBackToDashboard,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<APPreset>(AP_PRESETS[0]);
  const [a, setA] = useState<number>(AP_PRESETS[0].a);
  const [d, setD] = useState<number>(AP_PRESETS[0].d);
  const [n, setN] = useState<number>(AP_PRESETS[0].n);

  const [showNumberLine, setShowNumberLine] = useState(true);
  const [showJumps, setShowJumps] = useState(true);
  const [showTerms, setShowTerms] = useState(true);
  const [showFormulas, setShowFormulas] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [proofState, setProofState] = useState<ProofState>('manipulate');
  const [isHintsOpen, setIsHintsOpen] = useState(false);

  const handleReset = () => {
    setSelectedPreset(AP_PRESETS[0]);
    setA(AP_PRESETS[0].a);
    setD(AP_PRESETS[0].d);
    setN(AP_PRESETS[0].n);
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
                className="hover:text-blue-600 flex items-center gap-1 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Visual Proofs</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-blue-600 font-bold">Sequences & Series</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-blue-50 text-blue-800 font-bold text-xs border border-blue-200 shadow-sm">
                Beginner
              </span>

              <span className="px-3 py-1 rounded-full bg-white text-slate-600 font-semibold text-xs border border-slate-200 shadow-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>7 min</span>
              </span>

              <button
                onClick={() => setIsHintsOpen(true)}
                className="w-7 h-7 rounded-full bg-white hover:bg-blue-50 text-slate-500 hover:text-blue-600 border border-slate-200 shadow-sm flex items-center justify-center"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Arithmetic Progression as Equal Steps
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              <strong className="text-blue-950 font-bold">Mission:</strong> Place AP terms on a number line and see the constant difference.
            </p>
          </div>
        </header>

        {/* Mission Bar */}
        <APMissionBar
          showNumberLine={showNumberLine}
          setShowNumberLine={setShowNumberLine}
          showJumps={showJumps}
          setShowJumps={setShowJumps}
          showTerms={showTerms}
          setShowTerms={setShowTerms}
          showFormulas={showFormulas}
          setShowFormulas={setShowFormulas}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
        />

        {/* Proof Stepper Bar */}
        <APAnimationBar
          currentState={proofState}
          onSelectState={setProofState}
          onOpenHints={() => setIsHintsOpen(true)}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          <div className="xl:col-span-8 space-y-5">
            <Panel1APCanvas
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              a={a}
              setA={setA}
              d={d}
              setD={setD}
              n={n}
              setN={setN}
              showNumberLine={showNumberLine}
              showJumps={showJumps}
              showTerms={showTerms}
              showFormulas={showFormulas}
              snapEnabled={snapEnabled}
            />

            <Panel3APProof />
          </div>

          <div className="xl:col-span-4 space-y-5">
            <Panel2APGuide
              selectedPreset={selectedPreset}
              a={a}
              d={d}
              n={n}
            />

            <APWhyItWorksPanel
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Challenge Section */}
        <APChallengeSection />
      </div>

      <APHintModal
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
      />
    </div>
  );
};
