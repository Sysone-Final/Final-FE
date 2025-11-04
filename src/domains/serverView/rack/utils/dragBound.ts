export function dragBound(
  pos: { x: number; y: number },
  config: {
    baseY: number;
    rackHeight: number;
    deviceHeight: number;
    unitHeight: number;
  },
) {
  const minY = config.baseY;
  const maxY = config.baseY + config.rackHeight - config.deviceHeight;

  const relativeY = pos.y - config.baseY;
  const snappedRelativeY =
    Math.round(relativeY / config.unitHeight) * config.unitHeight;
  const snappedY = snappedRelativeY + config.baseY;

  const clampedY = Math.max(minY, Math.min(maxY, snappedY));

  return {
    x: 0,
    y: clampedY,
  };
}
