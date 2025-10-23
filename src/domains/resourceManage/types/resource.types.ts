// src/domains/resourceManage/types/resource.types.ts
import type { TableMeta } from "@tanstack/react-table";

// NOTE(user): UI 디자인 기준 자원 상태 타입
export type ResourceStatus = "정상" | "경고" | "정보 필요" | "미할당";

// NOTE(user): 자원(Equipment) 핵심 인터페이스
export interface Resource {
  id: string;
  assetName: string;
  status: ResourceStatus;
  ipAddress: string;
  model: string;
  location: string;
  vendor?: string; // 엑셀 데이터 참고 (선택적)
  osType?: string; // 엑셀 데이터 참고 (선택적)
  imageUrl?: string; // P0 핵심 기능 (이미지)
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
