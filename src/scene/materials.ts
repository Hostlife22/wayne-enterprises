import { MeshStandardMaterial } from "three";
import type { Finish } from "../config";

export function createMaterials(finish: Finish) {
  return {
    armor: new MeshStandardMaterial({
      color: finish.color,
      metalness: finish.metalness,
      roughness: finish.roughness,
    }),
    rubber: new MeshStandardMaterial({
      color: "#111618",
      roughness: 0.91,
      metalness: 0.05,
    }),
    metal: new MeshStandardMaterial({
      color: "#79858c",
      metalness: 0.9,
      roughness: 0.28,
    }),
    dark: new MeshStandardMaterial({
      color: "#272d31",
      metalness: 0.8,
      roughness: 0.4,
    }),
    seat: new MeshStandardMaterial({ color: "#15191b", roughness: 0.96 }),
    orange: new MeshStandardMaterial({
      color: "#fd6725",
      emissive: "#fa4e0b",
      emissiveIntensity: 0.4,
    }),
    screen: new MeshStandardMaterial({
      color: "#83c4d6",
      emissive: "#5ba6bf",
      emissiveIntensity: 0.8,
      metalness: 0.5,
      roughness: 0.2,
    }),
  };
}
export type VehicleMaterials = ReturnType<typeof createMaterials>;
