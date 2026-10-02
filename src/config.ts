export type PresetId = "standard" | "tactical" | "pursuit" | "combat";
export type FinishId = "black" | "graphite" | "silver";
export type AssemblyId =
  | "seat"
  | "cockpit"
  | "leftArmor"
  | "rightArmor"
  | "equipment"
  | "chassis"
  | "tank";
export type Vec3 = [number, number, number];
export interface Specifications {
  acceleration: number;
  speed: number;
  range: number;
  weight: number;
}
export interface EquipmentFeatures {
  stabilizers: boolean;
  grapple: boolean;
  spoiler: boolean;
  thrusters: boolean;
  cannons: boolean;
  turret: boolean;
  missilePod: boolean;
  launchers: boolean;
  headlights: boolean;
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
  wheelbase: number;
  rideHeightMm: number;
  features: EquipmentFeatures;
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
    wheelbase: 0,
    rideHeightMm: 145,
    features: {
      stabilizers: false,
      grapple: false,
      spoiler: false,
      thrusters: false,
      cannons: false,
      turret: false,
      missilePod: false,
      launchers: false,
      headlights: false,
    },
  },
  {
    id: "tactical",
    name: "Tactical Mode",
    subtitle: "Always prepared",
    specs: { acceleration: 3.1, speed: 290, range: 310, weight: 655 },
    height: 0.18,
    dashboard: 1,
    armor: 0.03,
    equipment: 0.08,
    wheelbase: 0,
    rideHeightMm: 200,
    features: {
      stabilizers: true,
      grapple: true,
      spoiler: false,
      thrusters: false,
      cannons: false,
      turret: false,
      missilePod: false,
      launchers: false,
      headlights: true,
    },
  },
  {
    id: "pursuit",
    name: "Pursuit Mode",
    subtitle: "Uncompromising pace",
    specs: { acceleration: 2.4, speed: 355, range: 240, weight: 560 },
    height: -0.18,
    dashboard: 0.58,
    armor: -0.05,
    equipment: 0,
    wheelbase: 0.2,
    rideHeightMm: 90,
    features: {
      stabilizers: false,
      grapple: false,
      spoiler: true,
      thrusters: true,
      cannons: false,
      turret: false,
      missilePod: false,
      launchers: false,
      headlights: false,
    },
  },
  {
    id: "combat",
    name: "Combat Mode",
    subtitle: "Maximum protection",
    specs: { acceleration: 3.3, speed: 300, range: 250, weight: 690 },
    height: 0.08,
    dashboard: 1,
    armor: 0.08,
    equipment: 0.14,
    wheelbase: 0,
    rideHeightMm: 170,
    features: {
      stabilizers: false,
      grapple: false,
      spoiler: false,
      thrusters: false,
      cannons: true,
      turret: true,
      missilePod: true,
      launchers: true,
      headlights: true,
    },
  },
];
export const FINISHES: Finish[] = [
  {
    id: "black",
    name: "Stealth Black",
    color: "#343940",
    roughness: 0.46,
    metalness: 0.5,
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
export const HOME_CAMERA: Vec3 = [1.45, 2.45, 7.8];
export const HOME_TARGET: Vec3 = [0, 1.4, 0];

export function equipmentSummary(preset: Preset): string[] {
  const f = preset.features;
  const details: string[] = [];
  if (f.stabilizers) details.push("Stabilizers down");
  if (f.grapple) details.push("Rear grapple raised");
  if (f.headlights) details.push("Headlights on");
  if (f.spoiler) details.push("Spoiler raised");
  if (f.thrusters) details.push("Aft thrusters extended");
  if (preset.wheelbase > 0) details.push("Wheelbase +180 mm");
  if (f.cannons) details.push("Cannons extended");
  if (f.turret) details.push("Turret deployed");
  if (f.missilePod) details.push("Missile pod raised");
  if (f.launchers) details.push("Launchers out");
  return details.length ? details : ["Equipment stowed"];
}
