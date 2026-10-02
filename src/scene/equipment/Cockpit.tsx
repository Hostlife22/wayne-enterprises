import type { Vec3 } from "../types";
import type { EquipmentProps } from "./types";
import { Axle, Fasteners, Panel } from "../Details";
import { Block, Rod } from "../parts";
import { Mechanism } from "../Motion";

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
