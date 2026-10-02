import { Suspense, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Finish, Preset } from "../configuration/types";
import { HOME_CAMERA } from "./camera/home";
import { supportsWebGL } from "../platform/webgl";
import { Vehicle } from "./Vehicle";
import { StudioFloor } from "./StudioFloor";
import { CameraRig } from "./CameraRig";
import { RenderBoundary } from "./RenderBoundary";
import { ContextMonitor } from "./ContextMonitor";
import { StudioLighting } from "./StudioLighting";

interface ViewerProps {
  preset: Preset;
  finish: Finish;
  exploded: boolean;
  reduced: boolean;
  reset: number;
  tour: boolean;
  stopTour: () => void;
  resetView: () => void;
}
export function Viewer(props: ViewerProps) {
  const [available] = useState(supportsWebGL);
  const [lost, setLost] = useState(false);
  const onContextLost = useCallback(() => setLost(true), []);
  return (
    <div
      className="canvas-wrap"
      aria-label="Interactive Batpod 3D viewer. Drag to orbit, pinch or scroll to zoom, right-drag to pan."
      onDoubleClick={props.resetView}
    >
      {!available || lost ? (
        <div className="viewer-fallback" role="status">
          <strong>3D viewing is unavailable</strong>
          <p>
            Enable WebGL 2 or try another browser. All vehicle specifications
            remain available.
          </p>
          <button onClick={() => window.location.reload()}>Retry viewer</button>
        </div>
      ) : (
        <RenderBoundary>
          <Canvas
            frameloop="demand"
            dpr={[1, 1.6]}
            camera={{ position: HOME_CAMERA, fov: 30, near: 0.1, far: 80 }}
            gl={{ antialias: true }}
          >
            <ContextMonitor onLost={onContextLost} />
            <Suspense
              fallback={
                <Html center>
                  <div className="loading">Initializing vehicle…</div>
                </Html>
              }
            >
              <StudioLighting />
              <Vehicle
                preset={props.preset}
                finish={props.finish}
                exploded={props.exploded}
                reduced={props.reduced}
              />
              <StudioFloor preset={props.preset} reduced={props.reduced} />
            </Suspense>
            <CameraRig
              reset={props.reset}
              exploded={props.exploded}
              tour={props.tour}
              reduced={props.reduced}
              stopTour={props.stopTour}
            />
          </Canvas>
        </RenderBoundary>
      )}
    </div>
  );
}
