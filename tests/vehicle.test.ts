import { describe, expect, it } from "vitest";
import { DoubleSide, Mesh, MeshBasicMaterial, Raycaster, Vector3 } from "three";
import { PRESETS } from "../src/configuration/catalog";
import { equipmentSummary } from "../src/configuration/equipmentSummary";
import { dampValue } from "../src/scene/animation/damping";
import {
  ARMOR_PROFILE,
  EQUIPMENT_PROFILE,
  TIRE_PROFILE,
  brakeRotorGeometry,
  panelGeometry,
} from "../src/scene/geometry";

describe("reference configuration equipment", () => {
  it("keeps standard equipment stowed and distinguishes all three mission profiles", () => {
    const [standard, tactical, pursuit, combat] = PRESETS;
    expect(Object.values(standard.features).some(Boolean)).toBe(false);
    expect(tactical.features).toMatchObject({
      stabilizers: true,
      grapple: true,
      headlights: true,
      cannons: false,
      turret: false,
    });
    expect(pursuit.features).toMatchObject({
      spoiler: true,
      thrusters: true,
      stabilizers: false,
      cannons: false,
    });
    expect(pursuit.wheelbase).toBeGreaterThan(standard.wheelbase);
    expect(pursuit.dashboard).toBeLessThan(standard.dashboard);
    expect(pursuit.rideHeightMm).toBeLessThan(standard.rideHeightMm);
    expect(combat.features).toMatchObject({
      cannons: true,
      turret: true,
      missilePod: true,
      launchers: true,
      stabilizers: false,
    });
    expect(combat.specs).toMatchObject({ speed: 300, range: 250, weight: 690 });
    expect(equipmentSummary(combat)).toContain("Turret deployed");
  });
  it("stows every deployable feature after rapidly interrupted preset selections", () => {
    for (const feature of Object.keys(PRESETS[0].features) as Array<
      keyof (typeof PRESETS)[0]["features"]
    >) {
      let progress = 0;
      for (let i = 0; i < 200; i++)
        progress = dampValue(
          progress,
          Number(PRESETS[i % 4].features[feature]),
          1 / 60,
        );
      for (let i = 0; i < 150; i++) progress = dampValue(progress, 0, 1 / 60);
      expect(progress).toBeLessThan(0.0005);
      expect(Number.isFinite(progress)).toBe(true);
    }
  });
});
describe("procedural mechanical geometry", () => {
  it("uses a broad, almost flat tire crown with rounded shoulders", () => {
    const crown = TIRE_PROFILE.filter(([, z]) => Math.abs(z) < 0.3);
    expect(crown.length).toBeGreaterThanOrEqual(5);
    expect(
      Math.max(...crown.map(([r]) => r)) - Math.min(...crown.map(([r]) => r)),
    ).toBeLessThan(0.025);
    expect(Math.max(...TIRE_PROFILE.map(([, z]) => z)) * 2).toBeGreaterThan(
      0.9,
    );
  });
  it("has real perforations in the brake rotor, rather than dots painted onto a disc", () => {
    const geometry = brakeRotorGeometry();
    const material = new MeshBasicMaterial({ side: DoubleSide });
    const mesh = new Mesh(geometry, material);
    const holeRay = new Raycaster(
      new Vector3(0.39, 0, 1),
      new Vector3(0, 0, -1),
    );
    const surfaceRay = new Raycaster(
      new Vector3(0.433, 0.025, 1),
      new Vector3(0, 0, -1),
    );
    expect(holeRay.intersectObject(mesh)).toHaveLength(0);
    expect(surfaceRay.intersectObject(mesh).length).toBeGreaterThan(0);
    const rimRay = new Raycaster(
      new Vector3(
        Math.cos(Math.PI / 6) * 0.518,
        Math.sin(Math.PI / 6) * 0.518,
        1,
      ),
      new Vector3(0, 0, -1),
    );
    expect(rimRay.intersectObject(mesh).length).toBeGreaterThan(0);
    geometry.dispose();
    material.dispose();
  });
  it("produces finite, thick armor and equipment shells", () => {
    for (const profile of [ARMOR_PROFILE, EQUIPMENT_PROFILE]) {
      const geometry = panelGeometry(profile, 0.14, 0.025);
      geometry.computeBoundingBox();
      expect(
        geometry.boundingBox!.max.z - geometry.boundingBox!.min.z,
      ).toBeGreaterThan(0.14);
      expect(
        Array.from(geometry.getAttribute("position").array).every(
          Number.isFinite,
        ),
      ).toBe(true);
      expect(
        Array.from(geometry.getAttribute("normal").array).every(
          Number.isFinite,
        ),
      ).toBe(true);
      geometry.dispose();
    }
  });
});
