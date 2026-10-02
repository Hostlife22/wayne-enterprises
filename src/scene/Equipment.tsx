import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import type { Preset, Vec3 } from "../config";
import type { VehicleMaterials } from "./materials";
import { Axle, Fasteners, Panel } from "./Details";
import { Block, Rod } from "./parts";
import { Mechanism } from "./Motion";

interface EquipmentProps {
  materials: VehicleMaterials;
  preset: Preset;
  reduced: boolean;
}
interface RotaryProps {
  materials: VehicleMaterials;
  active: boolean;
  reduced: boolean;
}

const DASH_OUTLINE = [
  [-0.15, -0.15],
  [-0.19, 0.12],
  [-0.12, 0.2],
  [0.1, 0.2],
  [0.17, 0.13],
  [0.16, -0.15],
] as const;
const DISPLAY_BOLTS: Vec3[] = [
  [-0.17, -0.14, -0.26],
  [-0.17, -0.14, 0.26],
  [-0.17, 0.15, -0.26],
  [-0.17, 0.15, 0.26],
];

export function Cockpit({ materials: m, preset, reduced }: EquipmentProps) {
  return (
    <group>
      <Rod
        from={[-0.1, -0.22, 0]}
        to={[0.08, 0.015, 0]}
        radius={0.082}
        material={m.metal}
      />
      <Rod
        from={[0, 0.015, -0.58]}
        to={[0, 0.015, 0.58]}
        radius={0.048}
        material={m.metal}
      />
      {[-1, 1].map((side) => (
        <group key={side}>
          <Rod
            from={[0, 0.015, side * 0.46]}
            to={[-0.18, 0.005, side * 0.83]}
            radius={0.059}
            material={m.seat}
          />
          <Rod
            from={[-0.065, -0.06, side * 0.49]}
            to={[-0.27, -0.07, side * 0.75]}
            radius={0.015}
            material={m.metal}
          />
          <Axle
            position={[-0.01, 0.015, side * 0.51]}
            radius={0.07}
            length={0.026}
            material={m.rotor}
          />
          <Block
            position={[-0.06, 0.085, side * 0.44]}
            size={[0.11, 0.055, 0.1]}
            material={m.dark}
            radius={0.013}
          />
          <Block
            position={[-0.06, 0.12, side * 0.44]}
            size={[0.035, 0.015, 0.035]}
            material={m.orange}
            radius={0.005}
          />
        </group>
      ))}
      <Mechanism
        amount={preset.id === "pursuit" ? 1 : 0}
        reduced={reduced}
        from={[0, 0.19, 0]}
        to={[-0.08, 0.08, 0]}
        scaleTo={[0.85, 0.8, 0.58]}
        rotationFrom={[0, 0.35, -0.22]}
        rotationTo={[0, 0.35, -0.65]}
      >
        <Panel
          profile={DASH_OUTLINE}
          material={m.frame}
          position={[0, 0, -0.31]}
          depth={0.62}
          bevel={0.016}
        />
        <Block
          position={[-0.171, 0.012, 0]}
          size={[0.02, 0.225, 0.51]}
          material={m.seat}
          radius={0.009}
        />
        <Block
          position={[-0.184, 0.01, -0.12]}
          size={[0.007, 0.16, 0.19]}
          material={m.display}
          radius={0.004}
        />
        <Block
          position={[-0.184, 0.01, 0.12]}
          size={[0.007, 0.16, 0.19]}
          material={m.display}
          radius={0.004}
        />
        {Array.from({ length: 5 }, (_, i) => (
          <Block
            key={i}
            position={[-0.19, -0.046 + i * 0.027, 0.12]}
            size={[0.006, 0.009, 0.04 + i * 0.02]}
            material={m.screen}
            radius={0.001}
          />
        ))}
        <Axle
          position={[-0.19, 0.015, -0.12]}
          radius={0.054}
          length={0.004}
          material={m.screen}
          axis="x"
        />
        <Axle
          position={[-0.194, 0.015, -0.12]}
          radius={0.045}
          length={0.004}
          material={m.display}
          axis="x"
        />
        <Fasteners
          positions={DISPLAY_BOLTS}
          material={m.metal}
          axis="x"
          radius={0.013}
        />
        <Rod
          from={[0.04, 0.2, 0.23]}
          to={[0.12, 0.43, 0.23]}
          radius={0.008}
          material={m.dark}
        />
      </Mechanism>
      <Block
        position={[0.13, -0.14, 0]}
        size={[0.15, 0.12, 0.3]}
        material={m.frame}
      />
      <Block
        position={[0.21, -0.14, 0]}
        size={[0.015, 0.067, 0.21]}
        material={m.display}
        radius={0.008}
      />
      <Mechanism
        amount={Number(preset.features.headlights)}
        reduced={reduced}
        hideStowed
        scaleFrom={[0.01, 0.01, 0.01]}
      >
        <Block
          position={[0.219, -0.14, 0]}
          size={[0.01, 0.057, 0.19]}
          material={m.screen}
          radius={0.004}
        />
      </Mechanism>
    </group>
  );
}
export function RearEquipment({
  materials: m,
  preset,
  reduced,
}: EquipmentProps) {
  return (
    <group>
      {[-1, 1].map((side) => (
        <group key={side} position={[-0.5, 0.16, side * 0.38]}>
          <Block
            position={[-0.015, 0.06, 0]}
            size={[0.4, 0.28, 0.21]}
            material={m.dark}
            radius={0.016}
          />
          <Rod
            from={[-0.53, 0.1, 0]}
            to={[0.1, 0.1, 0]}
            radius={0.106}
            material={m.dark}
          />
          {[-0.42, -0.22, 0.02].map((x) => (
            <Axle
              key={x}
              position={[x, 0.1, 0]}
              radius={0.117}
              length={0.04}
              material={m.frame}
              axis="x"
            />
          ))}
          <Axle
            position={[-0.51, 0.1, 0]}
            radius={0.13}
            length={0.13}
            material={m.rotor}
            axis="x"
          />
          <Axle
            position={[-0.58, 0.1, 0]}
            radius={0.09}
            length={0.013}
            material={m.dark}
            axis="x"
          />
          <Rod
            from={[-0.14, 0.24, 0]}
            to={[0.08, 0.24, 0]}
            radius={0.017}
            material={m.metal}
          />
          <Mechanism
            name={`thruster-${side}`}
            amount={Number(preset.features.thrusters)}
            reduced={reduced}
            to={[-0.39, 0, 0]}
          >
            <Axle
              position={[-0.37, 0.1, 0]}
              radius={0.089}
              length={0.35}
              material={m.metal}
              axis="x"
            />
            <Axle
              position={[-0.58, 0.1, 0]}
              radius={0.14}
              length={0.13}
              material={m.rotor}
              axis="x"
            />
            <Axle
              position={[-0.65, 0.1, 0]}
              radius={0.105}
              length={0.014}
              material={m.dark}
              axis="x"
            />
            <Mechanism
              amount={Number(preset.features.thrusters)}
              reduced={reduced}
              hideStowed
              scaleFrom={[0.01, 0.01, 0.01]}
            >
              <Axle
                position={[-0.66, 0.1, 0]}
                radius={0.073}
                length={0.008}
                material={m.orange}
                axis="x"
              />
            </Mechanism>
          </Mechanism>
        </group>
      ))}
      <Mechanism
        name="rear-grapple"
        amount={Number(preset.features.grapple)}
        reduced={reduced}
        hideStowed
        from={[-0.6, 0.22, 0]}
        to={[-0.6, 0.39, 0]}
        rotationFrom={[0, 0, 0]}
        rotationTo={[0, 0, -0.7]}
        scaleFrom={[1, 0.02, 1]}
      >
        <Block size={[0.3, 0.12, 0.19]} material={m.dark} />
        <Rod
          from={[0.09, 0.07, 0]}
          to={[-0.35, 0.07, 0]}
          radius={0.044}
          material={m.metal}
        />
        <Rod
          from={[-0.32, 0.07, 0]}
          to={[-0.39, 0.16, 0]}
          radius={0.014}
          material={m.orange}
        />
        <Rod
          from={[-0.32, 0.07, 0]}
          to={[-0.39, -0.02, 0]}
          radius={0.014}
          material={m.orange}
        />
      </Mechanism>
      <Mechanism
        name="missile-pod"
        amount={Number(preset.features.missilePod)}
        reduced={reduced}
        hideStowed
        from={[-0.59, 0.14, 0]}
        to={[-0.59, 0.43, 0]}
        scaleFrom={[1, 0.01, 1]}
        rotationTo={[0, 0, -0.18]}
      >
        <Block size={[0.36, 0.24, 0.58]} material={m.armor} radius={0.023} />
        {[-0.19, 0, 0.19].map((z) => (
          <group key={z}>
            <Axle
              position={[-0.193, 0, z]}
              radius={0.054}
              length={0.023}
              material={m.dark}
              axis="x"
            />
            <Axle
              position={[-0.21, 0, z]}
              radius={0.027}
              length={0.018}
              material={m.orange}
              axis="x"
            />
          </group>
        ))}
      </Mechanism>
    </group>
  );
}
export function Rotary({ materials: m, active, reduced }: RotaryProps) {
  const ref = useRef<Group>(null);
  useFrame(({ invalidate }, dt) => {
    if (!ref.current || !active || reduced || document.hidden) return;
    ref.current.rotation.x =
      (ref.current.rotation.x + Math.min(dt, 0.05) * 2.4) % (Math.PI * 2);
    invalidate();
  });
  return (
    <group ref={ref}>
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i * Math.PI) / 3;
        return (
          <group key={i}>
            <Rod
              from={[-0.28, Math.sin(a) * 0.1, Math.cos(a) * 0.1]}
              to={[0.4, Math.sin(a) * 0.1, Math.cos(a) * 0.1]}
              radius={0.027}
              material={m.metal}
            />
            <Axle
              position={[0.405, Math.sin(a) * 0.1, Math.cos(a) * 0.1]}
              radius={0.021}
              length={0.012}
              material={m.dark}
              axis="x"
            />
          </group>
        );
      })}
      {[-0.2, 0.17, 0.35].map((x) => (
        <Axle
          key={x}
          position={[x, 0, 0]}
          radius={0.136}
          length={0.032}
          material={m.dark}
          axis="x"
        />
      ))}
    </group>
  );
}
export function SideEquipment({
  materials: m,
  preset,
  reduced,
}: EquipmentProps) {
  return (
    <group>
      <Mechanism
        name="rotary-cannon"
        amount={Number(preset.features.cannons)}
        reduced={reduced}
        hideStowed
        from={[0.35, -0.27, 0.14]}
        to={[1, -0.27, 0.14]}
        scaleFrom={[0.01, 1, 1]}
      >
        <Rotary
          materials={m}
          active={preset.features.cannons}
          reduced={reduced}
        />
      </Mechanism>
      <Mechanism
        name="launcher-panel"
        amount={Number(preset.features.launchers)}
        reduced={reduced}
        hideStowed
        from={[0.31, 0.12, 0.2]}
        to={[0.43, 0.18, 0.43]}
        rotationTo={[0, -0.35, 0]}
        scaleFrom={[0.01, 1, 0.01]}
      >
        <Block size={[0.17, 0.32, 0.07]} material={m.dark} radius={0.005} />
        {[-0.1, 0, 0.1].map((y) => (
          <Axle
            key={y}
            position={[0, y, 0.046]}
            radius={0.033}
            length={0.02}
            material={m.rotor}
          />
        ))}
      </Mechanism>
    </group>
  );
}
export function Turret({ materials: m, preset, reduced }: EquipmentProps) {
  return (
    <Mechanism
      name="upper-turret"
      amount={Number(preset.features.turret)}
      reduced={reduced}
      hideStowed
      from={[0.06, 2.13, 0]}
      to={[0.06, 2.54, 0]}
      scaleFrom={[1, 0.01, 1]}
    >
      <Axle
        position={[0, -0.08, 0]}
        radius={0.077}
        length={0.17}
        material={m.rotor}
        axis="y"
      />
      <Block
        position={[0, 0.015, 0]}
        size={[0.3, 0.12, 0.18]}
        material={m.dark}
        radius={0.016}
      />
      <Rod
        from={[0, 0.065, 0]}
        to={[0.47, 0.065, 0]}
        radius={0.035}
        material={m.metal}
      />
      <Axle
        position={[0.46, 0.065, 0]}
        radius={0.05}
        length={0.065}
        material={m.dark}
        axis="x"
      />
    </Mechanism>
  );
}
