import type {
  Equipment3D,
  BackendDevice,
  BackendEquipment,
} from "../../types";

/** 백엔드 디바이스 배열을 Equipment3D 배열로 변환 */
export function transformBackendDevicesToEquipment(
  backendDevices: BackendDevice[]
): Equipment3D[] {
  return backendDevices.map((device) => transformBackendDeviceToEquipment(device));
}

/** 
 * 백엔드 디바이스를 Equipment3D로 변환
 * - degree → radian 변환
 * - null 값 처리
 */
export function transformBackendDeviceToEquipment(
  device: BackendDevice
): Equipment3D {
  return {
    id: device.id.toString(),
    type: device.deviceType,
    gridX: device.gridX,
    gridY: device.gridY ?? 0,
    gridZ: device.gridZ,
    rotation: degreeToRadian(device.rotation),
    equipmentId: device.id.toString(),
    rackId: device.rackId?.toString(),
    doorDirection: device.doorDirection, // 랙의 문 방향
    metadata: {
      name: device.deviceName,
      code: device.deviceCode,
      status: device.status,
      rackName: device.rackName ?? undefined,
    },
  };
}

/** 
 * Equipment3D를 BackendEquipment로 변환
 * @deprecated 레거시 API용, 개별 업데이트 API 사용 권장
 */
export function transformEquipmentToBackend(
  equipment: Equipment3D[]
): Omit<BackendEquipment, "equipmentId">[] {
  return equipment.map((item) => ({
    equipmentType: item.type,
    rackId: item.rackId,
    gridPosition: {
      x: item.gridX,
      y: item.gridY,
      z: item.gridZ,
    },
    rotation: item.rotation,
    metadata: item.metadata,
  }));
}

/** degree → radian 변환 */
export function degreeToRadian(degree: number): number {
  return (degree * Math.PI) / 180;
}

/** radian → degree 변환 (반올림) */
export function radianToDegree(radian: number): number {
  return Math.round((radian * 180) / Math.PI);
}
