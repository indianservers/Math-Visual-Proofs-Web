import { z } from "zod";

const pointSchema = z.object({ x: z.number(), y: z.number() });
const transformSchema = pointSchema.extend({ rotation: z.number() });
const vector3Schema = pointSchema.extend({ z: z.number() });

const geometrySchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("polygon"), points: z.array(pointSchema).min(3) }),
  z.object({
    kind: z.literal("rectangle"),
    width: z.number().positive(),
    height: z.number().positive(),
    radius: z.number().nonnegative().optional(),
  }),
  z.object({ kind: z.literal("circle"), radius: z.number().positive() }),
  z.object({
    kind: z.literal("ellipse"),
    radiusX: z.number().positive(),
    radiusY: z.number().positive(),
  }),
  z.object({ kind: z.literal("segment"), end: pointSchema }),
  z.object({
    kind: z.literal("arc"),
    radius: z.number().positive(),
    startAngle: z.number(),
    endAngle: z.number(),
  }),
  z.object({
    kind: z.literal("polyhedron"),
    vertices: z.array(vector3Schema).min(4),
    faces: z.array(z.array(z.number().int().nonnegative()).min(3)).min(4),
    projection: z.enum(["orthographic", "perspective"]).optional(),
  }),
]);

const constraintSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("bounds"),
    bounds: z.object({
      minX: z.number(),
      maxX: z.number(),
      minY: z.number(),
      maxY: z.number(),
    }),
  }),
  z.object({
    kind: z.literal("axis"),
    axis: z.enum(["x", "y"]),
    value: z.number().optional(),
  }),
  z.object({
    kind: z.literal("grid"),
    size: z.number().positive(),
    tolerance: z.number().nonnegative().optional(),
  }),
  z.object({ kind: z.literal("path"), points: z.array(pointSchema).min(2) }),
  z.object({
    kind: z.literal("rotation-step"),
    degrees: z.number().positive(),
  }),
  z.object({
    kind: z.literal("scale-range"),
    min: z.number().positive(),
    max: z.number().positive(),
  }),
]);

const objectSchema = z.object({
  id: z.string().min(1),
  label: z.string(),
  mathematicalType: z.string().min(1),
  color: z.string().min(1),
  gradientId: z.string(),
  initial: transformSchema,
  allowedRotations: z.array(z.number()),
  compatibleSlotIds: z.array(z.string()),
  snapTolerance: z.number().nonnegative(),
  quantity: z.string(),
  explanation: z.string(),
  geometry: geometrySchema.optional(),
  tags: z.array(z.string()).optional(),
  capabilities: z
    .object({
      draggable: z.boolean().optional(),
      rotatable: z.boolean().optional(),
      resizable: z.boolean().optional(),
      dockable: z.boolean().optional(),
      detachable: z.boolean().optional(),
      cloneable: z.boolean().optional(),
      inspectable: z.boolean().optional(),
    })
    .optional(),
  constraints: z.array(constraintSchema).optional(),
  appearance: z
    .object({
      fill: z.string().optional(),
      stroke: z.string().optional(),
      strokeWidth: z.number().nonnegative().optional(),
      opacity: z.number().min(0).max(1).optional(),
      className: z.string().optional(),
    })
    .optional(),
});

const slotSchema = z.object({
  id: z.string().min(1),
  accepts: z.array(z.string()),
  requiredRotation: z.number(),
  target: transformSchema,
  event: z.string(),
  acceptsTypes: z.array(z.string()).optional(),
  acceptsTags: z.array(z.string()).optional(),
  orientationTolerance: z.number().nonnegative().optional(),
  priority: z.number().optional(),
  lockOnDock: z.boolean().optional(),
});

export const proofCanvasConfigSchema = z
  .object({
    id: z.string().min(1),
    viewport: z.object({
      width: z.number().positive(),
      height: z.number().positive(),
      minZoom: z.number().positive().optional(),
      maxZoom: z.number().positive().optional(),
    }),
    objects: z.array(objectSchema),
    slots: z.array(slotSchema).optional(),
    snapTargets: z
      .array(
        z.object({
          id: z.string().min(1),
          kind: z.enum(["point", "vertex", "center", "grid", "guide"]),
          point: pointSchema,
          radius: z.number().nonnegative(),
          priority: z.number().optional(),
          acceptsTypes: z.array(z.string()).optional(),
          acceptsTags: z.array(z.string()).optional(),
        }),
      )
      .optional(),
    interaction: z
      .object({
        snapEnabled: z.boolean().optional(),
        detachDistance: z.number().nonnegative().optional(),
        keyboardStep: z.number().positive().optional(),
        rotationStep: z.number().positive().optional(),
      })
      .optional(),
    assist: z
      .object({
        objectPicker: z.boolean().optional(),
        directionPad: z.boolean().optional(),
        oneTapDock: z.boolean().optional(),
        zoomControls: z.boolean().optional(),
        spokenFeedback: z.boolean().optional(),
        showProgress: z.boolean().optional(),
        helpSteps: z.array(z.string().min(1)).max(6).optional(),
      })
      .optional(),
  })
  .superRefine((config, context) => {
    const objectIds = new Set(config.objects.map((object) => object.id));
    const slotIds = new Set(config.slots?.map((slot) => slot.id) ?? []);
    for (const object of config.objects) {
      for (const slotId of object.compatibleSlotIds) {
        if (!slotIds.has(slotId))
          context.addIssue({
            code: "custom",
            path: ["objects", object.id, "compatibleSlotIds"],
            message: `Unknown slot ${slotId}`,
          });
      }
    }
    for (const slot of config.slots ?? []) {
      for (const objectId of slot.accepts) {
        if (!objectIds.has(objectId))
          context.addIssue({
            code: "custom",
            path: ["slots", slot.id, "accepts"],
            message: `Unknown object ${objectId}`,
          });
      }
    }
    if (
      config.viewport.minZoom &&
      config.viewport.maxZoom &&
      config.viewport.minZoom > config.viewport.maxZoom
    ) {
      context.addIssue({
        code: "custom",
        path: ["viewport"],
        message: "minZoom must not exceed maxZoom",
      });
    }
  });

export type AuthoredProofCanvasConfig = z.infer<typeof proofCanvasConfigSchema>;

export function parseProofCanvasConfig(input: unknown) {
  return proofCanvasConfigSchema.parse(input);
}
