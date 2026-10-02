export interface Detail {
  title: string;
  body: string;
}
export type ContentId =
  "Vehicles" | "WayneTech" | "Legacy" | "Gotham" | "login";
export type Overlay =
  { kind: "closed" } | { kind: "search" } | { kind: "detail"; detail: Detail };

export const CONTENT: Record<ContentId, Detail> = {
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
