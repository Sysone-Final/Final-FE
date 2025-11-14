import type {
  Equipment3D,
  CreateDeviceRequest,
  CreateRackRequest,
  UpdateDeviceRequest,
} from "../types";
import { getDeviceTypeId } from "../constants/deviceTypes";
import { radianToDegree } from "../transformers/equipmentTransformer";

/**
 * Equipment3D를 CreateDeviceRequest로 변환
 */
export function buildCreateDeviceRequest(
  equipment: Omit<Equipment3D, "id" | "equipmentId">,
  deviceCode: string,
  serverRoomId: number,
  rackId?: number
): CreateDeviceRequest {
  const deviceTypeId = getDeviceTypeId(equipment.type);

  return {
    deviceName: equipment.metadata?.name || `New ${equipment.type}`,
    deviceCode,
    gridY: equipment.gridY,
    gridX: equipment.gridX,
    gridZ: equipment.gridZ,
    rotation: radianToDegree(equipment.rotation),
    status: equipment.metadata?.status || "NORMAL",
    modelName: equipment.metadata?.modelName as string | undefined,
    manufacturer: equipment.metadata?.manufacturer as string | undefined,
    serialNumber: equipment.metadata?.serialNumber as string | undefined,
    purchaseDate: equipment.metadata?.purchaseDate as string | undefined,
    warrantyEndDate: equipment.metadata?.warrantyEndDate as string | undefined,
    notes: equipment.metadata?.notes as string | undefined,
    deviceTypeId,
    rackId: rackId ?? (equipment.rackId ? Number(equipment.rackId) : null),
    serverRoomId,
  };
}

/**
 * Equipment3D를 UpdateDeviceRequest로 변환
 */
export function buildUpdateDeviceRequest(
  equipment: Equipment3D
): UpdateDeviceRequest {
  return {
    gridY: equipment.gridY,
    gridX: equipment.gridX,
    gridZ: equipment.gridZ,
    rotation: radianToDegree(equipment.rotation),
    deviceName: equipment.metadata?.name,
    status: equipment.metadata?.status,
    modelName: equipment.metadata?.modelName as string | undefined,
    manufacturer: equipment.metadata?.manufacturer as string | undefined,
    serialNumber: equipment.metadata?.serialNumber as string | undefined,
    purchaseDate: equipment.metadata?.purchaseDate as string | undefined,
    warrantyEndDate: equipment.metadata?.warrantyEndDate as string | undefined,
    notes: equipment.metadata?.notes as string | undefined,
  };
}

/**
 * Equipment3D로부터 CreateRackRequest 빌드
 */
export function buildCreateRackRequest(
  equipment: Omit<Equipment3D, "id" | "equipmentId">,
  serverRoomId: number
): CreateRackRequest {
  return {
    rackName: equipment.metadata?.name || `RACK-${Date.now()}`,
    gridX: equipment.gridX,
    gridY: equipment.gridY,
    totalUnits: 42, // 기본값: 42U
    doorDirection: "FRONT",
    zoneDirection: "EAST",
    maxPowerCapacity: 5000.0,
    manufacturer: equipment.metadata?.manufacturer as string | undefined,
    serialNumber: equipment.metadata?.serialNumber as string | undefined,
    status: "ACTIVE",
    rackType: "STANDARD",
    notes: equipment.metadata?.notes as string | undefined,
    serverRoomId,
  };
}
