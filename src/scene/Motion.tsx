import { useRef } from "react";
import type { ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { assemblyTarget, dampValue } from "../config";
import type { AssemblyId, Preset, Vec3 } from "../config";

interface AssemblyProps {
  id: AssemblyId;
  preset: Preset;
  exploded: boolean;
  reduced: boolean;
  children: ReactNode;
}
export interface MechanismProps {
  amount: number;
  reduced: boolean;
  from?: Vec3;
  to?: Vec3;
  rotationFrom?: Vec3;
  rotationTo?: Vec3;
  scaleFrom?: Vec3;
  scaleTo?: Vec3;
  hideStowed?: boolean;
  children: ReactNode;
  name?: string;
}

const ZERO: Vec3 = [0, 0, 0];
const ONE: Vec3 = [1, 1, 1];
export function Assembly({
  id,
  preset,
  exploded,
  reduced,
  children,
}: AssemblyProps) {
  const ref = useRef<Group>(null);
  const target = assemblyTarget(id, preset, exploded);
  const initial = useRef(target);
  useFrame(({ invalidate }, dt) => {
    const group = ref.current;
    if (!group) return;
    group.position.set(
      dampValue(group.position.x, target[0], dt, reduced),
      dampValue(group.position.y, target[1], dt, reduced),
      dampValue(group.position.z, target[2], dt, reduced),
    );
    if (
      Math.abs(group.position.x - target[0]) +
        Math.abs(group.position.y - target[1]) +
        Math.abs(group.position.z - target[2]) >
      0.001
    )
      invalidate();
  });
  return (
    <group ref={ref} position={initial.current} name={id}>
      {children}
    </group>
  );
}
export function Mechanism({
  amount,
  reduced,
  from = ZERO,
  to = ZERO,
  rotationFrom = ZERO,
  rotationTo = ZERO,
  scaleFrom = ONE,
  scaleTo = ONE,
  hideStowed = false,
  children,
  name,
}: MechanismProps) {
  const ref = useRef<Group>(null);
  const progress = useRef(amount);
  useFrame(({ invalidate }, dt) => {
    const group = ref.current;
    if (!group) return;
    progress.current = dampValue(progress.current, amount, dt, reduced);
    const a = progress.current;
    group.position.set(
      from[0] + (to[0] - from[0]) * a,
      from[1] + (to[1] - from[1]) * a,
      from[2] + (to[2] - from[2]) * a,
    );
    group.rotation.set(
      rotationFrom[0] + (rotationTo[0] - rotationFrom[0]) * a,
      rotationFrom[1] + (rotationTo[1] - rotationFrom[1]) * a,
      rotationFrom[2] + (rotationTo[2] - rotationFrom[2]) * a,
    );
    group.scale.set(
      scaleFrom[0] + (scaleTo[0] - scaleFrom[0]) * a,
      scaleFrom[1] + (scaleTo[1] - scaleFrom[1]) * a,
      scaleFrom[2] + (scaleTo[2] - scaleFrom[2]) * a,
    );
    group.visible = !hideStowed || a > 0.005;
    if (Math.abs(a - amount) > 0.0005) invalidate();
  });
  return (
    <group ref={ref} name={name}>
      {children}
    </group>
  );
}
