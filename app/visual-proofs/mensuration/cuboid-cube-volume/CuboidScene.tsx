"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { CuboidDimensions } from "../../../lib/cuboidVolumeMath";
import styles from "./CuboidVolumeProof.module.css";

type SceneProps = {
  dimensions: CuboidDimensions;
  visibleCount: number;
  showUnitCubes: boolean;
  showGrid: boolean;
  showDimensions: boolean;
  separated: boolean;
  resetViewToken: number;
};

const INITIAL_DIRECTION = new THREE.Vector3(1.18, 0.88, 1.36).normalize();
const WHITE = new THREE.Color(1, 1, 1);
const HOVER = new THREE.Color("#ffe2a3");

export default function CuboidScene(props: SceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const lengthRef = useRef<HTMLSpanElement>(null);
  const widthRef = useRef<HTMLSpanElement>(null);
  const heightRef = useRef<HTMLSpanElement>(null);
  const hoverRef = useRef<HTMLSpanElement>(null);
  const currentProps = useRef(props);
  const [error, setError] = useState(false);

  useEffect(() => { currentProps.current = props; }, [props]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      queueMicrotask(() => setError(true));
      return;
    }

    // Integrated GPUs and software WebGL can stall if this large scene is
    // redrawn at full device resolution on every animation frame.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.shadowMap.enabled = false;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.38;
    renderer.domElement.className = styles.webglCanvas;
    renderer.domElement.setAttribute("role", "img");
    renderer.domElement.setAttribute("aria-label", "Interactive three-dimensional cuboid made of unit cubes; drag to orbit and scroll to zoom.");
    host.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#fbfcff");
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 300);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enablePan = false;
    controls.minPolarAngle = 0.26;
    controls.maxPolarAngle = 1.48;
    controls.rotateSpeed = 0.58;
    controls.zoomSpeed = 0.72;
    controls.touches.ONE = THREE.TOUCH.ROTATE;
    controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;

    scene.add(new THREE.AmbientLight("#ffffff", 1.2));
    scene.add(new THREE.HemisphereLight("#dff6ff", "#ebe3ff", 1.8));
    const sun = new THREE.DirectionalLight("#ffffff", 2.5);
    sun.position.set(-8, 17, 11);
    sun.castShadow = false;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -24;
    sun.shadow.camera.right = 24;
    sun.shadow.camera.top = 24;
    sun.shadow.camera.bottom = -24;
    sun.shadow.normalBias = 0.025;
    sun.shadow.bias = -0.00015;
    scene.add(sun);

    const floorGeometry = new THREE.PlaneGeometry(80, 80);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: "#f7f9ff", roughness: 0.96 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.085;
    floor.receiveShadow = true;
    scene.add(floor);
    const grid = new THREE.GridHelper(24, 24, "#c4c9e8", "#e2e7f6");
    grid.position.y = -0.065;
    const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material];
    gridMaterials.forEach((material) => { material.transparent = true; material.opacity = 0.5; });
    scene.add(grid);

    const cubeGeometry = new THREE.BoxGeometry(0.965, 0.965, 0.965);
    const cubeMaterials = [
      new THREE.MeshStandardMaterial({ color: "#55cba8", roughness: 0.58, metalness: 0.03 }),
      new THREE.MeshStandardMaterial({ color: "#3ab899", roughness: 0.58, metalness: 0.03 }),
      new THREE.MeshStandardMaterial({ color: "#62cfff", roughness: 0.5, metalness: 0.04 }),
      new THREE.MeshStandardMaterial({ color: "#8174e8", roughness: 0.62 }),
      new THREE.MeshStandardMaterial({ color: "#b79bff", roughness: 0.59, metalness: 0.03 }),
      new THREE.MeshStandardMaterial({ color: "#a18af2", roughness: 0.59, metalness: 0.03 }),
    ];
    const cubes = new THREE.InstancedMesh(cubeGeometry, cubeMaterials, 1000);
    cubes.castShadow = true;
    cubes.receiveShadow = true;
    cubes.frustumCulled = false;
    cubes.count = 0;
    for (let index = 0; index < 1000; index++) cubes.setColorAt(index, WHITE);
    if (cubes.instanceColor) cubes.instanceColor.needsUpdate = true;
    scene.add(cubes);

    // Twelve true box edges per unit cube. A wireframe BoxGeometry also draws
    // its triangular face diagonals, which obscures the unit-cube grid.
    const wirePositions = new Float32Array(1000 * 12 * 2 * 3);
    const wireGeometry = new THREE.BufferGeometry();
    const wireAttribute = new THREE.BufferAttribute(wirePositions, 3);
    wireAttribute.setUsage(THREE.DynamicDrawUsage);
    wireGeometry.setAttribute("position", wireAttribute);
    wireGeometry.setDrawRange(0, 0);
    const wireMaterial = new THREE.LineBasicMaterial({ color: "#5942ba", transparent: true, opacity: 0.48 });
    const wires = new THREE.LineSegments(wireGeometry, wireMaterial);
    wires.frustumCulled = false;
    scene.add(wires);

    const shellMaterial = new THREE.MeshBasicMaterial({ color: "#6d64e7", transparent: true, opacity: 0.055, side: THREE.DoubleSide, depthWrite: false });
    const shell = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), shellMaterial);
    scene.add(shell);
    const solidMaterials = ["#56c7a5", "#45b995", "#75d8ff", "#8579ec", "#b99fff", "#a995f4"].map((color) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.59, transparent: true, opacity: 0.87, side: THREE.DoubleSide }),
    );
    const solid = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), solidMaterials);
    solid.castShadow = true;
    scene.add(solid);
    const outlineMaterial = new THREE.LineBasicMaterial({ color: "#6454d7", transparent: true, opacity: 0.7 });
    const outlineSource = new THREE.BoxGeometry(1, 1, 1);
    const outline = new THREE.LineSegments(new THREE.EdgesGeometry(outlineSource), outlineMaterial);
    outlineSource.dispose();
    scene.add(outline);

    const dimensionGroup = new THREE.Group();
    scene.add(dimensionGroup);
    const arrowMaterials = ["#5a37eb", "#069c72", "#ed5261"].map((color) => new THREE.MeshBasicMaterial({ color }));
    const arrowLineMaterials = ["#5a37eb", "#069c72", "#ed5261"].map((color) => new THREE.LineBasicMaterial({ color }));
    const coneGeometry = new THREE.ConeGeometry(0.085, 0.24, 8);
    const labelAnchors = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];

    const clearArrows = () => {
      for (const child of [...dimensionGroup.children]) {
        dimensionGroup.remove(child);
        if (child instanceof THREE.Line) child.geometry.dispose();
      }
    };
    const addArrow = (start: THREE.Vector3, end: THREE.Vector3, index: number) => {
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([start, end]), arrowLineMaterials[index]);
      dimensionGroup.add(line);
      const direction = end.clone().sub(start).normalize();
      const fromY = new THREE.Vector3(0, 1, 0);
      for (const [point, sign] of [[start, -1], [end, 1]] as const) {
        const head = new THREE.Mesh(coneGeometry, arrowMaterials[index]);
        head.position.copy(point);
        head.quaternion.setFromUnitVectors(fromY, direction.clone().multiplyScalar(sign));
        dimensionGroup.add(head);
      }
      labelAnchors[index].copy(start).add(end).multiplyScalar(0.5);
    };

    let lastSignature = "";
    let lastDimensions = "";
    let lastResetToken = currentProps.current.resetViewToken;
    let hovered = -1;
    const dummy = new THREE.Object3D();
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const projection = new THREE.Vector3();
    const size = { width: 1, height: 1 };
    let frame = 0;
    let dirty = true;
    const markDirty = () => { dirty = true; };
    controls.addEventListener("change", markDirty);

    const fitCamera = (dimensions: CuboidDimensions, separated: boolean, resetDirection: boolean) => {
      const gap = separated ? 0.5 : 0;
      const extentY = dimensions.height + (dimensions.height - 1) * gap;
      const target = new THREE.Vector3(0, extentY / 2, 0);
      const direction = resetDirection ? INITIAL_DIRECTION.clone() : camera.position.clone().sub(controls.target).normalize();
      if (direction.lengthSq() < 0.1) direction.copy(INITIAL_DIRECTION);
      const radius = Math.hypot(dimensions.length, extentY, dimensions.width) / 2;
      const verticalDistance = radius / Math.sin(THREE.MathUtils.degToRad(camera.fov) / 2);
      const distance = Math.max(5.5, verticalDistance * (camera.aspect < 1 ? 1.16 / camera.aspect : 1.18));
      controls.target.copy(target);
      camera.position.copy(target).addScaledVector(direction, distance);
      controls.minDistance = Math.max(2.4, distance * 0.55);
      controls.maxDistance = distance * 2.15;
      camera.near = Math.max(0.05, distance / 100);
      camera.far = distance * 12;
      camera.updateProjectionMatrix();
      controls.update();
    };

    const updateDimensions = (dimensions: CuboidDimensions, separated: boolean) => {
      const { length, width, height } = dimensions;
      const gap = separated ? 0.5 : 0;
      const extentY = height + (height - 1) * gap;
      shell.geometry.dispose();
      shell.geometry = new THREE.BoxGeometry(length, height, width);
      shell.position.y = height / 2;
      solid.geometry.dispose();
      solid.geometry = new THREE.BoxGeometry(length, height, width);
      solid.position.y = height / 2;
      outline.geometry.dispose();
      const edgeSource = new THREE.BoxGeometry(length, height, width);
      outline.geometry = new THREE.EdgesGeometry(edgeSource);
      edgeSource.dispose();
      outline.position.y = height / 2;
      clearArrows();
      const side = width / 2 + 0.55;
      addArrow(new THREE.Vector3(-length / 2, 0.08, side), new THREE.Vector3(length / 2, 0.08, side), 0);
      addArrow(new THREE.Vector3(length / 2 + 0.55, 0.08, -width / 2), new THREE.Vector3(length / 2 + 0.55, 0.08, width / 2), 1);
      addArrow(new THREE.Vector3(length / 2 + 0.75, 0, width / 2 + 0.75), new THREE.Vector3(length / 2 + 0.75, extentY, width / 2 + 0.75), 2);
      labelAnchors[0].y -= 0.2;
      labelAnchors[1].y -= 0.15;
    };

    const refreshScene = () => {
      const values = currentProps.current;
      const { length, width, height } = values.dimensions;
      const dimensionsKey = `${length},${width},${height},${values.separated}`;
      const resetCamera = values.resetViewToken !== lastResetToken;
      if (dimensionsKey !== lastDimensions || resetCamera) {
        if (dimensionsKey !== lastDimensions) updateDimensions(values.dimensions, values.separated);
        fitCamera(values.dimensions, values.separated, resetCamera || !lastDimensions);
        lastDimensions = dimensionsKey;
        lastResetToken = values.resetViewToken;
      }
      const total = length * width * height;
      const count = Math.max(0, Math.min(total, values.visibleCount));
      const signature = `${dimensionsKey},${count},${values.showUnitCubes},${values.showGrid},${values.showDimensions}`;
      if (signature === lastSignature) return false;
      lastSignature = signature;
      grid.visible = values.showGrid;
      dimensionGroup.visible = values.showDimensions;
      cubes.visible = values.showUnitCubes;
      wires.visible = values.showUnitCubes;
      cubes.count = values.showUnitCubes ? count : 0;
      wireGeometry.setDrawRange(0, values.showUnitCubes ? count * 24 : 0);
      const completed = count >= total;
      shell.visible = completed && values.showUnitCubes && !values.separated;
      solid.visible = completed && !values.showUnitCubes;
      outline.visible = completed && !values.separated;
      if (hovered >= count) hovered = -1;
      const gap = values.separated ? 0.5 : 0;
      const edgePairs = [0, 1, 0, 2, 0, 4, 1, 3, 1, 5, 2, 3, 2, 6, 3, 7, 4, 5, 4, 6, 5, 7, 6, 7];
      for (let index = 0; index < count; index++) {
        const x = index % length;
        const z = Math.floor(index / length) % width;
        const y = Math.floor(index / (length * width));
        dummy.position.set(x + 0.5 - length / 2, y + 0.5 + y * gap, z + 0.5 - width / 2);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        cubes.setMatrixAt(index, dummy.matrix);
        const cx = dummy.position.x;
        const cy = dummy.position.y;
        const cz = dummy.position.z;
        const half = 0.487;
        for (let edge = 0; edge < edgePairs.length; edge++) {
          const vertex = edgePairs[edge];
          const offset = index * 72 + edge * 3;
          wirePositions[offset] = cx + (vertex & 1 ? half : -half);
          wirePositions[offset + 1] = cy + (vertex & 2 ? half : -half);
          wirePositions[offset + 2] = cz + (vertex & 4 ? half : -half);
        }
      }
      cubes.instanceMatrix.needsUpdate = true;
      wireAttribute.needsUpdate = true;
      return true;
    };

    const projectLabel = (element: HTMLSpanElement | null, anchor: THREE.Vector3) => {
      if (!element) return;
      projection.copy(anchor).project(camera);
      const x = (projection.x * 0.5 + 0.5) * size.width;
      const y = (-projection.y * 0.5 + 0.5) * size.height;
      const withinView = projection.z < 1 && projection.z > -1 && x > -40 && x < size.width + 40 && y > -35 && y < size.height + 35;
      element.style.visibility = withinView ? "visible" : "hidden";
      element.style.left = `${Math.max(10, Math.min(size.width - 10, x))}px`;
      element.style.top = `${Math.max(10, Math.min(size.height - 10, y))}px`;
    };

    const animate = () => {
      frame = window.requestAnimationFrame(animate);
      const sceneChanged = refreshScene();
      controls.update();
      if (dirty || sceneChanged) {
        projectLabel(lengthRef.current, labelAnchors[0]);
        projectLabel(widthRef.current, labelAnchors[1]);
        projectLabel(heightRef.current, labelAnchors[2]);
        renderer.render(scene, camera);
        dirty = false;
      }
    };
    const resize = () => {
      size.width = Math.max(1, host.clientWidth);
      size.height = Math.max(1, host.clientHeight);
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
      renderer.setSize(size.width, size.height, false);
      fitCamera(currentProps.current.dimensions, currentProps.current.separated, false);
      dirty = true;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    animate();

    const onPointerMove = (event: PointerEvent) => {
      const tooltip = hoverRef.current;
      if (!tooltip) return;
      if (!currentProps.current.showUnitCubes || cubes.count === 0) {
        tooltip.style.display = "none";
        return;
      }
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObject(cubes, false)[0];
      const next = hit?.instanceId ?? -1;
      if (next !== hovered) {
        if (hovered >= 0) cubes.setColorAt(hovered, WHITE);
        if (next >= 0) cubes.setColorAt(next, HOVER);
        hovered = next;
        if (cubes.instanceColor) cubes.instanceColor.needsUpdate = true;
        dirty = true;
      }
      tooltip.style.display = next >= 0 ? "block" : "none";
      tooltip.style.left = `${event.clientX - rect.left + 12}px`;
      tooltip.style.top = `${event.clientY - rect.top + 12}px`;
    };
    const onPointerLeave = () => {
      if (hovered >= 0) cubes.setColorAt(hovered, WHITE);
      hovered = -1;
      if (cubes.instanceColor) cubes.instanceColor.needsUpdate = true;
      dirty = true;
      if (hoverRef.current) hoverRef.current.style.display = "none";
    };
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
      controls.dispose();
      controls.removeEventListener("change", markDirty);
      clearArrows();
      coneGeometry.dispose();
      arrowMaterials.forEach((material) => material.dispose());
      arrowLineMaterials.forEach((material) => material.dispose());
      cubeGeometry.dispose();
      cubeMaterials.forEach((material) => material.dispose());
      cubes.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      shell.geometry.dispose();
      shellMaterial.dispose();
      solid.geometry.dispose();
      solidMaterials.forEach((material) => material.dispose());
      outline.geometry.dispose();
      outlineMaterial.dispose();
      floorGeometry.dispose();
      floorMaterial.dispose();
      grid.geometry.dispose();
      gridMaterials.forEach((material) => material.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  const { length, width, height } = props.dimensions;
  return (
    <div ref={hostRef} className={styles.scene} data-testid="cuboid-three-scene" aria-label={`${length} by ${width} by ${height} unit-cube model`}>
      {error && <div className={styles.webglFallback} role="alert">This browser could not start the 3D scene. The live dimensions and volume remain available below.</div>}
      <span ref={lengthRef} className={`${styles.sceneLabel} ${styles.lengthLabel}`} hidden={!props.showDimensions}><b>Length (l)</b>{length} units</span>
      <span ref={widthRef} className={`${styles.sceneLabel} ${styles.widthLabel}`} hidden={!props.showDimensions}><b>Width (w)</b>{width} units</span>
      <span ref={heightRef} className={`${styles.sceneLabel} ${styles.heightLabel}`} hidden={!props.showDimensions}><b>Height (h)</b>{height} units</span>
      <span ref={hoverRef} className={styles.hoverTip} role="status">1 cubic unit</span>
      <span className={styles.orbitHint}>Drag to orbit · Scroll or pinch to zoom</span>
    </div>
  );
}
