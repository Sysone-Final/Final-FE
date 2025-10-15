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

// 데이터센터 장비 정보
export interface DatacenterEquipment {
  x: number;
  y: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  type: EquipmentType;
}

// 아이소메트릭 좌표
export interface IsometricCoordinate {
  x: number;
  y: number;
}