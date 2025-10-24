export const UNIT_COUNT = 42;

export const RACK_CONFIG = {
  width: 300,
  height: 700,
  frameThickness: 20,
  panelWidth: 25,
  leftPanelOffset: -5,
  unitHeight: 40,
} as const;

export const RACK_COLORS = {
  background: "#1f2937",
  border: "#374151",
  rackBody: "#000000",
  line: "#4b5563",
  unitText: "#6b7280",
} as const;

export const RACK_LABELS = {
  TOTAL: "총 U 수",
  USED: "사용 중",
  REMAIN: "남은 U 수",
} as const;

export const RACK_STYLING = {
  strokeWidth: 1,
  lineStrokeWidth: 0.5,
} as const;

export const RACK_TEXT = {
  unitSize: 12,
  unitOffset: { x: 8, y: 12 },
} as const;

export const FLOATING_DEVICE = {
  id: -1,
  opacity: 0.2,
} as const;

export const DEVICE_COLORS = {
  floating: {
    fill: "#3b82f6",
    stroke: "#60a5fa",
  },
  normal: {
    fill: "#334155",
    stroke: "#3f4e63",
  },
} as const;

export const DEVICE_STYLING = {
  dragOpacity: 0.5,
  textOffset: { x: 10, y: 6 },
  textSize: 12,
  textColor: "#fff",
  normalStrokeWidth: 1,
  floatingStrokeWidth: 2,
  borderStrokeWidth: {
    top: 1,
    bottom: 2,
  },
} as const;

export const RACK_CONTAINER = {
  height: "670px",
  scrollbarWidth: "none" as const,
  msOverflowStyle: "none" as const,
} as const;

export const STAGE_STYLING = {
  display: "block" as const,
  margin: 0,
  padding: 0,
} as const;
