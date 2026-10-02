import { MeshStandardMaterial } from "three";
import type { Finish } from "../configuration/types";

export type VehicleMaterials = ReturnType<typeof createMaterials>;

export function createMaterials(finish: Finish) {
  return {
    armor: new MeshStandardMaterial({
      color: finish.color,
      metalness: finish.metalness,
      roughness: finish.roughness,
    }),
    edge: new MeshStandardMaterial({
      color: finish.color,
      metalness: 0.6,
      roughness: 0.38,
    }),
    frame: new MeshStandardMaterial({
      color: "#33383e",
      metalness: 0.65,
      roughness: 0.42,
    }),
    rotor: new MeshStandardMaterial({
      color: "#576069",
      metalness: 0.8,
      roughness: 0.43,
    }),
    tread: new MeshStandardMaterial({
      color: "#292c2f",
      roughness: 0.94,
      metalness: 0,
    }),
    badge: new MeshStandardMaterial({
      color: finish.id === "silver" ? "#20272d" : "#657078",
      metalness: 0.65,
      roughness: 0.5,
    }),
    rubber: new MeshStandardMaterial({
      color: "#222528",
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
      metalness: 0.55,
      roughness: 0.48,
    }),
    seat: new MeshStandardMaterial({ color: "#15191b", roughness: 0.96 }),
    orange: new MeshStandardMaterial({
      color: "#fd6725",
      emissive: "#fa4e0b",
      emissiveIntensity: 0.4,
    }),
    display: new MeshStandardMaterial({
      color: "#102c32",
      metalness: 0.35,
      roughness: 0.25,
    }),
    screen: new MeshStandardMaterial({
      color: "#b9d9df",
      emissive: "#5ba6bf",
      emissiveIntensity: 0.4,
      metalness: 0.5,
      roughness: 0.2,
    }),
  };
}
