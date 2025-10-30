import type { RackDevice } from "../types";

// 두 장비가 겹치는 지 확인
function Overlapping(
  range1: { bottom: number; top: number },
  range2: { bottom: number; top: number },
): boolean {
  return !(range1.top < range2.bottom || range1.bottom > range2.top);
}

// 새 장비가 기존 장비들과 충돌하는지 검사
export function checkCollision(
  newDevice: {
    position: number;
    height: number;
  },
  existingDevices: RackDevice[],
  excludeDeviceId?: number,
): boolean {
  const newRange = {
    bottom: newDevice.position,
    top: newDevice.position + newDevice.height - 1,
  };

  return existingDevices.some((device) => {
    if (
      excludeDeviceId !== undefined &&
      device.equipmentId === excludeDeviceId
    ) {
      return false;
    }

    const existingRange = {
      bottom: device.startUnit,
      top: device.startUnit + device.unitSize - 1,
    };

    return Overlapping(newRange, existingRange);
  });
}

//충돌하는 장비 찾기
export function findCollidingDevice(
  newDevice: {
    position: number;
    height: number;
  },
  existingDevices: RackDevice[],
  excludeDeviceId?: number,
): RackDevice | null {
  const newRange = {
    bottom: newDevice.position,
    top: newDevice.position + newDevice.height - 1,
  };
  const collidingDevice = existingDevices.find((device) => {
    if (
      excludeDeviceId !== undefined &&
      device.equipmentId == excludeDeviceId
    ) {
      return false;
    }
    const existingRange = {
      bottom: device.startUnit,
      top: device.startUnit + device.unitSize - 1,
    };
    return Overlapping(newRange, existingRange);
  });
  return collidingDevice || null;
}
