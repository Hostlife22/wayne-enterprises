import { PRESETS } from "../configuration/catalog";
import type { PresetId } from "../configuration/types";
import type { Detail } from "./content";
import type { Specification } from "./specifications";

export type SearchResult = {
  title: string;
  body: string;
} & ({ kind: "preset"; id: PresetId } | { kind: "detail"; detail: Detail });

export function searchShowroom(
  query: string,
  specifications: readonly Specification[],
): SearchResult[] {
  const results: SearchResult[] = [
    ...PRESETS.map((preset): SearchResult => ({
      kind: "preset",
      id: preset.id,
      title: preset.name,
      body: preset.subtitle,
    })),
    ...specifications.map((spec): SearchResult => ({
      kind: "detail",
      title: spec.label,
      body: `${spec.value} ${spec.unit}`,
      detail: { title: spec.label, body: spec.detail },
    })),
  ];
  const normalizedQuery = query.trim().toLowerCase();
  return results.filter((result) =>
    `${result.title} ${result.body}`.toLowerCase().includes(normalizedQuery),
  );
}
