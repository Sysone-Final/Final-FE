import { UNIT_COUNT } from "../constants/rackConstants";
import type { FloatingDevice } from "../types";

// 장비의 Y좌표를 랙 U위치로 변환
export function calculationPosition(
  mouseY: number,
  baseY: number,
  unitHeight: number,
): number {
  const relativeY = mouseY - baseY;
  const unit = Math.floor(relativeY / unitHeight);
  const position = UNIT_COUNT - unit;
  return Math.max(1, Math.min(UNIT_COUNT, position));
}

// Y좌표 계산
export function calculateDeviceY(
  position: number,
  deviceHeight: number,
  rackHeight: number,
  baseY: number,
  unitHeight: number,
): number {
  return (
    rackHeight - (position - 1) * unitHeight - deviceHeight * unitHeight + baseY
  );
}

// 떠있는 장비의 렌더링 정보 계산
export function getFloatingDeviceInfo(
  floatingDevice: FloatingDevice | null,
  rackConfig: {
    rackHeight: number;
    baseY: number;
    unitHeight: number;
  },
) {
  if (!floatingDevice) return null;
  const position = calculationPosition(
    floatingDevice.mouseY,
    rackConfig.baseY,
    rackConfig.unitHeight,
  );
  const y = calculateDeviceY(
    position,
    floatingDevice.card.height,
    rackConfig.rackHeight,
    rackConfig.baseY,
    rackConfig.unitHeight,
  );
  const height = rackConfig.unitHeight * floatingDevice.card.height;
  return { position, y, height };
}

// 드래그된 장비의 새 위치 계산
export function calculateDraggedPosition(
  newY: number,
  deviceHeight: number,
  baseY: number,
  unitHeight: number,
): number {
  const deviceBottomY = newY + deviceHeight * unitHeight;
  const relativeY = deviceBottomY - baseY;
  const bottomUnit = Math.floor(relativeY / unitHeight);
  const newPosition = UNIT_COUNT - bottomUnit;

  // 랙 범위 내로 제한
  return Math.max(1, Math.min(UNIT_COUNT - deviceHeight + 1, newPosition));
}
