import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { PerspectiveCamera } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { HOME_CAMERA, HOME_TARGET, dampValue } from "../config";

interface CameraRigProps {
  reset: number;
  exploded: boolean;
  tour: boolean;
  reduced: boolean;
  stopTour: () => void;
}

export function CameraRig({
  reset,
  tour,
  reduced,
  stopTour,
  exploded,
}: CameraRigProps) {
  const { camera, size, invalidate } = useThree();
  const targetFov =
    (size.width / size.height < 1.5 ? 43 : 24) + (exploded ? 7 : 0);
  const framing = useRef(true);
  useEffect(() => {
    framing.current = true;
    invalidate();
  }, [targetFov, reset, invalidate]);
  const controls = useRef<OrbitControlsImpl>(null);
  const resetting = useRef(false);
  const angle = useRef(0);
  useEffect(() => {
    resetting.current = true;
    invalidate();
  }, [reset, invalidate]);
  useEffect(() => {
    if (tour) {
      resetting.current = false;
      const p = controls.current?.object.position;
      if (p) angle.current = Math.atan2(p.x, p.z);
    }
  }, [tour]);
  useFrame((_, dt) => {
    if (camera instanceof PerspectiveCamera && framing.current) {
      camera.fov = dampValue(camera.fov, targetFov, dt, reduced);
      camera.updateProjectionMatrix();
      if (Math.abs(camera.fov - targetFov) > 0.01) invalidate();
      else framing.current = false;
    }
    const c = controls.current;
    if (!c) return;
    const p = c.object.position;
    if (tour && !reduced) {
      angle.current += Math.min(dt, 0.05) * 0.18;
      p.set(
        dampValue(p.x, Math.sin(angle.current) * 8.2, dt),
        dampValue(p.y, 3.1, dt),
        dampValue(p.z, Math.cos(angle.current) * 8.2, dt),
      );
      invalidate();
      c.target.set(...HOME_TARGET);
      c.update();
    }
    if (resetting.current) {
      invalidate();
      p.set(
        dampValue(p.x, HOME_CAMERA[0], dt, reduced),
        dampValue(p.y, HOME_CAMERA[1], dt, reduced),
        dampValue(p.z, HOME_CAMERA[2], dt, reduced),
      );
      c.target.set(
        dampValue(c.target.x, HOME_TARGET[0], dt, reduced),
        dampValue(c.target.y, HOME_TARGET[1], dt, reduced),
        dampValue(c.target.z, HOME_TARGET[2], dt, reduced),
      );
      c.update();
      if (
        Math.abs(p.x - HOME_CAMERA[0]) +
          Math.abs(p.y - HOME_CAMERA[1]) +
          Math.abs(p.z - HOME_CAMERA[2]) <
        0.005
      )
        resetting.current = false;
    }
    c.target.x = Math.max(-2, Math.min(2, c.target.x));
    c.target.y = Math.max(0.8, Math.min(2.5, c.target.y));
    c.target.z = Math.max(-2, Math.min(2, c.target.z));
  });
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      target={HOME_TARGET}
      enableDamping
      dampingFactor={0.08}
      minDistance={5}
      maxDistance={15}
      minPolarAngle={0.35}
      maxPolarAngle={Math.PI / 2 - 0.04}
      onStart={() => {
        resetting.current = false;
        framing.current = false;
        stopTour();
      }}
    />
  );
}
