export type EquipmentType =
  | "server"
  | "door"
  | "climatic_chamber"
  | "fire_extinguisher"
  | "thermometer"
  | "aircon";

export interface Equipment3D {
  id: string; // 프론트엔드에서 사용하는 로컬 ID (equipmentId로부터 생성)
  type: EquipmentType;
  gridX: number; // 격자 좌표 X
  gridY: number; // 격자 좌표 Y
  gridZ: number; // 격자 좌표 Z (높이)
  rotation: number; // Y축 회전 (라디안)
  equipmentId?: string; // 백엔드 DB의 실제 장비 ID (UUID)
  rackId?: string; // 랙 ID (서버 타입인 경우)
  metadata?: EquipmentMetadata; // 추가 정보
}

// 장비 추가 정보
export interface EquipmentMetadata {
  name?: string;
  status?: string;
  temperature?: number;
  [key: string]: unknown; // 기타 메타데이터
}

// 백엔드 API 응답 타입
export interface ServerRoomEquipmentResponse {
  serverRoomId: string;
  serverRoomName: string;
  equipment: BackendEquipment[];
}

// 백엔드에서 받는 장비 데이터 구조
export interface BackendEquipment {
  equipmentId: string; // DB의 UUID
  equipmentType: EquipmentType;
  rackId?: string;
  gridPosition: {
    x: number;
    y: number;
    z: number;
  };
  rotation: number;
  metadata?: EquipmentMetadata;
}

// 격자 설정
export interface GridConfig {
  rows: number; // 격자 행 개수
  columns: number; // 격자 열 개수
  cellSize: number; // 한 격자 크기
}

// 장비 팔레트 아이템
export interface EquipmentPaletteItem {
  type: EquipmentType;
  name: string;
  icon: string;
  modelPath: string;
}
