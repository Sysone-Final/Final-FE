// Babylon.js 데이터센터 장비 타입
export type EquipmentType = 'server' | 'storage' | 'network' | 'ups' | 'ac';

// 3D 장비 정보
export interface Equipment3D {
  id: string;
  type: EquipmentType;
  gridX: number; // 격자 좌표 X
  gridY: number; // 격자 좌표 Y
  gridZ: number; // 격자 좌표 Z (높이)
  rotation: number; // Y축 회전 (라디안)
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
