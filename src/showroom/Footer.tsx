import { ArrowDown } from "lucide-react";
import type { Preset } from "../configuration/types";
import { CONTENT } from "./content";
import type { Detail } from "./content";

interface FooterProps {
  preset: Preset;
  onConfigure: () => void;
  onDetail: (detail: Detail) => void;
}
interface FooterSection {
  label: string;
  action: () => void;
}

export function Footer({ preset, onConfigure, onDetail }: FooterProps) {
  const sections: FooterSection[] = [
    { label: "Configure", action: onConfigure },
    {
      label: "Performance",
      action: () =>
        onDetail({
          title: "Performance, precisely balanced.",
          body: `${preset.name}: 0–100 km/h in ${preset.specs.acceleration} s, ${preset.specs.speed} km/h maximum speed, ${preset.specs.range} km stealth range, and ${preset.specs.weight} kg. All figures are fictional demonstration data.`,
        }),
    },
    { label: "Engineering", action: () => onDetail(CONTENT.WayneTech) },
    { label: "Gotham Project", action: () => onDetail(CONTENT.Gotham) },
  ];
  return (
    <footer>
      <span className="footer-note">
        PROTOTYPE 001
        <br />
        BUILT FOR WHAT’S NEXT.
      </span>
      <div className="sections">
        {sections.map((section, index) => (
          <button key={section.label} onClick={section.action}>
            <span className={index === 0 ? "orange" : ""}>0{index + 1}</span>
            {section.label}
          </button>
        ))}
      </div>
      <span className="footer-note right">
        WAYNE ENTERPRISES
        <br />
        APPLIED SCIENCES DIVISION <ArrowDown size={10} />
      </span>
    </footer>
  );
}
