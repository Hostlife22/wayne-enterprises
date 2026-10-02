import { ChevronRight, Gauge, Radio, Shield, Weight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Detail } from "./content";
import type { Specification, SpecificationId } from "./specifications";

interface SpecificationCardsProps {
  specifications: Specification[];
  onDetail: (detail: Detail) => void;
}
interface SpecificationIconProps {
  id: SpecificationId;
}

const ICONS: Record<SpecificationId, LucideIcon> = {
  armor: Shield,
  range: Radio,
  speed: Gauge,
  weight: Weight,
};

function SpecificationIcon({ id }: SpecificationIconProps) {
  const Icon = ICONS[id];
  return <Icon size={23} strokeWidth={1.7} />;
}

export function SpecificationCards({
  specifications,
  onDetail,
}: SpecificationCardsProps) {
  return (
    <aside className="specs" aria-label="Vehicle specifications">
      {specifications.map(({ label, value, unit, description, id, detail }) => (
        <button
          key={label}
          className="spec-card"
          onClick={() => onDetail({ title: label, body: detail })}
        >
          <SpecificationIcon id={id} />
          <span>
            <span className="eyebrow">{label}</span>
            <strong className={unit ? "" : "armor-value"}>
              {value}
              <small> {unit}</small>
            </strong>
            <span className="spec-description">{description}</span>
          </span>
          <ChevronRight size={14} />
        </button>
      ))}
      <p className="spec-footnote">
        EXPERIMENTAL PLATFORM
        <br />
        FICTIONAL DEMONSTRATION DATA
      </p>
    </aside>
  );
}
