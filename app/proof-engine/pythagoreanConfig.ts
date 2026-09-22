import type {
  DockingSlotConfig,
  ProofCanvasConfig,
  ProofObjectConfig,
  ProofScene,
} from "./types";

export type PythagoreanPieceId =
  "triangle-1" | "triangle-2" | "triangle-3" | "triangle-4";

const SHARED_PIECE_BEHAVIOR = {
  geometry: {
    kind: "polygon" as const,
    points: [
      { x: 0, y: 0 },
      { x: 120, y: 0 },
      { x: 0, y: 140 },
    ],
  },
  tags: ["triangle", "congruent", "right-angle"],
  capabilities: {
    draggable: true,
    rotatable: true,
    dockable: true,
    detachable: true,
    inspectable: true,
  },
  constraints: [
    {
      kind: "bounds" as const,
      bounds: { minX: 5, maxX: 810, minY: 10, maxY: 405 },
    },
    { kind: "rotation-step" as const, degrees: 90 },
  ],
};

export const PYTHAGOREAN_PIECES: ProofObjectConfig<PythagoreanPieceId>[] = [
  {
    id: "triangle-1",
    label: "1",
    mathematicalType: "congruent-right-triangle",
    color: "#8a60ed",
    gradientId: "p",
    initial: { x: 70, y: 82, rotation: 0 },
    allowedRotations: [0, 90, 180, 270],
    compatibleSlotIds: ["slot-1"],
    snapTolerance: 58,
    quantity: "½ab",
    explanation: "The first congruent right triangle.",
    ...SHARED_PIECE_BEHAVIOR,
  },
  {
    id: "triangle-2",
    label: "2",
    mathematicalType: "congruent-right-triangle",
    color: "#2298dd",
    gradientId: "u",
    initial: { x: 330, y: 82, rotation: 90 },
    allowedRotations: [0, 90, 180, 270],
    compatibleSlotIds: ["slot-2"],
    snapTolerance: 58,
    quantity: "½ab",
    explanation: "The second congruent right triangle.",
    ...SHARED_PIECE_BEHAVIOR,
  },
  {
    id: "triangle-3",
    label: "3",
    mathematicalType: "congruent-right-triangle",
    color: "#16ae9c",
    gradientId: "t",
    initial: { x: 330, y: 342, rotation: 180 },
    allowedRotations: [0, 90, 180, 270],
    compatibleSlotIds: ["slot-3"],
    snapTolerance: 58,
    quantity: "½ab",
    explanation: "The third congruent right triangle.",
    ...SHARED_PIECE_BEHAVIOR,
  },
  {
    id: "triangle-4",
    label: "4",
    mathematicalType: "congruent-right-triangle",
    color: "#f05b62",
    gradientId: "r",
    initial: { x: 70, y: 342, rotation: 270 },
    allowedRotations: [0, 90, 180, 270],
    compatibleSlotIds: ["slot-4"],
    snapTolerance: 58,
    quantity: "½ab",
    explanation: "The fourth congruent right triangle.",
    ...SHARED_PIECE_BEHAVIOR,
  },
];

export const PYTHAGOREAN_SLOTS: DockingSlotConfig<PythagoreanPieceId>[] = [
  {
    id: "slot-1",
    accepts: ["triangle-1"],
    requiredRotation: 90,
    target: { x: 780, y: 82, rotation: 90 },
    event: "Triangle 1 forms the upper-right corner.",
  },
  {
    id: "slot-2",
    accepts: ["triangle-2"],
    requiredRotation: 270,
    target: { x: 640, y: 202, rotation: 270 },
    event: "Triangle 2 completes the upper rectangle.",
  },
  {
    id: "slot-3",
    accepts: ["triangle-3"],
    requiredRotation: 0,
    target: { x: 520, y: 202, rotation: 0 },
    event: "Triangle 3 starts the lower rectangle.",
  },
  {
    id: "slot-4",
    accepts: ["triangle-4"],
    requiredRotation: 180,
    target: { x: 640, y: 342, rotation: 180 },
    event: "Triangle 4 completes the lower rectangle.",
  },
];

export const PYTHAGOREAN_CANVAS_CONFIG: ProofCanvasConfig<PythagoreanPieceId> =
  {
    id: "pythagorean-area-rearrangement",
    viewport: { width: 820, height: 420, minZoom: 0.75, maxZoom: 2.5 },
    objects: PYTHAGOREAN_PIECES,
    slots: PYTHAGOREAN_SLOTS,
    interaction: {
      snapEnabled: true,
      detachDistance: 14,
      keyboardStep: 4,
      rotationStep: 90,
    },
    assist: {
      objectPicker: true,
      directionPad: true,
      oneTapDock: true,
      zoomControls: true,
      spokenFeedback: true,
      showProgress: true,
      helpSteps: [
        "Choose a numbered triangle.",
        "Drag it or move it with the arrows.",
        "Rotate and attach it to the matching outline.",
      ],
    },
  };

export const INITIAL_PYTHAGOREAN_SCENE: ProofScene<PythagoreanPieceId> = {
  phase: "INITIAL",
  comparisonConfirmed: false,
  objects: Object.fromEntries(
    PYTHAGOREAN_PIECES.map((piece) => [
      piece.id,
      { id: piece.id, ...piece.initial, dockedSlotId: null },
    ]),
  ) as ProofScene<PythagoreanPieceId>["objects"],
};

export const PYTHAGOREAN_REASONING = [
  "A right triangle has legs a and b meeting at 90°, and hypotenuse c opposite that corner.",
  "a², b², and c² are areas of squares built on those three sides — not just abstract numbers.",
  "Both pictures sit in the same outer square of side a + b, so both have the same total area.",
  "The four coloured triangles are identical copies. Moving them does not change their area.",
  "Arrangement A hides a tilted square whose side is the hypotenuse, so that leftover area is c².",
  "Arrangement B hides an upright a-square and b-square, so that leftover area is a² + b².",
  "Same whole minus the same four triangles leaves equal remainders, therefore a² + b² = c².",
] as const;

export const PYTHAGOREAN_STEPS = [
  "Observe",
  "Build",
  "Rearrange",
  "Compare",
  "Prove",
] as const;
