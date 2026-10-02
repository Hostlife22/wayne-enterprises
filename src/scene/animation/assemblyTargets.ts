import type { Preset } from "../../configuration/types";
import type { AssemblyId, Vec3 } from "../types";

export function assemblyTarget(
  id: AssemblyId,
  preset: Preset,
  exploded: boolean,
): Vec3 {
  const lift = preset.height;
  switch (id) {
    case "seat":
      return [-1.04, 2.05 + lift + (exploded ? 0.7 : 0), 0];
    case "cockpit":
      return [
        0.92 + (exploded ? 0.2 : 0),
        2.17 + lift + (exploded ? 0.7 : 0),
        0,
      ];
    case "leftArmor":
      return [0, 1.6 + lift, 0.44 + preset.armor + (exploded ? 0.75 : 0)];
    case "rightArmor":
      return [0, 1.6 + lift, -0.44 - preset.armor - (exploded ? 0.75 : 0)];
    case "equipment":
      return [
        1.0,
        0.97 + lift,
        0.66 + preset.equipment + (exploded ? 0.65 : 0),
      ];
    case "tank":
      return [0, lift + (exploded ? 0.5 : 0), 0];
    case "chassis":
      return [0, lift, 0];
  }
}
