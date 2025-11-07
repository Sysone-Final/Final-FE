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
  status_code: number;
  status_message: string;
  result: BackendEquipment[];
}

// 백엔드에서 받는 장비 데이터 구조
export interface BackendEquipment {
  id: number; // 장비 ID
  deviceName: string; // 장비명
  deviceCode: string; // 장비 코드
  deviceType: EquipmentType; // 장비 타입
  gridX: number; // X 좌표
  gridY: number; // Y 좌표
  gridZ: number; // Z 좌표
  rotation: number; // 회전값 (degree)
  status: string; // 상태 (NORMAL, WARNING, CRITICAL 등)
  datacenterName: string; // 데이터센터명
  datacenterId: number; // 데이터센터 ID
  rackName: string | null; // 랙명
  rackId: number | null; // 랙 ID
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
