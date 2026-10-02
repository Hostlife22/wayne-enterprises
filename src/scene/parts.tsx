import { useLayoutEffect, useMemo, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import { CatmullRomCurve3, Object3D, Vector3 } from "three";
import type { InstancedMesh, Material } from "three";
import type { Vec3 } from "../config";
import type { VehicleMaterials } from "./materials";

interface BoxProps {
  position?: Vec3;
  size: Vec3;
  material: Material;
  rotation?: Vec3;
  radius?: number;
}
interface RodProps {
  from: Vec3;
  to: Vec3;
  radius?: number;
  material: Material;
}
interface WheelProps {
  x: number;
  materials: VehicleMaterials;
}
interface SpringProps {
  from: Vec3;
  to: Vec3;
  materials: VehicleMaterials;
}

export function Block({
  position,
  size,
  material,
  rotation,
  radius = 0.04,
}: BoxProps) {
  return (
    <RoundedBox
      args={size}
      radius={radius}
      smoothness={2}
      position={position}
      rotation={rotation}
      material={material}
      castShadow
      receiveShadow
    />
  );
}
export function Rod({ from, to, radius = 0.035, material }: RodProps) {
  const { mid, length, quaternion } = useMemo(() => {
    const a = new Vector3(...from),
      b = new Vector3(...to),
      direction = b.clone().sub(a);
    return {
      mid: a.add(b).multiplyScalar(0.5),
      length: direction.length(),
      quaternion: new Object3D().quaternion.setFromUnitVectors(
        new Vector3(0, 1, 0),
        direction.normalize(),
      ),
    };
  }, [from, to]);
  return (
    <mesh position={mid} quaternion={quaternion} material={material} castShadow>
      <cylinderGeometry args={[radius, radius, length, 12]} />
    </mesh>
  );
}
export function Wheel({ x, materials: m }: WheelProps) {
  const tread = useRef<InstancedMesh>(null),
    bolts = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const dummy = new Object3D();
    for (let row = 0; row < 5; row++)
      for (let i = 0; i < 64; i++) {
        const a = ((i + (row % 2) * 0.5) / 64) * Math.PI * 2;
        dummy.position.set(
          Math.sin(a) * 0.877,
          Math.cos(a) * 0.877,
          (row - 2) * 0.13,
        );
        dummy.rotation.set(0, 0, -a + (row % 2 ? 0.12 : -0.12));
        dummy.updateMatrix();
        tread.current?.setMatrixAt(row * 64 + i, dummy.matrix);
      }
    if (tread.current) tread.current.instanceMatrix.needsUpdate = true;
    for (let side = 0; side < 2; side++)
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        dummy.position.set(
          Math.sin(a) * 0.33,
          Math.cos(a) * 0.33,
          side ? 0.405 : -0.405,
        );
        dummy.rotation.set(Math.PI / 2, 0, 0);
        dummy.updateMatrix();
        bolts.current?.setMatrixAt(side * 12 + i, dummy.matrix);
      }
    if (bolts.current) bolts.current.instanceMatrix.needsUpdate = true;
  }, [m]);
  return (
    <group position={[x, 0.91, 0]}>
      <mesh material={m.rubber} castShadow receiveShadow>
        <torusGeometry args={[0.655, 0.245, 20, 72]} />
      </mesh>
      <instancedMesh ref={tread} args={[undefined, m.rubber, 320]} castShadow>
        <boxGeometry args={[0.073, 0.048, 0.12]} />
      </instancedMesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} material={m.dark} castShadow>
        <cylinderGeometry args={[0.46, 0.46, 0.7, 48]} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[0, 0, side * 0.36]}>
          <mesh material={m.metal}>
            <torusGeometry args={[0.44, 0.027, 8, 48]} />
          </mesh>
          <mesh material={m.metal}>
            <ringGeometry args={[0.27, 0.36, 48]} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={m.dark}>
            <cylinderGeometry args={[0.17, 0.17, 0.1, 16]} />
          </mesh>
          <mesh
            position={[0, 0, side * 0.06]}
            rotation={[Math.PI / 2, 0, 0]}
            material={m.metal}
          >
            <cylinderGeometry args={[0.085, 0.085, 0.065, 8]} />
          </mesh>
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <Rod
                key={i}
                from={[Math.sin(a) * 0.13, Math.cos(a) * 0.13, 0]}
                to={[Math.sin(a + 0.25) * 0.42, Math.cos(a + 0.25) * 0.42, 0]}
                radius={0.037}
                material={m.dark}
              />
            );
          })}
          <Block
            position={[0.3, 0.12, 0.025]}
            size={[0.12, 0.24, 0.09]}
            material={m.dark}
          />
        </group>
      ))}
      <instancedMesh ref={bolts} args={[undefined, m.metal, 24]}>
        <cylinderGeometry args={[0.024, 0.024, 0.028, 6]} />
      </instancedMesh>
    </group>
  );
}
export function Spring({ from, to, materials: m }: SpringProps) {
  const curve = useMemo(() => {
    const a = new Vector3(...from),
      b = new Vector3(...to),
      axis = b.clone().sub(a),
      u = new Vector3(0, 0, 1),
      v = new Vector3().crossVectors(axis, u).normalize();
    return new CatmullRomCurve3(
      Array.from({ length: 161 }, (_, i) => {
        const t = i / 160,
          angle = t * Math.PI * 20;
        return a
          .clone()
          .addScaledVector(axis, t)
          .addScaledVector(u, Math.cos(angle) * 0.085)
          .addScaledVector(v, Math.sin(angle) * 0.085);
      }),
    );
  }, [from, to]);
  return (
    <group>
      <Rod from={from} to={to} radius={0.042} material={m.metal} />
      <mesh material={m.metal} castShadow>
        <tubeGeometry args={[curve, 160, 0.018, 6, false]} />
      </mesh>
    </group>
  );
}
