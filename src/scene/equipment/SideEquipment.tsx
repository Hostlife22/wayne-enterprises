import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import type { VehicleMaterials } from "../materials";
import type { EquipmentProps } from "./types";
import { Axle } from "../Details";
import { Block, Rod } from "../parts";
import { Mechanism } from "../Motion";

interface RotaryProps {
  materials: VehicleMaterials;
  active: boolean;
  reduced: boolean;
}

function Rotary({ materials: m, active, reduced }: RotaryProps) {
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
