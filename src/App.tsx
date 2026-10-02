import { useRef, useState } from "react";
import { useConfiguration } from "./configuration/useConfiguration";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { useViewerControls } from "./hooks/useViewerControls";
import { CONTENT } from "./showroom/content";
import type { Detail, Overlay } from "./showroom/content";
import { getSpecifications } from "./showroom/specifications";
import { Header } from "./showroom/Header";
import { Footer } from "./showroom/Footer";
import { VehicleIntro } from "./showroom/VehicleIntro";
import { VehicleStage } from "./showroom/VehicleStage";
import { SpecificationCards } from "./showroom/SpecificationCards";
import { ConfigurationPicker } from "./showroom/ConfigurationPicker";
import { ConfigurePromotion, FilmPromotion } from "./showroom/Promotions";
import { ShowroomDialogs } from "./showroom/ShowroomDialogs";

export default function App() {
  const { state, preset, finish, selectPreset, selectFinish, explode } =
    useConfiguration();
  const reduced = useReducedMotion();
  const viewer = useViewerControls(reduced);
  const [overlay, setOverlay] = useState<Overlay>({ kind: "closed" });
  const configRef = useRef<HTMLDivElement>(null);
  const specifications = getSpecifications(preset);
  const openDetail = (detail: Detail) => setOverlay({ kind: "detail", detail });
  const focusConfig = () => {
    configRef.current?.scrollIntoView({
      behavior: reduced ? "instant" : "smooth",
      block: "nearest",
    });
    configRef.current?.querySelector("button")?.focus({ preventScroll: true });
  };
  const playFilm = () => {
    if (reduced) {
      openDetail({
        title: "Cinematic presentation",
        body: "Camera motion is disabled by your reduced-motion preference. You can still inspect the vehicle manually using the viewer.",
      });
    } else viewer.startTour();
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to vehicle configurator
      </a>
      <div className="showroom">
        <Header
          onNavigate={(id) => openDetail(CONTENT[id])}
          onConfigure={focusConfig}
          onSearch={() => setOverlay({ kind: "search" })}
        />
        <main id="main" className="main-grid">
          <VehicleIntro
            preset={preset}
            finish={finish}
            onFinish={selectFinish}
          />
          <VehicleStage
            preset={preset}
            finish={finish}
            exploded={state.exploded}
            reduced={reduced}
            reset={viewer.reset}
            tour={viewer.tour}
            stopTour={viewer.stopTour}
            resetView={viewer.resetView}
          />
          <SpecificationCards
            specifications={specifications}
            onDetail={openDetail}
          />
          <FilmPromotion onPlay={playFilm} />
          <ConfigurationPicker
            state={state}
            configRef={configRef}
            onPreset={selectPreset}
            onExplode={explode}
          />
          <ConfigurePromotion onConfigure={focusConfig} />
        </main>
        <Footer
          preset={preset}
          onConfigure={focusConfig}
          onDetail={openDetail}
        />
      </div>
      <ShowroomDialogs
        overlay={overlay}
        preset={preset}
        finish={finish}
        specifications={specifications}
        onClose={() => setOverlay({ kind: "closed" })}
        onDetail={openDetail}
        onPreset={selectPreset}
      />
    </>
  );
}
