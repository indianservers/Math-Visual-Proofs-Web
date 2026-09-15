import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  RefreshCw, 
  Play, 
  Pause,
  Activity,
  Zap,
  Gauge
} from 'lucide-react';
import { SHM_PRESETS, SHMPreset } from '../../data/shmData';
import { computeSHMState, generateSpringPath, generateCosineWaveform } from '../../utils/shmMath';
import { MathView } from '../common/MathView';

interface Panel1Props {
  amplitude: number;
  setAmplitude: (a: number) => void;
  omega: number;
  setOmega: (w: number) => void;
  phase: number;
  setPhase: (p: number) => void;
  mass: number;
  setMass: (m: number) => void;
  springK: number;
  setSpringK: (k: number) => void;
  showSpring: boolean;
  showWave: boolean;
  showPhasor: boolean;
  showEnergy: boolean;
  snapEnabled: boolean;
  isCustomParams: boolean;
  setIsCustomParams: (val: boolean) => void;
  showDerivationShapes: boolean;
  setShowDerivationShapes: (val: boolean) => void;
}

export const Panel1SHMCanvas: React.FC<Panel1Props> = ({
  amplitude,
  setAmplitude,
  omega,
  setOmega,
  phase,
  setPhase,
  mass,
  setMass,
  springK,
  setSpringK,
  showSpring,
  showWave,
  showPhasor,
  showEnergy,
  snapEnabled,
  isCustomParams,
  setIsCustomParams,
  showDerivationShapes,
  setShowDerivationShapes,
}) => {
  const [time, setTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<string>('standard');
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Derivation shapes for showing SHM physics concepts
  const [derivationShapes, setDerivationShapes] = useState([
    { id: 1, type: 'force', x: 200, y: 80, label: 'F = -kx', color: '#ef4444' },
    { id: 2, type: 'velocity', x: 200, y: 140, label: 'v = dx/dt', color: '#10b981' },
    { id: 3, type: 'acceleration', x: 200, y: 200, label: 'a = d²x/dt²', color: '#8b5cf6' },
  ]);

  // Animation Loop
  useEffect(() => {
    const loop = (timestamp: number) => {
      if (lastTimeRef.current !== null && isPlaying) {
        const dt = (timestamp - lastTimeRef.current) / 1000;
        setTime(prev => (prev + dt) % 12);
      }
      lastTimeRef.current = timestamp;
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  const shm = computeSHMState(time, amplitude, omega, phase, mass, springK);

  // Layout parameters for SVG
  const svgWidth = 420;
  const svgHeight = 270;

  // Spring & Mass layout
  const wallX = 20;
  const eqX = 140; // Equilibrium center at x = 0
  const pxPerMeter = 36;
  const massX = eqX + shm.x * pxPerMeter;
  const springY = 45;
  const massWidth = 32;
  const massHeight = 32;

  // Phasor Circle layout
  const phasorCx = 75;
  const phasorCy = 135;
  const phasorR = amplitude * 22;
  const phasorAngle = omega * time + phase;
  const phasorTipX = phasorCx + phasorR * Math.cos(phasorAngle);
  const phasorTipY = phasorCy - phasorR * Math.sin(phasorAngle);

  // Waveform graph points
  const waveformPts = generateCosineWaveform(amplitude, omega, phase, 6.0, 80);
  const graphOriginX = 175;
  const graphOriginY = 195;
  const graphWidth = 225;
  const graphHeight = 80;
  const tScale = graphWidth / 6.0;
  const yScale = graphHeight / (2.6 * 2);

  const waveSvgPath = waveformPts
    .map((p, i) => {
      const gx = graphOriginX + p.x * tScale;
      const gy = graphOriginY - p.y * yScale;
      return `${i === 0 ? 'M' : 'L'} ${gx.toFixed(1)},${gy.toFixed(1)}`;
    })
    .join(' ');

  const currentWaveX = graphOriginX + (time % 6.0) * tScale;
  const currentWaveY = graphOriginY - shm.x * yScale;

  const handleApplyPreset = (preset: SHMPreset) => {
    setActivePreset(preset.id);
    setAmplitude(preset.amplitude);
    setOmega(preset.omega);
    setPhase(preset.phase);
    setTime(0);
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-amber-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            1
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Mass-Spring & Cosine Waveform Studio
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Adjust amplitude A, angular frequency ω, and phase φ to observe real-time kinematics and waveform generation.
        </p>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center py-1">
        {/* Left Parameter Controls Card */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-2.5">
          <div className="bg-amber-50/40 rounded-2xl p-4 border border-amber-100 shadow-inner w-full max-w-[220px] space-y-2.5">
            <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider text-center">
              SHM Waveform Model
            </div>

            <div className="p-2 bg-white rounded-xl border border-amber-200 text-center">
              <MathView math="x(t) = A\cos(\omega t + \phi)" className="text-slate-900 font-semibold text-xs" />
            </div>

            {/* Slider 1: Amplitude A */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>Amplitude A:</span>
                <span className="font-mono font-bold text-amber-800">{amplitude.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={amplitude}
                onChange={(e) => setAmplitude(parseFloat(e.target.value))}
                className="w-full accent-amber-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 2: Angular Frequency omega */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>Frequency ω:</span>
                <span className="font-mono font-bold text-indigo-700">{omega.toFixed(1)} rad/s</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="4.0"
                step="0.2"
                value={omega}
                onChange={(e) => setOmega(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 3: Phase phi */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>Phase φ:</span>
                <span className="font-mono font-bold text-emerald-700">{(phase / Math.PI).toFixed(2)}π</span>
              </div>
              <input
                type="range"
                min={-Math.PI}
                max={Math.PI}
                step={Math.PI / 8}
                value={phase}
                onChange={(e) => setPhase(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Custom Parameters */}
            {isCustomParams && (
              <>
                <div className="space-y-0.5 pt-2 border-t border-amber-200/80">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                    <span>Mass m:</span>
                    <span className="font-mono font-bold text-amber-800">{mass.toFixed(2)} kg</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="5.0"
                    step="0.1"
                    value={mass}
                    onChange={(e) => setMass(parseFloat(e.target.value))}
                    className="w-full accent-amber-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                    <span>Spring k:</span>
                    <span className="font-mono font-bold text-rose-800">{springK.toFixed(2)} N/m</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="20.0"
                    step="0.5"
                    value={springK}
                    onChange={(e) => setSpringK(parseFloat(e.target.value))}
                    className="w-full accent-rose-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              </>
            )}

            {/* Numerical Instantaneous Readouts */}
            <div className="text-[10px] space-y-1 pt-1.5 border-t border-amber-200/80 font-mono text-slate-700">
              <div className="flex justify-between">
                <span>Displacement x:</span>
                <strong className="text-amber-800">{shm.x.toFixed(2)} m</strong>
              </div>
              <div className="flex justify-between">
                <span>Velocity v:</span>
                <strong className="text-emerald-700">{shm.v.toFixed(2)} m/s</strong>
              </div>
              <div className="flex justify-between">
                <span>Period T:</span>
                <strong className="text-indigo-800">{shm.period.toFixed(2)} s</strong>
              </div>
            </div>
          </div>

          {/* Play/Pause & Reset Row */}
          <div className="flex items-center gap-2 w-full max-w-[220px]">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex-1 py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              <span>{isPlaying ? 'Pause Motion' : 'Play Motion'}</span>
            </button>
            <button
              onClick={() => setTime(0)}
              className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 shadow-sm"
              title="Reset Time"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Custom Parameters Toggle */}
          <button
            onClick={() => setIsCustomParams(!isCustomParams)}
            className={`w-full py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
              isCustomParams
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isCustomParams ? '✏️ Custom Mode ON' : '✏️ Enable Custom Params'}
          </button>

          {/* Derivation Shapes Toggle */}
          <button
            onClick={() => setShowDerivationShapes(!showDerivationShapes)}
            className={`w-full py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
              showDerivationShapes
                ? 'bg-teal-50 text-teal-700 border-teal-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {showDerivationShapes ? '🎯 Derivation Shapes ON' : '🎯 Show Derivation Steps'}
          </button>
        </div>

        {/* Middle / Right Interactive Canvas */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[440px] h-[270px] rounded-2xl bg-slate-50/60 border border-amber-100 shadow-sm overflow-hidden flex items-center justify-center select-none">
            <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
              {/* --- SECTION 1: PHYSICAL MASS-SPRING (TOP) --- */}
              {showSpring && (
                <g>
                  {/* Fixed wall */}
                  <rect x="10" y="20" width="10" height="50" fill="#94a3b8" rx="2" />
                  {/* Coiled spring */}
                  <path
                    d={generateSpringPath(wallX, massX - massWidth / 2, springY, 8, 12)}
                    fill="none"
                    stroke="#475569"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Equilibrium vertical line */}
                  <line x1={eqX} y1="15" x2={eqX} y2="75" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x={eqX} y="14" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">x = 0</text>

                  {/* Mass Block */}
                  <rect
                    x={massX - massWidth / 2}
                    y={springY - massHeight / 2}
                    width={massWidth}
                    height={massHeight}
                    fill="#d97706"
                    stroke="#b45309"
                    strokeWidth="2"
                    rx="4"
                    className="filter drop-shadow-sm"
                  />
                  <text
                    x={massX}
                    y={springY + 4}
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    m
                  </text>

                  {/* Velocity Vector Arrow */}
                  {Math.abs(shm.v) > 0.1 && (
                    <line
                      x1={massX}
                      y1={springY + 22}
                      x2={massX + shm.v * 8}
                      y2={springY + 22}
                      stroke="#059669"
                      strokeWidth="2.5"
                      markerEnd="url(#arrow-green)"
                    />
                  )}
                </g>
              )}

              {/* --- SECTION 2: ROTATING PHASOR CIRCLE (MIDDLE LEFT) --- */}
              {showPhasor && (
                <g>
                  {/* Outer circle */}
                  <circle cx={phasorCx} cy={phasorCy} r={phasorR} fill="rgba(245, 158, 11, 0.1)" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
                  {/* Center dot */}
                  <circle cx={phasorCx} cy={phasorCy} r="3" fill="#b45309" />
                  {/* Rotating vector */}
                  <line x1={phasorCx} y1={phasorCy} x2={phasorTipX} y2={phasorTipY} stroke="#b45309" strokeWidth="2.5" />
                  <circle cx={phasorTipX} cy={phasorTipY} r="4.5" fill="#d97706" stroke="#ffffff" strokeWidth="1.5" />
                  {/* Horizontal projection line */}
                  <line x1={phasorTipX} y1={phasorTipY} x2={graphOriginX} y2={phasorTipY} stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                </g>
              )}

              {/* --- SECTION 3: WAVEFORM GRAPH (BOTTOM) --- */}
              {showWave && (
                <g>
                  {/* Graph axes */}
                  <line x1={graphOriginX} y1={graphOriginY} x2={graphOriginX + graphWidth} y2={graphOriginY} stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1={graphOriginX} y1={graphOriginY - graphHeight / 2} x2={graphOriginX} y2={graphOriginY + graphHeight / 2} stroke="#94a3b8" strokeWidth="1.5" />

                  {/* Amplitude upper & lower bounds */}
                  <line x1={graphOriginX} y1={graphOriginY - amplitude * yScale} x2={graphOriginX + graphWidth} y2={graphOriginY - amplitude * yScale} stroke="#fef3c7" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1={graphOriginX} y1={graphOriginY + amplitude * yScale} x2={graphOriginX + graphWidth} y2={graphOriginY + amplitude * yScale} stroke="#fef3c7" strokeWidth="1" strokeDasharray="2 2" />
                  <text x={graphOriginX - 6} y={graphOriginY - amplitude * yScale + 3} fill="#d97706" fontSize="9" fontWeight="bold" textAnchor="end">+A</text>
                  <text x={graphOriginX - 6} y={graphOriginY + amplitude * yScale + 3} fill="#d97706" fontSize="9" fontWeight="bold" textAnchor="end">-A</text>

                  {/* Cosine Waveform curve */}
                  <path d={waveSvgPath} fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Current Time Dot */}
                  <circle cx={currentWaveX} cy={currentWaveY} r="5" fill="#d97706" stroke="#ffffff" strokeWidth="2" />
                  <line x1={currentWaveX} y1={graphOriginY - graphHeight / 2} x2={currentWaveX} y2={graphOriginY + graphHeight / 2} stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
                </g>
              )}

              {/* Derivation Shapes (movable shapes to show SHM physics concepts) */}
              {showDerivationShapes && derivationShapes.map((shape) => {
                // Dynamic positioning based on current SHM state
                let dynamicX = shape.x;
                let dynamicY = shape.y;
                let value = 0;
                let displayValue = '';

                if (shape.type === 'force') {
                  value = -springK * shm.x;
                  displayValue = `F = ${value.toFixed(2)} N`;
                  dynamicX = massX + 30; // Position near the mass
                  dynamicY = springY + 40;
                } else if (shape.type === 'velocity') {
                  value = shm.v;
                  displayValue = `v = ${value.toFixed(2)} m/s`;
                  dynamicX = massX + 30;
                  dynamicY = springY + 60;
                } else if (shape.type === 'acceleration') {
                  value = -springK * shm.x / mass;
                  displayValue = `a = ${value.toFixed(2)} m/s²`;
                  dynamicX = massX + 30;
                  dynamicY = springY + 80;
                }

                return (
                  <g key={shape.id}>
                    <rect
                      x={dynamicX - 40}
                      y={dynamicY - 12}
                      width={80}
                      height={24}
                      rx={4}
                      fill={shape.color}
                      opacity={0.9}
                      className="cursor-grab active:cursor-grabbing hover:opacity-100 transition-opacity"
                    />
                    <text
                      x={dynamicX}
                      y={dynamicY + 4}
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {displayValue}
                    </text>
                    <text
                      x={dynamicX}
                      y={dynamicY - 16}
                      fill={shape.color}
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {shape.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Live Energy Horizontal Bar on Bottom */}
            {showEnergy && (
              <div className="absolute bottom-2 right-3 w-48 bg-white/90 backdrop-blur-sm p-2 rounded-xl border border-amber-100 shadow-sm text-[10px] space-y-1">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Energy Conservation</span>
                  <span className="font-mono">{shm.totalEnergy.toFixed(2)} J</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
                  <div
                    className="bg-emerald-500 transition-all duration-75"
                    style={{ width: `${(shm.kineticEnergy / Math.max(0.01, shm.totalEnergy)) * 100}%` }}
                    title={`Kinetic Energy: ${shm.kineticEnergy.toFixed(2)} J`}
                  />
                  <div
                    className="bg-amber-500 transition-all duration-75"
                    style={{ width: `${(shm.potentialEnergy / Math.max(0.01, shm.totalEnergy)) * 100}%` }}
                    title={`Potential Energy: ${shm.potentialEnergy.toFixed(2)} J`}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-bold">
                  <span className="text-emerald-700">● K = {shm.kineticEnergy.toFixed(1)}J</span>
                  <span className="text-amber-700">● U = {shm.potentialEnergy.toFixed(1)}J</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Presets Bar */}
      <div className="pt-2.5 border-t border-amber-50/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">Presets:</span>
          {SHM_PRESETS.map((preset) => {
            const isSelected = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
