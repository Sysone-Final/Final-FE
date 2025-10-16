// 서버랙 컴포넌트 Props 인터페이스
export interface ServerRackProps {
  x: number;
  y: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  type: 'server' | 'storage' | 'network' | 'ups' | 'ac';
}

// 장비 타입 정의
export type EquipmentType = 'server' | 'storage' | 'network' | 'ups' | 'ac';

// 데이터센터 장비 정보 (레거시 - 하위 호환성용)
export interface DatacenterEquipmentLegacy {
  x: number;
  y: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  type: EquipmentType;
}

// 데이터센터 장비 정보 (신규 - 드래그앤드롭용)
export interface DatacenterEquipment {
  id: string;
  x: number;
  y: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  type: EquipmentType;
  isDragging?: boolean;
  valid?: boolean;
}

// 아이소메트릭 좌표
export interface IsometricCoordinate {
  x: number;
  y: number;
}

// 장비 팔레트 아이템
export interface EquipmentPaletteItem {
  type: EquipmentType;
  name: string;
  icon: string;
  width: number;
  depth: number;
  height: number;
}