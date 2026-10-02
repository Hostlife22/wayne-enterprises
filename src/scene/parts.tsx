import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { CatmullRomCurve3, Object3D, Vector3 } from "three";
import type { Material } from "three";
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
