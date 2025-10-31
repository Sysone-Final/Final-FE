import type { Asset, AssetStatus } from '../types';

// --- [추가] 헬퍼 함수: 랜덤 숫자 생성 (테스트 데이터 다양화) ---
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number) => parseFloat((Math.random() * (max - min) + min).toFixed(1));

// --- [추가] 랙 상태 결정 로직 (DashboardAssetView와 동일하게) ---
const getStatusFromCpu = (cpu: number): AssetStatus => {
  if (cpu > 90) return 'danger';
  if (cpu > 75) return 'warning';
  return 'normal';
};

export const MOCK_ASSETS: Asset[] = [
  // --- Walls and Structure (15x8 Grid) ---
  // (기존 벽, 문 구조물 - 이름 한글 유지)
  {
    id: 'wall_top',
    assetType: 'wall',
    layer: 'floor',
    name: '상단 벽', // 한글 이름
    gridX: 0,
    gridY: 0,
    widthInCells: 15,
    heightInCells: 1,
    customColor: '#868e96',
    isLocked: true,
  },
  {
    id: 'wall_bottom',
    assetType: 'wall',
    layer: 'floor',
    name: '하단 벽', // 한글 이름
    gridX: 0,
    gridY: 7,
    widthInCells: 15,
    heightInCells: 1,
    customColor: '#868e96',
    isLocked: true,
  },
  {
    id: 'wall_left',
    assetType: 'wall',
    layer: 'floor',
    name: '좌측 벽', // 한글 이름
    gridX: 0,
    gridY: 1,
    widthInCells: 1,
    heightInCells: 6,
    customColor: '#868e96',
    isLocked: true,
  },
  {
    id: 'wall_right',
    assetType: 'wall',
    layer: 'floor',
    name: '우측 벽', // 한글 이름
    gridX: 14,
    gridY: 1,
    widthInCells: 1,
    heightInCells: 6,
    customColor: '#868e96',
    isLocked: true,
  },
  {
    id: 'main_door',
    assetType: 'door_double',
    layer: 'wall',
    name: '주 출입문', // 한글 이름
    gridX: 7,
    gridY: 7,
    widthInCells: 1,
    heightInCells: 1,
    customColor: '#ced4da',
    doorDirection: 'south',
    isLocked: true,
  },

  // --- [수정] 랙 A열 (5개, 1x1 크기) ---
  // A열: 대부분 정상
  ...Array.from({ length: 5 }).map((_, i) => {
    const cpu = rand(30, 60); // 30~60% (정상)
    return {
      id: `A-${String(i + 1).padStart(2, '0')}`,
      assetType: 'rack' as const,
      layer: 'floor' as const,
      name: `A-${String(i + 1).padStart(2, '0')}`, // 이름 유지
      status: getStatusFromCpu(cpu), // CPU 기준으로 상태 설정
      data: {
        temperature: rand(22, 25),      // 22~25°C
        uUsage: rand(40, 60),           // 40~60U (기존 값 활용)
        cpuUsage: cpu,                  // [신규]
        memoryUsage: rand(50, 70),      // [신규]
        powerUsage: randFloat(1.5, 2.5),// [신규]
        networkUsage: rand(80, 150),    // [신규]
      },
      gridX: 1 + i,
      gridY: 1,
      widthInCells: 1,
      heightInCells: 1,
      customColor: '#dbe4ff',
      doorDirection: 'south' as const,
      createdAt: new Date().toISOString(),
      uHeight: 42 as const,
    };
  }),

  // --- [수정] 랙 B열 (5개, 1x1 크기) ---
  // B열: 정상 + '주의' 1개
  ...Array.from({ length: 5 }).map((_, i) => {
    const isWarning = i === 3; // B-04 랙을 '주의' 상태로 설정
    const cpu = isWarning ? rand(76, 85) : rand(40, 65); // 76~85% (주의)
    return {
      id: `B-${String(i + 1).padStart(2, '0')}`,
      assetType: 'rack' as const,
      layer: 'floor' as const,
      name: `B-${String(i + 1).padStart(2, '0')}`, // 이름 유지
      status: getStatusFromCpu(cpu), // CPU 기준으로 상태 설정
      data: {
        temperature: isWarning ? rand(28, 31) : rand(23, 26), // 주의 랙 온도 약간 높음
        uUsage: rand(60, 80),           // (기존 값 활용)
        cpuUsage: cpu,                  // [신규]
        memoryUsage: isWarning ? rand(80, 90) : rand(60, 75), // [신규]
        powerUsage: isWarning ? randFloat(2.8, 3.5) : randFloat(2.0, 3.0), // [신규]
        networkUsage: rand(100, 200),   // [신규]
      },
      gridX: 1 + i,
      gridY: 3,
      widthInCells: 1,
      heightInCells: 1,
      customColor: '#dbe4ff',
      doorDirection: 'north' as const,
      createdAt: new Date().toISOString(),
      uHeight: 42 as const,
    };
  }),

  // --- [수정] 랙 C열 (6개, 1x1 크기) ---
  // C열: 정상, 주의, 위험 골고루
  ...Array.from({ length: 6 }).map((_, i) => {
    let cpu: number;
    let temp: number;
    if (i === 2) { // C-03 (Warning)
      cpu = rand(76, 89);
      temp = rand(30, 34);
    } else if (i === 4) { // C-05 (Danger)
      cpu = rand(91, 98);
      temp = rand(35, 40); // 온도도 높음
    } else { // Normal
      cpu = rand(50, 70);
      temp = rand(24, 27);
    }

    return {
      id: `C-${String(i + 1).padStart(2, '0')}`,
      assetType: 'rack' as const,
      layer: 'floor' as const,
      name: `C-${String(i + 1).padStart(2, '0')}`, // 이름 유지
      status: getStatusFromCpu(cpu), // CPU 기준으로 상태 설정
      data: {
        temperature: temp,              // [수정]
        uUsage: rand(70, 85),           // (기존 값 활용)
        cpuUsage: cpu,                  // [신규]
        memoryUsage: rand(65, 85),      // [신규]
        powerUsage: randFloat(2.5, 4.0),// [신규]
        networkUsage: rand(150, 300),   // [신규]
      },
      gridX: 7 + i,
      gridY: 1,
      widthInCells: 1,
      heightInCells: 1,
      customColor: '#dbe4ff',
      doorDirection: 'south' as const,
      createdAt: new Date().toISOString(),
      uHeight: 45 as const,
    };
  }),

  // --- Cooling & Power (한글 이름 유지) ---
  // (이하 랙이 아닌 자산들은 data 필드 없이 그대로 둡니다)
  {
    id: 'crac-1',
    assetType: 'crac',
    layer: 'floor',
    name: '항온항습기-01', // 한글 이름
    gridX: 1,
    gridY: 5,
    widthInCells: 1,
    heightInCells: 2,
    customColor: '#a7d8de',
  },
  {
    id: 'crac-2',
    assetType: 'crac',
    layer: 'floor',
    name: '항온항습기-02', // 한글 이름
    gridX: 12,
    gridY: 5,
    widthInCells: 1,
    heightInCells: 2,
    customColor: '#a7d8de',
  },
  {
    id: 'ups-1',
    assetType: 'ups_battery',
    layer: 'floor',
    name: 'UPS-01', // 한글 이름
    gridX: 3,
    gridY: 5,
    widthInCells: 2,
    heightInCells: 1,
    customColor: '#f9dcc4',
  },
  {
    id: 'rpp-1',
    assetType: 'power_panel',
    layer: 'floor',
    name: 'RPP-A', // 한글 이름
    gridX: 7,
    gridY: 3,
    widthInCells: 1,
    heightInCells: 1,
    customColor: '#f3d9e3',
  },
  {
    id: 'rpp-2',
    assetType: 'power_panel',
    layer: 'floor',
    name: 'RPP-B', // 한글 이름
    gridX: 9,
    gridY: 3,
    widthInCells: 1,
    heightInCells: 1,
    customColor: '#f3d9e3',
  },

  // --- Overhead & Wall-mounted items (한글 이름 유지) ---
  {
    id: 'cctv-1',
    assetType: 'cctv',
    layer: 'overhead',
    name: 'CCTV-코너-좌상', // 한글 이름
    gridX: 1,
    gridY: 1,
    widthInCells: 1,
    heightInCells: 1,
    customColor: '#e0e0e0',
  },
  {
    id: 'cctv-2',
    assetType: 'cctv',
    layer: 'overhead',
    name: 'CCTV-코너-우상', // 한글 이름
    gridX: 13,
    gridY: 1,
    widthInCells: 1,
    heightInCells: 1,
    customColor: '#e0e0e0',
  },
  {
    id: 'cctv-3',
    assetType: 'cctv',
    layer: 'overhead',
    name: 'CCTV-중앙', // 한글 이름
    gridX: 7,
    gridY: 4,
    widthInCells: 1,
    heightInCells: 1,
    customColor: '#e0e0e0',
  },
  {
    id: 'epo-1',
    assetType: 'epo',
    layer: 'wall',
    name: 'EPO', // 한글 이름
    gridX: 9,
    gridY: 7,
    widthInCells: 1,
    heightInCells: 1,
    customColor: '#ffadad',
  },
];

// 3. API가 반환할 그리드 크기를 15x8로 변경
export const MOCK_FLOOR_PLAN_DATA = {
  gridCols: 15,
  gridRows: 8,
  assets: MOCK_ASSETS,
};

