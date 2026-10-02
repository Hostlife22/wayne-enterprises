import { Component, Suspense, useState, useEffect } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  Html,
} from "@react-three/drei";
import type { Finish, Preset } from "../config";
import { HOME_CAMERA } from "../config";
import { supportsWebGL } from "../hooks";
import { Vehicle } from "./Vehicle";
import { CameraRig } from "./CameraRig";

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
interface ContextMonitorProps {
  onLost: () => void;
}
interface BoundaryProps {
  children: ReactNode;
}
interface BoundaryState {
  failed: boolean;
}

function ContextMonitor({ onLost }: ContextMonitorProps) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", onLost);
    return () => canvas.removeEventListener("webglcontextlost", onLost);
  }, [gl, onLost]);
  return null;
}
class RenderBoundary extends Component<BoundaryProps, BoundaryState> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Vehicle renderer failed", error, info.componentStack);
  }
  render() {
    return this.state.failed ? (
      <div className="viewer-fallback" role="alert">
        The 3D renderer could not start.{" "}
        <button onClick={() => window.location.reload()}>Reload viewer</button>
        <p>Specifications and configuration controls remain available below.</p>
      </div>
    ) : (
      this.props.children
    );
  }
}
export function Viewer(props: ViewerProps) {
  const [available] = useState(supportsWebGL);
  const [lost, setLost] = useState(false);
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
            shadows
            frameloop="demand"
            dpr={[1, 1.6]}
            camera={{ position: HOME_CAMERA, fov: 30, near: 0.1, far: 80 }}
            gl={{ antialias: true }}
          >
            <ContextMonitor onLost={() => setLost(true)} />
            <ambientLight intensity={0.6} />
            <directionalLight
              position={[2, 8, 5]}
              intensity={3}
              castShadow
              shadow-mapSize={[1024, 1024]}
              shadow-camera-left={-7}
              shadow-camera-right={7}
              shadow-camera-top={7}
              shadow-camera-bottom={-7}
            />
            <directionalLight position={[-4, 3, -5]} intensity={2} />
            <Suspense
              fallback={
                <Html center>
                  <div className="loading">Initializing vehicle…</div>
                </Html>
              }
            >
              <Environment resolution={128}>
                <Lightformer
                  intensity={2}
                  position={[0, 3, 6]}
                  rotation={[0, Math.PI, 0]}
                  scale={[8, 4, 1]}
                />
                <Lightformer
                  intensity={4}
                  position={[0, 5, 0]}
                  rotation={[Math.PI / 2, 0, 0]}
                  scale={[10, 10, 1]}
                />
                <Lightformer
                  intensity={3}
                  position={[-5, 2, 3]}
                  rotation={[0, Math.PI / 2, 0]}
                  scale={[5, 3, 1]}
                />
                <Lightformer
                  intensity={2}
                  position={[3, 3, -5]}
                  scale={[8, 4, 1]}
                />
              </Environment>
              <Vehicle {...props} />
              <ContactShadows
                position={[0, -0.015, 0]}
                opacity={0.5}
                scale={15}
                blur={2.5}
                far={4}
                resolution={256}
                frames={Infinity}
              />
            </Suspense>
            <CameraRig
              reset={props.reset}
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
