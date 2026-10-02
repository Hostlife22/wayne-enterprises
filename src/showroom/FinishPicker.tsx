import { ChevronRight } from "lucide-react";
import { FINISHES } from "../configuration/catalog";
import type { Finish, FinishId } from "../configuration/types";

interface FinishPickerProps {
  finish: Finish;
  onSelect: (id: FinishId) => void;
}

export function FinishPicker({ finish, onSelect }: FinishPickerProps) {
  return (
    <div className="finish-panel">
      <h2 className="eyebrow">FINISH & TRIM</h2>
      <div className="swatches" role="group" aria-label="Vehicle finish">
        {FINISHES.map((f) => (
          <button
            key={f.id}
            aria-label={f.name}
            aria-pressed={finish.id === f.id}
            onClick={() => onSelect(f.id)}
            className={`swatch swatch-${f.id} ${finish.id === f.id ? "selected" : ""}`}
          >
            <span />
          </button>
        ))}
        <ChevronRight size={15} />
      </div>
      <p aria-live="polite">{finish.name}</p>
    </div>
  );
}
