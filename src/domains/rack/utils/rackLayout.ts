import { RACK_CONFIG, UNIT_COUNT } from "../constants/rackConstants";

export function rackLayout(config: typeof RACK_CONFIG) {
  const rackHeight = UNIT_COUNT * config.unitHeight;
  const baseY = config.frameThickness;
  const fullWidth =
    config.width + config.frameThickness * 2 + config.panelWidth * 2;
  const fullHeight = rackHeight + config.frameThickness * 2;
  const leftPillarX = config.leftPanelOffset + config.panelWidth;
  const rackX = leftPillarX + config.frameThickness;

  return { rackHeight, baseY, fullWidth, fullHeight, rackX };
}
