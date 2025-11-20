import type { Equipment3D } from "../../types";

/**
 * 서버실별 3D 장비 배치 목 데이터
 * 격자 크기: 10x10
 *
 * 실제 서버실 레이아웃을 고려한 배치:
 * - 서버 랙: 중앙 및 벽면을 따라 배치
 * - 문: 입구 (0,0 근처)
 * - 항온항습기: 벽면 구석
 * - 에어컨: 천장/벽면 상부
 * - 소화기: 출입구 및 중요 위치
 * - 온도계: 모니터링이 필요한 위치
 *
 * 📌 백엔드 연동 시:
 * - id: 백엔드에서 받은 equipmentId (UUID)를 그대로 사용
 * - 목 데이터의 id는 예시이며, 실제로는 백엔드 UUID로 대체됨
 * - API: GET /api/server-rooms/{serverRoomId}/equipment
 */

// IDC A-Zone, Floor 3 (Seoul) - 32개 랙, Normal
// 대형 서버실, 체계적인 배치
export const SERVER_ROOM_A1_EQUIPMENT: Equipment3D[] = [
  // 입구
  {
    id: "a1-door-1",
    type: "door",
    gridX: 0,
    gridY: 0,
    gridZ: 0,
    rotation: Math.PI / 2,
  },

  // 입구 근처 안전 장비
  {
    id: "a1-fire-1",
    type: "fire_extinguisher",
    gridX: 1,
    gridY: 0,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "a1-thermo-1",
    type: "thermometer",
    gridX: 0,
    gridY: 1,
    gridZ: 0,
    rotation: 0,
  },

  // 좌측 서버 랙 라인 (2열)
  {
    id: "a1-server-1",
    type: "server",
    gridX: 2,
    gridY: 2,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "a1-server-2",
    type: "server",
    gridX: 2,
    gridY: 4,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "a1-server-3",
    type: "server",
    gridX: 2,
    gridY: 6,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "a1-server-4",
    type: "server",
    gridX: 2,
    gridY: 8,
    gridZ: 0,
    rotation: 0,
  },

  // 중앙 서버 랙 라인 (4-5열)
  {
    id: "a1-server-5",
    type: "server",
    gridX: 4,
    gridY: 1,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "a1-server-6",
    type: "server",
    gridX: 4,
    gridY: 3,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "a1-server-7",
    type: "server",
    gridX: 4,
    gridY: 5,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "a1-server-8",
    type: "server",
    gridX: 4,
    gridY: 7,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "a1-server-9",
    type: "server",
    gridX: 4,
    gridY: 9,
    gridZ: 0,
    rotation: 0,
  },

  {
    id: "a1-server-10",
    type: "server",
    gridX: 5,
    gridY: 1,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "a1-server-11",
    type: "server",
    gridX: 5,
    gridY: 3,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "a1-server-12",
    type: "server",
    gridX: 5,
    gridY: 5,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "a1-server-13",
    type: "server",
    gridX: 5,
    gridY: 7,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "a1-server-14",
    type: "server",
    gridX: 5,
    gridY: 9,
    gridZ: 0,
    rotation: 0,
  },

  // 우측 서버 랙 라인 (7열)
  {
    id: "a1-server-15",
    type: "server",
    gridX: 7,
    gridY: 2,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "a1-server-16",
    type: "server",
    gridX: 7,
    gridY: 4,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "a1-server-17",
    type: "server",
    gridX: 7,
    gridY: 6,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "a1-server-18",
    type: "server",
    gridX: 7,
    gridY: 8,
    gridZ: 0,
    rotation: 0,
  },

  // 냉각 시스템
  {
    id: "a1-aircon-1",
    type: "aircon",
    gridX: 9,
    gridY: 0,
    gridZ: 0,
    rotation: -Math.PI / 2,
  },
  {
    id: "a1-aircon-2",
    type: "aircon",
    gridX: 9,
    gridY: 5,
    gridZ: 0,
    rotation: -Math.PI / 2,
  },
  {
    id: "a1-climatic-1",
    type: "climatic_chamber",
    gridX: 9,
    gridY: 9,
    gridZ: 0,
    rotation: -Math.PI / 2,
  },

  // 모니터링
  {
    id: "a1-thermo-2",
    type: "thermometer",
    gridX: 3,
    gridY: 5,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "a1-thermo-3",
    type: "thermometer",
    gridX: 6,
    gridY: 5,
    gridZ: 0,
    rotation: 0,
  },

  // 추가 안전 장비
  {
    id: "a1-fire-2",
    type: "fire_extinguisher",
    gridX: 9,
    gridY: 3,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "a1-fire-3",
    type: "fire_extinguisher",
    gridX: 5,
    gridY: 0,
    gridZ: 0,
    rotation: 0,
  },
];

// IDC B-Zone, Floor 2 (Tokyo) - 24개 랙, Warning
// 중형 서버실, 냉각 시스템 경고
export const SERVER_ROOM_B2_EQUIPMENT: Equipment3D[] = [
  // 입구
  {
    id: "b2-door-1",
    type: "door",
    gridX: 0,
    gridY: 0,
    gridZ: 0,
    rotation: Math.PI / 2,
  },
  {
    id: "b2-fire-1",
    type: "fire_extinguisher",
    gridX: 1,
    gridY: 0,
    gridZ: 0,
    rotation: 0,
  },

  // 좌측 서버 랙
  {
    id: "b2-server-1",
    type: "server",
    gridX: 2,
    gridY: 2,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "b2-server-2",
    type: "server",
    gridX: 2,
    gridY: 4,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "b2-server-3",
    type: "server",
    gridX: 2,
    gridY: 6,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "b2-server-4",
    type: "server",
    gridX: 2,
    gridY: 8,
    gridZ: 0,
    rotation: 0,
  },

  // 중앙 서버 랙
  {
    id: "b2-server-5",
    type: "server",
    gridX: 4,
    gridY: 2,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "b2-server-6",
    type: "server",
    gridX: 4,
    gridY: 4,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "b2-server-7",
    type: "server",
    gridX: 4,
    gridY: 6,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "b2-server-8",
    type: "server",
    gridX: 4,
    gridY: 8,
    gridZ: 0,
    rotation: 0,
  },

  {
    id: "b2-server-9",
    type: "server",
    gridX: 5,
    gridY: 2,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "b2-server-10",
    type: "server",
    gridX: 5,
    gridY: 4,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "b2-server-11",
    type: "server",
    gridX: 5,
    gridY: 6,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "b2-server-12",
    type: "server",
    gridX: 5,
    gridY: 8,
    gridZ: 0,
    rotation: 0,
  },

  // 우측 서버 랙
  {
    id: "b2-server-13",
    type: "server",
    gridX: 7,
    gridY: 2,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "b2-server-14",
    type: "server",
    gridX: 7,
    gridY: 4,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "b2-server-15",
    type: "server",
    gridX: 7,
    gridY: 6,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "b2-server-16",
    type: "server",
    gridX: 7,
    gridY: 8,
    gridZ: 0,
    rotation: 0,
  },

  // 냉각 시스템 (Warning 상태를 위해 적게 배치)
  {
    id: "b2-aircon-1",
    type: "aircon",
    gridX: 9,
    gridY: 2,
    gridZ: 0,
    rotation: -Math.PI / 2,
  },
  {
    id: "b2-climatic-1",
    type: "climatic_chamber",
    gridX: 9,
    gridY: 7,
    gridZ: 0,
    rotation: -Math.PI / 2,
  },

  // 온도 모니터링 (경고 상태)
  {
    id: "b2-thermo-1",
    type: "thermometer",
    gridX: 0,
    gridY: 5,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "b2-thermo-2",
    type: "thermometer",
    gridX: 3,
    gridY: 5,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "b2-thermo-3",
    type: "thermometer",
    gridX: 6,
    gridY: 5,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "b2-thermo-4",
    type: "thermometer",
    gridX: 8,
    gridY: 5,
    gridZ: 0,
    rotation: 0,
  },

  // 안전 장비
  {
    id: "b2-fire-2",
    type: "fire_extinguisher",
    gridX: 9,
    gridY: 0,
    gridZ: 0,
    rotation: 0,
  },
];

// IDC C-Zone, Floor 1 (Singapore) - 48개 랙, Normal
// 대형 고밀도 서버실
export const SERVER_ROOM_C3_EQUIPMENT: Equipment3D[] = [
  // 입구
  { id: "c3-door-1", type: "door", gridX: 0, gridY: 5, gridZ: 0, rotation: 0 },
  {
    id: "c3-fire-1",
    type: "fire_extinguisher",
    gridX: 0,
    gridY: 4,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-fire-2",
    type: "fire_extinguisher",
    gridX: 0,
    gridY: 6,
    gridZ: 0,
    rotation: 0,
  },

  // 1열 서버 랙
  {
    id: "c3-server-1",
    type: "server",
    gridX: 1,
    gridY: 1,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-server-2",
    type: "server",
    gridX: 1,
    gridY: 3,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-server-3",
    type: "server",
    gridX: 1,
    gridY: 7,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-server-4",
    type: "server",
    gridX: 1,
    gridY: 9,
    gridZ: 0,
    rotation: 0,
  },

  // 2-3열 서버 랙 (밀집 배치)
  {
    id: "c3-server-5",
    type: "server",
    gridX: 2,
    gridY: 1,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-server-6",
    type: "server",
    gridX: 2,
    gridY: 3,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-server-7",
    type: "server",
    gridX: 2,
    gridY: 7,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-server-8",
    type: "server",
    gridX: 2,
    gridY: 9,
    gridZ: 0,
    rotation: 0,
  },

  {
    id: "c3-server-9",
    type: "server",
    gridX: 3,
    gridY: 1,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-server-10",
    type: "server",
    gridX: 3,
    gridY: 3,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-server-11",
    type: "server",
    gridX: 3,
    gridY: 7,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-server-12",
    type: "server",
    gridX: 3,
    gridY: 9,
    gridZ: 0,
    rotation: 0,
  },

  // 4-5열 서버 랙
  {
    id: "c3-server-13",
    type: "server",
    gridX: 4,
    gridY: 1,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-server-14",
    type: "server",
    gridX: 4,
    gridY: 3,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-server-15",
    type: "server",
    gridX: 4,
    gridY: 7,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-server-16",
    type: "server",
    gridX: 4,
    gridY: 9,
    gridZ: 0,
    rotation: 0,
  },

  {
    id: "c3-server-17",
    type: "server",
    gridX: 5,
    gridY: 1,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-server-18",
    type: "server",
    gridX: 5,
    gridY: 3,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-server-19",
    type: "server",
    gridX: 5,
    gridY: 7,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-server-20",
    type: "server",
    gridX: 5,
    gridY: 9,
    gridZ: 0,
    rotation: 0,
  },

  // 6-7열 서버 랙
  {
    id: "c3-server-21",
    type: "server",
    gridX: 6,
    gridY: 1,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-server-22",
    type: "server",
    gridX: 6,
    gridY: 3,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-server-23",
    type: "server",
    gridX: 6,
    gridY: 7,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-server-24",
    type: "server",
    gridX: 6,
    gridY: 9,
    gridZ: 0,
    rotation: 0,
  },

  {
    id: "c3-server-25",
    type: "server",
    gridX: 7,
    gridY: 1,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-server-26",
    type: "server",
    gridX: 7,
    gridY: 3,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-server-27",
    type: "server",
    gridX: 7,
    gridY: 7,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-server-28",
    type: "server",
    gridX: 7,
    gridY: 9,
    gridZ: 0,
    rotation: 0,
  },

  // 8-9열 서버 랙
  {
    id: "c3-server-29",
    type: "server",
    gridX: 8,
    gridY: 1,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-server-30",
    type: "server",
    gridX: 8,
    gridY: 3,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-server-31",
    type: "server",
    gridX: 8,
    gridY: 7,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-server-32",
    type: "server",
    gridX: 8,
    gridY: 9,
    gridZ: 0,
    rotation: 0,
  },

  // 냉각 시스템 (고밀도 배치로 많이 필요)
  {
    id: "c3-aircon-1",
    type: "aircon",
    gridX: 9,
    gridY: 1,
    gridZ: 0,
    rotation: -Math.PI / 2,
  },
  {
    id: "c3-aircon-2",
    type: "aircon",
    gridX: 9,
    gridY: 3,
    gridZ: 0,
    rotation: -Math.PI / 2,
  },
  {
    id: "c3-aircon-3",
    type: "aircon",
    gridX: 9,
    gridY: 7,
    gridZ: 0,
    rotation: -Math.PI / 2,
  },
  {
    id: "c3-aircon-4",
    type: "aircon",
    gridX: 9,
    gridY: 9,
    gridZ: 0,
    rotation: -Math.PI / 2,
  },

  {
    id: "c3-climatic-1",
    type: "climatic_chamber",
    gridX: 1,
    gridY: 5,
    gridZ: 0,
    rotation: Math.PI / 2,
  },
  {
    id: "c3-climatic-2",
    type: "climatic_chamber",
    gridX: 9,
    gridY: 5,
    gridZ: 0,
    rotation: -Math.PI / 2,
  },

  // 온도 모니터링
  {
    id: "c3-thermo-1",
    type: "thermometer",
    gridX: 0,
    gridY: 1,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-thermo-2",
    type: "thermometer",
    gridX: 0,
    gridY: 9,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-thermo-3",
    type: "thermometer",
    gridX: 4,
    gridY: 5,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-thermo-4",
    type: "thermometer",
    gridX: 5,
    gridY: 5,
    gridZ: 0,
    rotation: 0,
  },

  // 추가 안전 장비
  {
    id: "c3-fire-3",
    type: "fire_extinguisher",
    gridX: 4,
    gridY: 0,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "c3-fire-4",
    type: "fire_extinguisher",
    gridX: 5,
    gridY: 0,
    gridZ: 0,
    rotation: 0,
  },
];

// IDC D-Zone, Floor 4 (Hong Kong) - 16개 랙, Critical
// 소형 서버실, 위기 상황
export const SERVER_ROOM_D4_EQUIPMENT: Equipment3D[] = [
  // 입구
  {
    id: "d4-door-1",
    type: "door",
    gridX: 0,
    gridY: 0,
    gridZ: 0,
    rotation: Math.PI / 2,
  },
  {
    id: "d4-fire-1",
    type: "fire_extinguisher",
    gridX: 1,
    gridY: 0,
    gridZ: 0,
    rotation: 0,
  },

  // 서버 랙 (작은 규모)
  {
    id: "d4-server-1",
    type: "server",
    gridX: 3,
    gridY: 2,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "d4-server-2",
    type: "server",
    gridX: 3,
    gridY: 4,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "d4-server-3",
    type: "server",
    gridX: 3,
    gridY: 6,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "d4-server-4",
    type: "server",
    gridX: 3,
    gridY: 8,
    gridZ: 0,
    rotation: 0,
  },

  {
    id: "d4-server-5",
    type: "server",
    gridX: 5,
    gridY: 2,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "d4-server-6",
    type: "server",
    gridX: 5,
    gridY: 4,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "d4-server-7",
    type: "server",
    gridX: 5,
    gridY: 6,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "d4-server-8",
    type: "server",
    gridX: 5,
    gridY: 8,
    gridZ: 0,
    rotation: 0,
  },

  {
    id: "d4-server-9",
    type: "server",
    gridX: 7,
    gridY: 2,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "d4-server-10",
    type: "server",
    gridX: 7,
    gridY: 4,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "d4-server-11",
    type: "server",
    gridX: 7,
    gridY: 6,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "d4-server-12",
    type: "server",
    gridX: 7,
    gridY: 8,
    gridZ: 0,
    rotation: 0,
  },

  // 냉각 시스템 (Critical - 부족한 상태)
  {
    id: "d4-aircon-1",
    type: "aircon",
    gridX: 9,
    gridY: 5,
    gridZ: 0,
    rotation: -Math.PI / 2,
  },

  // 온도 모니터링 (Critical 상황 - 많이 배치)
  {
    id: "d4-thermo-1",
    type: "thermometer",
    gridX: 0,
    gridY: 2,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "d4-thermo-2",
    type: "thermometer",
    gridX: 0,
    gridY: 5,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "d4-thermo-3",
    type: "thermometer",
    gridX: 0,
    gridY: 8,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "d4-thermo-4",
    type: "thermometer",
    gridX: 4,
    gridY: 5,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "d4-thermo-5",
    type: "thermometer",
    gridX: 6,
    gridY: 5,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "d4-thermo-6",
    type: "thermometer",
    gridX: 9,
    gridY: 2,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "d4-thermo-7",
    type: "thermometer",
    gridX: 9,
    gridY: 8,
    gridZ: 0,
    rotation: 0,
  },

  // 안전 장비
  {
    id: "d4-fire-2",
    type: "fire_extinguisher",
    gridX: 9,
    gridY: 0,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "d4-fire-3",
    type: "fire_extinguisher",
    gridX: 5,
    gridY: 0,
    gridZ: 0,
    rotation: 0,
  },
];

// IDC E-Zone, Floor 5 (Mumbai) - 28개 랙, Normal
// 중형 서버실
export const SERVER_ROOM_E5_EQUIPMENT: Equipment3D[] = [
  // 입구
  {
    id: "e5-door-1",
    type: "door",
    gridX: 0,
    gridY: 0,
    gridZ: 0,
    rotation: Math.PI / 2,
  },
  {
    id: "e5-fire-1",
    type: "fire_extinguisher",
    gridX: 1,
    gridY: 0,
    gridZ: 0,
    rotation: 0,
  },

  // 좌측 서버 랙
  {
    id: "e5-server-1",
    type: "server",
    gridX: 2,
    gridY: 1,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "e5-server-2",
    type: "server",
    gridX: 2,
    gridY: 3,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "e5-server-3",
    type: "server",
    gridX: 2,
    gridY: 5,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "e5-server-4",
    type: "server",
    gridX: 2,
    gridY: 7,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "e5-server-5",
    type: "server",
    gridX: 2,
    gridY: 9,
    gridZ: 0,
    rotation: 0,
  },

  // 중앙 좌측 서버 랙
  {
    id: "e5-server-6",
    type: "server",
    gridX: 4,
    gridY: 1,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "e5-server-7",
    type: "server",
    gridX: 4,
    gridY: 3,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "e5-server-8",
    type: "server",
    gridX: 4,
    gridY: 5,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "e5-server-9",
    type: "server",
    gridX: 4,
    gridY: 7,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "e5-server-10",
    type: "server",
    gridX: 4,
    gridY: 9,
    gridZ: 0,
    rotation: 0,
  },

  // 중앙 우측 서버 랙
  {
    id: "e5-server-11",
    type: "server",
    gridX: 5,
    gridY: 1,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "e5-server-12",
    type: "server",
    gridX: 5,
    gridY: 3,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "e5-server-13",
    type: "server",
    gridX: 5,
    gridY: 5,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "e5-server-14",
    type: "server",
    gridX: 5,
    gridY: 7,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "e5-server-15",
    type: "server",
    gridX: 5,
    gridY: 9,
    gridZ: 0,
    rotation: 0,
  },

  // 우측 서버 랙
  {
    id: "e5-server-16",
    type: "server",
    gridX: 7,
    gridY: 1,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "e5-server-17",
    type: "server",
    gridX: 7,
    gridY: 3,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "e5-server-18",
    type: "server",
    gridX: 7,
    gridY: 5,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "e5-server-19",
    type: "server",
    gridX: 7,
    gridY: 7,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "e5-server-20",
    type: "server",
    gridX: 7,
    gridY: 9,
    gridZ: 0,
    rotation: 0,
  },

  // 냉각 시스템
  {
    id: "e5-aircon-1",
    type: "aircon",
    gridX: 9,
    gridY: 1,
    gridZ: 0,
    rotation: -Math.PI / 2,
  },
  {
    id: "e5-aircon-2",
    type: "aircon",
    gridX: 9,
    gridY: 5,
    gridZ: 0,
    rotation: -Math.PI / 2,
  },
  {
    id: "e5-aircon-3",
    type: "aircon",
    gridX: 9,
    gridY: 9,
    gridZ: 0,
    rotation: -Math.PI / 2,
  },
  {
    id: "e5-climatic-1",
    type: "climatic_chamber",
    gridX: 0,
    gridY: 5,
    gridZ: 0,
    rotation: Math.PI / 2,
  },

  // 온도 모니터링
  {
    id: "e5-thermo-1",
    type: "thermometer",
    gridX: 3,
    gridY: 5,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "e5-thermo-2",
    type: "thermometer",
    gridX: 6,
    gridY: 5,
    gridZ: 0,
    rotation: 0,
  },

  // 안전 장비
  {
    id: "e5-fire-2",
    type: "fire_extinguisher",
    gridX: 9,
    gridY: 0,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "e5-fire-3",
    type: "fire_extinguisher",
    gridX: 0,
    gridY: 9,
    gridZ: 0,
    rotation: 0,
  },
];

// IDC F-Zone, Floor 6 (Sydney) - 20개 랙, Maintenance
// 중소형 서버실, 유지보수 중
export const SERVER_ROOM_F6_EQUIPMENT: Equipment3D[] = [
  // 입구
  {
    id: "f6-door-1",
    type: "door",
    gridX: 0,
    gridY: 0,
    gridZ: 0,
    rotation: Math.PI / 2,
  },
  {
    id: "f6-fire-1",
    type: "fire_extinguisher",
    gridX: 1,
    gridY: 0,
    gridZ: 0,
    rotation: 0,
  },

  // 좌측 서버 랙
  {
    id: "f6-server-1",
    type: "server",
    gridX: 2,
    gridY: 2,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "f6-server-2",
    type: "server",
    gridX: 2,
    gridY: 4,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "f6-server-3",
    type: "server",
    gridX: 2,
    gridY: 6,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "f6-server-4",
    type: "server",
    gridX: 2,
    gridY: 8,
    gridZ: 0,
    rotation: 0,
  },

  // 중앙 서버 랙
  {
    id: "f6-server-5",
    type: "server",
    gridX: 4,
    gridY: 2,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "f6-server-6",
    type: "server",
    gridX: 4,
    gridY: 4,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "f6-server-7",
    type: "server",
    gridX: 4,
    gridY: 6,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "f6-server-8",
    type: "server",
    gridX: 4,
    gridY: 8,
    gridZ: 0,
    rotation: 0,
  },

  {
    id: "f6-server-9",
    type: "server",
    gridX: 6,
    gridY: 2,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "f6-server-10",
    type: "server",
    gridX: 6,
    gridY: 4,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "f6-server-11",
    type: "server",
    gridX: 6,
    gridY: 6,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "f6-server-12",
    type: "server",
    gridX: 6,
    gridY: 8,
    gridZ: 0,
    rotation: 0,
  },

  // 우측 서버 랙
  {
    id: "f6-server-13",
    type: "server",
    gridX: 8,
    gridY: 2,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "f6-server-14",
    type: "server",
    gridX: 8,
    gridY: 4,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "f6-server-15",
    type: "server",
    gridX: 8,
    gridY: 6,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "f6-server-16",
    type: "server",
    gridX: 8,
    gridY: 8,
    gridZ: 0,
    rotation: 0,
  },

  // 냉각 시스템 (유지보수 중)
  {
    id: "f6-aircon-1",
    type: "aircon",
    gridX: 9,
    gridY: 3,
    gridZ: 0,
    rotation: -Math.PI / 2,
  },
  {
    id: "f6-climatic-1",
    type: "climatic_chamber",
    gridX: 9,
    gridY: 7,
    gridZ: 0,
    rotation: -Math.PI / 2,
  },

  // 온도 모니터링
  {
    id: "f6-thermo-1",
    type: "thermometer",
    gridX: 0,
    gridY: 5,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "f6-thermo-2",
    type: "thermometer",
    gridX: 5,
    gridY: 5,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "f6-thermo-3",
    type: "thermometer",
    gridX: 9,
    gridY: 5,
    gridZ: 0,
    rotation: 0,
  },

  // 안전 장비
  {
    id: "f6-fire-2",
    type: "fire_extinguisher",
    gridX: 9,
    gridY: 0,
    gridZ: 0,
    rotation: 0,
  },
  {
    id: "f6-fire-3",
    type: "fire_extinguisher",
    gridX: 5,
    gridY: 0,
    gridZ: 0,
    rotation: 0,
  },
];

// 서버실 ID별 장비 맵핑
export const MOCK_SERVER_ROOM_EQUIPMENT_MAP: Record<string, Equipment3D[]> = {
  a1: SERVER_ROOM_A1_EQUIPMENT,
  b2: SERVER_ROOM_B2_EQUIPMENT,
  c3: SERVER_ROOM_C3_EQUIPMENT,
  d4: SERVER_ROOM_D4_EQUIPMENT,
  e5: SERVER_ROOM_E5_EQUIPMENT,
  f6: SERVER_ROOM_F6_EQUIPMENT,
};

/**
 * 서버실 ID로 장비 데이터 가져오기 (목 데이터)
 *
 * 📌 실제 백엔드 연동 시:
 * import { fetchServerRoomEquipment } from '../api/serverRoomEquipmentApi';
 * const equipment = await fetchServerRoomEquipment(serverRoomId);
 */
export function getServerRoomEquipment(serverRoomId: string): Equipment3D[] {
  return MOCK_SERVER_ROOM_EQUIPMENT_MAP[serverRoomId] || [];
}
