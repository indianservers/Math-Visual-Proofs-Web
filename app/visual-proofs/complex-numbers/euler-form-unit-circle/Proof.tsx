"use client";

import gsap from "gsap";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  Sparkles,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import Link from "next/link";
import katex from "katex";

const TAU = Math.PI * 2;
const DEFAULT_THETA = Math.PI / 4;
const QUICK_ANGLES = [0, 30, 45, 60, 90, 180, 270, 360];

type AngleUnit = "degrees" | "radians";
type DisplayOptions = {
  waves: boolean;
  projections: boolean;
  trail: boolean;
  labels: boolean;
  angleArc: boolean;
};

export default function EulerFormUnitCircleProof() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pointRef = useRef<SVGGElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const thetaRef = useRef(DEFAULT_THETA);
  const lastTickRef = useRef<number | null>(null);
  const [theta, setThetaState] = useState(DEFAULT_THETA);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [unit, setUnit] = useState<AngleUnit>("degrees");
  const [options, setOptions] = useState<DisplayOptions>({
    waves: true,
    projections: true,
    trail: true,
    labels: true,
    angleArc: true,
  });

  const setTheta = useCallback((value: number) => {
    const safe = Math.min(TAU, Math.max(0, value));
    thetaRef.current = safe;
    setThetaState(safe);
  }, []);

  useLayoutEffect(() => {
    if (!rootRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.from(".euler-reveal", {
        y: 18,
        opacity: 0,
        duration: 0.7,
        stagger: 0.055,
        ease: "power3.out",
        clearProps: "transform,opacity",
      });
      gsap.from(".euler-vector-draw", {
        strokeDasharray: 260,
        strokeDashoffset: 260,
        duration: 1,
        delay: 0.2,
        ease: "power2.out",
      });
      gsap.from(".euler-orbit", {
        scale: 0.86,
        opacity: 0,
        transformOrigin: "center",
        duration: 0.9,
        ease: "back.out(1.5)",
      });
    }, rootRef);
    return () => context.revert();
  }, []);

  useEffect(() => {
    if (!playing) {
      lastTickRef.current = null;
      return;
    }
    const tick = (time: number) => {
      const previous = lastTickRef.current ?? time;
      const deltaSeconds = Math.min(0.05, time - previous);
      lastTickRef.current = time;
      const next = (thetaRef.current + deltaSeconds * (TAU / 7) * speed) % TAU;
      setTheta(next);
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      lastTickRef.current = null;
    };
  }, [playing, setTheta, speed]);

  useEffect(() => {
    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  const animateTo = useCallback(
    (degrees: number) => {
      setPlaying(false);
      tweenRef.current?.kill();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setTheta((degrees * Math.PI) / 180);
        return;
      }
      const proxy = { value: thetaRef.current };
      tweenRef.current = gsap.to(proxy, {
        value: (degrees * Math.PI) / 180,
        duration: 0.62,
        ease: "power2.inOut",
        onUpdate: () => setTheta(proxy.value),
        onComplete: () => {
          if (pointRef.current) {
            gsap.fromTo(pointRef.current, { scale: 1.45 }, { scale: 1, duration: 0.38, ease: "back.out(2.5)", transformOrigin: "center" });
          }
        },
      });
    },
    [setTheta],
  );

  const degrees = radiansToDegrees(theta);
  const cosTheta = cleanTrig(Math.cos(theta));
  const sinTheta = cleanTrig(Math.sin(theta));
  const exact = exactAngleValues(degrees);
  const activeQuickAngle = QUICK_ANGLES.find((value) => Math.abs(value - degrees) < 0.05);

  const updateOption = (key: keyof DisplayOptions) => {
    setOptions((current) => ({ ...current, [key]: !current[key] }));
  };

  const handleSliderKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.code !== "Space") return;
    event.preventDefault();
    setPlaying((value) => !value);
  };

  return (
    <div ref={rootRef} className="mx-auto w-full max-w-[1540px] text-[#11194f]">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1 text-sm font-bold text-indigo-600">
        <nav className="flex items-center gap-2" aria-label="Breadcrumb">
          <Link href="/proofs" prefetch={false} className="hover:text-indigo-800">Visual Proofs</Link>
          <span className="text-slate-300">/</span>
          <Link href="/proofs#catalog-title" prefetch={false} className="hover:text-indigo-800">Complex Numbers</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500">#128</span>
        </nav>
        <Link href="/proofs" prefetch={false} className="inline-flex items-center gap-1 hover:text-indigo-800">← All visual proofs</Link>
      </div>

      <article className="overflow-hidden rounded-[26px] border border-indigo-100 bg-[linear-gradient(135deg,#ffffff_0%,#fbfcff_54%,#f4f1ff_100%)] shadow-[0_22px_70px_rgba(72,65,150,0.12)]">
        <header className="euler-reveal relative overflow-hidden px-5 pb-3 pt-3 sm:px-7">
          <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full bg-violet-200/35 blur-2xl" />
          <div className="relative flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">#128 · Complex Numbers</p>
              <h1 className="mt-0.5 text-3xl font-black tracking-[-0.035em] text-[#0b1245]">Euler Form and Unit Circle</h1>
              <p className="mt-0.5 max-w-4xl text-sm font-medium text-slate-600">
                Explore how <FormulaMath value={"e^{i\\theta}"} /> maps every angle to a point on the unit circle, and how its projections generate cosine and sine.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Pill icon={<Sparkles className="h-3.5 w-3.5" />}>Interactive visualisation</Pill>
                <Pill icon={<Lightbulb className="h-3.5 w-3.5 text-amber-500" />}>Build intuition</Pill>
              </div>
            </div>
            <blockquote className="hidden max-w-[270px] pr-5 pt-2 text-right font-serif text-lg italic leading-6 text-indigo-500 lg:block">
              “A beautiful bridge between algebra and geometry.”
              <footer className="mt-2 font-sans text-[10px] font-black not-italic uppercase tracking-[0.2em]">— Leonhard Euler</footer>
            </blockquote>
          </div>
        </header>

        <div className="grid gap-2 px-3 pb-2 md:grid-cols-[minmax(300px,0.78fr)_minmax(440px,1.22fr)] xl:grid-cols-[minmax(390px,0.82fr)_minmax(620px,1.18fr)] xl:px-4">
          <Panel className="euler-reveal min-h-[420px] overflow-hidden p-3" title="Unit Circle (Complex Plane)" icon={<Gauge className="h-4 w-4" />} actions={
            <div className="flex flex-wrap gap-1.5">
              <MiniToggle checked={options.projections} onChange={() => updateOption("projections")} label="Projections" />
              <MiniToggle checked={options.trail} onChange={() => updateOption("trail")} label="Trail" />
              <MiniToggle checked={options.labels} onChange={() => updateOption("labels")} label="Labels" />
            </div>
          }>
            <UnitCircle
              theta={theta}
              cosTheta={cosTheta}
              sinTheta={sinTheta}
              options={options}
              pointRef={pointRef}
              onThetaChange={(next) => { setPlaying(false); setTheta(next); }}
            />
          </Panel>

          <div className="grid min-w-0 content-start gap-2">
            <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_190px] xl:grid-cols-[minmax(0,1fr)_220px]">
              <Panel className="euler-reveal p-3" title="Angle Controls">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-500">Current position</span>
                  <strong className="text-xl text-indigo-600">
                    <FormulaMath value={`\\theta=${formatAngle(theta, unit)}`} />
                    {unit === "degrees" && exact.radians ? <span className="ml-2 text-base">(<FormulaMath value={exact.radians} />)</span> : null}
                  </strong>
                </div>
                <input
                  aria-label="Angle theta"
                  className="mt-2 h-3 w-full accent-indigo-600"
                  type="range"
                  min={0}
                  max={360}
                  step={0.1}
                  value={degrees}
                  onChange={(event) => { setPlaying(false); setTheta((Number(event.target.value) * Math.PI) / 180); }}
                  onKeyDown={handleSliderKeyDown}
                />
                <div className="mt-1 flex justify-between text-xs font-bold text-slate-400"><span>0°</span><span>90°</span><span>180°</span><span>270°</span><span>360°</span></div>

                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <button type="button" onClick={() => setPlaying((value) => !value)} className="inline-flex h-9 min-w-[108px] items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,#7664f4,#5540ea)] px-4 text-sm font-black text-white shadow-lg shadow-indigo-300/35 transition hover:-translate-y-0.5">
                    {playing ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4" fill="currentColor" />}
                    {playing ? "Pause" : "Play"}
                  </button>
                  <IconButton label="Step backward 5 degrees" onClick={() => animateTo(Math.max(0, degrees - 5))}><ChevronLeft className="h-4 w-4" /></IconButton>
                  <IconButton label="Step forward 5 degrees" onClick={() => animateTo(Math.min(360, degrees + 5))}><ChevronRight className="h-4 w-4" /></IconButton>
                  <button type="button" onClick={() => animateTo(45)} className="inline-flex h-10 items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 text-sm font-extrabold text-slate-600 shadow-sm hover:border-indigo-300 hover:text-indigo-700"><RotateCcw className="h-4 w-4" />Reset</button>
                  <label className="ml-auto flex min-w-[135px] items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs font-bold text-slate-500">
                    Speed
                    <input aria-label="Animation speed" type="range" min={0.25} max={2} step={0.25} value={speed} onChange={(event) => setSpeed(Number(event.target.value))} className="min-w-0 flex-1 accent-indigo-600" />
                    <span className="w-7 text-indigo-700">{speed}×</span>
                  </label>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1">
                  <span className="mr-1 text-xs font-extrabold text-slate-500">Quick angles:</span>
                  {QUICK_ANGLES.map((angle) => (
                    <button key={angle} type="button" onClick={() => animateTo(angle)} className={`min-w-10 rounded-full border px-2 py-1 text-xs font-black transition ${activeQuickAngle === angle ? "border-transparent bg-indigo-500 text-white shadow-md shadow-indigo-200" : "border-indigo-100 bg-indigo-50/60 text-indigo-700 hover:border-indigo-300"}`}>
                      {angle}°
                    </button>
                  ))}
                </div>
              </Panel>

              <Panel className="euler-reveal p-3" title="Display Options" icon={<Settings2 className="h-4 w-4" />}>
                <div className="grid gap-1.5">
                  <OptionToggle checked={options.waves} onChange={() => updateOption("waves")} label="Sine and cosine waves" />
                  <OptionToggle checked={options.projections} onChange={() => updateOption("projections")} label="Show projections" />
                  <OptionToggle checked={options.trail} onChange={() => updateOption("trail")} label="Show trail" />
                  <OptionToggle checked={options.labels} onChange={() => updateOption("labels")} label="Show labels" />
                  <OptionToggle checked={options.angleArc} onChange={() => updateOption("angleArc")} label="Show angle arc" />
                </div>
                <div className="mt-2 grid grid-cols-2 rounded-full bg-indigo-50 p-1 text-xs font-black">
                  <button type="button" onClick={() => setUnit("degrees")} className={`rounded-full px-2 py-2 ${unit === "degrees" ? "bg-indigo-500 text-white shadow" : "text-slate-500"}`}>Degrees</button>
                  <button type="button" onClick={() => setUnit("radians")} className={`rounded-full px-2 py-2 ${unit === "radians" ? "bg-indigo-500 text-white shadow" : "text-slate-500"}`}>Radians</button>
                </div>
              </Panel>
            </div>

            <Panel className="euler-reveal p-2.5" title="Live Values">
              <div className="grid grid-cols-2 gap-1.5 md:grid-cols-[0.9fr_0.8fr_0.8fr_1.55fr_0.95fr]">
                <ValueCard label="Angle" tint="violet"><FormulaMath value={`\\theta=${formatAngle(theta, unit)}`} />{exact.radians ? <small><FormulaMath value={`${exact.radians}\\,rad`} /></small> : <small>{formatNumber(theta)} rad</small>}</ValueCard>
                <ValueCard label="cos θ (x)" tint="blue"><strong>{formatNumber(cosTheta)}</strong>{exact.cos ? <small><FormulaMath value={exact.cos} /></small> : null}</ValueCard>
                <ValueCard label="sin θ (y)" tint="pink"><strong>{formatNumber(sinTheta)}</strong>{exact.sin ? <small><FormulaMath value={exact.sin} /></small> : null}</ValueCard>
                <ValueCard label="Complex number" tint="violet"><FormulaMath value={`e^{i\\theta}=${complexValue(cosTheta, sinTheta)}`} /><small><FormulaMath value={"=\\cos\\theta+i\\sin\\theta"} /></small></ValueCard>
                <ValueCard label="Magnitude" tint="green"><FormulaMath value="|z|=1.0000" /><small>unit circle</small></ValueCard>
              </div>
            </Panel>

            {options.waves ? (
              <Panel className="euler-reveal min-h-[158px] overflow-x-auto p-2.5" title="Sine and Cosine Waves (Projections vs Angle)" icon={<Sparkles className="h-4 w-4" />} actions={<div className="flex gap-3 text-xs font-bold"><span className="text-blue-600">■ cos θ</span><span className="text-fuchsia-600">■ sin θ</span></div>}>
                <WaveGraph theta={theta} cosTheta={cosTheta} sinTheta={sinTheta} />
              </Panel>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 px-3 pb-3 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.85fr_0.95fr_0.8fr] xl:px-4">
          <InfoCard className="euler-reveal" icon={<BookOpen className="h-4 w-4" />} title="Euler's Formula">
            <div className="grid gap-3 sm:grid-cols-[210px_1fr] sm:items-center">
              <div className="rounded-xl bg-indigo-50 px-3 py-4 text-center text-xl text-indigo-950"><FormulaMath value={"e^{i\\theta}=\\cos\\theta+i\\sin\\theta"} block /></div>
              <p className="text-xs font-medium leading-5 text-slate-600"><strong className="text-slate-800">Why it's true:</strong> A point rotating through angle θ has x-projection cos θ and y-projection sin θ. Together they form one complex number.</p>
            </div>
          </InfoCard>
          <InfoCard className="euler-reveal" icon={<Lightbulb className="h-4 w-4" />} title="Key Idea">
            <ul className="grid gap-1 text-xs font-medium leading-5 text-slate-600"><li>• <FormulaMath value={"e^{i\\theta}"} /> is a point on the unit circle.</li><li>• cos θ is the real part.</li><li>• sin θ is the imaginary part.</li></ul>
          </InfoCard>
          <InfoCard className="euler-reveal" icon={<Settings2 className="h-4 w-4" />} title="Applications">
            <p className="text-xs font-medium leading-5 text-slate-600">Euler's form represents rotations and periodic systems.</p>
            <div className="mt-2 flex flex-wrap gap-1"><Tag>Rotation</Tag><Tag>Phasors</Tag><Tag>Waves</Tag><Tag>Fourier analysis</Tag></div>
          </InfoCard>
          <InfoCard className="euler-reveal" icon={<Gauge className="h-4 w-4" />} title="Why It Matters">
            <p className="text-xs font-medium leading-5 text-slate-600">One compact language for rotations, waves, differential equations, and engineering.</p>
          </InfoCard>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-indigo-100 px-5 py-3 text-sm font-bold text-indigo-600">
          <Link href="/proofs" prefetch={false} className="hover:text-indigo-900">▥ Browse more proofs</Link>
          <Link href="/proofs" prefetch={false} className="hover:text-indigo-900">Next: De Moivre's Theorem →</Link>
        </footer>
      </article>
    </div>
  );
}

function UnitCircle({
  theta,
  cosTheta,
  sinTheta,
  options,
  pointRef,
  onThetaChange,
}: {
  theta: number;
  cosTheta: number;
  sinTheta: number;
  options: DisplayOptions;
  pointRef: RefObject<SVGGElement>;
  onThetaChange: (theta: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const center = { x: 270, y: 235 };
  const radius = 155;
  const point = { x: center.x + radius * cosTheta, y: center.y - radius * sinTheta };
  const angleEnd = { x: center.x + 52 * Math.cos(theta), y: center.y - 52 * Math.sin(theta) };
  const trailStart = Math.max(0, theta - Math.PI * 0.72);
  const trailStartPoint = { x: center.x + radius * Math.cos(trailStart), y: center.y - radius * Math.sin(trailStart) };

  const setFromPointer = (event: PointerEvent<SVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 560;
    const y = ((event.clientY - rect.top) / rect.height) * 470;
    let next = Math.atan2(center.y - y, x - center.x);
    if (next < 0) next += TAU;
    onThetaChange(next);
  };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 560 470"
      className="mt-1 h-[370px] w-full touch-none select-none sm:h-[390px] xl:h-[405px]"
      role="img"
      aria-label={`Interactive unit circle at ${radiansToDegrees(theta).toFixed(1)} degrees`}
      onPointerMove={(event) => { if (event.buttons === 1) setFromPointer(event); }}
      onPointerUp={(event) => event.currentTarget.releasePointerCapture(event.pointerId)}
    >
      <defs>
        <filter id="pointGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <linearGradient id="radiusGradient" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#355df5" /><stop offset="1" stopColor="#6d28d9" /></linearGradient>
      </defs>
      <line x1="68" y1={center.y} x2="493" y2={center.y} stroke="#293152" strokeWidth="1.4" />
      <path d={`M493 ${center.y}l-8-5v10z`} fill="#293152" />
      <line x1={center.x} y1="28" x2={center.x} y2="442" stroke="#293152" strokeWidth="1.4" />
      <path d={`M${center.x} 28l-5 8h10z`} fill="#293152" />
      <circle className="euler-orbit" cx={center.x} cy={center.y} r={radius} fill="rgba(99,102,241,.018)" stroke="#2425a8" strokeWidth="2.2" />
      {options.trail && theta > 0.015 ? <path d={`M ${trailStartPoint.x} ${trailStartPoint.y} A ${radius} ${radius} 0 ${theta - trailStart > Math.PI ? 1 : 0} 0 ${point.x} ${point.y}`} fill="none" stroke="#8b5cf6" strokeWidth="8" strokeLinecap="round" opacity=".12" /> : null}
      {options.projections ? <><line x1={point.x} y1={point.y} x2={point.x} y2={center.y} stroke="#718096" strokeWidth="1.3" strokeDasharray="5 5" /><line x1={point.x} y1={point.y} x2={center.x} y2={point.y} stroke="#718096" strokeWidth="1.3" strokeDasharray="5 5" /><line x1={center.x} y1={center.y} x2={point.x} y2={center.y} stroke="#2563eb" strokeWidth="5" opacity=".2" /><line x1={center.x} y1={center.y} x2={center.x} y2={point.y} stroke="#db16b8" strokeWidth="5" opacity=".2" /></> : null}
      {options.angleArc && theta > 0.01 ? <path d={`M ${center.x + 52} ${center.y} A 52 52 0 ${theta > Math.PI ? 1 : 0} 0 ${angleEnd.x} ${angleEnd.y}`} fill="none" stroke="#5b21e6" strokeWidth="2.2" /> : null}
      <line className="euler-vector-draw" x1={center.x} y1={center.y} x2={point.x} y2={point.y} stroke="url(#radiusGradient)" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx={center.x} cy={center.y} r="3.5" fill="#11194f" />
      <g
        ref={pointRef}
        tabIndex={0}
        role="slider"
        aria-label="Point on unit circle"
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={Math.round(radiansToDegrees(theta))}
        className="cursor-grab focus:outline-none active:cursor-grabbing"
        onPointerDown={(event) => { event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId); setFromPointer(event); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            onThetaChange(Math.min(TAU, Math.max(0, theta + (event.key === "ArrowRight" ? 1 : -1) * Math.PI / 180)));
          }
        }}
      >
        <circle cx={point.x} cy={point.y} r="14" fill="#6d28d9" opacity=".13" filter="url(#pointGlow)" />
        <circle cx={point.x} cy={point.y} r="7" fill="#5b21e6" stroke="white" strokeWidth="2" />
        <title>{`P = (${formatNumber(cosTheta)}, ${formatNumber(sinTheta)}) — drag me`}</title>
      </g>
      {options.labels ? <>
        <text x="500" y={center.y + 4} fill="#18203d" fontSize="16" fontStyle="italic">x</text><text x={center.x + 8} y="24" fill="#18203d" fontSize="16" fontStyle="italic">y</text>
        <text x={center.x - radius - 22} y={center.y + 22} fill="#273047" fontSize="14">−1</text><text x={center.x - 16} y={center.y + 22} fill="#273047" fontSize="14">0</text><text x={center.x + radius + 9} y={center.y + 22} fill="#273047" fontSize="14">1</text>
        <text x={center.x - 22} y={center.y - radius + 4} fill="#273047" fontSize="14">1</text><text x={center.x - 26} y={center.y + radius + 6} fill="#273047" fontSize="14">−1</text>
        <text x={(center.x + point.x) / 2 - 8} y={center.y + 24} fill="#2563eb" fontSize="16" fontWeight="700">cos θ</text>
        <text x={center.x - 52} y={(center.y + point.y) / 2} fill="#db16b8" fontSize="16" fontWeight="700">sin θ</text>
        <text x={(center.x + angleEnd.x) / 2 + 14} y={(center.y + angleEnd.y) / 2 - 6} fill="#4f20e8" fontSize="18" fontStyle="italic">θ</text>
        <text x={point.x + (cosTheta < -0.55 ? -138 : 14)} y={point.y - 14} fill="#3420e8" fontSize="16" fontWeight="700">(cos θ, sin θ)</text>
        <text x={(center.x + point.x) / 2 + 8} y={(center.y + point.y) / 2 - 8} fill="#4f20e8" fontSize="15">1</text>
      </> : null}
      <g transform="translate(28 410)"><rect width="242" height="45" rx="11" fill="#fafaff" stroke="#dfe3f7" /><circle cx="21" cy="22" r="12" fill="#ede9fe" /><circle cx="21" cy="22" r="5" fill="#5b21e6" /><text x="41" y="18" fill="#64748b" fontSize="11">Point on unit circle:</text><text x="41" y="35" fill="#1e1b4b" fontSize="13" fontStyle="italic">z = eⁱᶿ = cos θ + i sin θ</text></g>
    </svg>
  );
}

function WaveGraph({ theta, cosTheta, sinTheta }: { theta: number; cosTheta: number; sinTheta: number }) {
  const width = 760;
  const height = 158;
  const left = 42;
  const right = 28;
  const top = 18;
  const bottom = 30;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const x = left + (theta / TAU) * plotWidth;
  const y = (value: number) => top + (1 - (value + 1) / 2) * plotHeight;
  const path = (fn: (value: number) => number) => Array.from({ length: 181 }, (_, index) => {
    const angle = (index / 180) * TAU;
    return `${index ? "L" : "M"}${left + (index / 180) * plotWidth},${y(fn(angle))}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[118px] min-w-[430px] w-full" role="img" aria-label="Sine and cosine curves synchronized to the current angle">
      {[0, 90, 180, 270, 360].map((degree) => { const px = left + (degree / 360) * plotWidth; return <g key={degree}><line x1={px} y1={top} x2={px} y2={height - bottom} stroke="#dfe5f2" /><text x={px} y={height - 8} textAnchor={degree === 0 ? "start" : degree === 360 ? "end" : "middle"} fill="#64748b" fontSize="11">{degree}°</text></g>; })}
      {[-1, 0, 1].map((value) => <g key={value}><line x1={left} y1={y(value)} x2={width - right} y2={y(value)} stroke={value === 0 ? "#9ba6bd" : "#e7ebf4"} /><text x={left - 10} y={y(value) + 4} textAnchor="end" fill="#64748b" fontSize="11">{value}</text></g>)}
      <path d={path(Math.cos)} fill="none" stroke="#2563eb" strokeWidth="2.2" />
      <path d={path(Math.sin)} fill="none" stroke="#db16b8" strokeWidth="2.2" />
      <line x1={x} y1={top - 3} x2={x} y2={height - bottom} stroke="#5b21e6" strokeDasharray="5 4" strokeWidth="1.5" />
      <circle cx={x} cy={y(cosTheta)} r="5" fill="#2563eb" stroke="white" strokeWidth="2"><title>{`cos(${radiansToDegrees(theta).toFixed(1)}°) = ${formatNumber(cosTheta)}`}</title></circle>
      <circle cx={x} cy={y(sinTheta)} r="5" fill="#db16b8" stroke="white" strokeWidth="2"><title>{`sin(${radiansToDegrees(theta).toFixed(1)}°) = ${formatNumber(sinTheta)}`}</title></circle>
      <g transform={`translate(${Math.min(width - 95, Math.max(left, x - 32))} 0)`}><rect width="70" height="22" rx="8" fill="white" stroke="#cbd2e7" /><text x="35" y="15" textAnchor="middle" fill="#25265e" fontSize="11" fontWeight="700">θ = {Math.round(radiansToDegrees(theta))}°</text></g>
      <text x={width - right + 8} y={y(Math.sin(TAU)) - 5} fill="#db16b8" fontSize="11" fontWeight="700">sin θ</text>
      <text x={width - right + 8} y={y(Math.cos(TAU)) + 4} fill="#2563eb" fontSize="11" fontWeight="700">cos θ</text>
    </svg>
  );
}

function Panel({ title, icon, actions, className = "", children }: { title: string; icon?: ReactNode; actions?: ReactNode; className?: string; children: ReactNode }) {
  return <section className={`rounded-2xl border border-indigo-100 bg-white/82 shadow-[0_8px_28px_rgba(68,72,150,0.07)] ${className}`}><div className="flex min-h-7 flex-wrap items-center justify-between gap-2"><h2 className="flex items-center gap-2 text-sm font-black text-[#101850]">{icon ? <span className="grid h-7 w-7 place-items-center rounded-full bg-indigo-100 text-indigo-600">{icon}</span> : null}{title}</h2>{actions}</div>{children}</section>;
}

function InfoCard({ title, icon, className = "", children }: { title: string; icon: ReactNode; className?: string; children: ReactNode }) {
  return <section className={`rounded-2xl border border-indigo-100 bg-white/85 p-3 shadow-sm ${className}`}><h2 className="flex items-center gap-2 text-sm font-black text-[#101850]"><span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-100 text-indigo-600">{icon}</span>{title}</h2><div className="mt-2">{children}</div></section>;
}

function ValueCard({ label, tint, children }: { label: string; tint: "violet" | "blue" | "pink" | "green"; children: ReactNode }) {
  const tints = { violet: "bg-violet-50 text-violet-950", blue: "bg-blue-50 text-blue-950", pink: "bg-fuchsia-50 text-fuchsia-950", green: "bg-emerald-50 text-emerald-950" };
  return <div className={`min-h-[64px] min-w-0 rounded-xl p-2 ${tints[tint]}`}><p className="text-[11px] font-black opacity-75">{label}</p><div className="mt-0.5 flex min-w-0 flex-col gap-0.5 text-sm font-black leading-tight md:[&_small]:hidden xl:[&_small]:block">{children}</div></div>;
}

function OptionToggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return <label className="flex items-center gap-2 text-xs font-bold text-slate-600"><button type="button" role="switch" aria-checked={checked} onClick={onChange} className={`relative h-5 w-9 shrink-0 rounded-full transition ${checked ? "bg-indigo-500" : "bg-slate-200"}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${checked ? "left-[18px]" : "left-0.5"}`} /></button>{label}</label>;
}

function MiniToggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return <button type="button" role="switch" aria-checked={checked} onClick={onChange} className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-white px-2 py-1 text-[10px] font-bold text-slate-500"><span className={`relative h-4 w-7 rounded-full ${checked ? "bg-indigo-500" : "bg-slate-200"}`}><span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition ${checked ? "left-3.5" : "left-0.5"}`} /></span>{label}</button>;
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return <button type="button" aria-label={label} title={label} onClick={onClick} className="grid h-10 w-10 place-items-center rounded-full border border-indigo-100 bg-white text-indigo-900 shadow-sm hover:border-indigo-300 hover:bg-indigo-50">{children}</button>;
}

function Pill({ icon, children }: { icon: ReactNode; children: ReactNode }) { return <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600">{icon}{children}</span>; }
function Tag({ children }: { children: ReactNode }) { return <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-600">{children}</span>; }

function FormulaMath({ value, block = false }: { value: string; block?: boolean }) {
  return <span className={block ? "block" : "inline-block"} dangerouslySetInnerHTML={{ __html: katex.renderToString(value, { throwOnError: false, displayMode: block }) }} />;
}

function cleanTrig(value: number) { return Math.abs(value) < 1e-10 ? 0 : Math.abs(Math.abs(value) - 1) < 1e-10 ? Math.sign(value) : value; }
function radiansToDegrees(value: number) { return (value * 180) / Math.PI; }
function formatNumber(value: number) { return cleanTrig(value).toFixed(4); }
function complexValue(real: number, imaginary: number) {
  const r = formatNumber(real);
  const i = formatNumber(Math.abs(imaginary));
  if (imaginary === 0) return r;
  if (real === 0) return imaginary === 1 ? "i" : imaginary === -1 ? "-i" : `${imaginary < 0 ? "-" : ""}${i}i`;
  return `${r}${imaginary < 0 ? "-" : "+"}${i}i`;
}
function formatAngle(theta: number, unit: AngleUnit) {
  if (unit === "degrees") return `${formatDegree(radiansToDegrees(theta))}^{\\circ}`;
  return exactAngleValues(radiansToDegrees(theta)).radians ?? `${theta.toFixed(3)}`;
}
function formatDegree(value: number) { return Math.abs(value - Math.round(value)) < 0.01 ? String(Math.round(value)) : value.toFixed(1); }
function exactAngleValues(degrees: number) {
  const rounded = Math.round(degrees);
  const values: Record<number, { radians: string; cos: string; sin: string }> = {
    0: { radians: "0", cos: "1", sin: "0" },
    30: { radians: "\\pi/6", cos: "\\sqrt3/2", sin: "1/2" },
    45: { radians: "\\pi/4", cos: "\\sqrt2/2", sin: "\\sqrt2/2" },
    60: { radians: "\\pi/3", cos: "1/2", sin: "\\sqrt3/2" },
    90: { radians: "\\pi/2", cos: "0", sin: "1" },
    180: { radians: "\\pi", cos: "-1", sin: "0" },
    270: { radians: "3\\pi/2", cos: "0", sin: "-1" },
    360: { radians: "2\\pi", cos: "1", sin: "0" },
  };
  return Math.abs(degrees - rounded) < 0.05 && values[rounded] ? values[rounded] : { radians: "", cos: "", sin: "" };
}
