import client from "@api/client";
import type {
  Equipment3D,
  ServerRoomEquipmentResponse,
  BackendEquipment,
} from "../types";

/**
 * 백엔드 장비 데이터를 프론트엔드 3D 형식으로 변환
 */
export function transformBackendEquipment(
  backendEquipment: BackendEquipment[],
): Equipment3D[] {
  return backendEquipment.map((item) => ({
    id: item.id.toString(), 
    type: item.deviceType,
    gridX: item.gridX,
    gridY: item.gridY,
    gridZ: item.gridZ,
    rotation: (item.rotation * Math.PI) / 180, // degree를 radian으로 변환
    equipmentId: item.id.toString(),
    rackId: item.rackId !== null ? item.rackId.toString() : undefined,
    metadata: {
      name: item.deviceName,
      code: item.deviceCode,
      status: item.status,
      datacenterName: item.datacenterName,
      datacenterId: item.datacenterId,
      rackName: item.rackName,
    },
  }));
}

/**
 * 서버실(데이터센터)의 장비 목록 조회
 * @param datacenterId 데이터센터 ID
 */
export async function fetchServerRoomEquipment(
  datacenterId: number,
): Promise<Equipment3D[]> {
  try {
    const response = await client.get<ServerRoomEquipmentResponse>(
      `/devices/datacenter/${datacenterId}`,
    );

    // 백엔드 데이터를 프론트엔드 3D 형식으로 변환
    return transformBackendEquipment(response.data.result);
  } catch (error) {
    console.error("Failed to fetch server room equipment:", error);
    throw error;
  }
}
