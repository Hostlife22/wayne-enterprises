import { describe, expect, it } from "vitest";
import {
  FINISH_BY_ID,
  FINISHES,
  PRESET_BY_ID,
  PRESETS,
} from "../src/configuration/catalog";
import { getSpecifications } from "../src/showroom/specifications";
import { searchShowroom } from "../src/showroom/search";

// These checks protect the contract between the catalog, cards and search.
describe("showroom data", () => {
  it("resolves every displayed preset and finish to the canonical catalog entry", () => {
    expect(new Set(PRESETS.map((preset) => preset.id)).size).toBe(4);
    expect(new Set(FINISHES.map((finish) => finish.id)).size).toBe(3);
    for (const preset of PRESETS) expect(PRESET_BY_ID[preset.id]).toBe(preset);
    for (const finish of FINISHES) expect(FINISH_BY_ID[finish.id]).toBe(finish);
  });

  it("shows the current preset's values in both specification cards and search", () => {
    for (const preset of PRESETS) {
      const specifications = getSpecifications(preset);
      for (const id of ["range", "speed", "weight"] as const) {
        const card = specifications.find(
          (specification) => specification.id === id,
        );
        expect(card?.value).toBe(String(preset.specs[id]));
        const results = searchShowroom(
          String(preset.specs[id]),
          specifications,
        );
        expect(results).toContainEqual(
          expect.objectContaining({
            kind: "detail",
            title: card?.label,
            body: `${preset.specs[id]} ${card?.unit}`,
          }),
        );
      }
    }
  });

  it("normalizes a query and returns the exact preset selection", () => {
    expect(
      searchShowroom("  PuRsUiT  ", getSpecifications(PRESET_BY_ID.standard)),
    ).toEqual([
      {
        kind: "preset",
        id: "pursuit",
        title: "Pursuit Mode",
        body: "Uncompromising pace",
      },
    ]);
  });

  it("returns detail content independently of mutable UI state", () => {
    const specifications = getSpecifications(PRESET_BY_ID.combat);
    const [result] = searchShowroom("armor", specifications);
    expect(result).toEqual(
      expect.objectContaining({
        kind: "detail",
        detail: {
          title: specifications[0].label,
          body: specifications[0].detail,
        },
      }),
    );
  });

  it("returns all eight entries for an empty query and none for a missing term", () => {
    const specifications = getSpecifications(PRESET_BY_ID.standard);
    expect(searchShowroom("", specifications)).toHaveLength(8);
    expect(searchShowroom("not-a-vehicle", specifications)).toEqual([]);
  });
});
