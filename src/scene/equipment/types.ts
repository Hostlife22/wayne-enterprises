import type { Preset } from "../../configuration/types";
import type { VehicleMaterials } from "../materials";

export interface EquipmentProps {
  materials: VehicleMaterials;
  preset: Preset;
  reduced: boolean;
}
