export type ProofState =
  | "INITIAL"
  | "OBSERVING_INVARIANTS"
  | "BUILDING_ARRANGEMENT"
  | "PARTIALLY_DOCKED"
  | "ARRANGEMENT_COMPLETE"
  | "COMPARING_REGIONS"
  | "BUILDING_EQUATION"
  | "PROOF_COMPLETE";

export type Transform = { x: number; y: number; rotation: number };

export type Vector3 = { x: number; y: number; z: number };

export type Transform3D = Vector3 & {
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scale: number;
};

export type CanvasBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export type InteractionCapabilities = {
  draggable?: boolean;
  rotatable?: boolean;
  resizable?: boolean;
  dockable?: boolean;
  detachable?: boolean;
  cloneable?: boolean;
  inspectable?: boolean;
};

export type MovementConstraint =
  | { kind: "bounds"; bounds: CanvasBounds }
  | { kind: "axis"; axis: "x" | "y"; value?: number }
  | { kind: "grid"; size: number; tolerance?: number }
  | { kind: "path"; points: { x: number; y: number }[] }
  | { kind: "rotation-step"; degrees: number }
  | { kind: "scale-range"; min: number; max: number };

export type ShapeGeometry =
  | { kind: "polygon"; points: { x: number; y: number }[] }
  | { kind: "rectangle"; width: number; height: number; radius?: number }
  | { kind: "circle"; radius: number }
  | { kind: "ellipse"; radiusX: number; radiusY: number }
  | { kind: "segment"; end: { x: number; y: number } }
  | {
      kind: "arc";
      radius: number;
      startAngle: number;
      endAngle: number;
    }
  | {
      kind: "polyhedron";
      vertices: Vector3[];
      faces: number[][];
      projection?: "orthographic" | "perspective";
    };

export type SnapTarget = {
  id: string;
  kind: "point" | "vertex" | "center" | "grid" | "guide";
  point: { x: number; y: number };
  radius: number;
  priority?: number;
  acceptsTypes?: string[];
  acceptsTags?: string[];
};

export type ProofObjectAppearance = {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  className?: string;
};

export type ProofObjectConfig<Id extends string = string> = {
  id: Id;
  label: string;
  mathematicalType: string;
  color: string;
  gradientId: string;
  initial: Transform;
  allowedRotations: number[];
  compatibleSlotIds: string[];
  snapTolerance: number;
  quantity: string;
  explanation: string;
  geometry?: ShapeGeometry;
  tags?: string[];
  capabilities?: InteractionCapabilities;
  constraints?: MovementConstraint[];
  appearance?: ProofObjectAppearance;
};

export type DockingSlotConfig<Id extends string = string> = {
  id: string;
  accepts: Id[];
  requiredRotation: number;
  target: Transform;
  event: string;
  acceptsTypes?: string[];
  acceptsTags?: string[];
  orientationTolerance?: number;
  priority?: number;
  lockOnDock?: boolean;
};

export type ProofObjectState<Id extends string = string> = Transform & {
  id: Id;
  dockedSlotId: string | null;
};

export type ProofScene<Id extends string = string> = {
  phase: ProofState;
  objects: Record<Id, ProofObjectState<Id>>;
  comparisonConfirmed: boolean;
};

export type ValidationResult = {
  valid: boolean;
  reason: "valid" | "incompatible" | "orientation" | "distance" | "occupied";
};

export type CanvasViewport = {
  width: number;
  height: number;
  minZoom?: number;
  maxZoom?: number;
};

export type ProofCanvasConfig<Id extends string = string> = {
  id: string;
  viewport: CanvasViewport;
  objects: ProofObjectConfig<Id>[];
  slots?: DockingSlotConfig<Id>[];
  snapTargets?: SnapTarget[];
  interaction?: {
    snapEnabled?: boolean;
    detachDistance?: number;
    keyboardStep?: number;
    rotationStep?: number;
  };
  assist?: {
    objectPicker?: boolean;
    directionPad?: boolean;
    oneTapDock?: boolean;
    zoomControls?: boolean;
    spokenFeedback?: boolean;
    showProgress?: boolean;
    helpSteps?: string[];
  };
};

export type DockCandidate<Id extends string = string> = {
  slot: DockingSlotConfig<Id>;
  distance: number;
  score: number;
  validation: ValidationResult;
};

export type DropResolution =
  | { kind: "docked"; transform: Transform; slotId: string; message: string }
  | { kind: "free"; transform: Transform; message: string }
  | {
      kind: "rejected";
      transform: Transform;
      reason: ValidationResult["reason"];
      message: string;
    };
