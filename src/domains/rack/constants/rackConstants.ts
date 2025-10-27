export const UNIT_COUNT = 42;

export const RACK_CONFIG = {
  width: 350,
  height: 700,
  frameThickness: 10,
  panelWidth: 5,
  leftPanelOffset: -5,
  unitHeight: 40,
} as const;

export const RACK_LABELS = {
  TOTAL: "총 U 수",
  USED: "사용 중",
  REMAIN: "남은 U 수",
} as const;
