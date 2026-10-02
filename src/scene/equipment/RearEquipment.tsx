import type { EquipmentProps } from "./types";
import { Axle } from "../Details";
import { Block, Rod } from "../parts";
import { Mechanism } from "../Motion";

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
