import axios from "axios";
import type {
  Equipment3D,
  ServerRoomEquipmentResponse,
  BackendEquipment,
} from "../types";

// API 클라이언트 설정
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 백엔드 장비 데이터를 프론트엔드 형식으로 변환
 */
export function transformBackendEquipment(
  backendEquipment: BackendEquipment[],
): Equipment3D[] {
  return backendEquipment.map((item) => ({
    id: item.equipmentId, // 백엔드 UUID를 프론트엔드 id로 사용
    type: item.equipmentType,
    gridX: item.gridPosition.x,
    gridY: item.gridPosition.y,
    gridZ: item.gridPosition.z,
    rotation: item.rotation,
    equipmentId: item.equipmentId, // 원본 백엔드 ID 보관
    rackId: item.rackId,
    metadata: item.metadata,
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
 */
export async function fetchServerRoomEquipment(
  serverRoomId: string,
): Promise<Equipment3D[]> {
  try {
    const response = await apiClient.get<ServerRoomEquipmentResponse>(
      `/api/server-rooms/${serverRoomId}/equipment`,
    );

    // 백엔드 데이터를 프론트엔드 형식으로 변환
    return transformBackendEquipment(response.data.equipment);
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
      `/api/server-rooms/${serverRoomId}/equipment`,
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
      `/api/server-rooms/${serverRoomId}/equipment/${equipmentId}`,
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
      `/api/server-rooms/${serverRoomId}/equipment/${equipmentId}`,
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
      `/api/server-rooms/${serverRoomId}/equipment/add`,
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
