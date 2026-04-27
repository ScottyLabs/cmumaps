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
};

export const getPoiTypeStyle = (type: PoiType): PoiTypeStyle =>
  type ? STYLES[type] : DEFAULT_STYLE;
