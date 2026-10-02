import type { Ref } from "react";
import { Plus } from "lucide-react";
import { PRESETS } from "../configuration/catalog";
import type { ConfigState, PresetId } from "../configuration/types";

interface ConfigurationPickerProps {
  state: ConfigState;
  configRef: Ref<HTMLDivElement>;
  onPreset: (id: PresetId) => void;
  onExplode: () => void;
}

export function ConfigurationPicker({
  state,
  configRef,
  onPreset,
  onExplode,
}: ConfigurationPickerProps) {
  return (
    <section className="configuration" aria-label="Configuration controls">
      <div className="section-title">
        <span /> // BATPOD //
        <span />
      </div>
      <div
        className="preset-list"
        ref={configRef}
        role="group"
        aria-label="Choose configuration"
      >
        {PRESETS.map((p) => (
          <button
            key={p.id}
            className={`preset ${!state.exploded && state.preset === p.id ? "active" : ""}`}
            aria-pressed={!state.exploded && state.preset === p.id}
            onClick={() => onPreset(p.id)}
          >
            <img
              className="bike-thumbnail"
              src={`${import.meta.env.BASE_URL}thumbnails/${p.id}.png`}
              alt=""
              width="600"
              height="280"
            />
            <strong>{p.name}</strong>
            <span>{p.subtitle}</span>
          </button>
        ))}
        <button
          className={`preset custom ${state.exploded ? "active" : ""}`}
          aria-pressed={state.exploded}
          onClick={() => onExplode()}
        >
          <Plus size={27} strokeWidth={1} />
          <strong>Custom Build</strong>
          <span>Explore the assembly</span>
        </button>
      </div>
    </section>
  );
}
