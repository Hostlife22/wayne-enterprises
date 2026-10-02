import type { Preset } from "../configuration/types";

export type SpecificationId = "armor" | "range" | "speed" | "weight";
export interface Specification {
  id: SpecificationId;
  label: string;
  value: string;
  unit: string;
  description: string;
  detail: string;
}

export function getSpecifications(preset: Preset): Specification[] {
  return [
    {
      label: "Armor System",
      value: "WayneTech Composite",
      unit: "",
      description: "Adaptive layered protection",
      id: "armor",
      detail:
        "A fictional ceramic-composite shell protects the central drivetrain. Tactical and Combat profiles widen the armor arrangement; Custom Build opens the shell to expose its supporting structure.",
    },
    {
      label: "Stealth Range",
      value: String(preset.specs.range),
      unit: "km",
      description: "Silent. Efficient. Unseen.",
      id: "range",
      detail:
        "Estimated fictional electric range in low-signature operation. Additional equipment changes the energy demand in each configuration.",
    },
    {
      label: "Top Speed",
      value: String(preset.specs.speed),
      unit: "km/h",
      description: "Precision at every velocity",
      id: "speed",
      detail:
        "Fictional closed-course maximum speed. Pursuit mode lowers the chassis and reduces equipment load for its highest performance profile.",
    },
    {
      label: "Weight",
      value: String(preset.specs.weight),
      unit: "kg",
      description: "Every gram has a purpose",
      id: "weight",
      detail:
        "Fictional ready-to-ride mass including the selected armor and equipment. The Standard configuration balances range, protection and performance.",
    },
  ];
}
