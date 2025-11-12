import type {
  EquipmentType,
  ResourceStatus,
} from "../types/resource.types";


/**
 * 장비 유형 (Type) 필터 옵션
 */
export const EQUIPMENT_TYPE_OPTIONS: {
  value: EquipmentType;
  label: string;
}[] = [
  { value: "SERVER", label: "서버" },
  { value: "SWITCH", label: "스위치" },
  { value: "ROUTER", label: "라우터" },
  { value: "PDU", label: "PDU" },
  { value: "UPS", label: "UPS" },
  { value: "STORAGE", label: "스토리지" },
  { value: "FIREWALL", label: "방화벽" },
  { value: "LOAD_BALANCE", label: "로드 밸런서" },
  { value: "KVM", label: "KVM" },
  
];

/**
 * 자원 상태 (Status) 필터 옵션
 * (ResourceFilters.tsx에 하드코딩된 것을 상수로 추출)
 */
export const RESOURCE_STATUS_OPTIONS: {
  value: ResourceStatus;
  label: string;
}[] = [
  { value: "NORMAL", label: "정상" },
  { value: "MAINTENANCE", label: "점검중" },
  { value: "POWERED_OFF", label: "비활성/재고" },
  { value: "DECOMMISSIONED", label: "폐기" },
];