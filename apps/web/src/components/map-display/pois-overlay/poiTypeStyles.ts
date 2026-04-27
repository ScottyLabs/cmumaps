import type { PoiType } from "@cmumaps/common";

interface PoiTypeStyle {
  background: string;
  label: string;
}

const DEFAULT_STYLE: PoiTypeStyle = {
  background: "#9ca3af",
  label: "?",
};

const STYLES: Record<Exclude<PoiType, "">, PoiTypeStyle> = {
  "Vending Machine": { background: "#dc2626", label: "V" },
  "Water Fountain": { background: "#2563eb", label: "W" },
  Printer: { background: "#7c3aed", label: "P" },
  AED: { background: "#16a34a", label: "+" },
  "Bike Rack": { background: "#0891b2", label: "B" },
  Restroom: { background: "#ca8a04", label: "R" },
  "Emergency Phone": { background: "#ea580c", label: "!" },
};

export const getPoiTypeStyle = (type: PoiType): PoiTypeStyle =>
  type ? STYLES[type] : DEFAULT_STYLE;
