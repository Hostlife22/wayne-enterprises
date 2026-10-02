import { describe, expect, it } from "vitest";
import { PRESETS } from "../src/configuration/catalog";
import { INITIAL_STATE, configReducer } from "../src/configuration/reducer";
import { assemblyTarget } from "../src/scene/animation/assemblyTargets";
import { dampValue } from "../src/scene/animation/damping";
import { HOME_CAMERA, HOME_TARGET } from "../src/scene/camera/home";
import type { AssemblyId } from "../src/scene/types";

const assemblies: AssemblyId[] = [
  "seat",
  "cockpit",
  "leftArmor",
  "rightArmor",
  "equipment",
  "chassis",
  "tank",
];
describe("configuration", () => {
  it("uses the specified standard baseline", () => {
    expect(PRESETS[0].specs).toEqual({
      acceleration: 2.8,
      speed: 320,
      range: 280,
      weight: 600,
    });
  });
  it("preserves preset and exploded state when changing finish", () => {
    const state = configReducer(
      configReducer(INITIAL_STATE, { type: "preset", id: "combat" }),
      { type: "explode" },
    );
    expect(configReducer(state, { type: "finish", id: "silver" })).toEqual({
      preset: "combat",
      finish: "silver",
      exploded: true,
    });
  });
  it("reassembles with every preset while preserving finish", () => {
    for (const p of PRESETS) {
      expect(
        configReducer(
          { preset: "combat", finish: "silver", exploded: true },
          { type: "preset", id: p.id },
        ),
      ).toEqual({ preset: p.id, finish: "silver", exploded: false });
      expect(
        Object.values(p.specs).every((v) => v > 0 && Number.isFinite(v)),
      ).toBe(true);
    }
  });
  it("moves seat up and opposite armor panels outward, retaining chassis", () => {
    const p = PRESETS[0];
    expect(assemblyTarget("seat", p, true)[1]).toBeGreaterThan(
      assemblyTarget("seat", p, false)[1],
    );
    expect(assemblyTarget("leftArmor", p, true)[2]).toBeGreaterThan(
      assemblyTarget("leftArmor", p, false)[2],
    );
    expect(assemblyTarget("rightArmor", p, true)[2]).toBeLessThan(
      assemblyTarget("rightArmor", p, false)[2],
    );
    expect(assemblyTarget("chassis", p, true)).toEqual(
      assemblyTarget("chassis", p, false),
    );
  });
  it("converges after repeatedly interrupted transitions without drift", () => {
    for (const id of assemblies) {
      let position = assemblyTarget(id, PRESETS[0], false);
      for (let i = 0; i < 1000; i++) {
        const target = assemblyTarget(id, PRESETS[i % 4], i % 2 === 0);
        position = position.map((v, j) => dampValue(v, target[j], 1 / 60)) as [
          number,
          number,
          number,
        ];
        expect(position.every(Number.isFinite)).toBe(true);
      }
      const target = assemblyTarget(id, PRESETS[0], false);
      for (let i = 0; i < 300; i++)
        position = position.map((v, j) => dampValue(v, target[j], 1 / 60)) as [
          number,
          number,
          number,
        ];
      position.forEach((v, i) => expect(v).toBeCloseTo(target[i], 6));
    }
  });
  it("bounds pauses, ignores invalid time and supports reduced motion", () => {
    expect(dampValue(0, 1, 60)).toBe(dampValue(0, 1, 0.05));
    expect(dampValue(0, 1, NaN)).toBe(0);
    expect(dampValue(0, 1, -1)).toBe(0);
    expect(dampValue(0, 1, 0, true)).toBe(1);
  });
  it("reset has a stable camera position above the floor and away from the chassis", () => {
    expect(HOME_CAMERA[1]).toBeGreaterThan(HOME_TARGET[1]);
    expect(Math.hypot(...HOME_CAMERA)).toBeGreaterThan(5);
  });
});
