import { ArrowRight, Search } from "lucide-react";
import type { ContentId } from "./content";

interface HeaderProps {
  onNavigate: (id: ContentId) => void;
  onConfigure: () => void;
  onSearch: () => void;
}

const NAVIGATION = [
  "Vehicles",
  "WayneTech",
  "Configure",
  "Legacy",
  "Gotham",
] as const;

export function Header({ onNavigate, onConfigure, onSearch }: HeaderProps) {
  return (
    <header className="header">
      <button
        className="brand"
        aria-label="Wayne Enterprises overview"
        onClick={() => onNavigate("Vehicles")}
      >
        <span className="brand-mark">W</span>
        <span>
          WAYNE<small>ENTERPRISES</small>
        </span>
      </button>
      <nav aria-label="Main navigation">
        {NAVIGATION.map((item) => (
          <button
            key={item}
            className={item === "Vehicles" ? "nav-active" : ""}
            onClick={() =>
              item === "Configure" ? onConfigure() : onNavigate(item)
            }
          >
            {item}
          </button>
        ))}
      </nav>
      <div className="header-actions">
        <button
          className="icon-button"
          aria-label="Search configurations and specifications"
          onClick={() => onSearch()}
        >
          <Search size={18} />
        </button>
        <button className="login" onClick={() => onNavigate("login")}>
          Log In
        </button>
        <button className="dark-button header-configure" onClick={onConfigure}>
          <span className="mini-wing">⌁</span> Configure{" "}
          <ArrowRight size={14} />
        </button>
      </div>
    </header>
  );
}
