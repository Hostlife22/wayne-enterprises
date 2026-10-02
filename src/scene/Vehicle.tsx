import { useEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { ExtrudeGeometry, Shape } from "three";
import type { Group } from "three";
import { assemblyTarget, dampValue } from "../config";
import type { AssemblyId, Finish, Preset } from "../config";
import { createMaterials } from "./materials";
import type { VehicleMaterials } from "./materials";
import { Block, Rod, Spring, Wheel } from "./parts";

interface VehicleProps {
  preset: Preset;
  finish: Finish;
  exploded: boolean;
  reduced: boolean;
}
interface AssemblyProps {
  id: AssemblyId;
  preset: Preset;
  exploded: boolean;
  reduced: boolean;
  children: ReactNode;
}
interface ArmorProps {
  materials: VehicleMaterials;
}

function Assembly({ id, preset, exploded, reduced, children }: AssemblyProps) {
  const ref = useRef<Group>(null);
  const target = assemblyTarget(id, preset, exploded);
  const initial = useRef(target);
  useFrame(({ invalidate }, delta) => {
    if (!ref.current) return;
    ref.current.position.x = dampValue(
      ref.current.position.x,
      target[0],
      delta,
      reduced,
    );
    ref.current.position.y = dampValue(
      ref.current.position.y,
      target[1],
      delta,
      reduced,
    );
    ref.current.position.z = dampValue(
      ref.current.position.z,
      target[2],
      delta,
      reduced,
    );
    if (
      Math.abs(ref.current.position.x - target[0]) +
        Math.abs(ref.current.position.y - target[1]) +
        Math.abs(ref.current.position.z - target[2]) >
      0.001
    )
      invalidate();
  });
  return (
    <group ref={ref} position={initial.current}>
      {children}
    </group>
  );
}
function Armor({ materials: m }: ArmorProps) {
  const geometry = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-0.85, -0.3);
    shape.lineTo(-0.98, 0.12);
    shape.lineTo(-0.5, 0.57);
    shape.lineTo(0.24, 0.51);
    shape.lineTo(0.65, 0.12);
    shape.lineTo(0.55, -0.3);
    shape.lineTo(-0.85, -0.3);
    return new ExtrudeGeometry(shape, {
      depth: 0.13,
      bevelEnabled: true,
      bevelSize: 0.045,
      bevelThickness: 0.035,
      bevelSegments: 2,
      steps: 1,
    });
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <group>
      <mesh geometry={geometry} material={m.armor} castShadow receiveShadow />
      <Rod
        from={[-0.69, 0.32, 0.19]}
        to={[-0.42, 0.47, 0.19]}
        material={m.metal}
        radius={0.013}
      />
      <Rod
        from={[-0.42, 0.47, 0.19]}
        to={[0.15, 0.41, 0.19]}
        material={m.metal}
        radius={0.013}
      />
      <Block
        position={[-0.1, 0.08, 0.18]}
        size={[0.32, 0.06, 0.02]}
        rotation={[0, 0, -0.18]}
        material={m.dark}
        radius={0.01}
      />
      {[-0.65, 0.4].map((x) => (
        <mesh
          key={x}
          position={[x, -0.18, 0.18]}
          rotation={[Math.PI / 2, 0, 0]}
          material={m.metal}
        >
          <cylinderGeometry args={[0.025, 0.025, 0.025, 6]} />
        </mesh>
      ))}
    </group>
  );
}
export function Vehicle({ preset, finish, exploded, reduced }: VehicleProps) {
  const dashboard = useRef<Group>(null);
  const oppositeEquipment = useRef<Group>(null);
  useFrame(({ invalidate }, dt) => {
    if (dashboard.current)
      dashboard.current.scale.z = dampValue(
        dashboard.current.scale.z,
        preset.dashboard,
        dt,
        reduced,
      );
    if (oppositeEquipment.current)
      oppositeEquipment.current.position.z = dampValue(
        oppositeEquipment.current.position.z,
        -1.25 - preset.equipment * 2,
        dt,
        reduced,
      );
    if (
      (dashboard.current &&
        Math.abs(dashboard.current.scale.z - preset.dashboard) > 0.001) ||
      (oppositeEquipment.current &&
        Math.abs(
          oppositeEquipment.current.position.z + 1.25 + preset.equipment * 2,
        ) > 0.001)
    )
      invalidate();
  });
  const materials = useMemo(() => createMaterials(finish), [finish]);
  useEffect(
    () => () => Object.values(materials).forEach((m) => m.dispose()),
    [materials],
  );
  const shared = { preset, exploded, reduced };
  const m = materials;
  return (
    <group>
      <Wheel x={-2.05} materials={m} />
      <Wheel x={2.05} materials={m} />
      <Assembly id="chassis" {...shared}>
        <Block
          position={[0, 0.71, 0]}
          size={[2.6, 0.25, 0.57]}
          material={m.dark}
        />
        <Block
          position={[-0.2, 1.04, 0]}
          size={[1.25, 0.65, 0.62]}
          material={m.dark}
        />
        {[-1, 1].map((side) => (
          <group key={side}>
            <Rod
              from={[-2.05, 0.91, side * 0.42]}
              to={[-0.85, 1.43, side * 0.35]}
              radius={0.105}
              material={m.dark}
            />
            <Rod
              from={[-2.05, 0.91, side * 0.42]}
              to={[-0.65, 0.64, side * 0.35]}
              radius={0.065}
              material={m.metal}
            />
            <Rod
              from={[2.05, 0.91, side * 0.38]}
              to={[0.65, 1.73, side * 0.32]}
              radius={0.09}
              material={m.dark}
            />
            <Rod
              from={[2.05, 0.91, side * 0.38]}
              to={[0.55, 0.68, side * 0.35]}
              radius={0.055}
              material={m.metal}
            />
            <Spring
              from={[1.6, 1.04, side * 0.38]}
              to={[0.8, 1.83, side * 0.38]}
              materials={m}
            />
            <Spring
              from={[-1.6, 1.02, side * 0.28]}
              to={[-0.9, 1.59, side * 0.28]}
              materials={m}
            />
            <Rod
              from={[-1.25, 0.5, side * 0.4]}
              to={[0.9, 0.5, side * 0.4]}
              radius={0.048}
              material={m.metal}
            />
            <Rod
              from={[-0.6, 0.64, side * 0.35]}
              to={[-0.65, 0.53, side * 0.85]}
              radius={0.05}
              material={m.dark}
            />
            <Block
              position={[-0.65, 0.54, side * 0.77]}
              size={[0.4, 0.075, 0.22]}
              material={m.dark}
            />
            {Array.from({ length: 7 }, (_, i) => (
              <Block
                key={i}
                position={[-0.55 + i * 0.13, 0.96, side * 0.35]}
                size={[0.075, 0.41, 0.15]}
                material={m.metal}
                radius={0.015}
              />
            ))}
            <mesh
              position={[-0.84, 1.18, side * 0.42]}
              rotation={[Math.PI / 2, 0, 0]}
              material={m.metal}
            >
              <cylinderGeometry args={[0.14, 0.14, 0.08, 20]} />
            </mesh>
            <Rod
              from={[-0.8, 0.82, side * 0.47]}
              to={[-1.52, 0.72, side * 0.49]}
              radius={0.075}
              material={m.dark}
            />
          </group>
        ))}
        <Block
          position={[0, 1.62, 0]}
          size={[1.1, 0.35, 0.58]}
          rotation={[0, 0, -0.12]}
          material={m.armor}
        />
      </Assembly>
      <Assembly id="leftArmor" {...shared}>
        <Armor materials={m} />
      </Assembly>
      <Assembly id="rightArmor" {...shared}>
        <group scale={[1, 1, -1]}>
          <Armor materials={m} />
        </group>
      </Assembly>
      <Assembly id="seat" {...shared}>
        <Block
          size={[1.15, 0.15, 0.59]}
          rotation={[0, 0, -0.09]}
          material={m.seat}
        />
        <Block
          position={[-0.6, 0.08, 0]}
          size={[0.25, 0.22, 0.62]}
          rotation={[0, 0, -0.25]}
          material={m.armor}
        />
        <Rod
          from={[-0.5, -0.05, -0.22]}
          to={[-0.65, -0.47, -0.22]}
          radius={0.045}
          material={m.metal}
        />
        <Rod
          from={[-0.5, -0.05, 0.22]}
          to={[-0.65, -0.47, 0.22]}
          radius={0.045}
          material={m.metal}
        />
        <Block
          position={[-0.79, 0.03, 0]}
          size={[0.04, 0.055, 0.38]}
          material={m.orange}
          radius={0.01}
        />
      </Assembly>
      <Assembly id="cockpit" {...shared}>
        <Rod
          from={[-0.15, -0.3, 0]}
          to={[0.05, 0.06, 0]}
          radius={0.075}
          material={m.metal}
        />
        <Rod
          from={[0, 0.06, -0.62]}
          to={[0, 0.06, 0.62]}
          radius={0.042}
          material={m.metal}
        />
        {[-1, 1].map((side) => (
          <group key={side}>
            <Rod
              from={[0, 0.06, side * 0.4]}
              to={[-0.16, 0.06, side * 0.8]}
              radius={0.07}
              material={m.rubber}
            />
            <Rod
              from={[-0.05, 0.12, side * 0.47]}
              to={[-0.25, 0.12, side * 0.68]}
              radius={0.018}
              material={m.metal}
            />
          </group>
        ))}
        <group ref={dashboard}>
          <Block
            position={[0.08, 0.18, 0]}
            size={[0.28, 0.3, 0.48]}
            rotation={[0, 0, -0.4]}
            material={m.dark}
          />
          <Block
            position={[-0.065, 0.24, 0]}
            size={[0.018, 0.16, 0.33]}
            rotation={[0, 0, -0.4]}
            material={m.screen}
            radius={0.012}
          />
        </group>
        <Block
          position={[0.24, -0.05, 0]}
          size={[0.19, 0.12, 0.4]}
          material={m.screen}
        />
      </Assembly>
      <Assembly id="equipment" {...shared}>
        {[-1, 1].map((side) => (
          <group
            key={side}
            ref={side === -1 ? oppositeEquipment : undefined}
            position={[0, 0, side === 1 ? 0 : -1.25]}
          >
            <Block
              size={[1.18, 0.52, 0.36]}
              material={m.armor}
              rotation={[0, 0, 0.04]}
            />
            {Array.from({ length: 5 }, (_, i) => (
              <Block
                key={i}
                position={[0.15, 0.12 - i * 0.055, 0.19]}
                size={[0.58, 0.018, 0.022]}
                material={m.dark}
                radius={0.004}
              />
            ))}
            <Rod
              from={[0.51, -0.06, 0]}
              to={[0.85, -0.06, 0]}
              radius={0.13}
              material={m.dark}
            />
            <Rod
              from={[0.83, -0.06, 0]}
              to={[0.89, -0.06, 0]}
              radius={0.145}
              material={m.metal}
            />
            <Block
              position={[-0.35, 0.12, 0.19]}
              size={[0.11, 0.027, 0.025]}
              material={m.orange}
              radius={0.004}
            />
          </group>
        ))}
      </Assembly>
    </group>
  );
}
