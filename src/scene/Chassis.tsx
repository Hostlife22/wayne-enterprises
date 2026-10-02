import type { VehicleMaterials } from "./materials";
import type { Preset } from "../config";
import {
  Axle,
  Beam,
  Fasteners,
  Hose,
  Panel,
  SuspensionMember,
} from "./Details";
import { Block, Rod, Spring } from "./parts";
import { Mechanism } from "./Motion";
import { Fender } from "./Bodywork";

interface ChassisProps {
  materials: VehicleMaterials;
  preset: Preset;
  reduced: boolean;
}

const BELLY = [
  [-1.12, 0.08],
  [-0.76, -0.17],
  [0.65, -0.17],
  [0.97, 0.02],
  [0.68, 0.23],
  [-0.72, 0.26],
] as const;
const SWING_PLATE = [
  [-0.29, -0.13],
  [0.39, -0.11],
  [0.46, 0.13],
  [-0.17, 0.17],
  [-0.31, 0.02],
] as const;

export function Chassis({ materials: m, preset, reduced }: ChassisProps) {
  return (
    <group>
      <Block
        position={[-0.1, 1.11, 0]}
        size={[1.5, 0.7, 0.58]}
        material={m.dark}
      />
      <Panel
        profile={BELLY}
        material={m.dark}
        position={[0, 0.5, -0.4]}
        depth={0.8}
        bevel={0.035}
      />
      {[-1, 1].map((side) => (
        <group key={side}>
          <SuspensionMember
            reduced={reduced}
            from={[
              -2.12 - preset.wheelbase,
              1.025 - preset.height,
              side * 0.55,
            ]}
            to={[-0.81, 1.47, side * 0.5]}
            width={0.26}
            depth={0.17}
            material={m.dark}
          />
          <Mechanism amount={preset.height} reduced={reduced} to={[0, -1, 0]}>
            <Mechanism
              amount={preset.wheelbase}
              reduced={reduced}
              to={[-1, 0, 0]}
            >
              <Beam
                from={[-2.12, 1.025, side * 0.6]}
                to={[-1.69, 1.11, side * 0.6]}
                width={0.2}
                depth={0.11}
                material={m.frame}
              />
              <Panel
                profile={SWING_PLATE}
                position={[-2.03, 1.025, side * 0.6]}
                scale={[1, 1, side]}
                material={m.dark}
                depth={0.07}
                bevel={0.008}
              />
              <Fasteners
                positions={[
                  [-2.17, 1.03, side * 0.69],
                  [-1.94, 1.09, side * 0.69],
                  [-1.75, 1.14, side * 0.69],
                ]}
                material={m.metal}
                radius={0.031}
              />
            </Mechanism>
          </Mechanism>
          <Axle
            position={[-0.85, 1.47, side * 0.55]}
            radius={0.135}
            length={0.12}
            material={m.metal}
          />
          <Axle
            position={[-0.85, 1.47, side * 0.62]}
            radius={0.099}
            length={0.025}
            material={m.rotor}
          />
          <Rod
            from={[-1.68, 0.94, side * 0.45]}
            to={[-0.66, 0.56, side * 0.48]}
            radius={0.046}
            material={m.metal}
          />
          <Rod
            from={[-1.45, 0.85, side * 0.45]}
            to={[-0.88, 0.64, side * 0.48]}
            radius={0.073}
            material={m.dark}
          />
          <Beam
            from={[-2.01, 1.16, side * 0.54]}
            to={[-1.86, 2.06, side * 0.48]}
            width={0.12}
            depth={0.11}
            material={m.dark}
          />
          <Rod
            from={[-2.33, 2.08, side * 0.5]}
            to={[-1.6, 1.99, side * 0.5]}
            radius={0.038}
            material={m.metal}
          />
          <Spring
            from={[-1.28, 1.57, side * 0.25]}
            to={[-1.5, 1.99, side * 0.25]}
            materials={m}
          />
          <SuspensionMember
            reduced={reduced}
            from={[2.12 + preset.wheelbase, 1.025 - preset.height, side * 0.54]}
            to={[0.83, 2.13, side * 0.36]}
            radius={0.065}
            material={m.metal}
          />
          <Mechanism amount={preset.height} reduced={reduced} to={[0, -1, 0]}>
            <Mechanism
              amount={preset.wheelbase}
              reduced={reduced}
              to={[1, 0, 0]}
            >
              <Rod
                from={[2.1, 1.045, side * 0.54]}
                to={[1.54, 1.52, side * 0.47]}
                radius={0.112}
                material={m.dark}
              />
              <Rod
                from={[1.97, 1.15, side * 0.54]}
                to={[1.87, 1.235, side * 0.52]}
                radius={0.12}
                material={m.rotor}
              />
            </Mechanism>
          </Mechanism>
          <Spring
            from={[1.49, 1.26, side * 0.47]}
            to={[0.91, 1.98, side * 0.43]}
            materials={m}
          />
          <Mechanism amount={preset.height} reduced={reduced} to={[0, -1, 0]}>
            <Mechanism
              amount={preset.wheelbase}
              reduced={reduced}
              to={[1, 0, 0]}
            >
              <Beam
                from={[2.16, 1.025, side * 0.56]}
                to={[1.89, 1.29, side * 0.56]}
                width={0.14}
                depth={0.16}
                material={m.frame}
              />
              <Axle
                position={[2.12, 1.025, side * 0.65]}
                radius={0.117}
                length={0.045}
                material={m.metal}
              />
            </Mechanism>
          </Mechanism>
          <Rod
            from={[-1.12, 0.43, side * 0.52]}
            to={[0.76, 0.43, side * 0.52]}
            radius={0.051}
            material={m.dark}
          />
          <Rod
            from={[-1.24, 0.43, side * 0.52]}
            to={[-1.01, 0.43, side * 0.52]}
            radius={0.063}
            material={m.metal}
          />
          <Axle
            position={[-1.25, 0.43, side * 0.52]}
            radius={0.046}
            length={0.012}
            material={m.dark}
            axis="x"
          />
          <Rod
            from={[-0.95, 0.94, side * 0.38]}
            to={[-0.13, 0.94, side * 0.38]}
            radius={0.19}
            material={m.metal}
          />
          {[-0.83, -0.6, -0.35, -0.17].map((x) => (
            <Axle
              key={x}
              position={[x, 0.94, side * 0.38]}
              radius={0.204}
              length={0.031}
              material={m.dark}
              axis="x"
            />
          ))}
          <Axle
            position={[0.08, 0.91, side * 0.42]}
            radius={0.18}
            length={0.1}
            material={m.frame}
          />
          <Axle
            position={[0.08, 0.91, side * 0.49]}
            radius={0.072}
            length={0.04}
            material={m.metal}
          />
          <Fasteners
            positions={Array.from({ length: 8 }, (_, i) => [
              0.08 + Math.cos((i * Math.PI) / 4) * 0.145,
              0.91 + Math.sin((i * Math.PI) / 4) * 0.145,
              side * 0.482,
            ])}
            material={m.metal}
            radius={0.012}
          />
          <Hose
            points={[
              [-0.91, 1.22, side * 0.39],
              [-0.65, 1.12, side * 0.52],
              [-0.21, 1.16, side * 0.53],
              [0.24, 1.17, side * 0.45],
              [0.64, 0.82, side * 0.43],
            ]}
            material={m.rubber}
            radius={0.027}
          />
          <Hose
            points={[
              [0.98, 2.13, side * 0.41],
              [1.32, 1.95, side * 0.53],
              [1.65, 1.43, side * 0.61],
              [2.12, 1.17, side * 0.59],
            ]}
            material={m.rubber}
            radius={0.018}
          />
          <Rod
            from={[-0.43, 0.69, side * 0.53]}
            to={[0.42, 0.69, side * 0.53]}
            radius={0.055}
            material={m.dark}
          />
          <Mechanism
            amount={preset.id === "pursuit" ? 1 : 0}
            reduced={reduced}
            to={[-0.27, 0.08, 0]}
          >
            <Rod
              from={[-0.69, 0.64, side * 0.38]}
              to={[-0.8, 0.59, side * 0.87]}
              radius={0.044}
              material={m.metal}
            />
            <Block
              position={[-0.81, 0.6, side * 0.81]}
              size={[0.29, 0.075, 0.22]}
              material={m.dark}
              radius={0.012}
            />
            <Fasteners
              positions={[
                [-0.88, 0.645, side * 0.79],
                [-0.73, 0.645, side * 0.79],
              ]}
              material={m.metal}
              axis="y"
              radius={0.016}
            />
          </Mechanism>
          <Mechanism
            name={`stabilizer-${side}`}
            amount={Number(preset.features.stabilizers)}
            reduced={reduced}
            from={[-0.1, 0.59, side * 0.5]}
            to={[-0.1, 0.59, side * 0.5]}
            rotationFrom={[(side * Math.PI) / 2, 0, -Math.PI / 2]}
            rotationTo={[-side * 0.53, 0, -0.3]}
          >
            <Rod
              from={[0, 0, 0]}
              to={[0, -0.6, 0]}
              radius={0.05}
              material={m.dark}
            />
            <Rod
              from={[0, -0.57, 0]}
              to={[0, -0.91, 0]}
              radius={0.025}
              material={m.metal}
            />
            <Axle
              position={[0, -0.92, 0]}
              radius={0.09}
              length={0.035}
              material={m.dark}
              axis="y"
            />
          </Mechanism>
        </group>
      ))}
      <Mechanism
        amount={Number(preset.features.spoiler)}
        reduced={reduced}
        from={[-2.12, 2.12, 0]}
        to={[-2.3, 2.3, 0]}
        rotationTo={[0, 0, -0.3]}
      >
        <Fender materials={m} />
      </Mechanism>
    </group>
  );
}
