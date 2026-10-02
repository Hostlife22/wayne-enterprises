import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { dampValue } from "../config";
import { CatmullRomCurve3, Object3D, Vector3 } from "three";
import type { Group, InstancedMesh, Material } from "three";
import type { Vec3 } from "../config";
import { panelGeometry } from "./geometry";
import type { Profile } from "./geometry";
import { Block } from "./parts";

interface PanelProps {
  profile: Profile;
  material: Material;
  depth?: number;
  bevel?: number;
  position?: Vec3;
  scale?: Vec3;
  rotation?: Vec3;
}
interface FastenersProps {
  positions: ReadonlyArray<Vec3>;
  material: Material;
  radius?: number;
  axis?: "x" | "y" | "z";
}
interface HoseProps {
  points: ReadonlyArray<Vec3>;
  material: Material;
  radius?: number;
}
interface BeamProps {
  from: Vec3;
  to: Vec3;
  width: number;
  depth: number;
  material: Material;
}
interface AxleProps {
  position: Vec3;
  radius: number;
  length: number;
  material: Material;
  axis?: "x" | "y" | "z";
  segments?: number;
}

interface SuspensionMemberProps {
  from: Vec3;
  to: Vec3;
  material: Material;
  radius?: number;
  width?: number;
  depth?: number;
  reduced: boolean;
}

export function Panel({
  profile,
  material,
  depth = 0.1,
  bevel = 0.025,
  position,
  scale,
  rotation,
}: PanelProps) {
  const geometry = useMemo(
    () => panelGeometry(profile, depth, bevel),
    [profile, depth, bevel],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh
      geometry={geometry}
      material={material}
      position={position}
      scale={scale}
      rotation={rotation}
      castShadow
      receiveShadow
    />
  );
}
export function Fasteners({
  positions,
  material,
  radius = 0.022,
  axis = "z",
}: FastenersProps) {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const dummy = new Object3D();
    dummy.rotation.set(
      axis === "z" ? Math.PI / 2 : 0,
      0,
      axis === "x" ? Math.PI / 2 : 0,
    );
    positions.forEach((p, i) => {
      dummy.position.set(...p);
      dummy.updateMatrix();
      ref.current?.setMatrixAt(i, dummy.matrix);
    });
    if (ref.current) {
      ref.current.instanceMatrix.needsUpdate = true;
      ref.current.computeBoundingSphere();
    }
  }, [positions, material, axis]);
  return (
    <instancedMesh ref={ref} args={[undefined, material, positions.length]}>
      <cylinderGeometry args={[radius, radius, radius * 0.55, 6]} />
    </instancedMesh>
  );
}
export function Hose({ points, material, radius = 0.023 }: HoseProps) {
  const curve = useMemo(
    () => new CatmullRomCurve3(points.map((p) => new Vector3(...p))),
    [points],
  );
  return (
    <mesh material={material} castShadow>
      <tubeGeometry args={[curve, 32, radius, 6, false]} />
    </mesh>
  );
}
export function Beam({ from, to, width, depth, material }: BeamProps) {
  const mid: Vec3 = [
    (from[0] + to[0]) / 2,
    (from[1] + to[1]) / 2,
    (from[2] + to[2]) / 2,
  ];
  return (
    <Block
      position={mid}
      size={[Math.hypot(to[0] - from[0], to[1] - from[1]), width, depth]}
      rotation={[0, 0, Math.atan2(to[1] - from[1], to[0] - from[0])]}
      material={material}
      radius={0.018}
    />
  );
}
export function Axle({
  position,
  radius,
  length,
  material,
  axis = "z",
  segments = 32,
}: AxleProps) {
  return (
    <mesh
      position={position}
      rotation={
        axis === "z"
          ? [Math.PI / 2, 0, 0]
          : axis === "x"
            ? [0, 0, Math.PI / 2]
            : [0, 0, 0]
      }
      material={material}
      castShadow
    >
      <cylinderGeometry args={[radius, radius, length, segments]} />
    </mesh>
  );
}

export function SuspensionMember({
  from,
  to,
  material,
  radius = 0.05,
  width,
  depth = 0.15,
  reduced,
}: SuspensionMemberProps) {
  const ref = useRef<Group>(null);
  const initial = useRef({ from, to });
  const vectors = useMemo(
    () => ({
      start: new Vector3(...initial.current.from),
      end: new Vector3(...initial.current.to),
      direction: new Vector3(),
      up: new Vector3(0, 1, 0),
    }),
    [],
  );
  useFrame(({ invalidate }, dt) => {
    const group = ref.current;
    if (!group) return;
    vectors.start.set(
      dampValue(vectors.start.x, from[0], dt, reduced),
      dampValue(vectors.start.y, from[1], dt, reduced),
      dampValue(vectors.start.z, from[2], dt, reduced),
    );
    vectors.end.set(
      dampValue(vectors.end.x, to[0], dt, reduced),
      dampValue(vectors.end.y, to[1], dt, reduced),
      dampValue(vectors.end.z, to[2], dt, reduced),
    );
    vectors.direction.subVectors(vectors.end, vectors.start);
    const length = vectors.direction.length();
    group.position.copy(vectors.start).addScaledVector(vectors.direction, 0.5);
    group.scale.y = length;
    group.quaternion.setFromUnitVectors(
      vectors.up,
      vectors.direction.normalize(),
    );
    if (
      Math.abs(vectors.start.y - from[1]) +
        Math.abs(vectors.start.x - from[0]) +
        Math.abs(vectors.end.y - to[1]) >
      0.001
    )
      invalidate();
  });
  return (
    <group ref={ref}>
      <mesh material={material} castShadow>
        {width ? (
          <boxGeometry args={[width, 1, depth]} />
        ) : (
          <cylinderGeometry args={[radius, radius, 1, 16]} />
        )}
      </mesh>
    </group>
  );
}
