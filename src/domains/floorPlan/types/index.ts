// [수정] 데이터 홀 중심의 모든 자산 유형을 포함하는 새로운 타입을 정의합니다.
export type AssetType =
  // 구조물
  | "wall"
  | "door_single"
  | "door_double"
  | "door_sliding"
  | "pillar"
  | "ramp"
  // 핵심 장비
  | "rack"
  | "storage"
  | "mainframe"
  | "crash_cart"
  // 전력 및 공조
  | "crac"
  | "in_row_cooling"
  | "ups_battery"
  | "power_panel"
  | "aisle_containment"
  // 안전 및 접근 (아이콘 기반)
  | "speed_gate"
  | "fire_suppression"
  | "cctv"
  | "access_control"
  | "epo"
  | "leak_sensor";
export type UHeight = 42 | 45 | 48 | 52;
export type Mode = "view" | "edit";
export type DoorDirection = "north" | "south" | "east" | "west";
export type AssetStatus = "normal" | "warning" | "danger";
export type DisplayMode = "status" | "customColor";

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
  // [수정] 기존 type을 assetType으로 변경하고, 새로운 AssetType을 사용합니다.
  assetType: AssetType;
  // [추가] 랙의 U 높이를 저장하기 위한 속성
  uHeight?: 42 | 45 | 48 | 52;
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
  };
  // [삭제] 기존 type 속성은 assetType으로 대체되었습니다.
  // type: "rack" | "wall" | "door";
}

export interface FloorPlanState {
  mode: Mode;
  displayMode: DisplayMode;
  displayOptions: DisplayOptionsType;
  assets: Asset[];
  selectedAssetIds: string[];
  gridCols: number;
  gridRows: number;
  stage: { scale: number; x: number; y: number };
  toggleMode: () => void;
  setDisplayOptions: (options: Partial<DisplayOptionsType>) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  setGridSize: (cols: number, rows: number) => void;
  addAsset: (asset: Omit<Asset, "id">) => void;
  setStage: (stage: FloorPlanState["stage"]) => void;
  updateAsset: (id: string, newProps: Partial<Omit<Asset, "id">>) => void;
  selectAsset: (id: string, isMultiSelect?: boolean) => void;
  deselectAll: () => void;
  deleteAsset: (id: string) => void;
  duplicateAsset: (id: string) => void;
  groupSelectedAssets: () => void;
  ungroupSelectedAssets: () => void;
  zoom: (direction: "in" | "out") => void;
}
