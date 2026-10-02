import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ChevronRight,
  Gauge,
  Layers3,
  Maximize2,
  Play,
  Plus,
  Radio,
  RotateCcw,
  Search,
  Shield,
  Weight,
  X,
} from "lucide-react";
import { FINISHES, INITIAL_STATE, PRESETS, configReducer } from "./config";
import { useReducedMotion } from "./hooks";
import { Viewer } from "./scene/Viewer";
import { Dialog } from "./components/Dialog";
import { BikeDrawing, Skyline } from "./components/Graphics";

interface Detail {
  title: string;
  body: string;
}

const CONTENT: Record<string, Detail> = {
  Vehicles: {
    title: "Built for the city ahead.",
    body: "The Batpod is Wayne Enterprises’ experimental urban mobility platform. Four mission profiles bring a single modular chassis to life. Select a configuration below to explore the engineering.",
  },
  WayneTech: {
    title: "Precision, without compromise.",
    body: "An articulated chassis, independent suspension, composite armor and an adaptive cockpit form a modular vehicle architecture. Custom Build separates its main assemblies for inspection.",
  },
  Legacy: {
    title: "A better tomorrow. Since 1870.",
    body: "From the foundations of Gotham to the technologies of its future, Wayne Enterprises stands for progress with purpose. This fictional concept explores that enduring design philosophy.",
  },
  Gotham: {
    title: "A darker Gotham. A safer tomorrow.",
    body: "Designed for dense streets, long nights and demanding conditions. Quiet electric propulsion and a low center of gravity bring confidence to the fictional streets of Gotham.",
  },
  login: {
    title: "Wayne ID — demonstration",
    body: "This is a local configurator demo. Authentication and account storage are not connected. Your selections remain available during this session; no credentials are collected.",
  },
};
export default function App() {
  const [state, dispatch] = useReducer(configReducer, INITIAL_STATE);
  const [panel, setPanel] = useState<Detail | null>(null);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [reset, setReset] = useState(0);
  const [tour, setTour] = useState(false);
  const reduced = useReducedMotion();
  const configRef = useRef<HTMLDivElement>(null);
  const preset = PRESETS.find((p) => p.id === state.preset) ?? PRESETS[0];
  const finish = FINISHES.find((f) => f.id === state.finish) ?? FINISHES[0];
  const stopTour = useCallback(() => setTour(false), []);
  const resetView = useCallback(() => {
    setTour(false);
    setReset((v) => v + 1);
  }, []);
  const focusConfig = () => {
    configRef.current?.scrollIntoView({
      behavior: reduced ? "instant" : "smooth",
      block: "nearest",
    });
    configRef.current?.querySelector("button")?.focus();
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTour(false);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  const specifications = [
    {
      label: "Armor System",
      value: "WayneTech Composite",
      unit: "",
      description: "Adaptive layered protection",
      icon: Shield,
      detail:
        "A fictional ceramic-composite shell protects the central drivetrain. Tactical and Combat profiles widen the armor arrangement; Custom Build opens the shell to expose its supporting structure.",
    },
    {
      label: "Stealth Range",
      value: String(preset.specs.range),
      unit: "km",
      description: "Silent. Efficient. Unseen.",
      icon: Radio,
      detail:
        "Estimated fictional electric range in low-signature operation. Additional equipment changes the energy demand in each configuration.",
    },
    {
      label: "Top Speed",
      value: String(preset.specs.speed),
      unit: "km/h",
      description: "Precision at every velocity",
      icon: Gauge,
      detail:
        "Fictional closed-course maximum speed. Pursuit mode lowers the chassis and reduces equipment load for its highest performance profile.",
    },
    {
      label: "Weight",
      value: String(preset.specs.weight),
      unit: "kg",
      description: "Every gram has a purpose",
      icon: Weight,
      detail:
        "Fictional ready-to-ride mass including the selected armor and equipment. The Standard configuration balances range, protection and performance.",
    },
  ];
  const results = [
    ...PRESETS.map((p) => ({
      title: p.name,
      body: p.subtitle,
      action: () => {
        dispatch({ type: "preset", id: p.id });
        setSearch(false);
      },
    })),
    ...specifications.map((s) => ({
      title: s.label,
      body: `${s.value} ${s.unit}`,
      action: () => {
        setSearch(false);
        setPanel({ title: s.label, body: s.detail });
      },
    })),
  ].filter((r) =>
    `${r.title} ${r.body}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to vehicle configurator
      </a>
      <div className="showroom">
        <header className="header">
          <button
            className="brand"
            aria-label="Wayne Enterprises overview"
            onClick={() => setPanel(CONTENT.Vehicles)}
          >
            <span className="brand-mark">W</span>
            <span>
              WAYNE<small>ENTERPRISES</small>
            </span>
          </button>
          <nav aria-label="Main navigation">
            {["Vehicles", "WayneTech", "Configure", "Legacy", "Gotham"].map(
              (item) => (
                <button
                  key={item}
                  className={item === "Vehicles" ? "nav-active" : ""}
                  onClick={() =>
                    item === "Configure"
                      ? focusConfig()
                      : setPanel(CONTENT[item])
                  }
                >
                  {item}
                </button>
              ),
            )}
          </nav>
          <div className="header-actions">
            <button
              className="icon-button"
              aria-label="Search configurations and specifications"
              onClick={() => setSearch(true)}
            >
              <Search size={18} />
            </button>
            <button className="login" onClick={() => setPanel(CONTENT.login)}>
              Log In
            </button>
            <button
              className="dark-button header-configure"
              onClick={focusConfig}
            >
              <span className="mini-wing">⌁</span> Configure{" "}
              <ArrowRight size={14} />
            </button>
          </div>
        </header>
        <main id="main" className="main-grid">
          <section className="intro">
            <p className="eyebrow breadcrumb">
              WAYNE ENTERPRISES <span>/</span> BATPOD
            </p>
            <h1>
              GOTHAM
              <br />
              MOVES
              <br />
              FASTER
              <br />
              IN DARKNESS<span className="orange">.</span>
            </h1>
            <p className="tagline">
              Tactical engineering.
              <br />A safer Gotham.
            </p>
            <div className="metrics">
              <div>
                <span>0–100 KM/H</span>
                <strong>
                  {preset.specs.acceleration}
                  <small> s</small>
                </strong>
              </div>
              <div>
                <span>TOP SPEED</span>
                <strong>
                  {preset.specs.speed}
                  <small> km/h</small>
                </strong>
              </div>
              <div>
                <span>STEALTH RANGE</span>
                <strong>
                  {preset.specs.range}
                  <small> km</small>
                </strong>
              </div>
            </div>
            <p className="gesture-hint">
              <Maximize2 size={15} />
              <span>
                DRAG TO ORBIT · SCROLL TO ZOOM
                <br />
                RIGHT-DRAG TO PAN · DOUBLE-CLICK TO RESET
              </span>
            </p>
            <div className="finish-panel">
              <h2 className="eyebrow">FINISH & TRIM</h2>
              <div
                className="swatches"
                role="group"
                aria-label="Vehicle finish"
              >
                {FINISHES.map((f) => (
                  <button
                    key={f.id}
                    aria-label={f.name}
                    aria-pressed={state.finish === f.id}
                    onClick={() => dispatch({ type: "finish", id: f.id })}
                    className={`swatch swatch-${f.id} ${state.finish === f.id ? "selected" : ""}`}
                  >
                    <span />
                  </button>
                ))}
                <ChevronRight size={15} />
              </div>
              <p aria-live="polite">{finish.name}</p>
            </div>
          </section>
          <section className="vehicle-stage" aria-label="Vehicle inspection">
            <div className="technical-heading">
              <span className="orange-slash" />
              <p>
                WAYNETECH
                <br />
                TACTICAL
                <br />
                PURSUIT
                <br />
                VEHICLE
              </p>
              <span className="hairline" />
            </div>
            <div className="blueprint">
              <BikeDrawing technical />
              <div>
                <strong>BATPOD</strong>
                <span>
                  BP–01
                  <br />
                  ADAPTIVE CHASSIS
                  <br />
                  ENGINEERING DIVISION
                </span>
              </div>
            </div>
            <div className="stage-index">01 / ENGINEERED FOR THE NIGHT</div>
            <Viewer
              preset={preset}
              finish={finish}
              exploded={state.exploded}
              reduced={reduced}
              reset={reset}
              tour={tour}
              stopTour={stopTour}
              resetView={resetView}
            />
            <div className="viewer-tools">
              <span>
                <i /> LIVE 3D /{" "}
                {state.exploded ? "ASSEMBLY INSPECTION" : "STUDIO VIEW"}
              </span>
              <button aria-label="Reset view" onClick={resetView}>
                <RotateCcw size={14} /> Reset view
              </button>
            </div>
            {tour && (
              <button className="tour-stop dark-button" onClick={stopTour}>
                <X size={16} /> Stop film
              </button>
            )}
            <div className="vehicle-status" aria-live="polite">
              <span>
                <i /> RIDE HEIGHT{" "}
                <b>{Math.round(145 + preset.height * 100)} MM</b>
              </span>
              <span>
                DASHBOARD <b>{preset.dashboard > 1 ? "WIDE" : "COMPACT"}</b>
              </span>
              <span>
                EQUIPMENT{" "}
                <b>{preset.equipment > 0.2 ? "DEPLOYED" : "STOWED"}</b>
              </span>
              <span>
                ASSEMBLY: <b>{state.exploded ? "EXPLODED" : "ASSEMBLED"}</b>
              </span>
            </div>
          </section>
          <aside className="specs" aria-label="Vehicle specifications">
            {specifications.map(
              ({ label, value, unit, description, icon: Icon, detail }) => (
                <button
                  key={label}
                  className="spec-card"
                  onClick={() => setPanel({ title: label, body: detail })}
                >
                  <Icon size={23} strokeWidth={1.7} />
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
              ),
            )}
            <p className="spec-footnote">
              EXPERIMENTAL PLATFORM
              <br />
              FICTIONAL DEMONSTRATION DATA
            </p>
          </aside>
          <button
            className="editorial promo"
            onClick={() => {
              if (reduced)
                setPanel({
                  title: "Cinematic presentation",
                  body: "Camera motion is disabled by your reduced-motion preference. You can still inspect the vehicle manually using the viewer.",
                });
              else setTour(true);
            }}
          >
            <Skyline />
            <span className="promo-text">
              A DARKER
              <br />
              GOTHAM.
              <br />A SAFER
              <br />
              TOMORROW.
            </span>
            <span className="watch">
              <span className="play-circle">
                <Play size={10} fill="currentColor" />
              </span>{" "}
              WATCH FILM
            </span>
          </button>
          <section
            className="configuration"
            aria-label="Configuration controls"
          >
            <div className="section-title">
              <span /> // BATPOD //
              <span />
            </div>
            <div
              className="preset-list"
              ref={configRef}
              role="group"
              aria-label="Choose configuration"
            >
              {PRESETS.map((p, i) => (
                <button
                  key={p.id}
                  className={`preset ${!state.exploded && state.preset === p.id ? "active" : ""}`}
                  aria-pressed={!state.exploded && state.preset === p.id}
                  onClick={() => dispatch({ type: "preset", id: p.id })}
                >
                  <BikeDrawing variant={i} />
                  <strong>{p.name}</strong>
                  <span>{p.subtitle}</span>
                </button>
              ))}
              <button
                className={`preset custom ${state.exploded ? "active" : ""}`}
                aria-pressed={state.exploded}
                onClick={() => dispatch({ type: "explode" })}
              >
                <Plus size={27} strokeWidth={1} />
                <strong>Custom Build</strong>
                <span>Explore the assembly</span>
              </button>
            </div>
          </section>
          <button className="configure-promo promo" onClick={focusConfig}>
            <Skyline />
            <span className="eyebrow">YOUR CITY. YOUR RULES.</span>
            <strong>
              CONFIGURE
              <br />
              YOUR BATPOD
            </strong>
            <span className="promo-bottom">
              <span className="bat-symbol">⌁</span>
              <span className="orange-arrow">
                <ArrowRight size={21} />
              </span>
            </span>
          </button>
        </main>
        <footer>
          <span className="footer-note">
            PROTOTYPE 001
            <br />
            BUILT FOR WHAT’S NEXT.
          </span>
          <div className="sections">
            {["Configure", "Performance", "Engineering", "Gotham Project"].map(
              (label, i) => (
                <button
                  key={label}
                  onClick={() =>
                    i === 0
                      ? focusConfig()
                      : setPanel(
                          i === 1
                            ? {
                                title: "Performance, precisely balanced.",
                                body: `${preset.name}: 0–100 km/h in ${preset.specs.acceleration} s, ${preset.specs.speed} km/h maximum speed, ${preset.specs.range} km stealth range, and ${preset.specs.weight} kg. All figures are fictional demonstration data.`,
                              }
                            : CONTENT[i === 2 ? "WayneTech" : "Gotham"],
                        )
                  }
                >
                  <span className={i === 0 ? "orange" : ""}>0{i + 1}</span>
                  {label}
                </button>
              ),
            )}
          </div>
          <span className="footer-note right">
            WAYNE ENTERPRISES
            <br />
            APPLIED SCIENCES DIVISION <ArrowDown size={10} />
          </span>
        </footer>
      </div>
      {panel && (
        <Dialog title={panel.title} onClose={() => setPanel(null)}>
          <p>{panel.body}</p>
          <div className="detail-note">
            <Layers3 size={18} />
            <span>
              BATPOD · {preset.name} · {finish.name}
              <br />
              Fictional concept / independent design study
            </span>
          </div>
        </Dialog>
      )}
      {search && (
        <Dialog
          title="Find your next configuration."
          onClose={() => setSearch(false)}
        >
          <label className="search-label" htmlFor="search">
            Search configurations or technical details
          </label>
          <input
            id="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try pursuit, range, armor…"
          />
          <div className="search-results">
            {results.length ? (
              results.map((r) => (
                <button key={r.title} onClick={r.action}>
                  <span>
                    <strong>{r.title}</strong>
                    <small>{r.body}</small>
                  </span>
                  <ArrowRight size={17} />
                </button>
              ))
            ) : (
              <p>No matches. Try “speed” or “tactical”.</p>
            )}
          </div>
        </Dialog>
      )}
    </>
  );
}
