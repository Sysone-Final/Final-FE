import client from "@api/client";
import type {
  Equipment3D,
  ServerRoomEquipmentResponse,
  BackendDevice,
  BackendEquipment,
} from "../types";

// 공통 API 클라이언트 사용
const apiClient = client;

/**
 * 백엔드 디바이스 데이터를 프론트엔드 형식으로 변환
 */
export function transformBackendDevice(
  backendDevices: BackendDevice[],
): Equipment3D[] {
  return backendDevices.map((item) => ({
    id: item.id.toString(), // 숫자 ID를 문자열로 변환
    type: item.deviceType,
    gridX: item.gridX,
    gridY: item.gridY ?? 0, // null인 경우 0으로 처리
    gridZ: item.gridZ,
    rotation: (item.rotation * Math.PI) / 180, // degree를 radian으로 변환
    equipmentId: item.id.toString(), // 원본 백엔드 ID 보관
    rackId: item.rackId?.toString(),
    metadata: {
      name: item.deviceName,
      code: item.deviceCode,
      status: item.status,
      rackName: item.rackName ?? undefined,
    },
  }));
}


/**
 * 프론트엔드 장비 데이터를 백엔드 형식으로 변환 (저장 시)
 */
export function transformToBackendEquipment(
  equipment: Equipment3D[],
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

/**
 * 서버실의 장비 목록 조회
 * @returns 장비 목록과 그리드 설정 정보
 */
export async function fetchServerRoomEquipment(
  serverRoomId: string,
): Promise<{ equipment: Equipment3D[]; gridConfig: { rows: number; columns: number } }> {
  try {
    const response = await apiClient.get<ServerRoomEquipmentResponse>(
      `/devices/serverroom/${serverRoomId}`,
    );

    // 새로운 API 구조에서 데이터 추출
    const { serverRoom, devices } = response.data.result;

    // 백엔드 디바이스 데이터를 프론트엔드 형식으로 변환
    const equipment = transformBackendDevice(devices);

    // 서버실 그리드 설정 반환
    const gridConfig = {
      rows: serverRoom.rows,
      columns: serverRoom.columns,
    };

    return { equipment, gridConfig };
  } catch (error) {
    console.error("Failed to fetch server room equipment:", error);
    throw error;
  }
}

/**
 * 서버실 장비 배치 저장
 */
export async function saveServerRoomEquipment(
  serverRoomId: string,
  equipment: Equipment3D[],
): Promise<void> {
  try {
    const backendEquipment = transformToBackendEquipment(equipment);

    await apiClient.post(
      `/server-rooms/${serverRoomId}/equipment`,
      backendEquipment,
    );
  } catch (error) {
    console.error("Failed to save server room equipment:", error);
    throw error;
  }
}

/**
 * 특정 장비 업데이트
 */
export async function updateEquipment(
  serverRoomId: string,
  equipmentId: string,
  updates: Partial<Equipment3D>,
): Promise<void> {
  try {
    await apiClient.patch(
      `/server-rooms/${serverRoomId}/equipment/${equipmentId}`,
      {
        gridPosition:
          updates.gridX !== undefined
            ? {
                x: updates.gridX,
                y: updates.gridY,
                z: updates.gridZ,
              }
            : undefined,
        rotation: updates.rotation,
        metadata: updates.metadata,
      },
    );
  } catch (error) {
    console.error("Failed to update equipment:", error);
    throw error;
  }
}

/**
 * 장비 삭제
 */
export async function deleteEquipment(
  serverRoomId: string,
  equipmentId: string,
): Promise<void> {
  try {
    await apiClient.delete(
      `/server-rooms/${serverRoomId}/equipment/${equipmentId}`,
    );
  } catch (error) {
    console.error("Failed to delete equipment:", error);
    throw error;
  }
}

/**
 * 새 장비 추가
 */
export async function addEquipment(
  serverRoomId: string,
  equipment: Omit<Equipment3D, "id" | "equipmentId">,
): Promise<Equipment3D> {
  try {
    const response = await apiClient.post<BackendEquipment>(
      `/server-rooms/${serverRoomId}/equipment/add`,
      {
        equipmentType: equipment.type,
        rackId: equipment.rackId,
        gridPosition: {
          x: equipment.gridX,
          y: equipment.gridY,
          z: equipment.gridZ,
        },
        rotation: equipment.rotation,
        metadata: equipment.metadata,
      },
    );

    // 생성된 장비를 프론트엔드 형식으로 변환
    return {
      id: response.data.equipmentId,
      type: response.data.equipmentType,
      gridX: response.data.gridPosition.x,
      gridY: response.data.gridPosition.y,
      gridZ: response.data.gridPosition.z,
      rotation: response.data.rotation,
      equipmentId: response.data.equipmentId,
      rackId: response.data.rackId,
      metadata: response.data.metadata,
    };
  } catch (error) {
    console.error("Failed to add equipment:", error);
    throw error;
  }
}
