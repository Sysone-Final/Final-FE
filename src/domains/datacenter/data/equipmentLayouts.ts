import type { DatacenterEquipment } from '../types';

/**
 * 데이터센터 장비 배치 템플릿
 * 격자 기준으로 장비들을 2칸 간격으로 배치
 */
export const createDatacenterEquipmentLayout = (gridSize: number, cubeSize: number): DatacenterEquipment[] => [
  // 첫 번째 행 - 2칸 간격으로 배치 (격자 기준 1, 3, 5, 7번째 위치)
  { x: gridSize * 1, y: gridSize * 1, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'server' },
  { x: gridSize * 3, y: gridSize * 1, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'storage' },
  { x: gridSize * 5, y: gridSize * 1, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'network' },
  { x: gridSize * 7, y: gridSize * 1, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'ups' },
  
  // 두 번째 행
  { x: gridSize * 1, y: gridSize * 3, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'ac' },
  { x: gridSize * 3, y: gridSize * 3, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'server' },
  { x: gridSize * 5, y: gridSize * 3, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'storage' },
  { x: gridSize * 7, y: gridSize * 3, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'network' },
  
  // 세 번째 행
  { x: gridSize * 1, y: gridSize * 5, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'ups' },
  { x: gridSize * 3, y: gridSize * 5, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'ac' },
  { x: gridSize * 5, y: gridSize * 5, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'server' },
  { x: gridSize * 7, y: gridSize * 5, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'storage' },
  
  // 네 번째 행
  { x: gridSize * 1, y: gridSize * 7, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'network' },
  { x: gridSize * 3, y: gridSize * 7, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'ups' },
  { x: gridSize * 5, y: gridSize * 7, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'ac' },
  { x: gridSize * 7, y: gridSize * 7, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'server' },
];

/**
 * 기본 데이터센터 장비 배치 (설정값 기반)
 */
export const DEFAULT_DATACENTER_EQUIPMENT = createDatacenterEquipmentLayout(30, 25);

/**
 * 서버 중심 배치 (서버가 많은 레이아웃)
 */
export const createServerFocusedLayout = (gridSize: number, cubeSize: number): DatacenterEquipment[] => [
  // 주로 서버로 구성
  { x: gridSize * 1, y: gridSize * 1, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'server' },
  { x: gridSize * 3, y: gridSize * 1, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'server' },
  { x: gridSize * 5, y: gridSize * 1, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'server' },
  { x: gridSize * 7, y: gridSize * 1, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'network' },
  
  { x: gridSize * 1, y: gridSize * 3, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'server' },
  { x: gridSize * 3, y: gridSize * 3, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'server' },
  { x: gridSize * 5, y: gridSize * 3, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'server' },
  { x: gridSize * 7, y: gridSize * 3, z: 0, width: cubeSize, depth: cubeSize, height: cubeSize, type: 'storage' },
];

/**
 * 장비 타입별 개수 계산
 */
export const getEquipmentTypeCount = (equipment: DatacenterEquipment[]) => {
  return equipment.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

export const LAYOUT_TYPES = {
  DEFAULT: 'default',
  SERVER_FOCUSED: 'server_focused',
  CUSTOM: 'custom'
} as const;

export type LayoutType = typeof LAYOUT_TYPES[keyof typeof LAYOUT_TYPES];

/**
 * 레이아웃 타입에 따른 장비 배치 팩토리
 */
export const createEquipmentLayout = (
  layoutType: LayoutType, 
  gridSize: number, 
  cubeSize: number
): DatacenterEquipment[] => {
  switch (layoutType) {
    case LAYOUT_TYPES.SERVER_FOCUSED:
      return createServerFocusedLayout(gridSize, cubeSize);
    case LAYOUT_TYPES.DEFAULT:
    default:
      return createDatacenterEquipmentLayout(gridSize, cubeSize);
  }
};