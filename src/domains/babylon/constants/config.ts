import type { EquipmentPaletteItem } from "../types";

// 격자 설정
export const DEFAULT_GRID_CONFIG = {
  rows: 10,
  columns: 10,
  cellSize: 2, // 각 격자의 크기 (미터 단위)
};

// 카메라 설정
export const CAMERA_CONFIG = {
  // 아이소메트릭 뷰를 위한 초기 각도
  alpha: -Math.PI / 4, // -45도
  beta: Math.PI / 3.5, // 약 51.4도 (아이소메트릭)
  radius: 40, // 카메라 거리
  minZ: 0.1,
  maxZ: 1000,

  // 카메라 제한
  lowerRadiusLimit: 10,
  upperRadiusLimit: 100,
  lowerBetaLimit: 0.1,
  upperBetaLimit: Math.PI / 2 - 0.1,

  // 이동 속도
  panningSensibility: 50,
  wheelPrecision: 50,
};

// 장비 팔레트
export const EQUIPMENT_PALETTE: EquipmentPaletteItem[] = [
  {
    type: "server",
    name: "서버 랙",
    icon: "",
    modelPath: "/serverRack/scene.gltf",
  },
  {
    type: "door",
    name: "문",
    icon: "",
    modelPath: "/door/scene.gltf",
  },
  {
    type: "climatic_chamber",
    name: "항온항습기",
    icon: "",
    modelPath: "/climaticChamber/Climatic Chamber.glb",
  },
  {
    type: "fire_extinguisher",
    name: "소화기",
    icon: "",
    modelPath: "/fire_exting/scene.gltf",
  },
  {
    type: "thermometer",
    name: "온도계",
    icon: "",
    modelPath: "/thermometer/scene.gltf",
  },
  {
    type: "aircon",
    name: "에어컨",
    icon: "",
    modelPath: "/aircon/scene.glb",
  },
];

// 장비별 스케일 설정 (기본값 대비 배율)
export const EQUIPMENT_SCALE: Record<string, number> = {
  server: 0.9, // 서버 랙
  door: 0.0012, // 문
  climatic_chamber: 0.8, // 항온항습기
  fire_extinguisher: 0.01, // 소화기
  thermometer: 10, // 온도계
  aircon: 0.2, // 에어컨
};

// 장비별 Y축 오프셋 (바닥 높이 조정)
export const EQUIPMENT_Y_OFFSET: Record<string, number> = {
  server: 0, // 서버 랙 - 바닥보다 약간 아래
  door: 0, // 문 - 바닥에 정확히
  climatic_chamber: 0, // 항온항습기 - 바닥에 정확히
  fire_extinguisher: 0, // 소화기 - 바닥에 정확히
  thermometer: 2, // 온도계 - 위로 올림
  aircon: 0.5, // 에어컨 - 바닥에 정확히
};

// 장비별 기본 회전 각도 (라디안)
export const EQUIPMENT_DEFAULT_ROTATION: Record<string, number> = {
  server: 0, // 서버 랙 - 회전 없음
  door: Math.PI / 2, // 문 - 90도 회전 (격자에 맞게)
  climatic_chamber: 0, // 항온항습기 - 회전 없음
  fire_extinguisher: 0, // 소화기 - 회전 없음
  thermometer: 0, // 온도계 - 회전 없음
  aircon: 0, // 에어컨 - 회전 없음
};

// 장비별 위치 오프셋 (격자 중심에서 이동, X와 Z 방향)
export const EQUIPMENT_POSITION_OFFSET: Record<
  string,
  { x: number; z: number }
> = {
  server: { x: 0, z: 0 }, // 서버 랙 - 중앙
  door: { x: -0.4, z: 0 }, // 문 - 왼쪽으로 이동
  climatic_chamber: { x: 0, z: 0 }, // 항온항습기 - 중앙
  fire_extinguisher: { x: 0, z: 0 }, // 소화기 - 중앙
  thermometer: { x: 0, z: 0 }, // 온도계 - 중앙
  aircon: { x: 0, z: 0 }, // 에어컨 - 중앙
};

// 색상 설정
export const COLORS = {
  grid: "#000000", // 격자 색상
  gridFloor: "#ffffff", // 바닥 색상
  highlight: "#22d3ee", // 하이라이트 색상 (밝은 청록색)
  invalid: "#ef4444", // 유효하지 않은 위치
  valid: "#10b981", // 유효한 위치
};
