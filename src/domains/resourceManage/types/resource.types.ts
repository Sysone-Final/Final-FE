// src/domains/resourceManage/types/resource.types.ts

import type { TableMeta } from "@tanstack/react-table";

// NOTE(user): 3단계 폼 기준 자원 상태 타입
export type ResourceStatus =
  | "NORMAL" // 운영중
  | "MAINTENANCE" // 점검중
  | "INACTIVE" // 비활성/재고
  | "DISPOSED"; // 폐기

// NOTE(user): 3단계 폼 기준 장비 유형 타입
export type EquipmentType = "SERVER" | "SWITCH" | "ROUTER" | "PDU" | "UPS";

// NOTE(user): 3단계 폼 기준 설치 방향 타입
export type PositionType = "FRONT" | "REAR";

// NOTE(user): 자원(Equipment) 핵심 인터페이스 (3단계 폼 기준)
export interface Resource {
  // 1단계: 기본 식별 정보
  id: string; // (NOT NULL - PK)
  equipmentName: string; // (NOT NULL)
  equipmentType: EquipmentType; // (NOT NULL)
  manufacturer?: string | null;
  modelName?: string | null;
  serialNumber?: string | null;
  equipmentCode?: string | null;
  imageUrlFront?: string | null; // 앞면 이미지 URL
  imageUrlRear?: string | null; // 뒷면 이미지 URL

  // 2단계: 위치 및 사양
  // 2-1. 물리적 위치 (Nullable)
  datacenterId?: string | null;
  rackId?: string | null;
  startUnit?: number | null;
  unitSize: number; // (NOT NULL)
  positionType?: PositionType | null;

  // 2-2. 하드웨어 및 네트워크 사양 (Nullable)
  os?: string | null;
  cpuSpec?: string | null;
  memorySpec?: string | null;
  diskSpec?: string | null;
  ipAddress?: string | null;
  macAddress?: string | null;
  powerConsumption?: number | null; // (API 9.2 참고)
  weight?: number | null; // (API 9.2 참고)

  // 3단계: 관리 및 모니터링
  // 3-1. 관리 정보
  managerId?: string | null;
  status: ResourceStatus; // (NOT NULL)
  installationDate?: string | null; // (YYYY-MM-DD)
  notes?: string | null;

  // 3-2. 모니터링 설정 (Nullable)
  monitoringEnabled?: boolean | null;
  cpuThresholdWarning?: number | null;
  cpuThresholdCritical?: number | null;
  memoryThresholdWarning?: number | null;
  memoryThresholdCritical?: number | null;
  diskThresholdWarning?: number | null;
  diskThresholdCritical?: number | null;

  // 기존 타입 호환 (임시)
  location?: string; // (기존 테이블 표시용, rackId 등으로 대체 필요)
}

// NOTE(user): TanStack Table meta 타입 (핸들러 전달용)
export interface ResourceTableMeta extends TableMeta<Resource> {
  editResourceHandler: (resource: Resource) => void;
  deleteResourceHandler: (resourceId: string) => void;
}

// NOTE(user): API 응답 타입 (페이지네이션)
export interface PaginatedResourceResponse {
  content: Resource[];
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number; // 현재 페이지 번호 (0-based)
}

// NOTE(user): 검색/필터링을 위한 필터 타입
export interface ResourceListFilters {
  searchTerm?: string;
  status?: string;
  type?: string; // TODO(user): 실제 타입 필터 구현 시 사용
  location?: string; // TODO(user): 실제 위치 필터 구현 시 사용
}
