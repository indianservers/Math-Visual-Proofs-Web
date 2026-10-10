"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import styles from "./Proof.module.css";

const terms = [
  { label: "a³", color: "#06aebc", count: 1, description: "One cube: a × a × a" },
  { label: "3a²b", color: "#f4a629", count: 3, description: "Three slabs: a × a × b" },
  { label: "3ab²", color: "#557df0", count: 3, description: "Three prisms: a × b × b" },
  { label: "b³", color: "#ed5277", count: 1, description: "One cube: b × b × b" },
];

export default function Proof() {
  const mount = useRef<HTMLDivElement>(null);
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const [explode, setExplode] = useState(0.65);
  const [selected, setSelected] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [reset, setReset] = useState(0);
  const [error, setError] = useState(false);
  const values = useRef({ a, b, explode, selected });
  useEffect(() => { values.current = { a, b, explode, selected }; }, [a, b, explode, selected]);
  useEffect(() => {
    if (!playing) return;
    const start = performance.now(), from = values.current.explode;
    const to = from > 0.5 ? 0 : 1;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1800);
      setExplode(from + (to - from) * (t * t * (3 - 2 * t)));
      if (t < 1) frame = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);
  useEffect(() => {
    const container = mount.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true }); }
    catch { setError(true); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xf8faff, 1);
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(6.8, 5.2, 7.8);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 5; controls.maxDistance = 18; controls.enablePan = false;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x7283a5, 2.5));
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(4, 8, 6); scene.add(light);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const edges = new THREE.EdgesGeometry(geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x24314a });
    const blocks: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>[] = [];
    for (let x = 0; x < 2; x++) for (let y = 0; y < 2; y++) for (let z = 0; z < 2; z++) {
      const term = x + y + z;
      const block = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: terms[term].color, roughness: 0.38, transparent: true }));
      block.userData = { x, y, z, term };
      block.add(new THREE.LineSegments(edges, edgeMaterial));
      blocks.push(block); scene.add(block);
    }
    const raycaster = new THREE.Raycaster();
    let pointerStart = { x: 0, y: 0 };
    const down = (event: PointerEvent) => { pointerStart = { x: event.clientX, y: event.clientY }; };
    const pick = (event: PointerEvent) => {
      if (Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 5) return;
      const rect = renderer.domElement.getBoundingClientRect();
      raycaster.setFromCamera(new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1), camera);
      const hit = raycaster.intersectObjects(blocks, false)[0];
      setSelected(hit ? hit.object.userData.term : null);
    };
    renderer.domElement.addEventListener("pointerdown", down);
    renderer.domElement.addEventListener("pointerup", pick);
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(1, height);
      camera.zoom = Math.min(0.8, camera.aspect * 0.8);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize); observer.observe(container); resize();
    let frame = 0;
    const render = () => {
      const v = values.current, unit = 3 / (v.a + v.b), dims = [v.a * unit, v.b * unit];
      for (const block of blocks) {
        const { x, y, z, term } = block.userData;
        const position = (i: number) => (i === 0 ? -dims[1] / 2 : dims[0] / 2) + (i === 0 ? -1 : 1) * v.explode * 1.25;
        block.scale.set(dims[x], dims[y], dims[z]); block.position.set(position(x), position(y), position(z));
        block.material.opacity = v.selected === null || v.selected === term ? 1 : 0.14;
        block.material.depthWrite = v.selected === null || v.selected === term;
      }
      controls.update(); renderer.render(scene, camera); frame = requestAnimationFrame(render);
    }; render();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); controls.dispose();
      renderer.domElement.removeEventListener("pointerdown", down); renderer.domElement.removeEventListener("pointerup", pick);
      geometry.dispose(); edges.dispose(); edgeMaterial.dispose(); blocks.forEach((block) => block.material.dispose());
      renderer.dispose(); renderer.domElement.remove();
    };
  }, [reset]);
  const volumes = [a ** 3, 3 * a * a * b, 3 * a * b * b, b ** 3];
  return <div className={styles.workspace}>
    <div className={styles.heading}><div><span>VOLUME DECOMPOSITION · 8 SOLID BLOCKS</span><h2>(a + b)³ = a³ + 3a²b + 3ab² + b³</h2></div><button onClick={() => { setSelected(null); setReset((v) => v + 1); }}>Reset view</button></div>
    <div className={styles.scene} ref={mount} role="img" aria-label="Rotatable 3D cube divided into eight colored cuboids">
      <div className={styles.sceneLabel}>{explode < 0.02 ? `Assembled cube · side ${a + b}` : "Exploded cube · inspect all eight volumes"}</div>
      <div className={styles.help}>Drag to rotate · Scroll / pinch to zoom · Click a block to inspect</div>
      {error && <p className={styles.error}>Enable WebGL in your browser to view the interactive 3D cube.</p>}
    </div>
    <div className={styles.controls}>
      <label>Side a <output>{a}</output><input aria-label="Side a" type="range" min="1" max="6" value={a} onChange={(e) => setA(Number(e.target.value))} /></label>
      <label>Side b <output>{b}</output><input aria-label="Side b" type="range" min="1" max="6" value={b} onChange={(e) => setB(Number(e.target.value))} /></label>
      <label>Separation <output>{Math.round(explode * 100)}%</output><input aria-label="Block separation" type="range" min="0" max="1" step="0.01" value={explode} onChange={(e) => { setPlaying(false); setExplode(Number(e.target.value)); }} /></label>
      <button onClick={() => setPlaying(!playing)}>{playing ? "Pause" : explode > 0.5 ? "▶ Assemble cube" : "▶ Explode cube"}</button>
    </div>
    <div className={styles.terms}>{terms.map((term, i) => <button key={term.label} aria-pressed={selected === i} className={selected === i ? styles.selected : ""} style={{ "--term-color": term.color } as React.CSSProperties} onClick={() => setSelected(selected === i ? null : i)}><span className={styles.swatch} /><div><b>{term.label} <small>{term.count} {term.count === 1 ? "block" : "blocks"}</small></b><span>{term.description}</span></div><strong>{volumes[i]}</strong></button>)}</div>
    <p className={styles.result}><b>{a + b}³ = {volumes.join(" + ")} = {(a + b) ** 3}</b><span>Each axis splits into a and b: 2 × 2 × 2 = 8 blocks. Their volumes add to the whole cube, with no gaps or overlaps.</span></p>
  </div>;
}
