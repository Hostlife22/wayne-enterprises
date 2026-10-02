import type { EquipmentProps } from "./types";
import { Axle } from "../Details";
import { Block, Rod } from "../parts";
import { Mechanism } from "../Motion";

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
