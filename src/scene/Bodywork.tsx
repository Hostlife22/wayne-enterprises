import type { VehicleMaterials } from "./materials";
import type { Vec3 } from "./types";
import {
  ARMOR_PROFILE,
  ARMOR_INSET,
  BAT_PROFILE,
  EQUIPMENT_PROFILE,
  TAIL_PROFILE,
} from "./geometry";
import { Axle, Fasteners, Panel } from "./Details";
import { Block, Rod } from "./parts";

interface BodyworkProps {
  materials: VehicleMaterials;
}

const ARMOR_BOLTS: Vec3[] = [
  [-0.32, 0.53, 0.203],
  [0.3, 0.57, 0.203],
  [-0.5, 0.17, 0.203],
  [-0.27, -0.32, 0.203],
  [0.47, -0.27, 0.203],
];
const POD_BOLTS: Vec3[] = [
  [-0.78, 0.18, 0.34],
  [-0.6, -0.34, 0.34],
  [0.69, -0.4, 0.34],
  [0.69, 0.21, 0.34],
];
const VENT_BOLTS: Vec3[] = [
  [-0.21, 0.22, 0.372],
  [0.4, 0.22, 0.372],
  [-0.21, -0.03, 0.372],
  [0.4, -0.03, 0.372],
];
const TANK_TOP = [
  [-0.91, 0.02],
  [-0.55, 0.4],
  [0.25, 0.49],
  [0.74, 0.24],
  [0.56, -0.09],
  [-0.6, -0.2],
] as const;
const FENDER = [
  [-0.64, -0.025],
  [-0.54, 0.09],
  [-0.08, 0.17],
  [0.47, 0.07],
  [0.57, -0.05],
  [0.1, 0.005],
  [-0.4, -0.06],
] as const;

export function Armor({ materials: m }: BodyworkProps) {
  return (
    <group>
      <Panel
        profile={ARMOR_PROFILE}
        material={m.armor}
        depth={0.14}
        bevel={0.028}
      />
      <Panel
        profile={ARMOR_INSET}
        material={m.armor}
        position={[0, 0, 0.175]}
        depth={0.025}
        bevel={0.025}
      />
      <Panel
        profile={BAT_PROFILE}
        material={m.badge}
        position={[0.02, 0.22, 0.231]}
        depth={0.003}
        bevel={0}
      />
      <Fasteners positions={ARMOR_BOLTS} material={m.dark} radius={0.014} />
      <Axle
        position={[-0.69, -0.21, 0.2]}
        radius={0.125}
        length={0.06}
        material={m.dark}
      />
      <Fasteners
        positions={[
          [-0.77, -0.26, 0.237],
          [-0.61, -0.26, 0.237],
          [-0.69, -0.12, 0.237],
        ]}
        material={m.metal}
        radius={0.01}
      />
      <Block
        position={[-0.93, -0.18, 0.07]}
        size={[0.08, 0.28, 0.16]}
        material={m.frame}
        radius={0.006}
      />
      <Block
        position={[0.63, 0.32, 0.14]}
        size={[0.24, 0.045, 0.1]}
        rotation={[0, 0, -0.6]}
        material={m.dark}
        radius={0.004}
      />
    </group>
  );
}
export function Tank({ materials: m }: BodyworkProps) {
  return (
    <group position={[0, 1.86, 0]}>
      <Panel
        profile={TANK_TOP}
        material={m.armor}
        position={[0, 0, -0.39]}
        depth={0.78}
        bevel={0.035}
      />
      <Block
        position={[-0.1, 0.4, 0]}
        size={[0.71, 0.085, 0.31]}
        rotation={[0, 0, 0.13]}
        material={m.frame}
        radius={0.025}
      />
      <Axle
        position={[0.02, 0.46, 0]}
        radius={0.09}
        length={0.025}
        material={m.dark}
        axis="y"
        segments={12}
      />
      {[-1, 1].map((side) => (
        <group key={side}>
          <Rod
            from={[-0.57, 0.36, side * 0.28]}
            to={[0.12, 0.45, side * 0.28]}
            radius={0.026}
            material={m.metal}
          />
          <Rod
            from={[0.12, 0.45, side * 0.28]}
            to={[0.54, 0.23, side * 0.32]}
            radius={0.06}
            material={m.dark}
          />
          <Axle
            position={[0.2, 0.4, side * 0.29]}
            radius={0.063}
            length={0.035}
            material={m.metal}
            axis="x"
          />
        </group>
      ))}
    </group>
  );
}
export function EquipmentShell({ materials: m }: BodyworkProps) {
  return (
    <group>
      <Panel
        profile={EQUIPMENT_PROFILE}
        material={m.armor}
        depth={0.31}
        bevel={0.028}
      />
      <Panel
        profile={EQUIPMENT_PROFILE}
        material={m.frame}
        position={[0, 0, -0.018]}
        depth={0.016}
        bevel={0.027}
        scale={[1.025, 1.025, 1]}
      />
      <Block
        position={[0.08, 0.1, 0.345]}
        size={[0.72, 0.32, 0.025]}
        rotation={[0, 0, -0.03]}
        material={m.dark}
        radius={0.009}
      />
      {Array.from({ length: 4 }, (_, i) => (
        <Block
          key={i}
          position={[0.08, 0.19 - i * 0.065, 0.361]}
          size={[0.56, 0.008, 0.008]}
          material={m.frame}
          radius={0.002}
        />
      ))}
      {Array.from({ length: 4 }, (_, i) => (
        <Block
          key={i}
          position={[0.615, 0.15 - i * 0.075, 0.353]}
          size={[0.15, 0.012, 0.008]}
          material={m.edge}
          radius={0.002}
        />
      ))}
      <Fasteners positions={POD_BOLTS} material={m.metal} radius={0.012} />
      <Fasteners positions={VENT_BOLTS} material={m.metal} radius={0.009} />
      <Axle
        position={[-0.68, -0.23, 0.35]}
        radius={0.092}
        length={0.045}
        material={m.metal}
      />
      <Axle
        position={[-0.68, -0.23, 0.377]}
        radius={0.074}
        length={0.012}
        material={m.rotor}
        segments={16}
      />
    </group>
  );
}
export function Seat({ materials: m }: BodyworkProps) {
  return (
    <group>
      <Panel
        profile={TAIL_PROFILE}
        material={m.armor}
        position={[0, 0, -0.33]}
        depth={0.66}
        bevel={0.035}
      />
      <Block
        position={[-0.03, 0.12, 0]}
        size={[0.84, 0.09, 0.52]}
        rotation={[0, 0, -0.05]}
        material={m.seat}
        radius={0.035}
      />
      <Block
        position={[-0.39, 0.135, 0]}
        size={[0.13, 0.12, 0.55]}
        material={m.seat}
        radius={0.027}
      />
      {[-1, 1].map((side) => (
        <group key={side}>
          <Block
            position={[-0.04, -0.27, side * 0.352]}
            size={[0.6, 0.035, 0.019]}
            rotation={[0, 0, -0.06]}
            material={m.dark}
            radius={0.004}
          />
          <Axle
            position={[-0.37, -0.2, side * 0.36]}
            radius={0.045}
            length={0.035}
            material={m.metal}
          />
        </group>
      ))}
    </group>
  );
}
export function Fender({ materials: m }: BodyworkProps) {
  return (
    <group>
      <Panel
        profile={FENDER}
        material={m.armor}
        position={[0, 0, -0.52]}
        depth={1.04}
        bevel={0.016}
      />
      <Rod
        from={[-0.03, 0.16, -0.47]}
        to={[-0.03, 0.16, 0.47]}
        radius={0.028}
        material={m.dark}
      />
      <Block
        position={[-0.59, -0.035, 0]}
        size={[0.026, 0.027, 0.46]}
        material={m.orange}
        radius={0.005}
      />
    </group>
  );
}
