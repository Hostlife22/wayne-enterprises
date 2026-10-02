import { useState } from "react";
import { ArrowRight, Layers3 } from "lucide-react";
import type { Finish, Preset, PresetId } from "../configuration/types";
import { Dialog } from "../components/Dialog";
import type { Detail, Overlay } from "./content";
import type { Specification } from "./specifications";
import { searchShowroom } from "./search";

interface ShowroomDialogsProps {
  overlay: Overlay;
  preset: Preset;
  finish: Finish;
  specifications: Specification[];
  onClose: () => void;
  onDetail: (detail: Detail) => void;
  onPreset: (id: PresetId) => void;
}

export function ShowroomDialogs({
  overlay,
  preset,
  finish,
  specifications,
  onClose,
  onDetail,
  onPreset,
}: ShowroomDialogsProps) {
  const [query, setQuery] = useState("");
  if (overlay.kind === "closed") return null;
  const results = searchShowroom(query, specifications);
  return (
    <Dialog
      title={
        overlay.kind === "detail"
          ? overlay.detail.title
          : "Find your next configuration."
      }
      onClose={onClose}
    >
      {overlay.kind === "detail" ? (
        <>
          <p>{overlay.detail.body}</p>
          <div className="detail-note">
            <Layers3 size={18} />
            <span>
              BATPOD · {preset.name} · {finish.name}
              <br />
              Fictional concept / independent design study
            </span>
          </div>
        </>
      ) : (
        <>
          <label className="search-label" htmlFor="search">
            Search configurations or technical details
          </label>
          <input
            id="search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try pursuit, range, armor…"
          />
          <div className="search-results">
            {results.length ? (
              results.map((result) => (
                <button
                  key={result.title}
                  onClick={() => {
                    if (result.kind === "preset") {
                      onPreset(result.id);
                      onClose();
                    } else onDetail(result.detail);
                  }}
                >
                  <span>
                    <strong>{result.title}</strong>
                    <small>{result.body}</small>
                  </span>
                  <ArrowRight size={17} />
                </button>
              ))
            ) : (
              <p>No matches. Try “speed” or “tactical”.</p>
            )}
          </div>
        </>
      )}
    </Dialog>
  );
}
