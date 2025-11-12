import client from "@api/client";
import type {
  Equipment3D,
  ServerRoomEquipmentResponse,
  BackendDevice,
  BackendEquipment,
  CreateDeviceRequest,
  CreateDeviceResponse,
  CreateRackRequest,
  CreateRackResponse,
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

/**
 * deviceTypeId 매핑 (EquipmentType -> deviceTypeId)
 * DB 테이블 기준:
 * 1 = SERVER (서버 랙)
 * 2 = DOOR (출입문)
 * 3 = CLIMATIC_CHAMBER (항온항습기)
 * 4 = FIRE_EXTINGUISHER (소화기)
 * 5 = THERMOMETER (온도 센서)
 * 6 = AIRCON (정밀 에어컨)
 */
const DEVICE_TYPE_ID_MAP: Record<string, number> = {
  server: 1,
  door: 2,
  climatic_chamber: 3,     
  fire_extinguisher: 4,
  thermometer: 5,    
  aircon: 6,
};

/**
 * 새 랙 생성
 * server 타입 장비를 추가할 때 먼저 호출하여 Rack 테이블에 레코드 생성
 * @param equipment 랙으로 생성할 장비 정보
 * @param serverRoomId 서버실 ID
 * @returns 생성된 랙 ID
 */
async function createRack(
  equipment: Omit<Equipment3D, "id" | "equipmentId">,
  serverRoomId: number,
): Promise<number> {
  const rackRequest: CreateRackRequest = {
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

  const response = await apiClient.post<CreateRackResponse>(
    `/racks`,
    rackRequest,
  );

  return response.data.result.id;
}

/**
 * 새 장비 생성 (실제 POST /api/devices 사용)
 * - server 타입: 먼저 Rack 생성 후 Device 생성 (rackId 자동 할당)
 * - 기타 타입: Device만 생성
 * 
 * @param equipment 추가할 장비 정보
 * @param serverRoomId 서버실 ID
 * @param datacenterId 데이터센터 ID
 * @returns 생성된 장비 정보
 */
export async function createDevice(
  equipment: Omit<Equipment3D, "id" | "equipmentId">,
  serverRoomId: number,
  datacenterId: number,
): Promise<Equipment3D> {
  try {
    // 장비 타입에 따른 deviceTypeId 결정
    const deviceTypeId = DEVICE_TYPE_ID_MAP[equipment.type] || 1;

    // server 타입인 경우 먼저 랙 생성
    let rackId: number | null = null;
    if (equipment.type === "server") {
      rackId = await createRack(equipment, serverRoomId);
    }

    // 장비 코드 자동 생성 (예: DEV-2025-8364)
    const deviceCode = `DEV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

    const requestData: CreateDeviceRequest = {
      deviceName: equipment.metadata?.name || `New ${equipment.type}`,
      deviceCode,
      gridY: equipment.gridY,
      gridX: equipment.gridX,
      gridZ: equipment.gridZ,
      rotation: Math.round((equipment.rotation * 180) / Math.PI), // radian -> degree
      status: equipment.metadata?.status || "NORMAL",
      modelName: equipment.metadata?.modelName as string | undefined,
      manufacturer: equipment.metadata?.manufacturer as string | undefined,
      serialNumber: equipment.metadata?.serialNumber as string | undefined,
      purchaseDate: equipment.metadata?.purchaseDate as string | undefined,
      warrantyEndDate: equipment.metadata?.warrantyEndDate as string | undefined,
      notes: equipment.metadata?.notes as string | undefined,
      deviceTypeId,
      datacenterId,
      rackId: rackId ?? (equipment.rackId ? Number(equipment.rackId) : null), // 생성된 rackId 우선 사용
      serverRoomId,
    };

    const response = await apiClient.post<CreateDeviceResponse>(
      `/devices`,
      requestData,
    );

    const createdDevice = response.data.result;

    // 백엔드 응답을 프론트엔드 형식으로 변환
    return {
      id: createdDevice.id.toString(),
      type: createdDevice.deviceType,
      gridX: createdDevice.gridX,
      gridY: createdDevice.gridY ?? 0,
      gridZ: createdDevice.gridZ,
      rotation: (createdDevice.rotation * Math.PI) / 180, // degree -> radian
      equipmentId: createdDevice.id.toString(),
      rackId: createdDevice.rackId?.toString(),
      metadata: {
        name: createdDevice.deviceName,
        code: createdDevice.deviceCode,
        status: createdDevice.status,
        rackName: createdDevice.rackName ?? undefined,
      },
    };
  } catch (error) {
    console.error("Failed to create device:", error);
    throw error;
  }
}
