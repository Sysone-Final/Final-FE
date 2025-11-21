import type { EquipmentType } from "../../types";

export const DEVICE_TYPE_ID_MAP: Record<EquipmentType, number> = {
  server: 1,
  door: 2,
  climatic_chamber: 3,
  fire_extinguisher: 4,
  thermometer: 5,
  aircon: 6,
} as const;

/**
 * 장비 타입으로 deviceTypeId 조회
 */
export function getDeviceTypeId(type: EquipmentType): number {
  return DEVICE_TYPE_ID_MAP[type] ?? 1; // 기본값: 1 (SERVER)
}

/**
 * deviceTypeId로 장비 타입 조회
 */
export function getEquipmentType(deviceTypeId: number): EquipmentType | null {
  const entry = Object.entries(DEVICE_TYPE_ID_MAP).find(
    ([, id]) => id === deviceTypeId
  );
  return entry ? (entry[0] as EquipmentType) : null;
}
