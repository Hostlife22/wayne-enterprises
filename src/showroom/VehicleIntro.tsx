import { Maximize2 } from "lucide-react";
import type { Preset, Finish, FinishId } from "../configuration/types";
import { FinishPicker } from "./FinishPicker";

interface VehicleIntroProps {
  preset: Preset;
  finish: Finish;
  onFinish: (id: FinishId) => void;
}

export function VehicleIntro({ preset, finish, onFinish }: VehicleIntroProps) {
  return (
    <section className="intro">
      <p className="eyebrow breadcrumb">
        WAYNE ENTERPRISES <span>/</span> BATPOD
      </p>
      <h1>
        GOTHAM
        <br />
        MOVES
        <br />
        FASTER
        <br />
        IN DARKNESS<span className="orange">.</span>
      </h1>
      <p className="tagline">
        Tactical engineering.
        <br />A safer Gotham.
      </p>
      <div className="metrics">
        <div>
          <span>0–100 KM/H</span>
          <strong>
            {preset.specs.acceleration}
            <small> s</small>
          </strong>
        </div>
        <div>
          <span>TOP SPEED</span>
          <strong>
            {preset.specs.speed}
            <small> km/h</small>
          </strong>
        </div>
        <div>
          <span>STEALTH RANGE</span>
          <strong>
            {preset.specs.range}
            <small> km</small>
          </strong>
        </div>
      </div>
      <p className="gesture-hint">
        <Maximize2 size={15} />
        <span>
          DRAG TO ORBIT · SCROLL TO ZOOM
          <br />
          RIGHT-DRAG TO PAN · DOUBLE-CLICK TO RESET
        </span>
      </p>
      <FinishPicker finish={finish} onSelect={onFinish} />
    </section>
  );
}
