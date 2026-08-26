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
};

export type DockingSlotConfig<Id extends string = string> = {
  id: string;
  accepts: Id[];
  requiredRotation: number;
  target: Transform;
  event: string;
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
