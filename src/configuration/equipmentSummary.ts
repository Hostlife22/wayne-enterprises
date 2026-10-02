import type { Preset } from "./types";

export function equipmentSummary(preset: Preset): string[] {
  const f = preset.features;
  const details: string[] = [];
  if (f.stabilizers) details.push("Stabilizers down");
  if (f.grapple) details.push("Rear grapple raised");
  if (f.headlights) details.push("Headlights on");
  if (f.spoiler) details.push("Spoiler raised");
  if (f.thrusters) details.push("Aft thrusters extended");
  if (preset.wheelbase > 0) details.push("Wheelbase +180 mm");
  if (f.cannons) details.push("Cannons extended");
  if (f.turret) details.push("Turret deployed");
  if (f.missilePod) details.push("Missile pod raised");
  if (f.launchers) details.push("Launchers out");
  return details.length ? details : ["Equipment stowed"];
}
