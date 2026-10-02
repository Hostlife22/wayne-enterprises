export type PresetId = "standard" | "tactical" | "pursuit" | "combat";
export type FinishId = "black" | "graphite" | "silver";
export interface Specifications {
  readonly acceleration: number;
  readonly speed: number;
  readonly range: number;
  readonly weight: number;
}
export interface EquipmentFeatures {
  readonly stabilizers: boolean;
  readonly grapple: boolean;
  readonly spoiler: boolean;
  readonly thrusters: boolean;
  readonly cannons: boolean;
  readonly turret: boolean;
  readonly missilePod: boolean;
  readonly launchers: boolean;
  readonly headlights: boolean;
}
export interface Preset {
  readonly id: PresetId;
  readonly name: string;
  readonly subtitle: string;
  readonly specs: Specifications;
  readonly height: number;
  readonly dashboard: number;
  readonly armor: number;
  readonly equipment: number;
  readonly wheelbase: number;
  readonly rideHeightMm: number;
  readonly features: EquipmentFeatures;
}
export interface Finish {
  readonly id: FinishId;
  readonly name: string;
  readonly color: string;
  readonly roughness: number;
  readonly metalness: number;
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
