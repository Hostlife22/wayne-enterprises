import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Object3D, Vector2 } from "three";
import type { InstancedMesh } from "three";
import type { Vec3 } from "./types";
import type { VehicleMaterials } from "./materials";
import { TIRE_PROFILE, WHEEL_CENTER, brakeRotorGeometry } from "./geometry";
import { Axle, Fasteners, Panel } from "./Details";
import { Block } from "./parts";

interface WheelProps {
  x: number;
  materials: VehicleMaterials;
}

const TREAD_SEGMENTS = 88;
const TREAD_ROWS = 9;
const SIDEWALL_SEGMENTS = 96;
const SPOKE_PROFILE = [
  [-0.12, 0.1],
  [-0.07, 0.48],
  [0.07, 0.55],
  [0.16, 0.48],
  [0.1, 0.09],
] as const;
const TIRE_POINTS = TIRE_PROFILE.map(
  ([radius, width]) => new Vector2(radius, width),
);
const RIM_BOLTS: Vec3[] = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2;
  return [Math.sin(a) * 0.558, Math.cos(a) * 0.558, 0.053];
});
const HUB_BOLTS: Vec3[] = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2;
  return [Math.sin(a) * 0.215, Math.cos(a) * 0.215, 0.15];
});

export function Wheel({ x, materials: m }: WheelProps) {
  const tread = useRef<InstancedMesh>(null);
  const shoulder = useRef<InstancedMesh>(null);
  const rotor = useMemo(brakeRotorGeometry, []);
  useEffect(() => () => rotor.dispose(), [rotor]);
  useLayoutEffect(() => {
    const dummy = new Object3D();
    for (let row = 0; row < TREAD_ROWS; row++)
      for (let i = 0; i < TREAD_SEGMENTS; i++) {
        const z = (row - 4) * 0.087;
        const shoulderFactor = Math.abs(z) / 0.348;
        const radius = 1.002 - Math.pow(shoulderFactor, 4) * 0.035;
        const a = ((i + (row % 2) * 0.48) / TREAD_SEGMENTS) * Math.PI * 2;
        dummy.position.set(Math.sin(a) * radius, Math.cos(a) * radius, z);
        dummy.rotation.set(0, 0, -a);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        tread.current?.setMatrixAt(row * TREAD_SEGMENTS + i, dummy.matrix);
      }
    for (let side = 0; side < 2; side++)
      for (let row = 0; row < 4; row++)
        for (let i = 0; i < SIDEWALL_SEGMENTS; i++) {
          const a = ((i + row * 0.5) / SIDEWALL_SEGMENTS) * Math.PI * 2;
          const radius = [0.774, 0.844, 0.91, 0.963][row];
          dummy.position.set(
            Math.sin(a) * radius,
            Math.cos(a) * radius,
            (side ? 1 : -1) * [0.483, 0.461, 0.432, 0.381][row],
          );
          dummy.rotation.set(0, 0, -a);
          dummy.updateMatrix();
          shoulder.current?.setMatrixAt(
            side * SIDEWALL_SEGMENTS * 4 + row * SIDEWALL_SEGMENTS + i,
            dummy.matrix,
          );
        }
    for (const ref of [tread, shoulder])
      if (ref.current) {
        ref.current.instanceMatrix.needsUpdate = true;
        ref.current.computeBoundingSphere();
      }
  }, [m]);
  return (
    <group position={[x, WHEEL_CENTER, 0]}>
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        material={m.rubber}
        castShadow
        receiveShadow
      >
        <latheGeometry args={[TIRE_POINTS, 96]} />
      </mesh>
      <instancedMesh
        ref={tread}
        args={[undefined, m.tread, TREAD_ROWS * TREAD_SEGMENTS]}
        castShadow
      >
        <boxGeometry args={[0.058, 0.019, 0.077]} />
      </instancedMesh>
      <instancedMesh
        ref={shoulder}
        args={[undefined, m.tread, SIDEWALL_SEGMENTS * 8]}
        castShadow
      >
        <boxGeometry args={[0.043, 0.055, 0.012]} />
      </instancedMesh>
      <Axle position={[0, 0, 0]} radius={0.6} length={0.8} material={m.dark} />
      {[-1, 1].map((side) => (
        <group key={side} position={[0, 0, side * 0.443]} scale={[1, 1, side]}>
          {[0.635, 0.667, 0.787].map((r, i) => (
            <mesh key={r} material={i === 2 ? m.rubber : m.dark}>
              <torusGeometry args={[r, i === 2 ? 0.006 : 0.013, 8, 96]} />
            </mesh>
          ))}
          <mesh material={m.edge}>
            <torusGeometry args={[0.599, 0.018, 8, 96]} />
          </mesh>
          <Axle
            position={[0, 0, 0.018]}
            radius={0.56}
            length={0.035}
            material={m.dark}
          />
          {Array.from({ length: 6 }, (_, i) => (
            <Panel
              key={i}
              profile={SPOKE_PROFILE}
              depth={0.035}
              bevel={0.009}
              position={[0, 0, 0.02]}
              rotation={[0, 0, (i * Math.PI) / 3]}
              material={m.frame}
            />
          ))}
          <mesh geometry={rotor} material={m.rotor} position={[0, 0, 0.065]} />
          <Axle
            position={[0, 0, 0.082]}
            radius={0.28}
            length={0.075}
            material={m.dark}
          />
          <Axle
            position={[0, 0, 0.137]}
            radius={0.15}
            length={0.09}
            material={m.metal}
          />
          <Axle
            position={[0, 0, 0.19]}
            radius={0.103}
            length={0.031}
            material={m.edge}
            segments={12}
          />
          <Fasteners positions={RIM_BOLTS} material={m.metal} radius={0.013} />
          <Fasteners positions={HUB_BOLTS} material={m.metal} radius={0.019} />
          <Block
            position={[0.4, 0.23, 0.11]}
            size={[0.13, 0.29, 0.1]}
            rotation={[0, 0, -0.45]}
            material={m.frame}
            radius={0.019}
          />
          <Block
            position={[0.41, 0.23, 0.169]}
            size={[0.08, 0.18, 0.016]}
            rotation={[0, 0, -0.45]}
            material={m.edge}
            radius={0.01}
          />
        </group>
      ))}
    </group>
  );
}
