import { RotateCcw, X } from "lucide-react";
import type { Preset, Finish } from "../configuration/types";
import { equipmentSummary } from "../configuration/equipmentSummary";
import { Viewer } from "../scene/Viewer";
import { BikeDrawing } from "../components/Graphics";

interface VehicleStageProps {
  preset: Preset;
  finish: Finish;
  exploded: boolean;
  reduced: boolean;
  reset: number;
  tour: boolean;
  stopTour: () => void;
  resetView: () => void;
}

export function VehicleStage({
  preset,
  finish,
  exploded,
  reduced,
  reset,
  tour,
  stopTour,
  resetView,
}: VehicleStageProps) {
  return (
    <section className="vehicle-stage" aria-label="Vehicle inspection">
      <div className="technical-heading">
        <span className="orange-slash" />
        <p>
          WAYNETECH
          <br />
          TACTICAL
          <br />
          PURSUIT
          <br />
          VEHICLE
        </p>
        <span className="hairline" />
      </div>
      <div className="blueprint">
        <BikeDrawing technical />
        <div>
          <strong>BATPOD</strong>
          <span>
            BP–01
            <br />
            ADAPTIVE CHASSIS
            <br />
            ENGINEERING DIVISION
          </span>
        </div>
      </div>
      <div className="stage-index">01 / ENGINEERED FOR THE NIGHT</div>
      <Viewer
        preset={preset}
        finish={finish}
        exploded={exploded}
        reduced={reduced}
        reset={reset}
        tour={tour}
        stopTour={stopTour}
        resetView={resetView}
      />
      <div className="viewer-tools">
        <span>
          <i /> LIVE 3D / {exploded ? "ASSEMBLY INSPECTION" : "STUDIO VIEW"}
        </span>
        <button aria-label="Reset view" onClick={resetView}>
          <RotateCcw size={14} /> Reset view
        </button>
      </div>
      {tour && (
        <button className="tour-stop dark-button" onClick={stopTour}>
          <X size={16} /> Stop film
        </button>
      )}
      <div className="vehicle-status" aria-live="polite">
        <span>
          <i /> RIDE HEIGHT <b>{preset.rideHeightMm} MM</b>
        </span>
        <span>
          DASHBOARD <b>{preset.dashboard < 1 ? "COMPACT" : "FULL WIDTH"}</b>
        </span>
        <span>
          EQUIPMENT <b>{preset.features.cannons ? "DEPLOYED" : "STOWED"}</b>
        </span>
        <span>
          ASSEMBLY: <b>{exploded ? "EXPLODED" : "ASSEMBLED"}</b>
        </span>
      </div>
      <p className="mode-detail" aria-live="polite">
        {equipmentSummary(preset).join(" · ")}
      </p>
    </section>
  );
}
