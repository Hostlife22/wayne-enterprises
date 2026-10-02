import { useEffect, useMemo } from "react";
import type { Finish, Preset } from "../configuration/types";
import { createMaterials } from "./materials";
import { Wheel } from "./Wheel";
import { WHEEL_X } from "./geometry";
import { Assembly, Mechanism } from "./Motion";
import { Armor, EquipmentShell, Seat, Tank } from "./Bodywork";
import { Chassis } from "./Chassis";
import { Cockpit } from "./equipment/Cockpit";
import { RearEquipment } from "./equipment/RearEquipment";
import { SideEquipment } from "./equipment/SideEquipment";
import { Turret } from "./equipment/Turret";

interface VehicleProps {
  preset: Preset;
  finish: Finish;
  exploded: boolean;
  reduced: boolean;
}

export function Vehicle({ preset, finish, exploded, reduced }: VehicleProps) {
  const materials = useMemo(() => createMaterials(finish), [finish]);
  useEffect(
    () => () =>
      Object.values(materials).forEach((material) => material.dispose()),
    [materials],
  );
  const shared = { preset, exploded, reduced };
  const equipmentProps = { materials, preset, reduced };
  return (
    <group name="batpod">
      {[-1, 1].map((side) => (
        <Mechanism
          key={side}
          name={`wheelbase-${side}`}
          amount={preset.wheelbase}
          reduced={reduced}
          to={[side, 0, 0]}
        >
          <Wheel x={side * WHEEL_X} materials={materials} />
        </Mechanism>
      ))}
      <Assembly id="chassis" {...shared}>
        <Chassis {...equipmentProps} />
      </Assembly>
      <Assembly id="tank" {...shared}>
        <Tank materials={materials} />
        <Turret {...equipmentProps} />
      </Assembly>
      <Assembly id="leftArmor" {...shared}>
        <Armor materials={materials} />
      </Assembly>
      <Assembly id="rightArmor" {...shared}>
        <group scale={[1, 1, -1]}>
          <Armor materials={materials} />
        </group>
      </Assembly>
      <Assembly id="seat" {...shared}>
        <Seat materials={materials} />
        <RearEquipment {...equipmentProps} />
      </Assembly>
      <Assembly id="cockpit" {...shared}>
        <Cockpit {...equipmentProps} />
      </Assembly>
      <Assembly id="equipment" {...shared}>
        <EquipmentShell materials={materials} />
        <SideEquipment {...equipmentProps} />
        <Mechanism
          amount={preset.equipment + (exploded ? 0.65 : 0)}
          reduced={reduced}
          from={[0, 0, -1.32]}
          to={[0, 0, -3.32]}
        >
          <group scale={[1, 1, -1]}>
            <EquipmentShell materials={materials} />
            <SideEquipment {...equipmentProps} />
          </group>
        </Mechanism>
      </Assembly>
    </group>
  );
}
