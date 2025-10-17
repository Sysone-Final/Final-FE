import type { EquipmentPaletteItem } from "../types";
import serverRackModel from "../assets/serverRack/scene.gltf?url";

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
  radius: 30, // 카메라 거리
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
    modelPath: serverRackModel,
  },
  {
    type: "storage",
    name: "스토리지",
    icon: "",
    modelPath: serverRackModel, // 임시로 같은 모델 사용
  },
  {
    type: "network",
    name: "네트워크",
    icon: "",
    modelPath: serverRackModel, // 임시로 같은 모델 사용
  },
  {
    type: "ups",
    name: "UPS",
    icon: "",
    modelPath: serverRackModel, // 임시로 같은 모델 사용
  },
  {
    type: "ac",
    name: "에어컨",
    icon: "",
    modelPath: serverRackModel, // 임시로 같은 모델 사용
  },
];

// 색상 설정
export const COLORS = {
  grid: "#ffffff", // 격자 색상
  gridFloor: "#ffffff", // 바닥 색상
  highlight: "#22d3ee", // 하이라이트 색상
  invalid: "#ef4444", // 유효하지 않은 위치
  valid: "#10b981", // 유효한 위치
};
