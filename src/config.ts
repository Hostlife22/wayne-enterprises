export type PresetId = "standard" | "tactical" | "pursuit" | "combat";
export type FinishId = "black" | "graphite" | "silver";
export type AssemblyId =
  "seat" | "cockpit" | "leftArmor" | "rightArmor" | "equipment" | "chassis";
export type Vec3 = [number, number, number];
export interface Specifications {
  acceleration: number;
  speed: number;
  range: number;
  weight: number;
}
export interface Preset {
  id: PresetId;
  name: string;
  subtitle: string;
  specs: Specifications;
  height: number;
  dashboard: number;
  armor: number;
  equipment: number;
}
export interface Finish {
  id: FinishId;
  name: string;
  color: string;
  roughness: number;
  metalness: number;
}
export interface ConfigState {
  preset: PresetId;
  finish: FinishId;
  exploded: boolean;
}
export type ConfigAction =
  | { type: "preset"; id: PresetId }
  | { type: "finish"; id: FinishId }
  | { type: "explode" };

export const PRESETS: Preset[] = [
  {
    id: "standard",
    name: "Standard",
    subtitle: "Pure engineering",
    specs: { acceleration: 2.8, speed: 320, range: 280, weight: 600 },
    height: 0,
    dashboard: 1,
    armor: 0,
    equipment: 0,
  },
  {
    id: "tactical",
    name: "Tactical Mode",
    subtitle: "Always prepared",
    specs: { acceleration: 3.1, speed: 290, range: 310, weight: 655 },
    height: 0.15,
    dashboard: 1.25,
    armor: 0.12,
    equipment: 0.35,
  },
  {
    id: "pursuit",
    name: "Pursuit Mode",
    subtitle: "Uncompromising pace",
    specs: { acceleration: 2.4, speed: 355, range: 240, weight: 560 },
    height: -0.1,
    dashboard: 0.85,
    armor: -0.05,
    equipment: 0.1,
  },
  {
    id: "combat",
    name: "Combat Mode",
    subtitle: "Maximum protection",
    specs: { acceleration: 3.3, speed: 305, range: 265, weight: 720 },
    height: 0.22,
    dashboard: 1.45,
    armor: 0.24,
    equipment: 0.65,
  },
];
export const FINISHES: Finish[] = [
  {
    id: "black",
    name: "Stealth Black",
    color: "#232a2e",
    roughness: 0.35,
    metalness: 0.8,
  },
  {
    id: "graphite",
    name: "Graphite Gray",
    color: "#545f65",
    roughness: 0.32,
    metalness: 0.8,
  },
  {
    id: "silver",
    name: "Titanium Silver",
    color: "#a7b4bd",
    roughness: 0.25,
    metalness: 0.85,
  },
];
export const INITIAL_STATE: ConfigState = {
  preset: "standard",
  finish: "black",
  exploded: false,
};
export function configReducer(
  state: ConfigState,
  action: ConfigAction,
): ConfigState {
  if (action.type === "preset")
    return { ...state, preset: action.id, exploded: false };
  if (action.type === "finish") return { ...state, finish: action.id };
  return { ...state, exploded: true };
}
export function assemblyTarget(
  id: AssemblyId,
  preset: Preset,
  exploded: boolean,
): Vec3 {
  const lift = preset.height;
  switch (id) {
    case "seat":
      return [-0.85, 1.79 + lift + (exploded ? 1.05 : 0), 0];
    case "cockpit":
      return [
        0.92 + (exploded ? 0.2 : 0),
        1.93 + lift + (exploded ? 1.05 : 0),
        0,
      ];
    case "leftArmor":
      return [0, 1.35 + lift, 0.44 + preset.armor + (exploded ? 1.1 : 0)];
    case "rightArmor":
      return [0, 1.35 + lift, -0.44 - preset.armor - (exploded ? 1.1 : 0)];
    case "equipment":
      return [
        1.0,
        0.87 + lift,
        0.62 + preset.equipment + (exploded ? 0.65 : 0),
      ];
    case "chassis":
      return [0, lift, 0];
  }
}
export function dampValue(
  current: number,
  target: number,
  delta: number,
  reduced = false,
): number {
  return reduced
    ? target
    : current +
        (target - current) *
          (1 -
            Math.exp(
              -7 *
                Math.max(0, Math.min(Number.isFinite(delta) ? delta : 0, 0.05)),
            ));
}
export const HOME_CAMERA: Vec3 = [2.5, 2.55, 7.3];
export const HOME_TARGET: Vec3 = [0, 1.15, 0];
