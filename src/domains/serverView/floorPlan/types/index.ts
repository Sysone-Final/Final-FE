export type Mode = 'view' | 'edit';
export type DoorDirection = 'north' | 'south' | 'east' | 'west';
export type AssetStatus = 'normal' | 'warning' | 'danger';
export type DisplayMode = 'status' | 'customColor';
export type UHeight = 42 | 45 | 48 | 52;

// 자산의 물리적 위치(레이어)를 정의하는 타입
export type AssetLayer = 'floor' | 'wall' | 'overhead';

//  대시보드 지표 뷰 타입
export type DashboardMetricView =
 | 'default'
 | 'network'
 | 'usage'
 | 'heatmapTemp' // 온도 히트맵
 | 'heatmapPower'; // 전력 히트맵
// 새로운 레이어 기반 분류에 맞춰 자산 타입을 재정의
export type AssetType =
  // Floor Layer
  | 'wall'
  | 'pillar'
  | 'ramp'
  | 'rack'
  | 'storage'
  | 'mainframe'
  | 'crash_cart'
  | 'crac'
  | 'in_row_cooling'
  | 'ups_battery'
  | 'power_panel'
  | 'speed_gate'
  | 'fire_suppression'
  // Wall-Mounted Layer
  | 'door_single'
  | 'door_double'
  | 'door_sliding'
  | 'access_control'
  | 'epo'
  // Overhead Layer
  | 'aisle_containment'
  | 'cctv'
  | 'leak_sensor';

export interface DisplayOptionsType {
  showName: boolean;
  showStatusIndicator: boolean;
  showTemperature: boolean;
  showUUsage: boolean;
  showPowerStatus: boolean;
  showAisle: boolean;
  showPUE: boolean;
  showFacilities: boolean;
  showSensors: boolean;
  useLOD: boolean;
  showGridLine: boolean;
}

export interface Asset {
  id: string;
  name: string;
  gridX: number;
  gridY: number;
  widthInCells: number;
  heightInCells: number;
  assetType: AssetType;
  // 모든 자산은 어떤 레이어에 속하는지 명시해야 함
  layer: AssetLayer;
  uHeight?: UHeight;
  status?: AssetStatus;
  customColor?: string;
  isLocked?: boolean;
  rotation?: number;
  opacity?: number;
  doorDirection?: DoorDirection;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  groupId?: string;
  data?: {
    uUsage?: number;
    temperature?: number;
    cpuUsage?: number;    // 예: 78 (%)
    memoryUsage?: number; // 예: 68 (%)
    powerUsage?: number;  // 예: 2.3 (kW)
    networkUsage?: number; // 예: 160 (Mbps)
  };
}

// --- FloorPlanState에서 모든 함수 정의를 제거합니다 ---
export interface FloorPlanState {
  mode: Mode;
  displayMode: DisplayMode;
  displayOptions: DisplayOptionsType;
  dashboardMetricView: DashboardMetricView;
  assets: Asset[];
  selectedAssetIds: string[];
  gridCols: number;
  gridRows: number;
  stage: { scale: number; x: number; y: number };

visibleLayers: Record<AssetLayer, boolean>;
 visibleSeverities: Record<AssetStatus, boolean>;

  // 1. 로딩 및 에러 상태만 남겨둡니다.
  isLoading: boolean;
  error: string | null;

  // 2. 모든 액션 함수 시그니처를 제거합니다.
  // toggleMode: () => void;
  // ...
  // fetchFloorPlan: (roomId: string) => Promise<void>;
  // ...
}

